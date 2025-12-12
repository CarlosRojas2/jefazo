FROM php:8.2-fpm

# Instalar dependencias del sistema y Nginx
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    procps \
    # [CORRECCIÓN A] Instalar el paquete de desarrollo de Oniguruma (para mbstring)
    libonig-dev \
    # [CORRECCIÓN B] Asegurar que Nginx se instale correctamente
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensiones de PHP
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar directorio de trabajo
WORKDIR /var/www

# [CRÍTICO] 1. COPIAR ARCHIVOS DEL PROYECTO
COPY . .

# [CRÍTICO] 2. INSTALAR DEPENDENCIAS (Crea la carpeta 'vendor/' que artisan necesita)
# Este paso debe ir después del COPY.
RUN composer install --optimize-autoloader --no-dev --no-scripts --no-interaction

# 3. COPIAR ARCHIVOS DE CONFIGURACIÓN (Nginx y PHP-FPM)
COPY nginx.conf /etc/nginx/nginx.conf
# Asegúrate de que este archivo exista en tu raíz y se esté subiendo.
COPY www.conf /etc/php/8.2/fpm/pool.d/www.conf 

# 4. CONFIGURAR PERMISOS
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# 5. COPIAR Y EJECUTAR SCRIPT
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Exponer puerto
EXPOSE 8080

# Ejecutar script de inicio
CMD ["/start.sh"]