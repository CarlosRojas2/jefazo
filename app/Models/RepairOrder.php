<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class RepairOrder extends Model{
    protected $fillable=[
        'customer_id',
        'vehicle_id',
        'entry_date_time',
        'correlative',
        'problem',
        'observations'
    ];

    public function images(){
        return $this->hasMany(Image::class);
    }
}
