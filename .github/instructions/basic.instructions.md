---
applyTo: '**'
---

# Basic Instructions for AI Assistant

## Project Overview

This is a Laravel 12 automotive e-commerce application where the company owner manages and sells cars, car parts, and car salvage directly to customers. The application features online payments with GoPay, a Filament-based admin panel for inventory management, user profiles for customers, and ERP functionality for invoices. It uses Vue 3.5 with Inertia.js for seamless SPA experience.

## Business Domain

The application handles these main business areas:

- **Vehicle Sales**: Company-owned new and used car inventory, specifications, pricing
- **Parts Management**: Company car parts inventory, compatibility, pricing, stock management
- **Salvage Operations**: Company salvage vehicle sales, parts extraction, refurbishment
- **Payment Processing**: GoPay integration for secure customer transactions
- **Customer Management**: Customer profiles, order history, preferences
- **Admin Operations**: Filament-based admin panel for complete inventory management
- **ERP System**: Invoice generation, accounting, sales reporting, financial management
- **Inventory Management**: Real-time stock tracking, purchase orders, supplier management

## Core Business Model

### Single-Vendor E-commerce
- **Company-owned inventory** - All products managed by company administrators
- **Customer purchasing** - Customers browse and buy from company inventory
- **No third-party sellers** - Only company staff can add/manage products
- **Centralized inventory** - Single inventory management system
- **Company branding** - All products sold under company brand

### User Roles
- **Administrators** - Full access to inventory, orders, customers, financials
- **Managers** - Limited admin access for daily operations
- **Staff** - Inventory management and order processing
- **Customers** - Browse products, place orders, manage profiles

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.4+)
- **Frontend**: Vue 3.5 with Composition API (JavaScript, no TypeScript)
- **Bridge**: Inertia.js v2 for SPA-like experience
- **Language**: JavaScript for frontend, PHP for backend
- **Styling**: Tailwind CSS 4.x with modern features
- **Admin Panel**: Filament 3.x with Shield for permissions
- **Routing**: Ziggy for Laravel route names in JavaScript
- **Database**: MySQL/PostgreSQL with media library support
- **Testing**: PHPUnit for backend, Vitest for frontend
- **Code Quality**: Laravel Pint, ESLint, Prettier (no TypeScript ESLint)
- **Build Tools**: Vite 6.x with Laravel integration
- **Payments**: GoPay SDK for payment processing
- **Media**: Spatie Media Library for file management
- **Authentication**: Laravel Socialite for social login
- **Monitoring**: Sentry for error tracking and performance
- **QR Codes**: Lara Zeus QR for vehicle identification
- **Sitemap**: Spatie Laravel Sitemap for SEO

## Core Application Domains

### Inventory Management (Admin)
- **Vehicle Inventory**: Add, edit, remove vehicles from company stock
- **Parts Inventory**: Manage car parts, compatibility, stock levels
- **Salvage Inventory**: Process salvage vehicles, extract valuable parts
- **Pricing Management**: Set prices, discounts, promotions
- **Stock Control**: Track inventory levels, reorder points, supplier orders

### Customer Experience
- **Product Browsing**: Search and filter vehicles and parts
- **Product Details**: Comprehensive vehicle/part information
- **Shopping Cart**: Add items, calculate totals, apply discounts
- **Checkout Process**: Secure payment with GoPay integration
- **Order Tracking**: Order status, delivery information

### Sales & Financial Management
- **Order Processing**: Manage customer orders from payment to delivery
- **Invoice Generation**: Automated billing and receipt generation
- **Financial Reporting**: Sales analytics, profit margins, tax reporting
- **Customer Analytics**: Purchase history, preferences, loyalty metrics

## Coding Standards

### PHP/Laravel Standards

- Follow PSR-12 coding standards
- Use Laravel Pint for code formatting (`npm run pint`)
- Prefer explicit type declarations where possible
- Use Laravel's built-in features (Eloquent, validation, etc.)
- Follow Laravel naming conventions with consistent suffixes/prefixes:
    - Models: singular PascalCase (e.g., `Vehicle`, `CarPart`, `SalvageItem`)
    - Controllers: PascalCase with "Controller" suffix (e.g., `VehicleController`, `InventoryController`)
    - Events: descriptive name with "Event" suffix (e.g., `VehicleAddedEvent`, `OrderCompletedEvent`)
    - Listeners: action-based name with "Listener" suffix (e.g., `SendOrderConfirmationListener`)
    - Form Requests: action prefix with "Request" suffix (e.g., `StoreVehicleRequest`, `ProcessOrderRequest`)
    - API Resources: context with "Resource" suffix (e.g., `VehicleResource`, `OrderResource`)
    - Services: domain with "Service" suffix (e.g., `InventoryService`, `OrderService`, `PaymentService`)
    - Jobs: action-based with "Job" suffix (e.g., `ProcessOrderJob`, `UpdateInventoryJob`)
    - Observers: model name with "Observer" suffix (e.g., `VehicleObserver`, `OrderObserver`)
    - Policies: model name with "Policy" suffix (e.g., `VehiclePolicy`, `OrderPolicy`)
    - Middleware: descriptive name with "Middleware" suffix (e.g., `AdminOnlyMiddleware`)
    - Database tables: plural snake_case (e.g., `vehicles`, `car_parts`, `customer_orders`)
    - Routes: kebab-case for URLs, dot notation for names (e.g., `admin.vehicles.index`, `shop.parts.show`)
    - Always use named routes for Ziggy integration
- Use Resource classes for API responses
- Implement proper validation using Form Request classes
- Use Enums for constants and status values
- Follow Filament conventions for admin panel components

### Vue/JavaScript Standards

- Use JavaScript ES6+ (no TypeScript)
- Use Vue 3.5 Composition API with `<script setup>`
- Prefer modern JavaScript features
- Use proper JSDoc comments for function documentation
- Follow Vue best practices and reactivity patterns
- Use PascalCase for component names (e.g., `VehicleCard`, `ShoppingCart`)
- Use camelCase for props, reactive variables, and functions
- Use kebab-case for CSS classes and HTML attributes
- Always use Ziggy route names instead of hardcoded URLs
- Import `route` from 'ziggy-js' in components that need routing
- Format code with Prettier (`npm run format`)
- Lint with ESLint (`npm run lint`)
- Use composables for reusable reactive logic
- Use proper component props and emits definitions
- Handle loading and error states properly in components
- Use proper event handlers and avoid inline functions in templates when possible
- Follow Vue naming conventions: event handlers start with "handle" (e.g., `handleAddToCart`)
- Use destructuring for props and reactive variables where appropriate
- Take advantage of Vue 3.5 features (enhanced reactivity, better performance)
- Use Tailwind CSS 4.x utilities and modern CSS features
- Define prop types and defaults properly

### Filament Admin Panel Standards

- Use Filament 3.x conventions for admin resources
- Implement proper authorization with Filament Shield
- Use Filament form components for consistent UI
- Follow Filament naming conventions for resources and pages
- Use Filament widgets for dashboard components
- Implement proper media management with Filament Media Library plugin

## E-commerce Specific Guidelines

### Inventory Management
- Track stock levels in real-time
- Implement low stock alerts and reorder points
- Use proper indexing for product search functionality
- Handle product variants (size, color, condition) efficiently
- Implement bulk operations for inventory updates

### Customer Experience
- Optimize product search with filters and sorting
- Implement proper product image optimization
- Use structured data for SEO (Schema.org markup)
- Include comprehensive product information
- Implement related/recommended products

### Order Processing
- Use GoPay SDK for all payment processing
- Implement proper error handling for payment failures
- Create automated order workflows
- Generate invoices and receipts automatically
- Track order status from payment to delivery

### Security Considerations
- Validate all user inputs especially for product data
- Implement proper authentication for admin access
- Use HTTPS for all payment-related pages
- Implement rate limiting for search and API endpoints
- Validate file uploads for product images and documents

## Performance Guidelines

- Use eager loading for product relationships (images, specifications)
- Implement caching for frequently accessed data (product catalogs)
- Optimize image delivery with CDN for product photos
- Use database indexing for search functionality
- Implement proper pagination for large product catalogs
- Use Redis for session management and caching
- Optimize GoPay API calls to prevent timeouts

## Testing Standards

- Test payment flows thoroughly including error scenarios
- Test product search and filtering functionality
- Implement integration tests for GoPay payment processing
- Test file upload functionality for product images
- Test authorization for admin panel access
- Test responsive design for mobile users

## Domain-Specific Patterns

### Company Inventory Management

```php
// Vehicle inventory model
class Vehicle extends Model
{
    protected $fillable = [
        'make', 'model', 'year', 'vin', 'mileage',
        'price', 'description', 'status', 'stock_quantity',
        'admin_notes', 'purchase_price', 'profit_margin'
    ];

    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0)
                    ->where('status', 'available');
    }

    public function scopeLowStock($query, $threshold = 5)
    {
        return $query->where('stock_quantity', '<=', $threshold);
    }
}
```

### Customer Order Processing

```php
// Order service for single-vendor e-commerce
class OrderService
{
    public function processCustomerOrder(array $cartItems, User $customer, array $paymentData)
    {
        return DB::transaction(function () use ($cartItems, $customer, $paymentData) {
            // Create order
            $order = Order::create([
                'customer_id' => $customer->id,
                'order_number' => $this->generateOrderNumber(),
                'total_amount' => $this->calculateTotal($cartItems),
                'status' => 'pending',
                'payment_method' => 'gopay'
            ]);

            // Add order items and update inventory
            foreach ($cartItems as $item) {
                $this->addOrderItem($order, $item);
                $this->updateInventory($item);
            }

            // Process payment
            $payment = $this->processPayment($order, $paymentData);

            return $order;
        });
    }
}
```

### Filament Admin Resources

```php
// Vehicle admin resource for inventory management
class VehicleResource extends Resource
{
    protected static ?string $model = Vehicle::class;
    protected static ?string $navigationGroup = 'Inventory Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Vehicle Information')
                    ->schema([
                        TextInput::make('make')->required(),
                        TextInput::make('model')->required(),
                        TextInput::make('vin')->required(),
                        TextInput::make('year')->numeric()->required(),
                    ])->columns(2),

                Section::make('Pricing & Inventory')
                    ->schema([
                        TextInput::make('purchase_price')->numeric()->prefix('CZK'),
                        TextInput::make('price')->numeric()->prefix('CZK')->required(),
                        TextInput::make('stock_quantity')->numeric()->required(),
                        Select::make('status')
                            ->options([
                                'available' => 'Available',
                                'reserved' => 'Reserved',
                                'sold' => 'Sold',
                                'maintenance' => 'In Maintenance',
                            ])->required(),
                    ])->columns(2),

                SpatieMediaLibraryFileUpload::make('images')
                    ->collection('vehicles')
                    ->multiple()
                    ->image()
                    ->reorderable()
                    ->optimize('webp'),
            ]);
    }
}
```

## AI Assistant Guidelines

- Understand the single-vendor e-commerce business model
- Focus on company inventory management rather than marketplace features
- Consider admin workflow efficiency for inventory operations
- Think about customer experience for browsing and purchasing
- Always implement proper security for financial transactions
- Consider mobile users for product browsing experience
- Think about scalability for growing product catalogs
- Consider integration with supplier systems for inventory replenishment
- Implement proper error handling for payment processing
- Focus on conversion optimization for sales funnel

This project emphasizes single-vendor automotive e-commerce patterns, efficient inventory management, and streamlined customer purchasing experience through modern Laravel and Vue.js integration.
