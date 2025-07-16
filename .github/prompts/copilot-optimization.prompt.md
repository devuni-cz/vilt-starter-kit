---
mode: agent
---

# GitHub Copilot Optimization Prompt

## Expected Output Format

When optimizing code for GitHub Copilot suggestions, provide:

1. **Context-rich code** - Descriptive variable names and clear function purposes
2. **Documentation patterns** - JSDoc and PHPDoc comments for better AI understanding
3. **Consistent naming** - Follow established patterns for predictable suggestions
4. **Domain vocabulary** - Use automotive industry terminology consistently
5. **Code organization** - Structure files for optimal AI context understanding
6. **Comment strategies** - Write comments that help AI understand intent

## Copilot-Optimized Coding Patterns

### Descriptive Naming for Better AI Context

```php
// ✅ Good - Clear, descriptive names help Copilot understand context
class VehicleInventoryManagementService
{
    public function addNewVehicleToCompanyInventory(array $vehicleDetails, User $admin): Vehicle
    {
        $vehicleWithCalculatedPricing = $this->calculateProfitMarginAndRetailPrice($vehicleDetails);
        $savedVehicle = $this->saveVehicleToDatabase($vehicleWithCalculatedPricing, $admin);
        $this->notifyInventoryManagersOfNewVehicle($savedVehicle);

        return $savedVehicle;
    }

    /**
     * Calculate retail price based on purchase price and desired profit margin
     * Used for automotive e-commerce pricing strategy
     */
    private function calculateProfitMarginAndRetailPrice(array $vehicleData): array
    {
        $purchasePrice = $vehicleData['purchase_price'];
        $desiredProfitMargin = $vehicleData['profit_margin'] ?? 0.3; // 30% default
        $retailPrice = $purchasePrice * (1 + $desiredProfitMargin);

        return array_merge($vehicleData, [
            'retail_price' => $retailPrice,
            'profit_amount' => $retailPrice - $purchasePrice
        ]);
    }
}

// ❌ Bad - Vague names don't help Copilot understand purpose
class VehicleService
{
    public function add($data, $user): Vehicle
    {
        $result = $this->calc($data);
        $saved = $this->save($result, $user);
        $this->notify($saved);

        return $saved;
    }
}
```

### Documentation for AI Context

```javascript
/**
 * Shopping cart management composable for automotive e-commerce
 * Handles adding vehicles and parts to customer shopping cart
 * Integrates with Laravel backend API for cart persistence
 *
 * @returns {Object} Cart management functions and reactive state
 */
export function useShoppingCart() {
    const cartItems = ref([])
    const cartTotal = ref(0)
    const isLoadingCart = ref(false)

    /**
     * Add a vehicle to the customer's shopping cart
     * Validates stock availability before adding
     *
     * @param {Object} vehicle - Vehicle object with id, price, make, model
     * @param {number} quantity - Number of items to add (usually 1 for vehicles)
     */
    const addVehicleToCart = async (vehicle, quantity = 1) => {
        isLoadingCart.value = true

        try {
            const response = await router.post(route('shop.cart.add'), {
                item_type: 'vehicle',
                item_id: vehicle.id,
                quantity: quantity,
            })

            // Update local cart state with server response
            await refreshCartFromServer()

            return { success: true, message: 'Vehicle added to cart' }
        } catch (error) {
            return { success: false, message: error.message }
        } finally {
            isLoadingCart.value = false
        }
    }

    /**
     * Calculate total price including tax for Czech Republic (21% VAT)
     * Used for displaying final price to customers
     */
    const calculateCartTotalWithTax = computed(() => {
        const subtotal = cartItems.value.reduce((sum, item) => sum + item.total_price, 0)
        const vatRate = 0.21 // Czech Republic VAT rate
        const vatAmount = subtotal * vatRate

        return {
            subtotal: subtotal,
            vatAmount: vatAmount,
            total: subtotal + vatAmount,
        }
    })

    return {
        cartItems,
        cartTotal,
        isLoadingCart,
        addVehicleToCart,
        calculateCartTotalWithTax,
    }
}
```

### Domain-Specific Vocabulary

```php
// Use consistent automotive industry terminology
class VehicleSpecificationService
{
    /**
     * Automotive industry standard vehicle specifications
     * Following automotive data standards for consistent data structure
     */
    public function createVehicleSpecifications(Vehicle $vehicle, array $specifications): void
    {
        $standardizedSpecs = $this->standardizeAutomotiveSpecifications($specifications);

        foreach ($standardizedSpecs as $specCategory => $specValue) {
            VehicleSpecification::create([
                'vehicle_id' => $vehicle->id,
                'specification_type' => $specCategory, // engine, transmission, safety, etc.
                'specification_value' => $specValue,
                'is_highlight' => $this->isHighlightSpecification($specCategory),
                'display_order' => $this->getSpecificationDisplayOrder($specCategory)
            ]);
        }
    }

    /**
     * Standardize automotive specifications to industry standards
     * Ensures consistent data format for vehicle comparisons
     */
    private function standardizeAutomotiveSpecifications(array $rawSpecs): array
    {
        return [
            'engine_displacement' => $rawSpecs['engine_size'] ?? null,
            'engine_type' => $rawSpecs['engine_type'] ?? null,
            'transmission_type' => $rawSpecs['transmission'] ?? null,
            'fuel_consumption_city' => $rawSpecs['fuel_city'] ?? null,
            'fuel_consumption_highway' => $rawSpecs['fuel_highway'] ?? null,
            'safety_rating' => $rawSpecs['safety_rating'] ?? null,
            'drivetrain' => $rawSpecs['drivetrain'] ?? null, // FWD, RWD, AWD
            'seating_capacity' => $rawSpecs['seats'] ?? null,
            'cargo_volume' => $rawSpecs['trunk_space'] ?? null,
        ];
    }
}
```

### File Organization for AI Context

```php
// Organize files with clear, hierarchical structure
// app/Services/Automotive/Inventory/VehicleInventoryService.php
namespace App\Services\Automotive\Inventory;

/**
 * Vehicle inventory management for automotive e-commerce company
 * Handles company-owned vehicle stock, pricing, and availability
 */
class VehicleInventoryService
{
    // Vehicle inventory management methods here
}

// app/Services/Automotive/Sales/CustomerOrderService.php
namespace App\Services\Automotive\Sales;

/**
 * Customer order processing for vehicle purchases
 * Handles single-vendor e-commerce order workflow
 */
class CustomerOrderService
{
    // Order processing methods here
}

// app/Services/Automotive/Catalog/VehicleSearchService.php
namespace App\Services\Automotive\Catalog;

/**
 * Vehicle search and filtering for customer catalog browsing
 * Optimized for automotive e-commerce product discovery
 */
class VehicleSearchService
{
    // Search and filtering methods here
}
```

### Laravel Model Documentation

```php
/**
 * Vehicle model for automotive e-commerce inventory
 * Represents company-owned vehicles available for sale to customers
 *
 * @property int $id
 * @property string $make Vehicle manufacturer (BMW, Audi, Škoda, etc.)
 * @property string $model Vehicle model name
 * @property int $year Model year
 * @property string $vin Vehicle Identification Number (17 characters)
 * @property float $purchase_price Company purchase price for internal tracking
 * @property float $retail_price Customer-facing sale price
 * @property int $mileage Vehicle mileage in kilometers
 * @property string $status available|reserved|sold|maintenance
 * @property int $stock_quantity Usually 1 for vehicles, can be > 1 for parts
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @property-read Collection<VehicleSpecification> $specifications
 * @property-read Collection<Media> $images
 * @property-read Collection<Order> $orders
 */
class Vehicle extends Model
{
    use HasFactory, HasMedia, SoftDeletes;

    protected $fillable = [
        'make',
        'model',
        'year',
        'vin',
        'purchase_price',
        'retail_price',
        'mileage',
        'status',
        'stock_quantity',
        'description',
        'admin_notes'
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'retail_price' => 'decimal:2',
        'year' => 'integer',
        'mileage' => 'integer',
        'stock_quantity' => 'integer'
    ];

    /**
     * Scope to get vehicles available for customer purchase
     * Excludes sold, reserved, and maintenance vehicles
     */
    public function scopeAvailableForSale($query)
    {
        return $query->where('status', 'available')
                    ->where('stock_quantity', '>', 0);
    }

    /**
     * Scope to get vehicles that need reordering or restocking
     * Used for inventory management alerts
     */
    public function scopeLowStock($query, int $threshold = 1)
    {
        return $query->where('stock_quantity', '<=', $threshold)
                    ->where('status', '!=', 'sold');
    }
}
```

### Vue Component Organization

```vue
<!-- 
VehicleCatalogGrid.vue
Displays grid of vehicles for customer browsing
Used on main shop page and search results
Integrates with shopping cart functionality
-->
<script setup>
import { computed } from 'vue'
import { useShoppingCart } from '@/composables/useShoppingCart'

/**
 * Props for vehicle catalog grid component
 * @param {Array} vehicles - Array of vehicle objects from Laravel API
 * @param {Object} filters - Current search/filter parameters
 * @param {Boolean} showAddToCart - Whether to show add to cart buttons
 */
const props = defineProps({
    vehicles: {
        type: Array,
        required: true,
        validator: (vehicles) => vehicles.every((v) => v.id && v.make && v.model),
    },
    filters: {
        type: Object,
        default: () => ({}),
    },
    showAddToCart: {
        type: Boolean,
        default: true,
    },
})

const { addVehicleToCart, isLoadingCart } = useShoppingCart()

/**
 * Format vehicle display price with Czech currency
 * @param {number} price - Price in CZK
 * @returns {string} Formatted price string
 */
const formatVehiclePrice = (price) => {
    return new Intl.NumberFormat('cs-CZ', {
        style: 'currency',
        currency: 'CZK',
    }).format(price)
}

/**
 * Handle adding vehicle to customer cart
 * Shows loading state and handles errors
 */
const handleAddToCart = async (vehicle) => {
    const result = await addVehicleToCart(vehicle)

    if (result.success) {
        // Show success notification to customer
    } else {
        // Handle error (out of stock, etc.)
    }
}
</script>

<template>
    <div class="vehicle-catalog-grid">
        <!-- Vehicle grid implementation -->
    </div>
</template>
```

## Additional Copilot Optimizations

### Context Files

Create `.copilot-context` files in key directories:

```
// app/Services/.copilot-context
This directory contains business logic services for the automotive e-commerce platform.
Services handle complex operations like inventory management, order processing, and payment integration.
All services follow single-vendor e-commerce patterns where the company owns all inventory.
```

### Consistent Method Signatures

Use consistent parameter naming across similar methods:

```php
// Consistent naming helps Copilot predict method signatures
public function addVehicleToInventory(array $vehicleData, User $admin): Vehicle
public function updateVehicleInInventory(Vehicle $vehicle, array $updateData, User $admin): Vehicle
public function removeVehicleFromInventory(Vehicle $vehicle, User $admin): bool
```

### Error Handling Patterns

Use consistent error handling for better AI pattern recognition:

```php
try {
    $result = $this->processCustomerOrder($orderData);
    return ['success' => true, 'data' => $result];
} catch (InsufficientStockException $e) {
    return ['success' => false, 'error' => 'insufficient_stock', 'message' => $e->getMessage()];
} catch (PaymentFailedException $e) {
    return ['success' => false, 'error' => 'payment_failed', 'message' => $e->getMessage()];
} catch (\Exception $e) {
    return ['success' => false, 'error' => 'general_error', 'message' => 'An unexpected error occurred'];
}
```

These patterns help GitHub Copilot provide better, more contextually relevant suggestions for your automotive e-commerce platform.
