<?php

declare(strict_types=1);

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => Inertia::render('Welcome'))
    ->name('welcome');
