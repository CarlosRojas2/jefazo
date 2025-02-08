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
        'observations',
        'status'
    ];

    public function images(){
        return $this->hasMany(Image::class);
    }

    public function services(){
        return $this->belongsToMany(Service::class, 'repair_order_services')
        ->withPivot('observations')
        ->withTimestamps();
    }

    public function parts(){
        return $this->belongsToMany(RepairPart::class, 'repair_order_parts')
        ->withPivot('quantity')
        ->withTimestamps();
    }

    public function customer(){
        return $this->belongsTo(Customer::class);
    }

    public function vehicle(){
        return $this->belongsTo(Vehicle::class);
    }
}
