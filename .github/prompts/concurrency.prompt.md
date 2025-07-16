---
mode: agent
---

# Concurrency & Queue Management Prompt

## Expected Output Format

When working with concurrent operations and queues, provide:

1. **Queue architecture** - Job organization and processing strategies
2. **Concurrency handling** - Race conditions and data consistency
3. **Background processing** - Async operations for performance
4. **Error handling** - Retry mechanisms and failure management
5. **Performance optimization** - Queue processing efficiency
6. **Monitoring setup** - Queue health and performance tracking

## Concurrency Patterns for Automotive E-commerce

### Vehicle Inventory Concurrency

```php
// Handle concurrent vehicle reservations
class VehicleReservationService
{
    public function reserveVehicle(Vehicle $vehicle, User $user): bool
    {
        return DB::transaction(function () use ($vehicle, $user) {
            // Use database locks to prevent race conditions
            $vehicle = Vehicle::where('id', $vehicle->id)
                ->where('status', 'available')
                ->lockForUpdate()
                ->first();

            if (!$vehicle) {
                throw new VehicleNotAvailableException();
            }

            $vehicle->update([
                'status' => 'reserved',
                'reserved_by' => $user->id,
                'reserved_until' => now()->addMinutes(15),
            ]);

            // Dispatch cleanup job
            dispatch(new ReleaseExpiredReservationJob($vehicle))->delay(now()->addMinutes(15));

            return true;
        });
    }

    public function purchaseVehicle(Vehicle $vehicle, User $user): bool
    {
        return DB::transaction(function () use ($vehicle, $user) {
            $vehicle = Vehicle::where('id', $vehicle->id)
                ->where('status', 'reserved')
                ->where('reserved_by', $user->id)
                ->lockForUpdate()
                ->first();

            if (!$vehicle) {
                throw new VehicleNotReservedException();
            }

            $vehicle->update([
                'status' => 'sold',
                'sold_to' => $user->id,
                'sold_at' => now(),
            ]);

            // Dispatch related jobs
            dispatch(new GenerateInvoiceJob($vehicle, $user));
            dispatch(new SendPurchaseConfirmationJob($vehicle, $user));
            dispatch(new UpdateInventoryStatsJob());

            return true;
        });
    }
}
```

### Queue Job Organization

```php
// Payment processing job with proper error handling
class ProcessPaymentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [10, 30, 60]; // Progressive backoff
    public $timeout = 120;

    public function __construct(
        private Payment $payment,
        private Vehicle $vehicle,
        private User $user
    ) {}

    public function handle(PaymentService $paymentService): void
    {
        try {
            $result = $paymentService->processVehiclePayment(
                $this->vehicle,
                $this->user,
                $this->payment
            );

            if ($result['success']) {
                $this->payment->update([
                    'status' => 'completed',
                    'processed_at' => now(),
                    'gopay_response' => $result['response'],
                ]);

                // Chain dependent jobs
                dispatch(new VehicleTransferJob($this->vehicle, $this->user));
                dispatch(new GenerateInvoiceJob($this->payment));

            } else {
                $this->handlePaymentFailure($result['error']);
            }

        } catch (GopayException $e) {
            $this->handleGopayException($e);
        } catch (\Exception $e) {
            $this->handleGeneralException($e);
        }
    }

    public function failed(\Throwable $exception): void
    {
        $this->payment->update([
            'status' => 'failed',
            'error_message' => $exception->getMessage(),
            'failed_at' => now(),
        ]);

        // Release vehicle reservation
        $this->vehicle->update(['status' => 'available']);

        // Notify user and admin
        dispatch(new SendPaymentFailedNotificationJob($this->payment, $exception));
    }

    private function handlePaymentFailure(string $error): void
    {
        $this->payment->update([
            'status' => 'failed',
            'error_message' => $error,
        ]);

        // Don't retry for certain errors
        if (str_contains($error, 'insufficient_funds')) {
            $this->fail(new InsufficientFundsException($error));
        }
    }
}
```

### Batch Processing for Inventory

```php
// Bulk inventory update job
class BulkInventoryUpdateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private array $inventoryUpdates,
        private string $batchId
    ) {}

    public function handle(): void
    {
        $batch = Bus::batch([])
            ->name('Inventory Update Batch')
            ->allowFailures()
            ->finally(function (Batch $batch) {
                // Cleanup and notifications
                dispatch(new InventoryBatchCompleteJob($batch));
            });

        foreach ($this->inventoryUpdates as $update) {
            $batch->add(new UpdateSingleInventoryItemJob($update));
        }

        $batch->dispatch();
    }
}

// Individual inventory item update
class UpdateSingleInventoryItemJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private array $updateData) {}

    public function handle(): void
    {
        DB::transaction(function () {
            $item = Vehicle::lockForUpdate()->find($this->updateData['id']);

            if ($item) {
                $item->update($this->updateData);

                // Update search index
                dispatch(new UpdateSearchIndexJob($item));
            }
        });
    }
}
```

### Queue Configuration

```php
// config/queue.php optimizations
return [
    'default' => env('QUEUE_CONNECTION', 'redis'),

    'connections' => [
        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => env('REDIS_QUEUE', 'default'),
            'retry_after' => 90,
            'block_for' => null,
        ],

        // High priority queue for payments
        'payments' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'payments',
            'retry_after' => 60,
            'block_for' => null,
        ],

        // Low priority queue for notifications
        'notifications' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'notifications',
            'retry_after' => 300,
            'block_for' => null,
        ],
    ],

    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'database'),
        'database' => env('DB_CONNECTION', 'mysql'),
        'table' => 'failed_jobs',
    ],
];
```

### Queue Monitoring

```php
// Queue health monitoring service
class QueueHealthMonitor
{
    public function checkQueueHealth(): array
    {
        $queues = ['default', 'payments', 'notifications'];
        $health = [];

        foreach ($queues as $queue) {
            $health[$queue] = [
                'pending' => $this->getPendingJobs($queue),
                'failed' => $this->getFailedJobs($queue),
                'processing_time' => $this->getAverageProcessingTime($queue),
                'workers' => $this->getActiveWorkers($queue),
            ];
        }

        // Alert if queues are backed up
        foreach ($health as $queue => $stats) {
            if ($stats['pending'] > 1000) {
                $this->alertQueueBackup($queue, $stats);
            }

            if ($stats['failed'] > 50) {
                $this->alertHighFailureRate($queue, $stats);
            }
        }

        return $health;
    }

    private function getPendingJobs(string $queue): int
    {
        return Redis::llen("queues:{$queue}");
    }

    private function getFailedJobs(string $queue): int
    {
        return DB::table('failed_jobs')
            ->where('queue', $queue)
            ->where('failed_at', '>=', now()->subDay())
            ->count();
    }
}
```

### Concurrency Controls

```php
// Rate limiting for API endpoints
class RateLimitMiddleware
{
    public function handle(Request $request, Closure $next, int $maxAttempts = 60): Response
    {
        $key = $this->resolveRequestSignature($request);

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            return response()->json([
                'message' => 'Too many requests',
                'retry_after' => RateLimiter::availableIn($key),
            ], 429);
        }

        RateLimiter::increment($key);

        return $next($request);
    }
}

// Database connection optimization
class DatabaseOptimizer
{
    public function optimizeConnections(): void
    {
        // Configure read/write splitting
        config([
            'database.connections.mysql.read' => [
                'host' => env('DB_READ_HOST', '127.0.0.1'),
            ],
            'database.connections.mysql.write' => [
                'host' => env('DB_WRITE_HOST', '127.0.0.1'),
            ],
        ]);

        // Set connection pool sizes
        config([
            'database.connections.mysql.pool' => [
                'min' => 5,
                'max' => 20,
            ],
        ]);
    }
}
```

This prompt covers comprehensive concurrency handling, queue management, and performance optimization for your automotive e-commerce platform.
