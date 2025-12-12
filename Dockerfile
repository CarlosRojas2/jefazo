FROM php:8.2-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    nginx \
    procps

# Instalar extensiones de PHP (incluye bcmath para tu proyecto)
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar directorio de trabajo
WORKDIR /var/www

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias de Composer
RUN composer install --optimize-autoloader --no-dev --no-scripts --no-interaction

# Dar permisos a Laravel
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar y dar permisos al script de inicio
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Exponer puerto 8080 (Railway lo requiere)
EXPOSE 8080

# Ejecutar script de inicio
CMD ["/start.sh"]