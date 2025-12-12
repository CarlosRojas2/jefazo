# -----------------------------------------------------------
# ETAPA 1: BUILD DE FRONTEND (NODE/VITE)
# Resuelve: Vite manifest not found
# -----------------------------------------------------------
FROM node:20 as node_builder

WORKDIR /app

# Copiar archivos de configuración de frontend
COPY package.json package-lock.json ./

# Instalar dependencias de Node
RUN npm install

# Copiar archivos fuente y compilar
COPY resources resources
COPY vite.config.js .
COPY public public

# Compilar assets para producción. Genera public/build/manifest.json
RUN npm run build 


# -----------------------------------------------------------
# ETAPA 2: RUNTIME (PHP/NGINX)
# Resuelve: 502 Bad Gateway, vendor/autoload.php not found
# -----------------------------------------------------------
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
    # [Soluciona: oniguruma error]
    libonig-dev \
    # [Soluciona: nginx: not found]
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensiones de PHP
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar directorio de trabajo
WORKDIR /var/www

# 1. COPIAR ARCHIVOS DEL PROYECTO
COPY . .

# 2. INSTALAR DEPENDENCIAS PHP (Crea 'vendor/')
# [Soluciona: vendor/autoload.php not found]
RUN composer install --optimize-autoloader --no-dev --no-scripts --no-interaction

# 3. ¡CRUCIAL! COPIAR ASSETS COMPILADOS
# Trae la carpeta 'build' de la Etapa 1 a la carpeta final 'public/build'
COPY --from=node_builder /app/public/build /var/www/public/build

# 4. COPIAR ARCHIVOS DE CONFIGURACIÓN
# [Soluciona: 502 Bad Gateway, asumiendo que www.conf usa el puerto 9000]
COPY nginx.conf /etc/nginx/nginx.conf
COPY www.conf /etc/php/8.2/fpm/pool.d/www.conf 

# 5. CONFIGURAR PERMISOS
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# 6. COPIAR Y EJECUTAR SCRIPT
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Puerto de Nginx
EXPOSE 8080
# El script que inicia PHP-FPM y Nginx
CMD ["/start.sh"]