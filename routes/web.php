<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RepairOrderController;
use App\Http\Controllers\RepairPartController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VehiclePartController;
use App\Http\Controllers\WebServiceController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class,'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/dni/{document}', [WebServiceController::class,'searchDni'])->where('document', '[0-9]+')->name('dni.search');
    Route::get('/ruc/{document}', [WebServiceController::class,'searchRuc'])->where('document', '[0-9]+')->name('ruc.search');

    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // Rutas para clientes
    Route::prefix('customers')->name('customers.')->group(function () {
        Route::get('/list', [CustomerController::class,'list'])->name('list');
        Route::get('/search', [CustomerController::class,'autocomplete'])->name('search');
    });
    Route::resource('customers', CustomerController::class)->only(['index','show','destroy','store']);

    // Rutas para conceptos
    Route::prefix('services')->name('services.')->group(function () {
        Route::get('/list', [ServiceController::class,'list'])->name('list');
        Route::get('/search', [ServiceController::class,'autocomplete'])->name('search');
    });
    Route::resource('services', ServiceController::class)->only(['index','show','destroy','store']);

    // Rutas para conceptos
    Route::prefix('vehicles')->name('vehicles.')->group(function () {
        Route::get('/list', [VehicleController::class,'list'])->name('list');
    });
    Route::resource('vehicles', VehicleController::class)->only(['index','show','destroy','store']);

    // Rutas para ordenes de reparación
    Route::prefix('repair_orders')->name('repair_orders.')->group(function () {
        Route::get('/list', [RepairOrderController::class,'list'])->name('list');
        Route::post('/upload', [RepairOrderController::class, 'upload'])->name('upload');
        Route::post('/revert', [RepairOrderController::class, 'revert']);
        Route::post('/diagnose', [RepairOrderController::class, 'diagnose'])->name('diagnose');
        Route::get('/inspection/{id}', [RepairOrderController::class, 'inspection'])->name('inspection');
        Route::get('/print/{id}', [RepairOrderController::class, 'print'])->name('print');
        Route::post('/generate-inspection', [RepairOrderController::class,'generateInspection'])->name('generate.inspection');
    });
    Route::resource('repair_orders', RepairOrderController::class)->only(['index','create','edit','show','destroy','store']);

    // Rutas para respuestos de reparación
    Route::prefix('articles')->name('articles.')->group(function () {
        Route::get('/list', [ArticleController::class,'list'])->name('list');
        Route::get('/search', [ArticleController::class,'autocomplete'])->name('search');
    });
    Route::resource('articles', ArticleController::class)->only(['index','show','destroy','store']);

    // Rutas para partes de vehiculo
    Route::prefix('vehicle_parts')->name('vehicle_parts.')->group(function () {
        Route::get('/list', [VehiclePartController::class,'list'])->name('list');
        Route::get('/search', [VehiclePartController::class,'autocomplete'])->name('search');
    });
    Route::resource('vehicle_parts', VehiclePartController::class)->only(['index','show','destroy','store']);
});

require __DIR__.'/auth.php';
