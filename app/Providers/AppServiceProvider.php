<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Date;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Vite;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

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
            $this->app['request']->server->set('HTTPS', true);
            // DB::prohibitDestructiveCommands();
        }
    }
}
