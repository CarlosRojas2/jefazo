<?php
namespace App\Actions;
use App\Models\RepairOrder;
class RepairOrderStoreAction{
    public function execute($attributes){
        dd($attributes);
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
        foreach($images as $image){
            $repair_order->images->create([
                // 'repair_order_id'=>0,
                'path'=>$image
            ]);
        }
    }
}
?>
