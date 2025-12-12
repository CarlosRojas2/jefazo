#!/bin/bash
# Ejecutar migraciones y optimizaciones
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Iniciar PHP-FPM en background
php-fpm -D

# Esperar que PHP-FPM inicie completamente
sleep 2

echo "✅ PHP-FPM iniciado correctamente"

# Iniciar Nginx en foreground (para que el contenedor no se detenga)
echo "🚀 Iniciando Nginx..."
exec nginx -g "daemon off;"
```

---

## Resumen:
```
tu-proyecto/
├── Dockerfile          ← Construye el contenedor
├── nginx.conf          ← Configura el servidor web
├── start.sh            ← Script de inicio
├── composer.json
├── package.json
├── .env (NO lo subas a Git)
└── ... (resto de archivos Laravel)