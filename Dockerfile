FROM php:8.2-fpm

# ... (Instalación de dependencias y extensiones) ...

# Configurar directorio de trabajo
WORKDIR /var/www

# Copiar archivos del proyecto
COPY . .

# Copiar configuración de PHP-FPM (¡Paso crucial!)
COPY www.conf /etc/php/8.2/fpm/pool.d/www.conf 

# ... (Instalar dependencias de Composer) ...

# Copiar configuración de Nginx y script de inicio
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Exponer puerto 8080 (Railway lo requiere)
EXPOSE 8080

# Ejecutar script de inicio
CMD ["/start.sh"]