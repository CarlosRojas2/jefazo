#!/bin/bash

# --- 1. LIMPIEZA FORZADA DE CACHÉ ---
echo "--- Limpiando caché de Laravel ---"
# Limpiar configuración, rutas y vistas (importante para que se lean las nuevas variables)
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 1. EJECUCIÓN DE COMANDOS DE DEPLOY/MIGRACIÓN
echo "--- Ejecutando comandos de Laravel ---"
php artisan config:clear
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 2. INICIO DE PROCESOS SIMULTÁNEOS
echo "--- Iniciando PHP-FPM y Nginx ---"
# Iniciar PHP-FPM en background (Ahora escuchará en 127.0.0.1:9000)
php-fpm -D

# Pequeña espera para asegurar que PHP-FPM inicie
sleep 2

# Iniciar Nginx en foreground (Este es el proceso principal del contenedor)
exec nginx -g "daemon off;"