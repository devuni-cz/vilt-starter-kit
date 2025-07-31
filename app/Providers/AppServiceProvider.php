<?php

declare(strict_types=1);

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Override;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    #[Override]
    public function register(): void {}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Date::useClass(CarbonImmutable::class);
        JsonResource::withoutWrapping();
        Vite::prefetch(concurrency: 3);

        if (app()->isLocal()) {
            Model::preventLazyLoading();
            Model::shouldBeStrict();
        }
        if (app()->isProduction()) {
            request()->server->set('HTTPS', true);
            DB::prohibitDestructiveCommands();
        }
    }
}
