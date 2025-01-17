<?php

use App\Http\Controllers\ConceptController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // Rutas para clientes
    Route::prefix('customers')->name('customers.')->group(function () {
        Route::get('/list', [CustomerController::class,'list'])->name('list');
    });
    Route::resource('customers', CustomerController::class)->only(['index','store']);

    // Rutas para conceptos
    Route::prefix('concepts')->name('concepts.')->group(function () {
        Route::get('/list', [ConceptController::class,'list'])->name('list');
    });
    Route::resource('concepts', ConceptController::class)->only(['index','store']);
});

require __DIR__.'/auth.php';
