<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class CloudinaryService {
    
    /**
     * Valida si una imagen existe en Cloudinary
     * Intenta cargar la URL y verifica el código de respuesta HTTP
     * 
     * @param string $imageUrl URL de la imagen en Cloudinary
     * @return bool true si la imagen existe, false en caso contrario
     */
    public static function imageExists($imageUrl) {
        if (empty($imageUrl)) {
            return false;
        }

        // Usar caché para evitar hacer requests innecesarios a Cloudinary
        $cacheKey = 'cloudinary_image_exists_' . md5($imageUrl);
        
        return Cache::remember($cacheKey, now()->addHours(24), function () use ($imageUrl) {
            try {
                $response = Http::timeout(10)
                    ->connectTimeout(5)
                    ->head($imageUrl);
                return $response->successful();
            } catch (\Throwable $e) {
                // En caso de error, asumir que no existe
                return false;
            }
        });
    }

    /**
     * Genera una URL optimizada de Cloudinary
     * 
     * @param string $imageUrl URL original de la imagen
     * @param int $width Ancho máximo de la imagen (opcional)
     * @param string $quality Calidad automática (defecto: 'auto')
     * @param string $format Formato de la imagen (defecto: 'jpg')
     * @return string URL optimizada
     */
    public static function optimizeUrl($imageUrl, $width = 600, $quality = 'auto', $format = 'jpg') {
        if (empty($imageUrl)) {
            return null;
        }

        // Reemplaza el patrón /upload/ con parámetros de optimización
        return str_replace(
            '/upload/',
            "/upload/w_{$width},c_limit,q_{$quality},f_{$format}/",
            $imageUrl
        );
    }

    /**
     * Obtiene la URL de imagen con validación
     * Si la imagen no existe, retorna null
     * 
     * @param string $imageUrl URL de la imagen en Cloudinary
     * @param int $width Ancho máximo (opcional)
     * @return string|null URL optimizada si existe, null si no
     */
    public static function getValidImageUrl($imageUrl, $width = 600) {
        if (empty($imageUrl)) {
            return null;
        }

        try {
            if (!self::imageExists($imageUrl)) {
                return null;
            }

            $optimizedUrl = self::optimizeUrl($imageUrl, $width);
            return $optimizedUrl;
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Obtiene una imagen de placeholder cuando la imagen no existe
     * 
     * @return string URL del placeholder
     */
    public static function getPlaceholder() {
        // Puedes usar un servicio como placeholder.com o una imagen estática
        return 'https://via.placeholder.com/600x400?text=Imagen+No+Disponible';
    }

    // ============================================
    // MÉTODOS DE CARGA Y ELIMINACIÓN
    // ============================================

    /**
     * Sube una imagen a Cloudinary
     * 
     * @param mixed $file Archivo (UploadedFile o ruta)
     * @param string $folder Carpeta en Cloudinary (ej: 'images', 'signatures', 'annexes')
     * @param array $options Opciones adicionales de Cloudinary
     * @return array|null Array con 'url' y 'public_id', o null si falla
     */
    public static function uploadImage($file, $folder = 'images', $options = []) {
        try {
            // Obtener la ruta real del archivo
            $filePath = is_string($file) ? $file : $file->getRealPath();
            
            if (!file_exists($filePath)) {
                throw new \Exception("Archivo no encontrado: $filePath");
            }

            // Preparar opciones base para Cloudinary
            $uploadOptions = array_merge([
                'folder' => trim($folder, '/'),
                'resource_type' => 'auto',
                'overwrite' => false,
                'unique_filename' => true,
            ], $options);

            // Usar uploadApi() de la Facade de Cloudinary
            $uploadedFile = Cloudinary::uploadApi()->upload($filePath, $uploadOptions);

            return [
                'url' => $uploadedFile['secure_url'],
                'public_id' => $uploadedFile['public_id'],
                'secure_url' => $uploadedFile['secure_url'],
            ];
        } catch (\Throwable $e) {
            throw new \Exception('Cloudinary: ' . $e->getMessage());
        }
    }

    /**
     * Elimina una imagen de Cloudinary por su public_id
     * 
     * @param string $publicId ID público de la imagen en Cloudinary
     * @return bool true si se eliminó, false si falla
     */
    public static function deleteImage($publicId) {
        try {
            // Usar uploadApi() para eliminar
            Cloudinary::uploadApi()->destroy($publicId);

            // Limpiar caché de validación
            $cacheKey = 'cloudinary_image_exists_' . md5($publicId);
            Cache::forget($cacheKey);

            return true;
        } catch (\Throwable $e) {
            return false;
        }
    }

    /**
     * Elimina una imagen por su URL completa
     * Extrae el public_id de la URL y la elimina
     * 
     * @param string $imageUrl URL completa de la imagen en Cloudinary
     * @return bool true si se eliminó, false si falla
     */
    public static function deleteImageByUrl($imageUrl) {
        try {
            // Extraer public_id de la URL
            // Ejemplo: https://res.cloudinary.com/cloud/image/upload/v123/folder/filename.jpg
            // public_id sería: folder/filename
            
            if (preg_match('/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/', $imageUrl, $matches)) {
                $publicId = $matches[1];
                return self::deleteImage($publicId);
            }

            return false;
        } catch (\Throwable $e) {
            return false;
        }
    }

    /**
     * Obtiene información de una imagen en Cloudinary
     * 
     * @param string $publicId ID público de la imagen
     * @return array|null Información de la imagen o null
     */
    public static function getImageInfo($publicId) {
        try {
            $info = Cloudinary::api()->resource($publicId);

            return [
                'public_id' => $info['public_id'],
                'url' => $info['secure_url'] ?? $info['url'],
                'width' => $info['width'],
                'height' => $info['height'],
                'bytes' => $info['bytes'],
                'format' => $info['format'],
                'created_at' => $info['created_at'],
            ];
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Sube una imagen desde un archivo local con validación
     * 
     * @param \Illuminate\Http\UploadedFile $uploadedFile Archivo cargado
     * @param string $folder Carpeta en Cloudinary
     * @return array|null Datos de la imagen o null
     */
    public static function uploadAndValidate($uploadedFile, $folder = 'images') {
        // Validaciones locales
        $maxSize = 5 * 1024 * 1024; // 5MB
        if ($uploadedFile->getSize() > $maxSize) {
            return null;
        }

        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!in_array($uploadedFile->getMimeType(), $allowedMimes)) {
            return null;
        }

        return self::uploadImage($uploadedFile, $folder);
    }

    /**
     * Sube múltiples imágenes a Cloudinary
     * 
     * @param array $files Array de archivos (UploadedFile)
     * @param string $folder Carpeta en Cloudinary
     * @return array Array de resultados [['url' => ..., 'public_id' => ...], ...]
     */
    public static function uploadMultipleImages($files, $folder = 'images') {
        $results = [];
        $errors = [];

        foreach ($files as $file) {
            try {
                $result = self::uploadImage($file, $folder);
                if ($result) {
                    $results[] = $result;
                } else {
                    $errors[] = [
                        'file' => $file->getClientOriginalName(),
                        'error' => 'Error desconocido'
                    ];
                }
            } catch (\Throwable $e) {
                $errors[] = [
                    'file' => $file->getClientOriginalName(),
                    'error' => $e->getMessage()
                ];
            }
        }

        return [
            'success' => $results,
            'errors' => $errors,
            'total' => count($files),
        ];
    }
}
