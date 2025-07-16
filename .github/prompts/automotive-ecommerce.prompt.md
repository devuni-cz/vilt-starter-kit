---
mode: agent
---

# Automotive E-commerce Development Prompt

## Expected Output Format

When working on automotive e-commerce features, provide:

1. **Domain understanding** - Automotive business logic and requirements
2. **E-commerce patterns** - Shopping cart, payments, inventory management
3. **Vehicle-specific features** - VIN validation, specifications, media handling
4. **Payment integration** - GoPay SDK implementation and security
5. **Performance optimization** - Large inventory handling and search optimization
6. **SEO considerations** - Vehicle listings optimization and structured data

## Automotive Domain Patterns

### Vehicle Management

```php
// Vehicle model with proper relationships
class Vehicle extends Model
{
    use HasMedia, SoftDeletes;

    protected $fillable = [
        'make', 'model', 'year', 'vin', 'mileage',
        'price', 'description', 'status', 'seller_id',
        'fuel_type', 'transmission', 'body_type', 'color'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'mileage' => 'integer',
        'year' => 'integer',
        'is_featured' => 'boolean',
        'specifications' => 'array'
    ];

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function category()
    {
        return $this->belongsTo(VehicleCategory::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function inquiries()
    {
        return $this->hasMany(VehicleInquiry::class);
    }

    // Scopes for common queries
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeByPriceRange($query, $min, $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    public function scopeByMakeModel($query, $make, $model = null)
    {
        $query->where('make', $make);
        if ($model) {
            $query->where('model', $model);
        }
        return $query;
    }
}
```

### Car Parts Management

```php
// Car part model with compatibility
class CarPart extends Model
{
    use HasMedia;

    protected $fillable = [
        'name', 'part_number', 'description', 'price',
        'stock_quantity', 'category_id', 'seller_id',
        'condition', 'warranty_period', 'is_oem'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'is_oem' => 'boolean',
        'compatible_vehicles' => 'array'
    ];

    public function category()
    {
        return $this->belongsTo(PartCategory::class);
    }

    public function compatibility()
    {
        return $this->hasMany(PartCompatibility::class);
    }

    public function isCompatibleWith(Vehicle $vehicle)
    {
        return $this->compatibility()
            ->where('make', $vehicle->make)
            ->where('model', $vehicle->model)
            ->whereBetween('year_from', [$vehicle->year, $vehicle->year])
            ->exists();
    }

    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    public function scopeCompatibleWith($query, $make, $model, $year)
    {
        return $query->whereHas('compatibility', function ($q) use ($make, $model, $year) {
            $q->where('make', $make)
              ->where('model', $model)
              ->where('year_from', '<=', $year)
              ->where('year_to', '>=', $year);
        });
    }
}
```

### Salvage Operations

```php
// Salvage vehicle model
class SalvageVehicle extends Model
{
    use HasMedia;

    protected $fillable = [
        'vehicle_id', 'damage_description', 'salvage_title',
        'auction_start_date', 'auction_end_date', 'minimum_bid',
        'current_bid', 'status', 'location'
    ];

    protected $casts = [
        'minimum_bid' => 'decimal:2',
        'current_bid' => 'decimal:2',
        'auction_start_date' => 'datetime',
        'auction_end_date' => 'datetime',
        'damage_assessment' => 'array'
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function bids()
    {
        return $this->hasMany(SalvageBid::class);
    }

    public function extractableParts()
    {
        return $this->hasMany(ExtractablePart::class);
    }

    public function scopeActiveAuctions($query)
    {
        return $query->where('status', 'active')
                    ->where('auction_start_date', '<=', now())
                    ->where('auction_end_date', '>=', now());
    }
}
```

## Payment Integration Patterns

### GoPay Payment Service

```php
// GoPay payment processing service
class PaymentService
{
    private $goPay;

    public function __construct()
    {
        $this->goPay = new \GoPay\Payments([
            'goid' => config('services.gopay.goid'),
            'clientId' => config('services.gopay.client_id'),
            'clientSecret' => config('services.gopay.client_secret'),
            'isProductionMode' => config('services.gopay.production'),
        ]);
    }

    public function createVehiclePayment(Vehicle $vehicle, User $buyer, array $options = [])
    {
        $payment = [
            'payer' => [
                'default_payment_instrument' => 'BANK_ACCOUNT',
                'allowed_payment_instruments' => ['BANK_ACCOUNT', 'PAYMENT_CARD'],
                'contact' => [
                    'first_name' => $buyer->first_name,
                    'last_name' => $buyer->last_name,
                    'email' => $buyer->email,
                    'phone_number' => $buyer->phone,
                ]
            ],
            'amount' => $vehicle->price * 100, // Convert to cents
            'currency' => 'CZK',
            'order_number' => $this->generateOrderNumber(),
            'order_description' => "Purchase of {$vehicle->make} {$vehicle->model} ({$vehicle->year})",
            'items' => [
                [
                    'name' => "{$vehicle->make} {$vehicle->model}",
                    'amount' => $vehicle->price * 100,
                    'count' => 1,
                    'vat_rate' => 21
                ]
            ],
            'callback' => [
                'return_url' => route('payment.return'),
                'notification_url' => route('payment.notify')
            ]
        ];

        $response = $this->goPay->createPayment($payment);

        if ($response->hasSucceed()) {
            // Store payment record
            $paymentRecord = Payment::create([
                'gopay_id' => $response->json['id'],
                'vehicle_id' => $vehicle->id,
                'user_id' => $buyer->id,
                'amount' => $vehicle->price,
                'status' => 'pending',
                'order_number' => $payment['order_number']
            ]);

            return [
                'success' => true,
                'payment_id' => $response->json['id'],
                'gateway_url' => $response->json['gw_url'],
                'payment_record' => $paymentRecord
            ];
        }

        return [
            'success' => false,
            'error' => $response->json['errors'] ?? 'Payment creation failed'
        ];
    }

    public function handlePaymentNotification(array $data)
    {
        $payment = Payment::where('gopay_id', $data['id'])->first();

        if (!$payment) {
            return false;
        }

        $paymentStatus = $this->goPay->getStatus($data['id']);

        if ($paymentStatus->hasSucceed()) {
            $status = $paymentStatus->json['state'];

            $payment->update([
                'status' => $this->mapGoPayStatus($status),
                'gopay_response' => $paymentStatus->json
            ]);

            // Handle successful payment
            if ($status === 'PAID') {
                $this->handleSuccessfulPayment($payment);
            }

            return true;
        }

        return false;
    }

    private function handleSuccessfulPayment(Payment $payment)
    {
        // Update vehicle status
        $payment->vehicle->update(['status' => 'sold']);

        // Create order
        Order::create([
            'vehicle_id' => $payment->vehicle_id,
            'buyer_id' => $payment->user_id,
            'seller_id' => $payment->vehicle->seller_id,
            'payment_id' => $payment->id,
            'amount' => $payment->amount,
            'status' => 'completed'
        ]);

        // Send notifications
        event(new VehicleSoldEvent($payment->vehicle, $payment->user));

        // Generate invoice
        dispatch(new GenerateInvoiceJob($payment));
    }
}
```

### Order Management

```php
// Order processing service
class OrderService
{
    public function createOrder(Vehicle $vehicle, User $buyer, Payment $payment)
    {
        DB::transaction(function () use ($vehicle, $buyer, $payment) {
            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'vehicle_id' => $vehicle->id,
                'buyer_id' => $buyer->id,
                'seller_id' => $vehicle->seller_id,
                'payment_id' => $payment->id,
                'amount' => $vehicle->price,
                'status' => 'pending',
                'order_date' => now()
            ]);

            // Update vehicle status
            $vehicle->update(['status' => 'reserved']);

            // Create order items
            OrderItem::create([
                'order_id' => $order->id,
                'item_type' => 'vehicle',
                'item_id' => $vehicle->id,
                'quantity' => 1,
                'unit_price' => $vehicle->price,
                'total_price' => $vehicle->price
            ]);

            return $order;
        });
    }

    public function completeOrder(Order $order)
    {
        $order->update(['status' => 'completed']);
        $order->vehicle->update(['status' => 'sold']);

        // Generate invoice
        dispatch(new GenerateInvoiceJob($order));

        // Send completion notifications
        event(new OrderCompletedEvent($order));
    }
}
```

## Search and Filtering

### Vehicle Search Service

```php
// Advanced vehicle search service
class VehicleSearchService
{
    public function search(array $filters)
    {
        $query = Vehicle::query()
            ->with(['seller', 'category'])
            ->available();

        // Apply filters
        if (!empty($filters['make'])) {
            $query->where('make', $filters['make']);
        }

        if (!empty($filters['model'])) {
            $query->where('model', $filters['model']);
        }

        if (!empty($filters['year_from'])) {
            $query->where('year', '>=', $filters['year_from']);
        }

        if (!empty($filters['year_to'])) {
            $query->where('year', '<=', $filters['year_to']);
        }

        if (!empty($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }

        if (!empty($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        if (!empty($filters['mileage_max'])) {
            $query->where('mileage', '<=', $filters['mileage_max']);
        }

        if (!empty($filters['fuel_type'])) {
            $query->where('fuel_type', $filters['fuel_type']);
        }

        if (!empty($filters['transmission'])) {
            $query->where('transmission', $filters['transmission']);
        }

        if (!empty($filters['location'])) {
            $query->whereHas('seller', function ($q) use ($filters) {
                $q->where('city', 'like', '%' . $filters['location'] . '%');
            });
        }

        // Full-text search
        if (!empty($filters['query'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('description', 'like', '%' . $filters['query'] . '%')
                  ->orWhere('make', 'like', '%' . $filters['query'] . '%')
                  ->orWhere('model', 'like', '%' . $filters['query'] . '%');
            });
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortBy, $sortDirection);

        return $query->paginate($filters['per_page'] ?? 20);
    }

    public function getFilterOptions()
    {
        return Cache::remember('vehicle_filters', 3600, function () {
            return [
                'makes' => Vehicle::distinct()->pluck('make')->filter()->sort()->values(),
                'fuel_types' => Vehicle::distinct()->pluck('fuel_type')->filter()->sort()->values(),
                'transmissions' => Vehicle::distinct()->pluck('transmission')->filter()->sort()->values(),
                'body_types' => Vehicle::distinct()->pluck('body_type')->filter()->sort()->values(),
                'price_range' => [
                    'min' => Vehicle::min('price'),
                    'max' => Vehicle::max('price')
                ],
                'year_range' => [
                    'min' => Vehicle::min('year'),
                    'max' => Vehicle::max('year')
                ]
            ];
        });
    }
}
```

## Frontend Integration

### Vue Vehicle Search Component

```vue
<!-- Vehicle search component -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Vehicle {
    id: number
    make: string
    model: string
    year: number
    price: number
    mileage: number
    images: string[]
    seller: {
        name: string
        location: string
    }
}

interface SearchFilters {
    make?: string
    model?: string
    year_from?: number
    year_to?: number
    price_min?: number
    price_max?: number
    mileage_max?: number
    fuel_type?: string
    transmission?: string
    location?: string
    query?: string
    sort_by?: string
    sort_direction?: string
}

const props = defineProps<{
    vehicles: {
        data: Vehicle[]
        meta: {
            current_page: number
            last_page: number
            per_page: number
            total: number
        }
    }
    filters: SearchFilters
    filterOptions: {
        makes: string[]
        fuel_types: string[]
        transmissions: string[]
        body_types: string[]
        price_range: { min: number; max: number }
        year_range: { min: number; max: number }
    }
}>()

const searchFilters = ref<SearchFilters>({ ...props.filters })
const showFilters = ref(false)

const filteredVehicles = computed(() => props.vehicles.data)

const handleSearch = () => {
    router.get(route('vehicles.search'), searchFilters.value, {
        preserveScroll: true,
        preserveState: true,
    })
}

const handleSort = (sortBy: string) => {
    searchFilters.value.sort_by = sortBy
    searchFilters.value.sort_direction = searchFilters.value.sort_direction === 'asc' ? 'desc' : 'asc'
    handleSearch()
}

const resetFilters = () => {
    searchFilters.value = {}
    handleSearch()
}

// Watch for filter changes and auto-search
watch(
    searchFilters,
    () => {
        handleSearch()
    },
    { deep: true }
)
</script>

<template>
    <div class="vehicle-search">
        <!-- Search Bar -->
        <div class="search-bar bg-white p-4 rounded-lg shadow-sm mb-6">
            <div class="flex gap-4 items-center">
                <div class="flex-1">
                    <input
                        v-model="searchFilters.query"
                        type="text"
                        placeholder="Search vehicles..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    @click="showFilters = !showFilters"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Filters
                </button>
                <button
                    @click="handleSearch"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Search
                </button>
            </div>
        </div>

        <!-- Advanced Filters -->
        <div
            v-if="showFilters"
            class="filters bg-white p-6 rounded-lg shadow-sm mb-6"
        >
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Make</label>
                    <select
                        v-model="searchFilters.make"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Makes</option>
                        <option
                            v-for="make in filterOptions.makes"
                            :key="make"
                            :value="make"
                        >
                            {{ make }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <div class="flex gap-2">
                        <input
                            v-model="searchFilters.price_min"
                            type="number"
                            placeholder="Min"
                            class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            v-model="searchFilters.price_max"
                            type="number"
                            placeholder="Max"
                            class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <div class="flex gap-2">
                        <input
                            v-model="searchFilters.year_from"
                            type="number"
                            placeholder="From"
                            class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            v-model="searchFilters.year_to"
                            type="number"
                            placeholder="To"
                            class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                    <select
                        v-model="searchFilters.fuel_type"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Types</option>
                        <option
                            v-for="fuel in filterOptions.fuel_types"
                            :key="fuel"
                            :value="fuel"
                        >
                            {{ fuel }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="mt-4 flex justify-end gap-2">
                <button
                    @click="resetFilters"
                    class="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                    Reset
                </button>
                <button
                    @click="showFilters = false"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Apply Filters
                </button>
            </div>
        </div>

        <!-- Results -->
        <div class="results">
            <div class="flex justify-between items-center mb-4">
                <p class="text-gray-600">{{ vehicles.meta.total }} vehicles found</p>
                <div class="flex gap-2">
                    <button
                        @click="handleSort('price')"
                        class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                    >
                        Price
                    </button>
                    <button
                        @click="handleSort('year')"
                        class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                    >
                        Year
                    </button>
                    <button
                        @click="handleSort('mileage')"
                        class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                    >
                        Mileage
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    v-for="vehicle in filteredVehicles"
                    :key="vehicle.id"
                    class="vehicle-card bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                    <div class="aspect-w-16 aspect-h-9">
                        <img
                            :src="vehicle.images[0]"
                            :alt="`${vehicle.make} ${vehicle.model}`"
                            class="w-full h-48 object-cover"
                        />
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-lg mb-1">{{ vehicle.make }} {{ vehicle.model }}</h3>
                        <p class="text-gray-600 text-sm mb-2">{{ vehicle.year }} • {{ vehicle.mileage.toLocaleString() }} km</p>
                        <p class="text-2xl font-bold text-blue-600 mb-2">{{ vehicle.price.toLocaleString() }} CZK</p>
                        <p class="text-gray-500 text-sm mb-4">{{ vehicle.seller.name }} • {{ vehicle.seller.location }}</p>
                        <Link
                            :href="route('vehicles.show', { vehicle: vehicle.id })"
                            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-block text-center"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
```

## SEO and Performance

### Structured Data for Vehicles

```php
// SEO service for vehicle listings
class VehicleSeoService
{
    public function generateStructuredData(Vehicle $vehicle)
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Car',
            'name' => "{$vehicle->make} {$vehicle->model}",
            'brand' => [
                '@type' => 'Brand',
                'name' => $vehicle->make
            ],
            'model' => $vehicle->model,
            'vehicleModelDate' => $vehicle->year,
            'mileageFromOdometer' => [
                '@type' => 'QuantitativeValue',
                'value' => $vehicle->mileage,
                'unitCode' => 'KMT'
            ],
            'fuelType' => $vehicle->fuel_type,
            'vehicleTransmission' => $vehicle->transmission,
            'bodyType' => $vehicle->body_type,
            'color' => $vehicle->color,
            'offers' => [
                '@type' => 'Offer',
                'price' => $vehicle->price,
                'priceCurrency' => 'CZK',
                'availability' => 'https://schema.org/InStock',
                'seller' => [
                    '@type' => 'Organization',
                    'name' => $vehicle->seller->name
                ]
            ],
            'image' => $vehicle->getFirstMediaUrl('images'),
            'description' => $vehicle->description
        ];
    }
}
```

This comprehensive prompt covers all the key aspects of automotive e-commerce development with your specific tech stack.
