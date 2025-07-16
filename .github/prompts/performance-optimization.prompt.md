---
mode: agent
---

# Performance & Optimization Prompt

## Expected Output Format

When optimizing Laravel + Inertia.js + Vue.js applications, provide:

1. **Performance analysis** - Identify bottlenecks and optimization opportunities
2. **Database optimization** - Query optimization and caching strategies
3. **Frontend optimization** - Bundle size, rendering, and user experience
4. **Caching strategies** - Multi-layer caching implementation
5. **Monitoring setup** - Performance tracking and alerting
6. **Scalability planning** - Preparation for growth

## Database Performance

### Query Optimization

```php
// Eager loading to prevent N+1 queries
$projects = Project::with(['user', 'tasks.assignee'])
    ->whereHas('user', fn($q) => $q->where('active', true))
    ->paginate(15);

// Using database indexes effectively
Schema::table('attendance_records', function (Blueprint $table) {
    $table->index(['user_id', 'date']); // Composite index for common queries
    $table->index('created_at'); // For time-based queries
});

// Optimized subqueries
$users = User::withCount(['projects as active_projects_count' => function ($query) {
    $query->where('status', 'active');
}])->get();
```

### Database Caching

```php
// Model-level caching
class Project extends Model
{
    public function getStatsAttribute()
    {
        return Cache::remember(
            "project.{$this->id}.stats",
            now()->addHours(6),
            fn() => $this->calculateStats()
        );
    }
}

// Query result caching
public function getActiveProjects()
{
    return Cache::tags(['projects'])
        ->remember('projects.active', 300, function () {
            return Project::where('status', 'active')
                ->with('user')
                ->get();
        });
}
```

## Frontend Performance

### Bundle Optimization

```javascript
// Lazy loading routes
const routes = [
    {
        path: '/dashboard',
        component: () => import('@/pages/Dashboard.vue'),
    },
    {
        path: '/projects',
        component: () => import('@/pages/Projects/Index.vue'),
    },
];

// Component lazy loading
const HeavyChart = defineAsyncComponent({
    loader: () => import('@/components/HeavyChart.vue'),
    loading: () => h('div', 'Loading chart...'),
    error: () => h('div', 'Failed to load chart'),
    delay: 200,
    timeout: 3000,
});
```

### Rendering Optimization

```vue
<script setup>
import { computed, shallowRef, markRaw } from 'vue';

// Use shallowRef for large datasets
const largeDataset = shallowRef([]);

// Memoize expensive computations
const processedData = computed(() => {
    return largeDataset.value.map((item) => ({
        ...item,
        computed: expensiveCalculation(item),
    }));
});

// Mark non-reactive objects
const chartConfig = markRaw({
    type: 'line',
    options: {
        /* chart options */
    },
});
</script>

<template>
    <!-- Virtual scrolling for large lists -->
    <div class="virtual-list">
        <div
            v-for="item in visibleItems"
            :key="item.id"
            v-memo="[item.id, item.updated_at]"
            class="list-item"
        >
            {{ item.name }}
        </div>
    </div>
</template>
```

### Image and Asset Optimization

```vue
<template>
    <!-- Responsive images with lazy loading -->
    <img
        :src="imageSrc"
        :srcset="imageSrcSet"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        alt="Project image"
        class="h-auto w-full"
    />

    <!-- Preload critical resources -->
    <link
        rel="preload"
        href="/fonts/inter.woff2"
        as="font"
        type="font/woff2"
        crossorigin
    />
</template>
```

## Caching Strategies

### Multi-Layer Caching

```php
// Application cache hierarchy
class CacheService
{
    public function get(string $key, callable $callback, int $ttl = 3600)
    {
        // 1. Memory cache (fastest)
        if ($value = $this->memoryCache[$key] ?? null) {
            return $value;
        }

        // 2. Redis cache (fast)
        if ($value = Cache::store('redis')->get($key)) {
            $this->memoryCache[$key] = $value;
            return $value;
        }

        // 3. Database/computation (slowest)
        $value = $callback();

        Cache::store('redis')->put($key, $value, $ttl);
        $this->memoryCache[$key] = $value;

        return $value;
    }
}
```

### Smart Cache Invalidation

```php
// Observer for automatic cache invalidation
class ProjectObserver
{
    public function saved(Project $project): void
    {
        Cache::tags(['projects', "project.{$project->id}"])->flush();

        // Selective cache clearing
        Cache::forget("user.{$project->user_id}.project_count");
        Cache::forget('dashboard.stats');
    }
}

// Event-driven cache invalidation
class ProjectUpdated
{
    public function __construct(public Project $project) {}
}

class ClearProjectCache
{
    public function handle(ProjectUpdated $event): void
    {
        Cache::tags(['projects'])->flush();

        // Update related caches
        dispatch(new UpdateDashboardStats());
    }
}
```

## Monitoring and Analytics

### Performance Monitoring

```php
// Custom middleware for performance tracking
class PerformanceMiddleware
{
    public function handle($request, Closure $next)
    {
        $start = microtime(true);
        $startMemory = memory_get_usage();

        $response = $next($request);

        $duration = microtime(true) - $start;
        $memoryUsed = memory_get_usage() - $startMemory;

        Log::info('Request Performance', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'duration' => $duration,
            'memory' => $memoryUsed,
            'status' => $response->getStatusCode(),
        ]);

        return $response;
    }
}
```

### Frontend Performance Tracking

```javascript
// Performance monitoring composable
export function usePerformanceMonitor() {
    const trackPageLoad = () => {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];

            console.log('Page Load Metrics', {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                totalTime: navigation.loadEventEnd - navigation.fetchStart,
            });
        }
    };

    const trackUserInteraction = (action, element) => {
        const start = performance.now();

        return () => {
            const duration = performance.now() - start;
            console.log(`${action} took ${duration}ms`);
        };
    };

    return { trackPageLoad, trackUserInteraction };
}
```

## Scalability Preparation

### Database Scaling

```php
// Read/write splitting
class DatabaseService
{
    public function read(string $query, array $bindings = [])
    {
        return DB::connection('read')->select($query, $bindings);
    }

    public function write(string $query, array $bindings = [])
    {
        return DB::connection('write')->statement($query, $bindings);
    }
}

// Database sharding preparation
class ShardedModel extends Model
{
    public function getConnectionName()
    {
        return 'shard_' . ($this->user_id % 4);
    }
}
```

### Queue Optimization

```php
// Efficient job batching
Bus::batch([
    new ProcessAttendanceRecord($record1),
    new ProcessAttendanceRecord($record2),
    new ProcessAttendanceRecord($record3),
])->then(function (Batch $batch) {
    // All jobs completed successfully
    Cache::forget('attendance.daily_stats');
})->catch(function (Batch $batch, Throwable $e) {
    // First batch job failure
})->finally(function (Batch $batch) {
    // Cleanup
})->dispatch();

// Memory-efficient data processing
class ProcessLargeDataset implements ShouldQueue
{
    public function handle(): void
    {
        User::chunk(100, function ($users) {
            foreach ($users as $user) {
                $this->processUser($user);
            }
        });
    }
}
```

### CDN and Asset Optimization

```php
// Asset versioning and CDN
class AssetHelper
{
    public static function url(string $path): string
    {
        $version = config('app.asset_version');
        $cdnUrl = config('app.cdn_url');

        return $cdnUrl . '/' . ltrim($path, '/') . '?v=' . $version;
    }
}
```
