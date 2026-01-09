<?php

namespace App\Traits;

use App\Services\CloudinaryService;
use Illuminate\Support\Collection;

trait CloudinaryValidationTrait {
    
    /**
     * Filtra las imágenes válidas de Cloudinary de una colección
     * 
     * @param Collection|array $images Colección de imágenes
     * @return Collection Imágenes validadas y optimizadas
     */
    public function filterValidCloudinaryImages($images) {
        if (is_array($images)) {
            $images = collect($images);
        }

        return $images->filter(function ($image) {
            $path = $image->path ?? $image;
            return CloudinaryService::imageExists($path);
        })->map(function ($image) {
            if (is_object($image)) {
                $image->validated_path = CloudinaryService::optimizeUrl($image->path);
            }
            return $image;
        });
    }

    /**
     * Obtiene todas las imágenes válidas del modelo
     * 
     * @return Collection
     */
    public function getValidImages() {
        if (!method_exists($this, 'images')) {
            return collect([]);
        }

        return $this->filterValidCloudinaryImages($this->images);
    }

    /**
     * Cuenta las imágenes válidas
     * 
     * @return int
     */
    public function countValidImages() {
        return $this->getValidImages()->count();
    }

    /**
     * Verifica si tiene al menos una imagen válida
     * 
     * @return bool
     */
    public function hasValidImages() {
        return $this->countValidImages() > 0;
    }
}
