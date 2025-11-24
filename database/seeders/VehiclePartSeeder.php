<?php
namespace Database\Seeders;
use App\Models\VehiclePart;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
class VehiclePartSeeder extends Seeder{
    public function run(): void{
        $parts=[
            'Luces de emergencia (encendido,parpadeo)',
            'Claxon (tono,volumen)',
            'Espejos',
            'Pedal freno',
            'Luces de estacionamiento',
            'Cable embrague',
            'Filtro de aire (reemplzar)',
            'Filtro de combustible (reemplazar)',
            'Filtro de aceite',
            'Cuerpo de aceleración',
            'Carburador (funcionamiento,lubricación)',
            'Bateria (nivel,capacidad)',
            'Compresión de motor',
            'Aceite de motor',
            'Motor',
            'Neumáticos (desgaste irregular,presión)',
            'Pastillas',
            'Disco de freno (desgaste,espesor,limpieza)',
            'Sistema de arrastre',
            'Aro(deformación,corrosión)',
            'Pernos de la catalina',
            'Luz posterior',
            'Freno delantero',
            'Luz delantera',
            'Bujías',
            'Luces de intermitente',
            'Barras telescópicas',
            'Pistas de dirección',
            'Pardor lateral',
            'Timón',
            'Asiento',
            'Cable de freno',
            'Freno posterior',
            'Disco de freno',
            'Bocamaza posterior',
            'Monoshock',
            'Tanque de combustible',
            'Chapa de contacto',
            'Arranque automático',
            'Amortiguadores'
        ];
        foreach($parts as $part){
            VehiclePart::create([
                'description' => $part
            ]);
        }
    }
}
