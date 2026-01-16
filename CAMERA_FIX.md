# Solución: Problema de Cámara no visible en algunos teléfonos móviles

## Problema
En algunos dispositivos móviles no se mostraba la opción de captura de cámara en FilePond, mientras que en otros sí funcionaba correctamente.

## Causa
El problema era causado por:
1. **Falta de permisos en la política de permisos del servidor** - Los navegadores requieren que el servidor autorice explícitamente el acceso a la cámara
2. **Configuración incompleta en el componente FilePond** - Faltaba especificar la fuente de medios (mediaSource) con la cámara habilitada
3. **Headers HTTP insuficientes** - No se enviaban los headers correctos en las respuestas HTTP

## Cambios realizados

### 1. **Componente Filepond.jsx**
Se agregó la configuración `mediaSource` para especificar que solo la cámara debe estar disponible:
```jsx
mediaSource={{
    camera: true,
    microphone: false,
    screen: false,
}}
```

### 2. **Archivo HTML principal (app.blade.php)**
Se agregaron los meta tags de permisos:
```html
<meta http-equiv="permissions-policy" content="camera=*">
<meta name="permissions-policy" content="camera=*">
```

### 3. **Configuración Nginx (nginx.conf)**
Se agregó el header de política de permisos en la ubicación raíz:
```nginx
add_header Permissions-Policy "camera=*";
```

### 4. **Middleware de Laravel (CameraPermissionsMiddleware.php)**
Se creó un nuevo middleware que agrega automáticamente el header `Permissions-Policy` a todas las respuestas HTTP

### 5. **Registro del Middleware (bootstrap/app.php)**
Se registró el middleware en la cadena de middlewares web

### 6. **Manifest PWA (manifest.json)**
Se agregó el campo `permissions` con acceso a la cámara:
```json
"permissions": ["camera"]
```

## Instrucciones para implementar

1. Asegúrate de que los archivos hayan sido modificados correctamente
2. Recarga la aplicación en los navegadores móviles
3. Limpia la caché del navegador en los dispositivos móviles si es necesario
4. Si estás usando HTTPS (recomendado), el acceso a la cámara funcionará en todos los dispositivos

## Notas importantes

- **HTTPS es obligatorio**: Los navegadores modernos requieren HTTPS para acceder a la cámara por razones de seguridad. Asegúrate de que tu aplicación esté servida sobre HTTPS en producción
- **Permisos del usuario**: El usuario aún verá una solicitud del navegador para permitir el acceso a la cámara cuando la use por primera vez
- **Compatibilidad**: Esta solución es compatible con todos los navegadores modernos (Chrome, Firefox, Safari, Edge)

## Pruebas recomendadas

1. Abre la aplicación en un dispositivo iOS con Safari
2. Abre la aplicación en un dispositivo Android con Chrome
3. Verifica que el botón de captura de cámara aparezca en ambos casos
4. Toma una foto para confirmar que el flujo completo funciona
