<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

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
        Vite::prefetch(concurrency: 3);
        
        // Agregar header para permitir acceso a cámara en todos los dispositivos
        \Illuminate\Support\Facades\Response::macro('withCameraPermissions', function ($response) {
            return $response->header('Permissions-Policy', 'camera=*');
        });
    }
}
