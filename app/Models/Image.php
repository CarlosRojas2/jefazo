<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Services\CloudinaryService;

class Image extends Model{
    use SoftDeletes;
    protected $fillable=['repair_order_id','path'];

    public function repairOrder(){
        return $this->belongsTo(RepairOrder::class);
    }

    /**
     * Verifica si la imagen existe en Cloudinary
     * @return bool
     */
    public function existsInCloudinary() {
        return CloudinaryService::imageExists($this->path);
    }

    /**
     * Obtiene la URL optimizada de Cloudinary si existe
     * @param int $width Ancho máximo (opcional)
     * @return string|null
     */
    public function getOptimizedUrl($width = 600) {
        return CloudinaryService::getValidImageUrl($this->path, $width);
    }

    /**
     * Accesador para obtener automáticamente la URL validada
     * @return string|null
     */
    public function getValidPathAttribute() {
        return $this->getOptimizedUrl();
    }
}
