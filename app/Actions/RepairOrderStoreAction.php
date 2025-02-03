<?php
namespace App\Actions;

use App\Models\Image;
use App\Models\RepairOrder;
class RepairOrderStoreAction{
    public function execute($attributes){
        $repair_order = RepairOrder::find($attributes['id']);
        if(is_null($repair_order)){
            $repair_order = new RepairOrder();
        }
        $this->fill($repair_order,$attributes);
        $repair_order->save();
        $this->saveImages($repair_order,$attributes['images']);
        return $repair_order;
    }

    public function fill(RepairOrder $repair_order, array $attributes){
        $repair_order->fill($attributes);
    }

    public function saveDetail(RepairOrder $repair_order, array $attributes){

    }

    public function saveImages(RepairOrder $repair_order, array $images){
        // Restaurar o crear solo las imágenes que vienen en el array de imágenes
        foreach ($images as $image) {
            $obj_image = Image::withTrashed()
                ->where('repair_order_id', $repair_order->id)
                ->where('path', $image)
                ->first();

            if ($obj_image) {
                // Si la imagen existe en "papelera", restaurarla
                $obj_image->restore();
            } else {
                // Si no existe, crear una nueva imagen
                $repair_order->images()->create([
                    'path' => $image
                ]);
            }
        }

        // Eliminar solo las imágenes que NO están en el array de imágenes (sin tocar las que vienen en $images)
        $repair_order->images()
            ->whereNotIn('path', $images)
            ->delete();
    }
}
?>
