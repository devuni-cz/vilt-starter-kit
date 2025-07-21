<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => Inertia::render('Welcome'))
    ->name('welcome');
