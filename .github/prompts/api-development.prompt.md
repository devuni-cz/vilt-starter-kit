---
mode: agent
---

# API Development Prompt

## Expected Output Format

When developing APIs with Laravel and Inertia.js, provide:

1. **API design** - RESTful endpoints and resource organization
2. **Request/Response structure** - Consistent data formats
3. **Validation strategy** - Form Requests and API validation
4. **Error handling** - Proper HTTP status codes and error responses
5. **Authentication/Authorization** - Security implementation
6. **Documentation** - API endpoint documentation

## API Architecture with Inertia.js

### Hybrid Approach

- **Inertia.js routes** for page navigation and form submissions
- **Pure API routes** for AJAX requests and mobile apps
- **Shared validation** between Inertia and API routes
- **Consistent error handling** across both patterns

### Route Organization

```php
// Web routes (Inertia.js) - Always use named routes for Ziggy integration
Route::middleware(['auth', 'web'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('projects', ProjectController::class)->names([
        'index' => 'projects.index',
        'create' => 'projects.create',
        'store' => 'projects.store',
        'show' => 'projects.show',
        'edit' => 'projects.edit',
        'update' => 'projects.update',
        'destroy' => 'projects.destroy',
    ]);

    // Custom named routes
    Route::get('/projects/{project}/tasks', [ProjectController::class, 'tasks'])->name('projects.tasks');
    Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn'])->name('attendance.clock-in');
});

// API routes (Pure API) - Named routes for consistency
Route::middleware(['auth:sanctum', 'api'])->prefix('api')->name('api.')->group(function () {
    Route::apiResource('projects', Api\ProjectController::class)->names([
        'index' => 'projects.index',
        'store' => 'projects.store',
        'show' => 'projects.show',
        'update' => 'projects.update',
        'destroy' => 'projects.destroy',
    ]);
    Route::post('attendance/clock-in', [Api\AttendanceController::class, 'clockIn'])->name('attendance.clock-in');
    Route::get('users/{user}/projects', [Api\UserController::class, 'projects'])->name('users.projects');
});
```

## Request/Response Patterns

### Form Requests

```php
class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Project::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'deadline' => ['nullable', 'date', 'after:today'],
        ];
    }
}
```

### API Resources with Context-Specific Naming

```php
class ProjectShowResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status,
            'deadline' => $this->deadline?->format('Y-m-d'),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Include detailed relationships for show view
            'user' => new UserShowResource($this->whenLoaded('user')),
            'tasks' => TaskListResource::collection($this->whenLoaded('tasks')),
            'attachments' => AttachmentResource::collection($this->whenLoaded('attachments')),
        ];
    }
}

class ProjectIndexResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status,
            'deadline' => $this->deadline?->format('Y-m-d'),
            'tasks_count' => $this->tasks_count,
            'created_at' => $this->created_at->format('d.m.Y'),

            // Minimal user info for index view
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
        ];
    }
}

class UserShowResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'hourly_rate' => $this->hourly_rate,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('d.m.Y'),
        ];
    }
}
```

## Error Handling Strategy

### Validation Errors

- **422 Unprocessable Entity** for validation failures
- **Consistent error format** for both Inertia and API
- **Field-specific errors** for form validation
- **User-friendly messages** in multiple languages

### Exception Handling

```php
// In App\Exceptions\Handler
public function render($request, Throwable $exception)
{
    if ($request->expectsJson()) {
        return $this->handleApiException($request, $exception);
    }

    return $this->handleInertiaException($request, $exception);
}
```

## Authentication & Authorization

### Sanctum Integration

- **SPA authentication** for Inertia.js
- **Token authentication** for mobile/external APIs
- **Cookie-based sessions** for web routes
- **CSRF protection** for state-changing operations

### Policy-Based Authorization

```php
class ProjectPolicy
{
    public function view(User $user, Project $project): bool
    {
        return $user->id === $project->user_id || $user->can('view-all-projects');
    }

    public function update(User $user, Project $project): bool
    {
        return $user->id === $project->user_id;
    }
}
```

## Performance Considerations

### Query Optimization

- **Eager loading** for relationships
- **API pagination** with proper meta data
- **Caching strategies** for expensive queries
- **Database indexes** for frequently queried fields

### Response Optimization

- **Conditional loading** of relationships
- **Partial resource loading** based on request needs
- **Response compression** for large datasets
- **ETags** for caching validation

## Testing API Endpoints

### Feature Testing

```php
public function test_user_can_create_project()
{
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/projects', [
            'name' => 'Test Project',
            'description' => 'Test Description',
        ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'data' => ['id', 'name', 'description', 'created_at']
        ]);
}
```

## Frontend Integration

### Inertia.js Patterns

- **Form helpers** for validation error display
- **Loading states** during API calls
- **Optimistic updates** for better UX
- **Error boundaries** for graceful error handling

### Vue.js Composables with Ziggy Integration

```javascript
// useApi.js - Enhanced with Ziggy route names
export function useApi() {
    const loading = ref(false);
    const error = ref(null);

    const request = async (routeName, params = {}, options = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const url = route(routeName, params);
            const response = await fetch(url, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    Accept: 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return { request, loading, error };
}

// useProjects.js - Using Ziggy route names
export function useProjects() {
    const projects = ref([]);
    const loading = ref(false);

    const loadProjects = () => {
        router.get(route('projects.index'));
    };

    const createProject = (data) => {
        router.post(route('projects.store'), data);
    };

    const updateProject = (projectId, data) => {
        router.put(route('projects.update', { project: projectId }), data);
    };

    const deleteProject = (projectId) => {
        if (confirm('Are you sure?')) {
            router.delete(route('projects.destroy', { project: projectId }));
        }
    };

    const viewProject = (projectId) => {
        router.get(route('projects.show', { project: projectId }));
    };

    return {
        projects,
        loading,
        loadProjects,
        createProject,
        updateProject,
        deleteProject,
        viewProject,
    };
}
```

## Ziggy Integration Patterns

### Route Naming Conventions

```php
// Follow consistent naming patterns for Ziggy
Route::name('dashboard.')->prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('index');
    Route::get('/stats', [DashboardController::class, 'stats'])->name('stats');
});

Route::name('projects.')->prefix('projects')->group(function () {
    Route::get('/', [ProjectController::class, 'index'])->name('index');
    Route::get('/create', [ProjectController::class, 'create'])->name('create');
    Route::post('/', [ProjectController::class, 'store'])->name('store');
    Route::get('/{project}', [ProjectController::class, 'show'])->name('show');
    Route::get('/{project}/edit', [ProjectController::class, 'edit'])->name('edit');
    Route::put('/{project}', [ProjectController::class, 'update'])->name('update');
    Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('destroy');

    // Nested routes
    Route::get('/{project}/tasks', [ProjectController::class, 'tasks'])->name('tasks');
    Route::get('/{project}/export', [ProjectController::class, 'export'])->name('export');
});

// API routes with consistent naming
Route::name('api.')->prefix('api')->group(function () {
    Route::name('projects.')->prefix('projects')->group(function () {
        Route::get('/', [Api\ProjectController::class, 'index'])->name('index');
        Route::post('/', [Api\ProjectController::class, 'store'])->name('store');
        Route::get('/{project}', [Api\ProjectController::class, 'show'])->name('show');
    });
});
```

### Vue.js Integration with Ziggy

```javascript
// In Vue components, always use route names
<script setup>
const props = defineProps(['project']);

// Navigation methods using route names
const editProject = () => {
    router.get(route('projects.edit', { project: props.project.id }));
};

const deleteProject = () => {
    if (confirm('Are you sure?')) {
        router.delete(route('projects.destroy', { project: props.project.id }));
    }
};

// API calls using route names
const exportProject = async () => {
    const url = route('projects.export', { project: props.project.id });
    window.open(url, '_blank');
};
</script>

<template>
    <div class="project-card">
        <!-- Use route helper in templates -->
        <Link :href="route('projects.show', { project: project.id })" class="project-link">
            {{ project.name }}
        </Link>

        <div class="actions">
            <button @click="editProject" class="btn-edit">
                Edit
            </button>
            <button @click="deleteProject" class="btn-delete">
                Delete
            </button>
            <a :href="route('projects.export', { project: project.id })" target="_blank" class="btn-export">
                Export
            </a>
        </div>
    </div>
</template>
```

### Route Parameter Patterns

```javascript
// Simple route with single parameter
route('projects.show', { project: 123 });
// Generates: /projects/123

// Route with multiple parameters
route('projects.tasks', { project: 123, status: 'active' });
// Generates: /projects/123/tasks?status=active

// Route with query parameters
route(
    'projects.index',
    {},
    {
        query: {
            page: 2,
            search: 'laravel',
            status: 'active',
        },
    },
);
// Generates: /projects?page=2&search=laravel&status=active

// Absolute URLs when needed
route('api.projects.show', { project: 123 }, true);
// Generates: https://yourdomain.com/api/projects/123
```

### Form Submissions with Ziggy

```javascript
// Form submission patterns
const form = useForm({
    name: '',
    description: '',
    deadline: null,
});

const submit = () => {
    if (isEditing.value) {
        form.put(route('projects.update', { project: props.project.id }), {
            onSuccess: () => {
                // Handle success
            },
        });
    } else {
        form.post(route('projects.store'), {
            onSuccess: () => {
                // Handle success
            },
        });
    }
};
```
