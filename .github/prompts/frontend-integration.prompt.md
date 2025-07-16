---
mode: agent
---

# Frontend Integration Prompt

## Expected Output Format

When working with Vue 3.5 + Inertia.js + Tailwind CSS 4, provide:

1. **Component architecture** - Reusable Vue components with Composition API
2. **Inertia.js integration** - Server-side rendering and client-side navigation
3. **Tailwind CSS 4 patterns** - Modern utility-first styling
4. **Form handling** - Laravel validation integration
5. **State management** - Composables and reactive patterns
6. **Performance optimization** - Bundle size and rendering optimization

## Vue 3.5 Patterns

### Component Structure with Composition API

```vue
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useForm, usePage } from '@inertiajs/vue3'

// Props definition
const props = defineProps({
    project: {
        type: Object,
        required: true,
    },
    canEdit: {
        type: Boolean,
        default: false,
    },
})

// Emits definition
const emit = defineEmits(['updated', 'deleted'])

// Reactive state
const isEditing = ref(false)
const { user } = usePage().props.auth

// Form handling with Inertia
const form = useForm({
    name: props.project.name || '',
    description: props.project.description || '',
})

// Computed properties
const isOwner = computed(() => user.id === props.project.user_id)
const canEditProject = computed(() => props.canEdit && isOwner.value)

// Methods
const handleSave = () => {
    form.put(route('projects.update', { project: props.project.id }), {
        onSuccess: () => {
            isEditing.value = false
            emit('updated', form.data)
        },
    })
}

const handleCancel = () => {
    isEditing.value = false
    form.reset()
}

const handleDelete = () => {
    if (confirm('Are you sure you want to delete this project?')) {
        form.delete(route('projects.destroy', { project: props.project.id }), {
            onSuccess: () => emit('deleted', props.project.id),
        })
    }
}

// Watchers
watch(
    () => props.project,
    (newProject) => {
        form.name = newProject.name
        form.description = newProject.description
    },
    { deep: true }
)

// Lifecycle hooks
onMounted(() => {
    // Component mounted logic
})
</script>

<template>
    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div class="p-6">
            <div
                v-if="isEditing"
                class="space-y-4"
            >
                <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        v-model="form.name"
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        :class="{ 'border-red-500': form.errors.name }"
                    />
                    <p
                        v-if="form.errors.name"
                        class="mt-1 text-sm text-red-600"
                    >
                        {{ form.errors.name }}
                    </p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        v-model="form.description"
                        rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        :class="{ 'border-red-500': form.errors.description }"
                    />
                    <p
                        v-if="form.errors.description"
                        class="mt-1 text-sm text-red-600"
                    >
                        {{ form.errors.description }}
                    </p>
                </div>

                <div class="flex justify-end space-x-2">
                    <button
                        type="button"
                        @click="handleCancel"
                        class="btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        @click="handleSave"
                        :disabled="form.processing"
                        class="btn-primary"
                    >
                        {{ form.processing ? 'Saving...' : 'Save' }}
                    </button>
                </div>
            </div>

            <div v-else>
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">
                        {{ project.name }}
                    </h3>
                    <div
                        v-if="canEditProject"
                        class="flex space-x-2"
                    >
                        <button
                            @click="isEditing = true"
                            class="text-blue-600 hover:text-blue-800"
                        >
                            Edit
                        </button>
                        <button
                            @click="handleDelete"
                            class="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <p class="mt-2 text-gray-600">{{ project.description }}</p>
                <div class="mt-4 flex items-center text-sm text-gray-500">
                    <span>Created {{ project.created_at }}</span>
                    <span class="mx-2">•</span>
                    <span class="capitalize">{{ project.status }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
```

### Custom Composables Pattern

```javascript
// composables/useProjects.js
import { ref, computed } from 'vue'

/**
 * Composable for project management
 * @returns {Object} Project management functions and state
 */
export function useProjects() {
    const loading = ref(false)
    const error = ref(null)
    const projects = ref([])

    const activeProjects = computed(() => projects.value.filter((project) => project.status === 'active'))

    const completedProjects = computed(() => projects.value.filter((project) => project.status === 'completed'))

    const loadProjects = async (filters = {}) => {
        loading.value = true
        error.value = null

        try {
            router.get(route('projects.index'), filters, {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    loading.value = false
                },
            })
        } catch (err) {
            error.value = err.message
            loading.value = false
        }
    }

    const createProject = (data) => {
        return router.post(route('projects.store'), data, {
            onStart: () => {
                loading.value = true
                error.value = null
            },
            onFinish: () => {
                loading.value = false
            },
            onError: (errors) => {
                error.value = errors
            },
        })
    }

    const updateProject = (projectId, data) => {
        return router.put(route('projects.update', { project: projectId }), data)
    }

    const deleteProject = (projectId) => {
        if (confirm('Are you sure you want to delete this project?')) {
            return router.delete(route('projects.destroy', { project: projectId }))
        }
    }

    return {
        projects,
        loading,
        error,
        activeProjects,
        completedProjects,
        loadProjects,
        createProject,
        updateProject,
        deleteProject,
    }
}
```

### Page Component with Inertia

```vue
<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { useProjects } from '@/composables/useProjects'

// Props from Laravel controller
const props = defineProps({
    projects: {
        type: Array,
        required: true,
    },
    filters: {
        type: Object,
        default: () => ({}),
    },
    meta: {
        type: Object,
        default: () => ({}),
    },
})

// Use composable
const { updateProject, deleteProject } = useProjects()

const handleProjectUpdate = (projectId, data) => {
    updateProject(projectId, data)
}

const handleProjectDelete = (projectId) => {
    deleteProject(projectId)
}
</script>

<template>
    <Head title="Projects" />

    <AppLayout>
        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div class="mb-6 flex items-center justify-between">
                    <h1 class="text-2xl font-bold text-gray-900">Projects</h1>
                    <Link
                        :href="route('projects.create')"
                        class="btn-primary"
                    >
                        New Project
                    </Link>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <ProjectCard
                        v-for="project in projects"
                        :key="project.id"
                        :project="project"
                        :can-edit="true"
                        @updated="handleProjectUpdate"
                        @deleted="handleProjectDelete"
                    />
                </div>

                <!-- Pagination -->
                <div
                    v-if="meta.last_page > 1"
                    class="mt-6 flex justify-center"
                >
                    <Link
                        v-if="meta.prev_page_url"
                        :href="route('projects.index', { page: meta.current_page - 1 })"
                        class="btn-secondary mr-2"
                    >
                        Previous
                    </Link>
                    <span class="mx-4 flex items-center text-sm text-gray-700"> Page {{ meta.current_page }} of {{ meta.last_page }} </span>
                    <Link
                        v-if="meta.next_page_url"
                        :href="route('projects.index', { page: meta.current_page + 1 })"
                        class="btn-secondary"
                    >
                        Next
                    </Link>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
```

### Form Handling with Laravel Validation

```vue
<script setup>
import { useForm } from '@inertiajs/vue3'
import InputError from '@/components/InputError.vue'
import TextInput from '@/components/TextInput.vue'

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
})

const submit = () => {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    })
}
</script>

<template>
    <form @submit.prevent="submit">
        <div class="space-y-4">
            <div>
                <label
                    for="name"
                    class="block text-sm font-medium text-gray-700"
                >
                    Name
                </label>
                <TextInput
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="mt-1 block w-full"
                    required
                    autofocus
                />
                <InputError
                    class="mt-2"
                    :message="form.errors.name"
                />
            </div>

            <div>
                <label
                    for="email"
                    class="block text-sm font-medium text-gray-700"
                >
                    Email
                </label>
                <TextInput
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="mt-1 block w-full"
                    required
                />
                <InputError
                    class="mt-2"
                    :message="form.errors.email"
                />
            </div>

            <div>
                <label
                    for="password"
                    class="block text-sm font-medium text-gray-700"
                >
                    Password
                </label>
                <TextInput
                    id="password"
                    v-model="form.password"
                    type="password"
                    class="mt-1 block w-full"
                    required
                />
                <InputError
                    class="mt-2"
                    :message="form.errors.password"
                />
            </div>

            <div>
                <label
                    for="password_confirmation"
                    class="block text-sm font-medium text-gray-700"
                >
                    Confirm Password
                </label>
                <TextInput
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    class="mt-1 block w-full"
                    required
                />
                <InputError
                    class="mt-2"
                    :message="form.errors.password_confirmation"
                />
            </div>

            <div class="flex items-center justify-end">
                <button
                    type="submit"
                    :disabled="form.processing"
                    class="btn-primary"
                >
                    {{ form.processing ? 'Creating Account...' : 'Create Account' }}
                </button>
            </div>
        </div>
    </form>
</template>
```

## Tailwind CSS 4 Patterns

### Component-Based Styling

```vue
<template>
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">{{ title }}</h3>
            <div class="card-actions">
                <slot name="actions" />
            </div>
        </div>
        <div class="card-body">
            <slot />
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
})
</script>

<style>
@layer components {
    .card {
        @apply overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm;
    }

    .card-header {
        @apply flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4;
    }

    .card-title {
        @apply text-lg font-semibold text-gray-900;
    }

    .card-body {
        @apply p-6;
    }

    .card-actions {
        @apply flex items-center space-x-2;
    }
}
</style>
```

## State Management with Composables

### Global State Management

```javascript
// composables/useAuth.js
import { ref, computed, readonly } from 'vue'
import { usePage } from '@inertiajs/vue3'

const user = ref(null)
const permissions = ref([])

export function useAuth() {
    const page = usePage()

    // Initialize from Inertia shared data
    if (page.props.auth?.user) {
        user.value = page.props.auth.user
        permissions.value = page.props.auth.permissions || []
    }

    const isAuthenticated = computed(() => !!user.value)
    const hasRole = (role) => user.value?.roles?.includes(role) ?? false
    const hasPermission = (permission) => permissions.value.includes(permission)

    const login = (userData) => {
        user.value = userData
    }

    const logout = () => {
        user.value = null
        permissions.value = []
    }

    return {
        user: readonly(user),
        permissions: readonly(permissions),
        isAuthenticated,
        hasRole,
        hasPermission,
        login,
        logout,
    }
}
```

### Form Validation Composable

```javascript
// composables/useFormValidation.js
import { ref, computed, watch } from 'vue'

export function useFormValidation(initialData, rules) {
    const data = ref({ ...initialData })
    const errors = ref({})
    const touched = ref({})

    const isValid = computed(() => Object.keys(errors.value).length === 0)

    const validate = (field, value) => {
        if (rules[field]) {
            const rule = rules[field]
            const error = rule(value)

            if (error) {
                errors.value[field] = error
            } else {
                delete errors.value[field]
            }
        }
    }

    const setField = (field, value) => {
        data.value[field] = value
        touched.value[field] = true
        validate(field, value)
    }

    const reset = () => {
        data.value = { ...initialData }
        errors.value = {}
        touched.value = {}
    }

    // Watch for changes and validate
    watch(
        data,
        (newData) => {
            Object.keys(newData).forEach((field) => {
                if (touched.value[field]) {
                    validate(field, newData[field])
                }
            })
        },
        { deep: true }
    )

    return {
        data,
        errors,
        touched,
        isValid,
        setField,
        validate,
        reset,
    }
}
```

## Performance Optimization

### Lazy Loading Components

```javascript
// Lazy load heavy components
import { defineAsyncComponent } from 'vue'

const ProjectChart = defineAsyncComponent(() => import('@/components/ProjectChart.vue'))
const DataTable = defineAsyncComponent(() => import('@/components/DataTable.vue'))

// With loading and error states
const HeavyComponent = defineAsyncComponent({
    loader: () => import('@/components/HeavyComponent.vue'),
    loadingComponent: () => import('@/components/LoadingSpinner.vue'),
    errorComponent: () => import('@/components/ErrorMessage.vue'),
    delay: 200,
    timeout: 3000,
})
```

### Optimized Rendering

```vue
<script setup>
import { computed, shallowRef } from 'vue'

// Use shallowRef for large arrays to prevent deep reactivity
const projects = shallowRef([])

// Memoize expensive computations
const projectStats = computed(() => {
    return projects.value.reduce((stats, project) => {
        stats[project.status] = (stats[project.status] || 0) + 1
        return stats
    }, {})
})
</script>

<template>
    <!-- Use v-memo for expensive list items -->
    <div
        v-for="project in projects"
        :key="project.id"
        v-memo="[project.id, project.updated_at]"
        class="project-item"
    >
        <ProjectCard :project="project" />
    </div>
</template>
```

## Ziggy Route Integration

```vue
<script setup>

const navigation = [
    { name: 'Dashboard', route: 'dashboard', icon: 'home' },
    { name: 'Projects', route: 'projects.index', icon: 'folder' },
    { name: 'Attendance', route: 'attendance.index', icon: 'clock' },
    { name: 'Reports', route: 'reports.index', icon: 'chart' },
]

const isActive = (routeName) => {
    return route().current(routeName)
}
</script>

<template>
    <nav class="space-y-1">
        <Link
            v-for="item in navigation"
            :key="item.name"
            :href="route(item.route)"
            :class="[
                isActive(item.route)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'flex items-center border-l-4 py-2 pr-4 pl-3 text-sm font-medium',
            ]"
        >
            <Icon
                :name="item.icon"
                class="mr-3 h-5 w-5"
            />
            {{ item.name }}
        </Link>
    </nav>
</template>
```

## Modern Vue 3.5 Features

### Enhanced Reactivity

```javascript
// Use Vue 3.5's enhanced reactivity features
import { ref, computed, watch, watchEffect } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

// Watch with immediate and deep options
watch(
    count,
    (newValue, oldValue) => {
        console.log(`Count changed from ${oldValue} to ${newValue}`)
    },
    { immediate: true }
)

// Watch effect for complex dependencies
watchEffect(() => {
    console.log(`Count is ${count.value}, doubled is ${doubled.value}`)
})
```

### Teleport and Suspense

```vue
<template>
    <div>
        <!-- Teleport modals to body -->
        <Teleport to="body">
            <div
                v-if="showModal"
                class="modal-overlay"
            >
                <div class="modal-content">
                    <slot name="modal" />
                </div>
            </div>
        </Teleport>

        <!-- Suspense for async components -->
        <Suspense>
            <template #default>
                <AsyncComponent />
            </template>
            <template #fallback>
                <LoadingSpinner />
            </template>
        </Suspense>
    </div>
</template>
```

This prompt now correctly reflects your Vue 3.5 + Inertia.js + Tailwind CSS 4 stack!
