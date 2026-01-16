<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CameraPermissionsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Agregar headers de Permissions-Policy para permitir acceso a cámara
        $response->header('Permissions-Policy', 'camera=*');
        
        return $response;
    }
}
