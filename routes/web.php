<?php

use App\Http\Controllers\ConceptController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DiagnosisController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\WebServiceController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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
    Route::prefix('concepts')->name('concepts.')->group(function () {
        Route::get('/list', [ConceptController::class,'list'])->name('list');
    });
    Route::resource('concepts', ConceptController::class)->only(['index','show','destroy','store']);

    // Rutas para conceptos
    Route::prefix('vehicles')->name('vehicles.')->group(function () {
        Route::get('/list', [VehicleController::class,'list'])->name('list');
    });
    Route::resource('vehicles', VehicleController::class)->only(['index','show','destroy','store']);

    // Rutas para diagnosticos
    Route::prefix('diagnoses')->name('diagnoses.')->group(function () {
        Route::get('/list', [DiagnosisController::class,'list'])->name('list');
    });
    Route::resource('diagnoses', DiagnosisController::class)->only(['index','create','show','destroy','store']);
});

require __DIR__.'/auth.php';
