---
mode: agent
---

# Filament Admin Panel Development Prompt

## Expected Output Format

When working with Filament 3.x admin panels, provide:

1. **Resource design** - Filament resource structure and relationships
2. **Permission integration** - Shield-based authorization
3. **Custom components** - Filament-specific UI components
4. **Dashboard widgets** - Analytics and reporting widgets
5. **Bulk operations** - Mass actions and data management
6. **Media management** - File uploads and media library integration

## Filament Resource Patterns

### Basic Resource Structure

```php
// Vehicle admin resource
class VehicleResource extends Resource
{
    protected static ?string $model = Vehicle::class;
    protected static ?string $navigationIcon = 'heroicon-o-truck';
    protected static ?string $navigationGroup = 'Inventory';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Vehicle Information')
                    ->schema([
                        TextInput::make('make')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('model')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('year')
                            ->required()
                            ->numeric()
                            ->minValue(1900)
                            ->maxValue(date('Y') + 1),
                        TextInput::make('vin')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(17),
                    ])->columns(2),

                Section::make('Pricing & Details')
                    ->schema([
                        TextInput::make('price')
                            ->required()
                            ->numeric()
                            ->prefix('CZK'),
                        TextInput::make('mileage')
                            ->required()
                            ->numeric()
                            ->suffix('km'),
                        Select::make('fuel_type')
                            ->options([
                                'gasoline' => 'Gasoline',
                                'diesel' => 'Diesel',
                                'electric' => 'Electric',
                                'hybrid' => 'Hybrid',
                            ])
                            ->required(),
                        Select::make('transmission')
                            ->options([
                                'manual' => 'Manual',
                                'automatic' => 'Automatic',
                                'cvt' => 'CVT',
                            ])
                            ->required(),
                    ])->columns(2),

                Section::make('Description & Media')
                    ->schema([
                        Textarea::make('description')
                            ->maxLength(65535)
                            ->rows(4),
                        SpatieMediaLibraryFileUpload::make('images')
                            ->collection('vehicles')
                            ->multiple()
                            ->image()
                            ->reorderable()
                            ->maxFiles(10)
                            ->optimize('webp')
                            ->resize(800, 600),
                    ]),

                Section::make('Status & Seller')
                    ->schema([
                        Select::make('status')
                            ->options([
                                'available' => 'Available',
                                'reserved' => 'Reserved',
                                'sold' => 'Sold',
                                'pending' => 'Pending',
                            ])
                            ->required(),
                        Select::make('seller_id')
                            ->relationship('seller', 'name')
                            ->searchable()
                            ->required(),
                        Toggle::make('is_featured')
                            ->label('Featured Listing'),
                    ])->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                SpatieMediaLibraryImageColumn::make('images')
                    ->collection('vehicles')
                    ->size(60)
                    ->circular(),
                TextColumn::make('make')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('model')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('year')
                    ->sortable(),
                TextColumn::make('price')
                    ->money('CZK')
                    ->sortable(),
                TextColumn::make('mileage')
                    ->formatStateUsing(fn ($state) => number_format($state) . ' km')
                    ->sortable(),
                BadgeColumn::make('status')
                    ->colors([
                        'success' => 'available',
                        'warning' => 'reserved',
                        'danger' => 'sold',
                        'secondary' => 'pending',
                    ]),
                TextColumn::make('seller.name')
                    ->searchable()
                    ->sortable(),
                IconColumn::make('is_featured')
                    ->boolean()
                    ->trueIcon('heroicon-o-star')
                    ->falseIcon('heroicon-o-star')
                    ->trueColor('warning'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'available' => 'Available',
                        'reserved' => 'Reserved',
                        'sold' => 'Sold',
                        'pending' => 'Pending',
                    ])
                    ->multiple(),
                SelectFilter::make('fuel_type')
                    ->options([
                        'gasoline' => 'Gasoline',
                        'diesel' => 'Diesel',
                        'electric' => 'Electric',
                        'hybrid' => 'Hybrid',
                    ])
                    ->multiple(),
                Filter::make('price_range')
                    ->form([
                        TextInput::make('price_from')
                            ->numeric()
                            ->placeholder('From'),
                        TextInput::make('price_to')
                            ->numeric()
                            ->placeholder('To'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when($data['price_from'], fn (Builder $query, $price) => $query->where('price', '>=', $price))
                            ->when($data['price_to'], fn (Builder $query, $price) => $query->where('price', '<=', $price));
                    }),
                TernaryFilter::make('is_featured')
                    ->label('Featured')
                    ->boolean(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\Action::make('feature')
                    ->label('Toggle Feature')
                    ->icon('heroicon-o-star')
                    ->action(function (Vehicle $record) {
                        $record->update(['is_featured' => !$record->is_featured]);
                    })
                    ->color('warning'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('mark_available')
                        ->label('Mark as Available')
                        ->icon('heroicon-o-check-circle')
                        ->action(function (Collection $records) {
                            $records->each(fn (Vehicle $record) => $record->update(['status' => 'available']));
                        })
                        ->color('success'),
                    Tables\Actions\BulkAction::make('mark_sold')
                        ->label('Mark as Sold')
                        ->icon('heroicon-o-x-circle')
                        ->action(function (Collection $records) {
                            $records->each(fn (Vehicle $record) => $record->update(['status' => 'sold']));
                        })
                        ->color('danger')
                        ->requiresConfirmation(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            OrdersRelationManager::class,
            InquiriesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVehicles::route('/'),
            'create' => Pages\CreateVehicle::route('/create'),
            'edit' => Pages\EditVehicle::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'available')->count();
    }
}
```

### Dashboard Widgets

```php
// Sales overview widget
class SalesOverviewWidget extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Sales', Order::where('status', 'completed')->count())
                ->description('Completed orders')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Revenue', 'CZK ' . number_format(Order::where('status', 'completed')->sum('amount')))
                ->description('Total revenue')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('primary'),

            Stat::make('Available Vehicles', Vehicle::where('status', 'available')->count())
                ->description('In stock')
                ->descriptionIcon('heroicon-m-truck')
                ->color('warning'),

            Stat::make('Pending Orders', Order::where('status', 'pending')->count())
                ->description('Awaiting payment')
                ->descriptionIcon('heroicon-m-clock')
                ->color('gray'),
        ];
    }
}

// Sales chart widget
class SalesChartWidget extends ChartWidget
{
    protected static ?string $heading = 'Sales Overview';
    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $salesData = Order::where('status', 'completed')
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(amount) as revenue')
            ->whereBetween('created_at', [now()->subDays(30), now()])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Orders',
                    'data' => $salesData->pluck('count')->toArray(),
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                    'borderColor' => 'rgb(59, 130, 246)',
                ],
                [
                    'label' => 'Revenue',
                    'data' => $salesData->pluck('revenue')->toArray(),
                    'backgroundColor' => 'rgba(34, 197, 94, 0.1)',
                    'borderColor' => 'rgb(34, 197, 94)',
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
```

### Custom Filament Components

```php
// Vehicle specifications repeater
class VehicleSpecificationsRepeater extends Repeater
{
    public function setUp(): void
    {
        parent::setUp();

        $this->schema([
            TextInput::make('name')
                ->required()
                ->placeholder('Specification name'),
            TextInput::make('value')
                ->required()
                ->placeholder('Specification value'),
        ]);
    }
}

// Price calculator component
class PriceCalculatorComponent extends Component
{
    public $basePrice = 0;
    public $vatRate = 21;
    public $commission = 5;

    public function getCalculatedPrice()
    {
        $commissionAmount = $this->basePrice * ($this->commission / 100);
        $subtotal = $this->basePrice + $commissionAmount;
        $vatAmount = $subtotal * ($this->vatRate / 100);

        return $subtotal + $vatAmount;
    }

    public function render()
    {
        return view('filament.components.price-calculator');
    }
}
```

### Shield Integration for Permissions

```php
// Vehicle policy with Shield integration
class VehiclePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('view_any_vehicle');
    }

    public function view(User $user, Vehicle $vehicle): bool
    {
        return $user->can('view_vehicle');
    }

    public function create(User $user): bool
    {
        return $user->can('create_vehicle');
    }

    public function update(User $user, Vehicle $vehicle): bool
    {
        return $user->can('update_vehicle');
    }

    public function delete(User $user, Vehicle $vehicle): bool
    {
        return $user->can('delete_vehicle');
    }

    public function deleteAny(User $user): bool
    {
        return $user->can('delete_any_vehicle');
    }
}

// Shield resource for permission management
class VehicleShieldResource extends Resource
{
    protected static ?string $model = Vehicle::class;
    protected static ?string $slug = 'shield/vehicles';
    protected static ?string $navigationIcon = 'heroicon-o-shield-check';
    protected static ?string $navigationGroup = 'Shield';

    public static function getPermissions(): array
    {
        return [
            'view_any_vehicle',
            'view_vehicle',
            'create_vehicle',
            'update_vehicle',
            'delete_vehicle',
            'delete_any_vehicle',
        ];
    }
}
```

### Advanced Table Features

```php
// Vehicle resource with advanced table features
public static function table(Table $table): Table
{
    return $table
        ->columns([
            // ... existing columns ...
        ])
        ->filters([
            // ... existing filters ...
        ])
        ->actions([
            // ... existing actions ...
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\DeleteBulkAction::make(),

                // Custom bulk actions
                Tables\Actions\BulkAction::make('export')
                    ->label('Export Selected')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->action(function (Collection $records) {
                        return Excel::download(new VehiclesExport($records), 'vehicles.xlsx');
                    }),

                Tables\Actions\BulkAction::make('feature')
                    ->label('Feature Selected')
                    ->icon('heroicon-o-star')
                    ->action(function (Collection $records) {
                        $records->each(fn (Vehicle $record) => $record->update(['is_featured' => true]));
                    })
                    ->color('warning'),
            ]),
        ])
        ->defaultSort('created_at', 'desc')
        ->persistSortInSession()
        ->persistFiltersInSession()
        ->persistSearchInSession()
        ->striped()
        ->extremePaginationLinks();
}
```

This specialized prompt provides comprehensive guidance for building Filament admin panels with proper Shield integration, custom components, and advanced features.
