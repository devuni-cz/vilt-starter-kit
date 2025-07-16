---
mode: agent
---

# Sentry Monitoring & Error Tracking Prompt

## Expected Output Format

When implementing Sentry monitoring, provide:

1. **Error tracking setup** - Laravel and Vue.js integration
2. **Performance monitoring** - Transaction tracking and optimization
3. **Release tracking** - Deploy monitoring and rollback capabilities
4. **Custom contexts** - Automotive-specific error contexts
5. **Alert configuration** - Critical error notifications
6. **Dashboard setup** - Key metrics and monitoring widgets

## Sentry Integration Patterns

### Laravel Backend Integration

```php
// config/sentry.php enhancements
return [
    'dsn' => env('SENTRY_LARAVEL_DSN'),
    'environment' => env('APP_ENV', 'production'),
    'release' => env('SENTRY_RELEASE', git_hash()),

    // Performance monitoring
    'traces_sample_rate' => env('SENTRY_TRACES_SAMPLE_RATE', 0.1),
    'profiles_sample_rate' => env('SENTRY_PROFILES_SAMPLE_RATE', 0.1),

    // Custom contexts for automotive domain
    'before_send' => function (\Sentry\Event $event): ?\Sentry\Event {
        // Add automotive-specific context
        $event->setContext('automotive', [
            'vehicle_count' => \App\Models\Vehicle::count(),
            'active_orders' => \App\Models\Order::where('status', 'pending')->count(),
            'payment_failures' => \App\Models\Payment::where('status', 'failed')
                ->where('created_at', '>=', now()->subHour())
                ->count(),
        ]);

        return $event;
    },
];
```

### Enhanced Error Tracking Service

```php
// Service for automotive-specific error tracking
class AutomotiveErrorTracker
{
    public function trackVehicleError(Vehicle $vehicle, \Throwable $exception, array $context = []): void
    {
        \Sentry\withScope(function (\Sentry\State\Scope $scope) use ($vehicle, $exception, $context) {
            $scope->setContext('vehicle', [
                'id' => $vehicle->id,
                'vin' => $vehicle->vin,
                'make' => $vehicle->make,
                'model' => $vehicle->model,
                'year' => $vehicle->year,
                'seller_id' => $vehicle->seller_id,
                'status' => $vehicle->status,
                'price' => $vehicle->price,
            ]);

            $scope->setContext('additional', $context);
            $scope->setLevel(\Sentry\Severity::error());

            \Sentry\captureException($exception);
        });
    }

    public function trackPaymentError(Payment $payment, \Throwable $exception, array $context = []): void
    {
        \Sentry\withScope(function (\Sentry\State\Scope $scope) use ($payment, $exception, $context) {
            $scope->setContext('payment', [
                'id' => $payment->id,
                'gopay_id' => $payment->gopay_id,
                'amount' => $payment->amount,
                'status' => $payment->status,
                'vehicle_id' => $payment->vehicle_id,
                'user_id' => $payment->user_id,
                'order_number' => $payment->order_number,
            ]);

            $scope->setContext('additional', $context);
            $scope->setLevel(\Sentry\Severity::error());

            \Sentry\captureException($exception);
        });
    }

    public function trackSearchPerformance(array $filters, int $resultCount, float $executionTime): void
    {
        \Sentry\withScope(function (\Sentry\State\Scope $scope) use ($filters, $resultCount, $executionTime) {
            $scope->setContext('search', [
                'filters' => $filters,
                'result_count' => $resultCount,
                'execution_time' => $executionTime,
                'slow_query' => $executionTime > 2.0,
            ]);

            if ($executionTime > 2.0) {
                $scope->setLevel(\Sentry\Severity::warning());
                \Sentry\captureMessage('Slow vehicle search query detected');
            }
        });
    }
}
```

### Vue.js Frontend Integration

```javascript
// Enhanced Sentry setup for Vue.js
import * as Sentry from '@sentry/vue'
import { createApp } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'

createInertiaApp({
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) }).use(plugin)

        // Initialize Sentry for Vue
        Sentry.init({
            app,
            dsn: import.meta.env.VITE_SENTRY_DSN_PUBLIC,
            environment: import.meta.env.VITE_APP_ENV,
            release: import.meta.env.VITE_SENTRY_RELEASE,

            integrations: [
                new Sentry.BrowserTracing({
                    routingInstrumentation: Sentry.vueRouterInstrumentation(router),
                }),
                new Sentry.Replay(),
            ],

            // Performance monitoring
            tracesSampleRate: 0.1,
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,

            // Custom error filtering
            beforeSend(event) {
                // Filter out non-critical errors
                if (event.exception) {
                    const error = event.exception.values[0]
                    if (error.type === 'ChunkLoadError') {
                        return null // Ignore chunk load errors
                    }
                }
                return event
            },
        })

        return app
    },
})
```

### Performance Monitoring Composable

```javascript
// Vue composable for performance tracking
export function usePerformanceMonitoring() {
    const trackVehicleSearch = (filters: object) => {
        const transaction = Sentry.startTransaction({
            name: 'Vehicle Search',
            op: 'search',
            data: { filters }
        })

        const span = transaction.startChild({
            op: 'vehicle.search',
            description: 'Search vehicles with filters'
        })

        return {
            finish: (resultCount: number) => {
                span.setTag('result_count', resultCount)
                span.setTag('has_results', resultCount > 0)
                span.finish()
                transaction.finish()
            }
        }
    }

    const trackPaymentProcess = (vehicleId: number) => {
        const transaction = Sentry.startTransaction({
            name: 'Payment Process',
            op: 'payment',
            data: { vehicleId }
        })

        return {
            addBreadcrumb: (message: string, data?: object) => {
                Sentry.addBreadcrumb({
                    message,
                    category: 'payment',
                    data,
                    level: 'info'
                })
            },
            finish: (success: boolean) => {
                transaction.setTag('payment_success', success)
                transaction.finish()
            }
        }
    }

    const trackError = (error: Error, context?: object) => {
        Sentry.withScope((scope) => {
            if (context) {
                scope.setContext('additional', context)
            }
            Sentry.captureException(error)
        })
    }

    return {
        trackVehicleSearch,
        trackPaymentProcess,
        trackError
    }
}
```

## Performance Monitoring Middleware

```php
// Middleware for automatic performance tracking
class SentryPerformanceMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $transaction = \Sentry\startTransaction([
            'name' => $request->route()->getName() ?? $request->getPathInfo(),
            'op' => 'http.request',
            'data' => [
                'method' => $request->getMethod(),
                'url' => $request->getUri(),
                'user_agent' => $request->userAgent(),
            ],
        ]);

        \Sentry\SentrySdk::getCurrentHub()->setSpan($transaction);

        $response = $next($request);

        $transaction->setHttpStatus($response->getStatusCode());
        $transaction->finish();

        return $response;
    }
}
```

### Custom Alert Rules

```php
// Custom Sentry alert configurations
class SentryAlertService
{
    public function configureAutomotiveAlerts(): void
    {
        // High-priority alerts for automotive business
        $this->createAlert('Payment Failures', [
            'conditions' => [
                'events' => 'payment.failed',
                'threshold' => 5,
                'timeframe' => '5m',
            ],
            'actions' => [
                'email' => ['admin@autoauto.cz'],
                'slack' => '#critical-alerts',
            ],
        ]);

        $this->createAlert('Vehicle Search Performance', [
            'conditions' => [
                'metric' => 'avg_response_time',
                'threshold' => 2000, // ms
                'timeframe' => '10m',
            ],
            'actions' => [
                'email' => ['dev@autoauto.cz'],
            ],
        ]);

        $this->createAlert('High Error Rate', [
            'conditions' => [
                'error_rate' => 0.05, // 5%
                'timeframe' => '5m',
            ],
            'actions' => [
                'email' => ['admin@autoauto.cz'],
                'slack' => '#urgent-alerts',
            ],
        ]);
    }
}
```

This prompt provides comprehensive Sentry integration for your automotive e-commerce platform with specific monitoring for vehicles, payments, and performance.
