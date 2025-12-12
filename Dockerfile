FROM php:8.2-fpm

# Instalar dependencias del sistema y Nginx
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    libpq-dev \
    zip \
    unzip \
    # **Aseguramos la instalación de Nginx**
    nginx \ 
    procps \
    && rm -rf /var/lib/apt/lists/* # Limpieza

# Instalar extensiones de PHP (bcmath, etc.)
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar directorio de trabajo
WORKDIR /var/www

# 1. COPIAR ARCHIVOS DEL PROYECTO
COPY . .

# 2. INSTALAR DEPENDENCIAS (¡AHORA, ANTES de Artisan!)
# Esto crea la carpeta 'vendor/'
RUN composer install --optimize-autoloader --no-dev --no-scripts --no-interaction

# 3. COPIAR ARCHIVOS DE CONFIGURACIÓN (incluyendo el www.conf que creaste)
COPY nginx.conf /etc/nginx/nginx.conf
COPY www.conf /etc/php/8.2/fpm/pool.d/www.conf 

# 4. CONFIGURAR PERMISOS (Despues de Composer)
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Copiar y ejecutar script de inicio
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Exponer puerto
EXPOSE 8080

# Ejecutar script de inicio
CMD ["/start.sh"]