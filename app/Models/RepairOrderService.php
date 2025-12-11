<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class RepairOrderService extends Model{
    protected $attributes=[
        'repair_order_id',
        'service_id',
        'observations',
        'price'
    ];
}
