<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Concept extends Model{
    use SoftDeletes;
    protected $fillable=["description"];
    // Mutador para convertir 'description' a mayúsculas antes de guardarlo
    public function setDescriptionAttribute($value){
        $this->attributes['description'] = strtoupper($value); // Convertir a mayúsculas
    }
}
