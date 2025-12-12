#!/bin/bash

# --- 1. LIMPIEZA FORZADA DE CACHÉ (CRÍTICO para HTTPS) ---
echo "--- Limpiando caché de Laravel ---"
php artisan config:clear
php artisan route:clear
php artisan view:clear

# --- 2. EJECUCIÓN DE COMANDOS DE DEPLOY/MIGRACIÓN/SEEDERS ---
echo "--- Ejecutando comandos de Laravel ---"
php artisan migrate --force

# [NUEVO] Ejecutar los Seeders para poblar la base de datos
echo "--- Ejecutando Seeders ---"
php artisan db:seed --force

# [NUEVO] Crear el enlace simbólico para el disco local (Storage Link)
# Si Laravel no puede escribir, esto podría fallar, pero con los permisos 775/777 debe funcionar.
echo "--- Creando Storage Link ---"
php artisan storage:link

# Recachear configuración y rutas (con la nueva config HTTPS)
php artisan config:cache
php artisan route:cache
php artisan view:cache

# --- 3. INICIO DE PROCESOS SIMULTÁNEOS (PHP-FPM y Nginx) ---
echo "--- Iniciando PHP-FPM y Nginx ---"

# Iniciar PHP-FPM en segundo plano (-D)
php-fpm -D

# Esperar un poco para asegurar que PHP-FPM esté listo
sleep 2

# Iniciar Nginx en primer plano (daemon off) para que Docker lo monitoree
exec nginx -g "daemon off;"