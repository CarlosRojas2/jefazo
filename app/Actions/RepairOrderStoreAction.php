<?php
namespace App\Actions;
use App\Models\Image;
use App\Models\RepairOrder;
use Cloudinary\Api\Upload\UploadApi;
class RepairOrderStoreAction{
    public function execute($attributes){
        $repair_order = RepairOrder::find($attributes['id']);
        if(is_null($repair_order)){
            $repair_order = new RepairOrder();
        }
        $this->fill($repair_order,$attributes);
        if ($attributes['id'] < 1) {
            $repair_order->correlative = $this->generateCorrelative();
            $result = (new UploadApi())->upload(
                $attributes['signature'], // base64 del canvas
                [
                    'folder' => 'signatures',
                    'resource_type' => 'image',
                ]
            );
            // Guarda el public_id
            $repair_order->signature = $result['secure_url'];
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
        // Manejar diferentes formatos de entrada
        $imagePaths = [];
        
        foreach ($images as $image) {
            // Si es un array con 'url' o 'path'
            if (is_array($image)) {
                $path = $image['url'] ?? $image['path'] ?? null;
                if ($path) {
                    $imagePaths[] = $path;
                }
            } 
            // Si es un string directo
            else if (is_string($image)) {
                $imagePaths[] = $image;
            }
        }

        // Restaurar o crear solo las imágenes que vienen en el array de imágenes
        foreach ($imagePaths as $imagePath) {
            $obj_image = Image::withTrashed()
            ->where('repair_order_id', $repair_order->id)
            ->where('path', $imagePath)
            ->first();
            if ($obj_image) {
                // Si la imagen existe en "papelera", restaurarla
                $obj_image->restore();
            } else {
                // Si no existe, crear una nueva imagen
                $repair_order->images()->create([
                    'path' => $imagePath
                ]);
            }
        }

        // Eliminar solo las imágenes que NO están en el array de imágenes (sin tocar las que vienen en $imagePaths)
        $repair_order->images()
        ->whereNotIn('path', $imagePaths)
        ->delete();
    }

    public function diagnose($attributes){
        $repair_order=RepairOrder::find($attributes['id']);
        // Calcular totales
        $subtotalServices = collect($attributes['services'])->sum('price');
        $subtotalArticles = collect($attributes['articles'])->sum(function ($article) {
            return $article['quantity'] * $article['price'];
        });

        $repair_order->status=$attributes['status'];
        $repair_order->subtotal_services=$subtotalServices;
        $repair_order->subtotal_articles=$subtotalArticles;
        $repair_order->total=$subtotalServices + $subtotalArticles;
        if (!$repair_order) {
            return response()->json(['error' => 'Repair order not found'], 404);
        }
        foreach($attributes['services'] as $service){
            $services[$service['id']] = [
                'observations' => $service['observations'],
                'price' => $service['price'],
            ];
            // Sincroniza los servicios (agrega, actualiza, elimina)
            $repair_order->services()->sync($services);
        }

        foreach($attributes['articles'] as $article){
            $articles[$article['id']] = [
                'quantity' => $article['quantity'],
                'price' => $article['price'],
            ];
            // Sincroniza los servicios (agrega, actualiza, elimina)
            $repair_order->articles()->sync($articles);
        }
        $repair_order->save();
    }
}
?>
