---
mode: agent
---

# Laravel Architecture Prompt

## Expected Output Format

When working with Laravel architecture patterns, provide:

1. **Architecture design** - Which Laravel patterns to use and why
2. **Implementation strategy** - Step-by-step approach using Laravel features
3. **Event-driven design** - Events, listeners, and observers integration
4. **Service layer** - Business logic organization and dependency injection
5. **Integration points** - How components work together

## Laravel Naming Conventions

### Class Naming with Suffixes/Prefixes

```php
// Events - descriptive name with "Event" suffix
App\Events\User\UserRegisteredEvent
App\Events\Project\ProjectCompletedEvent
App\Events\Attendance\AttendanceRecordedEvent
App\Events\Bonus\BonusAwardedEvent
App\Events\Company\CompanyInviteCreatedEvent

// Listeners - action-based with "Listener" suffix
App\Listeners\User\SendWelcomeEmailListener
App\Listeners\Project\NotifyProjectManagerListener
App\Listeners\Company\SendMailCompanyInviteListener
App\Listeners\Attendance\UpdateDailyStatsListener

// Form Requests - action prefix with "Request" suffix
App\Http\Requests\User\StoreUserRequest
App\Http\Requests\User\UpdateUserRequest
App\Http\Requests\Project\StoreProjectRequest
App\Http\Requests\Attendance\ClockInRequest

// API Resources - context with "Resource" suffix
App\Http\Resources\User\UserShowResource
App\Http\Resources\User\UserIndexResource
App\Http\Resources\Project\ProjectDetailResource
App\Http\Resources\Project\ProjectListResource

// Services - domain with "Service" suffix
App\Services\UserService
App\Services\ProjectService
App\Services\AttendanceService
App\Services\BonusCalculationService

// Jobs - action-based with "Job" suffix
App\Jobs\ProcessPayrollJob
App\Jobs\SendNotificationJob
App\Jobs\GenerateReportJob
App\Jobs\BackupDatabaseJob

// Observers - model name with "Observer" suffix
App\Observers\UserObserver
App\Observers\ProjectObserver
App\Observers\AttendanceRecordObserver

// Policies - model name with "Policy" suffix
App\Policies\UserPolicy
App\Policies\ProjectPolicy
App\Policies\AttendanceRecordPolicy

// Middleware - descriptive with "Middleware" suffix
App\Http\Middleware\AuthenticateMiddleware
App\Http\Middleware\RateLimitMiddleware
App\Http\Middleware\EnsureUserIsActiveMiddleware
```

## Laravel Patterns to Prioritize

### Core Laravel Features

- **Eloquent Models** with proper relationships and scopes
- **Form Requests** for validation and authorization
- **API Resources** for consistent response formatting
- **Events & Listeners** for decoupled application logic
- **Observers** for model lifecycle management
- **Mail & Notifications** for communication
- **Jobs & Queues** for background processing
- **Policies** for authorization logic
- **Custom Artisan Commands** for CLI operations

### Advanced Patterns

- **Service Classes** for complex business logic
- **Repository Pattern** when needed (avoid over-abstraction)
- **Action Classes** for single-responsibility operations
- **Data Transfer Objects (DTOs)** for complex data structures
- **Enum Classes** for constants and typed values
- **Custom Collections** for domain-specific data manipulation

## Event-Driven Architecture

### When to Use Events

- User registration/authentication flows
- Model lifecycle changes (created, updated, deleted)
- Business process triggers (project completed, bonus awarded)
- External API integrations
- Audit logging and tracking

### Event Organization

```php
// Domain-specific event namespacing with Event suffix
App\Events\User\UserRegisteredEvent
App\Events\Project\ProjectCompletedEvent
App\Events\Attendance\AttendanceRecordedEvent
App\Events\Bonus\BonusAwardedEvent
```

### Listener Patterns

- **Single responsibility** - One listener per action
- **Queueable listeners** for heavy operations
- **Event subscribers** for related event groups
- **Proper error handling** and retry logic

```php
// Listener examples with proper naming
class SendWelcomeEmailListener implements ShouldQueue
{
    public function handle(UserRegisteredEvent $event): void
    {
        Mail::to($event->user)->send(new WelcomeEmail($event->user));
    }
}

class NotifyProjectManagerListener
{
    public function handle(ProjectCompletedEvent $event): void
    {
        // Notify project manager logic
    }
}
```

## Service Layer Design

### Service Organization

```php
App\Services\UserService
App\Services\ProjectService
App\Services\AttendanceService
App\Services\BonusCalculationService
```

### Service Responsibilities

- **Business logic coordination**
- **Multiple model interactions**
- **External API integrations**
- **Complex calculations and algorithms**
- **Transaction management**

## Integration with Inertia.js

### Backend Patterns

- **Shared data** via Inertia middleware
- **Error handling** with proper validation responses
- **Resource transformations** for consistent API responses
- **Route model binding** for clean controllers
- **Middleware stacks** for common functionality

### Frontend Integration

- **Form helpers** for Laravel validation integration
- **Error handling** consistent with Laravel patterns
- **Loading states** for better UX
- **Optimistic updates** where appropriate

## Database Patterns

### Migration Organization

- **Descriptive migration names** with proper timestamps
- **Foreign key constraints** with proper cascading
- **Indexes** for frequently queried columns
- **Enum columns** using Laravel's native enum support

### Model Best Practices

- **Proper relationships** with appropriate eager loading
- **Accessors/Mutators** for data transformation
- **Local scopes** for common query patterns
- **Global scopes** for tenant isolation or soft deletes
- **Observers** for model lifecycle events

## Testing Architecture

### Test Organization by Laravel Patterns

- **Unit Tests** for Services, Actions, and Utilities
- **Feature Tests** for Controllers and HTTP flows
- **Database Tests** for Models and Repositories
- **Event Tests** for Events and Listeners
- **Mail Tests** for Mail and Notification classes

### Laravel-Specific Testing

- **Factory usage** for consistent test data
- **Database transactions** for test isolation
- **Queue testing** for job verification
- **Event faking** for event-driven testing
- **Mail faking** for communication testing
