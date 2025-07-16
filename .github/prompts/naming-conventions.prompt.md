---
mode: agent
---

# Laravel Naming Conventions Prompt

## Expected Output Format

When creating Laravel classes, always follow these naming conventions with proper suffixes and prefixes:

1. **Consistent class naming** - Use appropriate suffixes for all Laravel classes
2. **Domain organization** - Group related classes by business domain
3. **Clear purpose indication** - Class names should indicate their role and context
4. **Laravel standards compliance** - Follow Laravel community conventions

## Class Naming Conventions

### Events

**Pattern**: `{Domain}{Action}Event`

```php
// User domain events
App\Events\User\UserRegisteredEvent
App\Events\User\UserActivatedEvent
App\Events\User\UserDeactivatedEvent

// Project domain events
App\Events\Project\ProjectCreatedEvent
App\Events\Project\ProjectCompletedEvent
App\Events\Project\ProjectDeletedEvent

// Company domain events
App\Events\Company\CompanyInviteCreatedEvent
App\Events\Company\CompanyInviteAcceptedEvent

// Attendance domain events
App\Events\Attendance\AttendanceRecordedEvent
App\Events\Attendance\AttendanceUpdatedEvent

// Bonus domain events
App\Events\Bonus\BonusCalculatedEvent
App\Events\Bonus\BonusAwardedEvent
```

### Listeners

**Pattern**: `{Action}{Target}Listener`

```php
// Email listeners
App\Listeners\User\SendWelcomeEmailListener
App\Listeners\Company\SendMailCompanyInviteListener
App\Listeners\Project\SendProjectCompletionEmailListener

// Notification listeners
App\Listeners\User\NotifyAdminUserRegisteredListener
App\Listeners\Project\NotifyProjectManagerListener
App\Listeners\Attendance\NotifyHRAttendanceListener

// Processing listeners
App\Listeners\Bonus\CalculateBonusPointsListener
App\Listeners\Attendance\UpdateDailyStatsListener
App\Listeners\Project\UpdateProjectMetricsListener
```

### Form Requests

**Pattern**: `{Action}{Model}Request`

```php
// User requests
App\Http\Requests\User\StoreUserRequest
App\Http\Requests\User\UpdateUserRequest
App\Http\Requests\User\ActivateUserRequest

// Project requests
App\Http\Requests\Project\StoreProjectRequest
App\Http\Requests\Project\UpdateProjectRequest
App\Http\Requests\Project\CompleteProjectRequest

// Attendance requests
App\Http\Requests\Attendance\ClockInRequest
App\Http\Requests\Attendance\ClockOutRequest
App\Http\Requests\Attendance\UpdateAttendanceRequest

// Bonus requests
App\Http\Requests\Bonus\CalculateBonusRequest
App\Http\Requests\Bonus\AwardBonusRequest
```

### API Resources

**Pattern**: `{Model}{Context}Resource`

```php
// User resources
App\Http\Resources\User\UserShowResource      // Detailed user view
App\Http\Resources\User\UserIndexResource     // User listing
App\Http\Resources\User\UserProfileResource   // User profile context
App\Http\Resources\User\UserMinimalResource   // Minimal user info

// Project resources
App\Http\Resources\Project\ProjectShowResource      // Full project details
App\Http\Resources\Project\ProjectIndexResource     // Project listing
App\Http\Resources\Project\ProjectCardResource      // Project card view
App\Http\Resources\Project\ProjectSummaryResource   // Summary view

// Attendance resources
App\Http\Resources\Attendance\AttendanceShowResource
App\Http\Resources\Attendance\AttendanceIndexResource
App\Http\Resources\Attendance\AttendanceReportResource

// Bonus resources
App\Http\Resources\Bonus\BonusShowResource
App\Http\Resources\Bonus\BonusIndexResource
App\Http\Resources\Bonus\BonusCalculationResource
```

### Services

**Pattern**: `{Domain}Service`

```php
App\Services\UserService               // User management operations
App\Services\ProjectService            // Project management operations
App\Services\AttendanceService         // Attendance tracking operations
App\Services\BonusCalculationService   // Bonus calculation logic
App\Services\EmailService              // Email operations
App\Services\NotificationService       // Notification operations
App\Services\ReportService             // Report generation
App\Services\PayrollService            // Payroll processing
```

### Jobs

**Pattern**: `{Action}{Target}Job`

```php
// Email jobs
App\Jobs\SendWelcomeEmailJob
App\Jobs\SendProjectNotificationJob
App\Jobs\SendBonusNotificationJob

// Processing jobs
App\Jobs\ProcessPayrollJob
App\Jobs\ProcessAttendanceJob
App\Jobs\CalculateBonusesJob

// Maintenance jobs
App\Jobs\BackupDatabaseJob
App\Jobs\CleanupOldRecordsJob
App\Jobs\GenerateReportsJob

// Import/Export jobs
App\Jobs\ImportUsersJob
App\Jobs\ExportAttendanceJob
App\Jobs\SyncProjectDataJob
```

### Observers

**Pattern**: `{Model}Observer`

```php
App\Observers\UserObserver              // User model lifecycle
App\Observers\ProjectObserver           // Project model lifecycle
App\Observers\AttendanceRecordObserver  // AttendanceRecord lifecycle
App\Observers\BonusObserver             // Bonus model lifecycle
```

### Policies

**Pattern**: `{Model}Policy`

```php
App\Policies\UserPolicy              // User authorization
App\Policies\ProjectPolicy           // Project authorization
App\Policies\AttendanceRecordPolicy  // AttendanceRecord authorization
App\Policies\BonusPolicy             // Bonus authorization
```

### Middleware

**Pattern**: `{Purpose}Middleware`

```php
App\Http\Middleware\AuthenticateMiddleware
App\Http\Middleware\EnsureUserIsActiveMiddleware
App\Http\Middleware\RateLimitMiddleware
App\Http\Middleware\CheckProjectAccessMiddleware
App\Http\Middleware\ValidateApiTokenMiddleware
App\Http\Middleware\LogRequestMiddleware
```

### Controllers

**Pattern**: `{Model}Controller` or `{Domain}Controller`

```php
// Standard resource controllers
App\Http\Controllers\UserController
App\Http\Controllers\ProjectController
App\Http\Controllers\AttendanceController

// API controllers
App\Http\Controllers\Api\UserController
App\Http\Controllers\Api\ProjectController
App\Http\Controllers\Api\AttendanceController

// Specialized controllers
App\Http\Controllers\Auth\LoginController
App\Http\Controllers\Dashboard\DashboardController
App\Http\Controllers\Reports\ReportController
```

### Commands (Artisan)

**Pattern**: `{Action}{Target}Command`

```php
App\Console\Commands\GenerateReportsCommand
App\Console\Commands\ProcessPayrollCommand
App\Console\Commands\SendDailyNotificationsCommand
App\Console\Commands\CleanupOldDataCommand
App\Console\Commands\ImportUsersCommand
App\Console\Commands\BackupDatabaseCommand
```

### Mail Classes

**Pattern**: `{Purpose}Mail`

```php
App\Mail\WelcomeUserMail
App\Mail\ProjectCompletedMail
App\Mail\BonusAwardedMail
App\Mail\AttendanceReminderMail
App\Mail\PayrollGeneratedMail
App\Mail\CompanyInviteMail
```

### Notifications

**Pattern**: `{Purpose}Notification`

```php
App\Notifications\UserRegisteredNotification
App\Notifications\ProjectDeadlineNotification
App\Notifications\BonusAwardedNotification
App\Notifications\AttendanceMissedNotification
App\Notifications\PayrollReadyNotification
```

## File Organization Examples

### Complete User Domain Structure

```
app/
├── Events/User/
│   ├── UserRegisteredEvent.php
│   ├── UserActivatedEvent.php
│   └── UserDeactivatedEvent.php
├── Listeners/User/
│   ├── SendWelcomeEmailListener.php
│   └── NotifyAdminUserRegisteredListener.php
├── Http/
│   ├── Controllers/
│   │   └── UserController.php
│   ├── Requests/User/
│   │   ├── StoreUserRequest.php
│   │   └── UpdateUserRequest.php
│   └── Resources/User/
│       ├── UserShowResource.php
│       ├── UserIndexResource.php
│       └── UserProfileResource.php
├── Services/
│   └── UserService.php
├── Observers/
│   └── UserObserver.php
├── Policies/
│   └── UserPolicy.php
└── Mail/
    └── WelcomeUserMail.php
```

## Implementation Examples

### Event and Listener Creation

```php
// Event
class UserRegisteredEvent
{
    public function __construct(
        public User $user,
        public string $registrationSource = 'web'
    ) {}
}

// Listener
class SendWelcomeEmailListener implements ShouldQueue
{
    public function handle(UserRegisteredEvent $event): void
    {
        Mail::to($event->user)->send(new WelcomeUserMail($event->user));
    }
}
```

### Request and Resource Examples

```php
// Form Request
class StoreUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8', 'confirmed'],
        ];
    }
}

// API Resource
class UserShowResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at->format('d.m.Y'),
            'projects' => ProjectCardResource::collection($this->whenLoaded('projects')),
        ];
    }
}
```

## Best Practices

### Naming Consistency

- Always use the same suffix for the same type of class
- Group related classes in domain-specific folders
- Use descriptive names that indicate purpose and context
- Follow Laravel community conventions

### Domain Organization

- Organize by business domain (User, Project, Attendance, Bonus)
- Keep related classes in the same namespace
- Use consistent naming across all domains

### Context Specificity

- Use context-specific resource names (Show, Index, Card, Summary)
- Create purpose-specific request classes (Store, Update, Activate)
- Name jobs and listeners based on their specific action
