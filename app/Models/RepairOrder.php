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
        'status',
        'signature',
        'total'
    ];

    public function images(){
        return $this->hasMany(Image::class);
    }

    public function services(){
        return $this->belongsToMany(Service::class, 'repair_order_services')
        ->withPivot('observations', 'price')
        ->withTimestamps();
    }

    public function articles(){
        return $this->belongsToMany(Article::class, 'repair_order_articles')
        ->withPivot('quantity', 'price')
        ->withTimestamps();
    }

    public function customer(){
        return $this->belongsTo(Customer::class);
    }

    public function vehicle(){
        return $this->belongsTo(Vehicle::class);
    }

    public function inspections(){
        return $this->hasMany(RepairOrderInspection::class);
    }
}
