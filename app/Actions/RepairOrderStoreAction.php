<?php
namespace App\Actions;
use App\Models\Image;
use App\Models\RepairOrder;
use Illuminate\Support\Facades\Storage;

class RepairOrderStoreAction{
    public function execute($attributes){
        $repair_order = RepairOrder::find($attributes['id']);
        if(is_null($repair_order)){
            $repair_order = new RepairOrder();
        }
        $this->fill($repair_order,$attributes);
        if($attributes['id']<1){//solo cuando crea
            $repair_order->correlative=$this->generateCorrelative();
            // Decodificar la imagen base64
            $signature = str_replace('data:image/png;base64,', '', $attributes['signature']);
            $signature = str_replace(' ', '+', $signature);
            $imageSignature = base64_decode($signature);
            // Generar un nombre único para la imagen
            $fileName = uniqid() . '.png';
            Storage::disk('public')->put("signatures/{$fileName}",$imageSignature);
            $repair_order->signature="signatures/{$fileName}";
        }
        $repair_order->save();
        $this->saveImages($repair_order,$attributes['images']);
        return $repair_order;
    }

    private function generateCorrelative(){
        // Bloquear la última fila con el mayor correlativo
        $last = RepairOrder::lockForUpdate()->orderBy('correlative', 'desc')->first();
        // Incrementar y rellenar con ceros a la izquierda
        $nextCorrelative = $last ? $last->correlative + 1 : 1;
        return str_pad($nextCorrelative, 3, '0', STR_PAD_LEFT);
    }

    public function fill(RepairOrder $repair_order, array $attributes){
        $repair_order->fill($attributes);
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

    public function diagnose($attributes){
        $repair_order=RepairOrder::find($attributes['id']);
        $repair_order->status=$attributes['status'];
        if (!$repair_order) {
            return response()->json(['error' => 'Repair order not found'], 404);
        }
        foreach($attributes['services'] as $service){
            $services[$service['id']] = [
                'observations' => $service['observations'],
            ];
            // Sincroniza los servicios (agrega, actualiza, elimina)
            $repair_order->services()->sync($services);
        }

        foreach($attributes['parts'] as $repair_part){
            $parts[$repair_part['id']] = [
                'quantity' => $repair_part['quantity'],
            ];
            // Sincroniza los servicios (agrega, actualiza, elimina)
            $repair_order->parts()->sync($parts);
        }
        $repair_order->save();
    }
}
?>
