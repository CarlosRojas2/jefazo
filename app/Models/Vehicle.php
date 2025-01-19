<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Vehicle extends Model{
    use SoftDeletes;
    protected $fillable=[
        'customer_id',
        'brand',
        'model',
        'plate',
        'color'
    ];
    //
}
