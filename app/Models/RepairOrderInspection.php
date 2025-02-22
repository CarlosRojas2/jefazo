<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class RepairOrderInspection extends Model{
    use HasFactory;
    protected $table = 'repair_order_inspections'; // Nombre de la tabla
    protected $fillable = [
        'repair_order_id',
        'vehicle_part_id',
        'status',
        'observations',
    ];
    protected $casts = [
        'status' => 'string', // El enum se maneja como string en Laravel
    ];

    public function repairOrder(){
        return $this->belongsTo(RepairOrder::class);
    }

    public function vehiclePart(){
        return $this->belongsTo(VehiclePart::class);
    }
}
