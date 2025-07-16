---
mode: agent
---

# QR Code Development Prompt

## Expected Output Format

When working with QR codes using Lara Zeus QR package, provide:

1. **QR code generation** - Vehicle identification, parts tracking, invoice QR codes
2. **QR code scanning** - Mobile integration with html5-qrcode
3. **Data encoding** - Efficient data structures for automotive information
4. **Security considerations** - Signed QR codes and validation
5. **Performance optimization** - Caching and bulk generation
6. **Mobile integration** - Scanner components for Vue.js frontend

## QR Code Patterns for Automotive E-commerce

### Vehicle QR Codes

```php
// Vehicle QR code service
class VehicleQRService
{
    public function generateVehicleQR(Vehicle $vehicle): string
    {
        $data = [
            'type' => 'vehicle',
            'id' => $vehicle->id,
            'vin' => $vehicle->vin,
            'make' => $vehicle->make,
            'model' => $vehicle->model,
            'year' => $vehicle->year,
            'url' => route('vehicles.show', $vehicle),
            'timestamp' => now()->timestamp,
        ];

        return QrCode::size(300)
            ->format('png')
            ->merge(public_path('images/logo.png'), 0.3)
            ->generate(json_encode($data));
    }

    public function generatePartQR(CarPart $part): string
    {
        $data = [
            'type' => 'part',
            'id' => $part->id,
            'part_number' => $part->part_number,
            'name' => $part->name,
            'url' => route('parts.show', $part),
            'compatibility' => $part->compatible_vehicles,
            'timestamp' => now()->timestamp,
        ];

        return QrCode::size(200)
            ->format('png')
            ->generate(json_encode($data));
    }

    public function generateInvoiceQR(Invoice $invoice): string
    {
        $data = [
            'type' => 'invoice',
            'number' => $invoice->number,
            'amount' => $invoice->amount,
            'due_date' => $invoice->due_date->format('Y-m-d'),
            'payment_url' => route('invoices.pay', $invoice),
            'verification' => hash('sha256', $invoice->number . $invoice->amount . config('app.key')),
        ];

        return QrCode::size(250)
            ->format('png')
            ->generate(json_encode($data));
    }
}
```

### Vue.js QR Scanner Component

```vue
<!-- QR Scanner component using html5-qrcode -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Html5QrcodeScanner } from 'html5-qrcode'

interface QRScanResult {
    type: 'vehicle' | 'part' | 'invoice'
    id: number
    url?: string
    data: Record<string, any>
}

const emit = defineEmits<{
    scanned: [result: QRScanResult]
    error: [error: string]
}>()

const scannerRef = ref<HTMLDivElement>()
const isScanning = ref(false)
const scanner = ref<Html5QrcodeScanner | null>(null)

const startScanning = () => {
    if (!scannerRef.value) return

    scanner.value = new Html5QrcodeScanner(
        'qr-reader',
        {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
        },
        false
    )

    scanner.value.render(onScanSuccess, onScanFailure)
    isScanning.value = true
}

const stopScanning = () => {
    if (scanner.value) {
        scanner.value.clear()
        scanner.value = null
    }
    isScanning.value = false
}

const onScanSuccess = (decodedText: string, decodedResult: any) => {
    try {
        const data = JSON.parse(decodedText)

        // Validate QR code structure
        if (!data.type || !data.id) {
            throw new Error('Invalid QR code format')
        }

        emit('scanned', data as QRScanResult)
        stopScanning()
    } catch (error) {
        emit('error', 'Invalid QR code data')
    }
}

const onScanFailure = (error: string) => {
    // Handle scan failures silently or log for debugging
    console.warn('QR scan failed:', error)
}

onMounted(() => {
    startScanning()
})

onUnmounted(() => {
    stopScanning()
})
</script>

<template>
    <div class="qr-scanner">
        <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">Scan QR Code</h3>
            <button
                v-if="isScanning"
                @click="stopScanning"
                class="btn-secondary"
            >
                Stop Scanning
            </button>
            <button
                v-else
                @click="startScanning"
                class="btn-primary"
            >
                Start Scanning
            </button>
        </div>

        <div
            ref="scannerRef"
            id="qr-reader"
            class="w-full max-w-md mx-auto"
        ></div>

        <div class="mt-4 text-center text-sm text-gray-600">
            <p>Point your camera at a QR code to scan vehicle, part, or invoice information</p>
        </div>
    </div>
</template>

<style scoped>
/* Override html5-qrcode styles */
:deep(#qr-reader) {
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
}

:deep(#qr-reader__camera_selection) {
    margin-bottom: 1rem;
}

:deep(#qr-reader__dashboard_section) {
    background: #f9fafb;
    padding: 1rem;
}
</style>
```

### Bulk QR Generation

```php
// Bulk QR generation for inventory management
class BulkQRService
{
    public function generateVehicleQRBatch(Collection $vehicles): array
    {
        $qrCodes = [];

        foreach ($vehicles as $vehicle) {
            $qrCodes[] = [
                'vehicle_id' => $vehicle->id,
                'filename' => "vehicle_{$vehicle->id}.png",
                'qr_code' => $this->generateVehicleQR($vehicle),
                'data' => [
                    'vin' => $vehicle->vin,
                    'make' => $vehicle->make,
                    'model' => $vehicle->model,
                    'year' => $vehicle->year,
                ]
            ];
        }

        return $qrCodes;
    }

    public function generatePartQRBatch(Collection $parts): array
    {
        return $parts->map(function ($part) {
            return [
                'part_id' => $part->id,
                'filename' => "part_{$part->part_number}.png",
                'qr_code' => $this->generatePartQR($part),
                'data' => [
                    'part_number' => $part->part_number,
                    'name' => $part->name,
                    'category' => $part->category->name,
                ]
            ];
        })->toArray();
    }

    public function exportQRCodes(array $qrCodes, string $format = 'zip'): string
    {
        $zip = new ZipArchive();
        $filename = storage_path('app/qr_codes_' . date('Y-m-d_H-i-s') . '.zip');

        if ($zip->open($filename, ZipArchive::CREATE) === TRUE) {
            foreach ($qrCodes as $qrCode) {
                $zip->addFromString(
                    $qrCode['filename'],
                    $qrCode['qr_code']
                );
            }
            $zip->close();
        }

        return $filename;
    }
}
```

## QR Code Security and Validation

### Signed QR Codes

```php
// Secure QR code generation with signatures
class SecureQRService
{
    public function generateSignedQR(array $data): string
    {
        $data['signature'] = $this->signData($data);
        $data['expires'] = now()->addHours(24)->timestamp;

        return QrCode::size(300)
            ->format('png')
            ->generate(json_encode($data));
    }

    public function validateQRSignature(array $data): bool
    {
        $signature = $data['signature'] ?? null;
        $expires = $data['expires'] ?? null;

        if (!$signature || !$expires) {
            return false;
        }

        if (now()->timestamp > $expires) {
            return false;
        }

        unset($data['signature'], $data['expires']);

        return hash_equals($signature, $this->signData($data));
    }

    private function signData(array $data): string
    {
        ksort($data);
        $string = json_encode($data);

        return hash_hmac('sha256', $string, config('app.key'));
    }
}
```

This prompt covers QR code generation, scanning, and security for your automotive e-commerce platform.
