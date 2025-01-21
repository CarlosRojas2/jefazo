<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model{
    use SoftDeletes;
    protected $fillable=[
        "full_names",
        "dni",
        "phone",
        "address"
    ];

    public function vehicles(){
        return $this->hasMany(Vehicle::class);
    }
}
