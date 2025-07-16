---
mode: agent
---

# Single-Vendor E-commerce Development Prompt

## Expected Output Format

When working on single-vendor e-commerce features, provide:

1. **Business logic** - Company-owned inventory and customer purchasing patterns
2. **Admin workflows** - Efficient inventory management for company staff
3. **Customer experience** - Streamlined browsing and purchasing journey
4. **Inventory control** - Stock management, reorder points, supplier integration
5. **Order processing** - End-to-end order fulfillment workflows
6. **Analytics and reporting** - Sales performance and inventory insights

## Single-Vendor E-commerce Patterns

### Company Inventory Management

```php
// Comprehensive inventory service
class InventoryService
{
    public function addVehicleToInventory(array $vehicleData, User $admin): Vehicle
    {
        return DB::transaction(function () use ($vehicleData, $admin) {
            $vehicle = Vehicle::create([
                'make' => $vehicleData['make'],
                'model' => $vehicleData['model'],
                'year' => $vehicleData['year'],
                'vin' => $vehicleData['vin'],
                'purchase_price' => $vehicleData['purchase_price'],
                'price' => $vehicleData['price'],
                'stock_quantity' => 1,
                'status' => 'available',
                'added_by' => $admin->id,
                'added_at' => now(),
            ]);

            // Log inventory addition
            InventoryLog::create([
                'item_type' => 'vehicle',
                'item_id' => $vehicle->id,
                'action' => 'added',
                'admin_id' => $admin->id,
                'details' => json_encode($vehicleData),
            ]);

            // Check if low stock alerts needed
            $this->checkLowStockAlerts('vehicles');

            return $vehicle;
        });
    }

    public function updateStock(string $itemType, int $itemId, int $newQuantity, User $admin): bool
    {
        return DB::transaction(function () use ($itemType, $itemId, $newQuantity, $admin) {
            $model = $this->getModelClass($itemType);
            $item = $model::findOrFail($itemId);
            $oldQuantity = $item->stock_quantity;

            $item->update(['stock_quantity' => $newQuantity]);

            // Log stock change
            InventoryLog::create([
                'item_type' => $itemType,
                'item_id' => $itemId,
                'action' => 'stock_updated',
                'admin_id' => $admin->id,
                'details' => json_encode([
                    'old_quantity' => $oldQuantity,
                    'new_quantity' => $newQuantity,
                    'change' => $newQuantity - $oldQuantity,
                ]),
            ]);

            return true;
        });
    }

    public function getLowStockItems(string $itemType = null): Collection
    {
        $query = InventoryItem::query()
            ->where('stock_quantity', '<=', DB::raw('reorder_point'))
            ->where('status', 'active');

        if ($itemType) {
            $query->where('item_type', $itemType);
        }

        return $query->with(['item'])->get();
    }
}
```

### Customer Shopping Experience

```php
// Customer shopping service
class ShoppingService
{
    public function getProductCatalog(array $filters = []): LengthAwarePaginator
    {
        $query = Vehicle::query()
            ->inStock()
            ->with(['media', 'specifications']);

        // Apply filters
        if (!empty($filters['make'])) {
            $query->where('make', $filters['make']);
        }

        if (!empty($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }

        if (!empty($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        if (!empty($filters['year_from'])) {
            $query->where('year', '>=', $filters['year_from']);
        }

        // Apply sorting
        $sortBy = $filters['sort'] ?? 'created_at';
        $sortDirection = $filters['direction'] ?? 'desc';
        $query->orderBy($sortBy, $sortDirection);

        return $query->paginate(20);
    }

    public function addToCart(int $vehicleId, User $customer): Cart
    {
        $vehicle = Vehicle::inStock()->findOrFail($vehicleId);

        // Check if already in cart
        $existingCartItem = Cart::where('customer_id', $customer->id)
            ->where('item_type', 'vehicle')
            ->where('item_id', $vehicleId)
            ->first();

        if ($existingCartItem) {
            throw new ItemAlreadyInCartException();
        }

        return Cart::create([
            'customer_id' => $customer->id,
            'item_type' => 'vehicle',
            'item_id' => $vehicleId,
            'quantity' => 1,
            'unit_price' => $vehicle->price,
            'total_price' => $vehicle->price,
        ]);
    }

    public function getCartTotal(User $customer): float
    {
        return Cart::where('customer_id', $customer->id)
            ->sum('total_price');
    }
}
```

### Order Processing System

```php
// Comprehensive order processing
class OrderProcessingService
{
    public function processOrder(User $customer, array $paymentData): Order
    {
        return DB::transaction(function () use ($customer, $paymentData) {
            // Get cart items
            $cartItems = Cart::where('customer_id', $customer->id)
                ->with('item')
                ->get();

            if ($cartItems->isEmpty()) {
                throw new EmptyCartException();
            }

            // Verify stock availability
            $this->verifyStockAvailability($cartItems);

            // Create order
            $order = Order::create([
                'customer_id' => $customer->id,
                'order_number' => $this->generateOrderNumber(),
                'subtotal' => $cartItems->sum('total_price'),
                'tax_amount' => $this->calculateTax($cartItems),
                'total_amount' => $this->calculateTotal($cartItems),
                'status' => 'pending',
                'order_date' => now(),
            ]);

            // Create order items and reserve inventory
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'item_type' => $cartItem->item_type,
                    'item_id' => $cartItem->item_id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->unit_price,
                    'total_price' => $cartItem->total_price,
                ]);

                // Reserve inventory
                $this->reserveInventory($cartItem);
            }

            // Process payment
            $payment = $this->processPayment($order, $paymentData);

            if ($payment['success']) {
                $this->completeOrder($order);
                $this->clearCart($customer);
            }

            return $order;
        });
    }

    private function reserveInventory($cartItem): void
    {
        $model = $this->getModelClass($cartItem->item_type);
        $item = $model::find($cartItem->item_id);

        $item->decrement('stock_quantity', $cartItem->quantity);

        // Log inventory reservation
        InventoryLog::create([
            'item_type' => $cartItem->item_type,
            'item_id' => $cartItem->item_id,
            'action' => 'reserved',
            'quantity_change' => -$cartItem->quantity,
            'order_id' => $cartItem->order_id ?? null,
        ]);
    }

    private function completeOrder(Order $order): void
    {
        $order->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        // Generate invoice
        dispatch(new GenerateInvoiceJob($order));

        // Send confirmation email
        dispatch(new SendOrderConfirmationJob($order));

        // Update analytics
        dispatch(new UpdateSalesAnalyticsJob($order));
    }
}
```

### Admin Dashboard Widgets

```php
// Sales performance widget for Filament
class SalesPerformanceWidget extends ChartWidget
{
    protected static ?string $heading = 'Sales Performance';
    protected static ?int $sort = 1;

    protected function getData(): array
    {
        $salesData = Order::where('status', 'completed')
            ->selectRaw('DATE(created_at) as date, COUNT(*) as orders, SUM(total_amount) as revenue')
            ->whereBetween('created_at', [now()->subDays(30), now()])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Orders',
                    'data' => $salesData->pluck('orders')->toArray(),
                    'borderColor' => 'rgb(59, 130, 246)',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                ],
                [
                    'label' => 'Revenue (CZK)',
                    'data' => $salesData->pluck('revenue')->toArray(),
                    'borderColor' => 'rgb(34, 197, 94)',
                    'backgroundColor' => 'rgba(34, 197, 94, 0.1)',
                ],
            ],
            'labels' => $salesData->pluck('date')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}

// Inventory status widget
class InventoryStatusWidget extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Vehicles', Vehicle::inStock()->count())
                ->description('Available for sale')
                ->descriptionIcon('heroicon-m-truck')
                ->color('success'),

            Stat::make('Low Stock Items', Vehicle::lowStock()->count())
                ->description('Need reordering')
                ->descriptionIcon('heroicon-m-exclamation-triangle')
                ->color('warning'),

            Stat::make('Total Parts', CarPart::inStock()->count())
                ->description('Available inventory')
                ->descriptionIcon('heroicon-m-cog')
                ->color('primary'),

            Stat::make('Pending Orders', Order::where('status', 'pending')->count())
                ->description('Awaiting processing')
                ->descriptionIcon('heroicon-m-clock')
                ->color('gray'),
        ];
    }
}
```

## Frontend Shopping Components (JavaScript)

### Product Catalog Component

```vue
<!-- Product catalog with filters -->
<script setup>
import { ref, computed, watch } from 'vue'

/**
 * Product catalog component for browsing vehicles
 * @param {Object} products - Product data with pagination
 * @param {Object} filters - Current filter values
 * @param {Object} filterOptions - Available filter options
 */
const props = defineProps({
    products: {
        type: Object,
        required: true,
    },
    filters: {
        type: Object,
        default: () => ({}),
    },
    filterOptions: {
        type: Object,
        required: true,
    },
})

const searchFilters = ref({ ...props.filters })
const showFilters = ref(false)

/**
 * Handle search with current filters
 */
const handleSearch = () => {
    router.get(route('shop.vehicles.index'), searchFilters.value, {
        preserveScroll: true,
        preserveState: true,
    })
}

/**
 * Reset all filters to default
 */
const resetFilters = () => {
    searchFilters.value = {}
    handleSearch()
}

/**
 * Add product to shopping cart
 * @param {number} vehicleId - Vehicle ID to add
 */
const addToCart = (vehicleId) => {
    router.post(
        route('shop.cart.add'),
        {
            vehicle_id: vehicleId,
        },
        {
            preserveScroll: true,
            onSuccess: () => {
                // Show success notification
            },
        }
    )
}

// Auto-search when filters change
watch(
    searchFilters,
    () => {
        handleSearch()
    },
    { deep: true }
)
</script>

<template>
    <div class="product-catalog">
        <!-- Search and Filters -->
        <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div class="flex items-center gap-4 mb-4">
                <input
                    v-model="searchFilters.search"
                    type="text"
                    placeholder="Search vehicles..."
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                    @click="showFilters = !showFilters"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                    {{ showFilters ? 'Hide' : 'Show' }} Filters
                </button>
            </div>

            <!-- Advanced Filters -->
            <div
                v-if="showFilters"
                class="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t"
            >
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Make</label>
                    <select
                        v-model="searchFilters.make"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                            class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            v-model="searchFilters.price_max"
                            type="number"
                            placeholder="Max"
                            class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
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
                            class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            v-model="searchFilters.year_to"
                            type="number"
                            placeholder="To"
                            class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>

                <div class="flex items-end">
                    <button
                        @click="resetFilters"
                        class="w-full px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
                v-for="vehicle in products.data"
                :key="vehicle.id"
                class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
                <div class="aspect-w-16 aspect-h-9">
                    <img
                        :src="vehicle.images[0]?.url"
                        :alt="`${vehicle.make} ${vehicle.model}`"
                        class="w-full h-48 object-cover"
                    />
                </div>

                <div class="p-6">
                    <h3 class="text-lg font-semibold mb-2">{{ vehicle.make }} {{ vehicle.model }}</h3>
                    <p class="text-gray-600 text-sm mb-2">{{ vehicle.year }} • {{ vehicle.mileage?.toLocaleString() }} km</p>
                    <p class="text-2xl font-bold text-blue-600 mb-4">{{ vehicle.price.toLocaleString() }} CZK</p>

                    <div class="flex gap-2">
                        <Link
                            :href="route('shop.vehicles.show', vehicle.id)"
                            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-center"
                        >
                            View Details
                        </Link>
                        <button
                            @click="addToCart(vehicle.id)"
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div
            v-if="products.meta.last_page > 1"
            class="mt-8 flex justify-center"
        >
            <nav class="flex items-center space-x-2">
                <Link
                    v-if="products.meta.prev_page_url"
                    :href="products.meta.prev_page_url"
                    class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                    Previous
                </Link>
                <span class="px-4 py-2 text-gray-600"> Page {{ products.meta.current_page }} of {{ products.meta.last_page }} </span>
                <Link
                    v-if="products.meta.next_page_url"
                    :href="products.meta.next_page_url"
                    class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                    Next
                </Link>
            </nav>
        </div>
    </div>
</template>
```

This comprehensive prompt covers single-vendor e-commerce patterns with company-owned inventory, streamlined customer experience, and efficient admin workflows.
