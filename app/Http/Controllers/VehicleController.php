<?php
namespace App\Http\Controllers;

use App\Models\RepairOrder;
use App\Models\Vehicle;
use App\Services\DataTable;
use Illuminate\Http\Request;
use Inertia\Inertia;
class VehicleController extends Controller{
    public function index(){
        return Inertia::render("Managements/Vehicles/Index");
    }

    public function store(Request $request){
        $vehicle = Vehicle::find($request->id);
        if(is_null($vehicle)){
            $vehicle=new Vehicle();
        }
        $vehicle->fill( $request->all());
        $vehicle->save();
        return redirect()->route("vehicles.index");
    }

    public function show(Vehicle $vehicle){
        return response()->json($vehicle);
    }

    public function list(Request $request){
        $grid=new DataTable($request);
        $grid->of(Vehicle::selectRaw("vehicles.id,cu.full_names as customer,brand,model,plate,color")
        ->join('customers as cu','cu.id','vehicles.customer_id')
        ->orderByDesc('vehicles.id'));
        $result=$grid->json();
        return response()->json($result);
    }

    public function destroy(Vehicle $vehicle){
        // Verificar si el vehiculo tiene ordenes asociadas
        $orderExists = RepairOrder::where('vehicle_id', $vehicle->id)->exists();
        if ($orderExists) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el vehículo porque tiene ordenes de reparación asociadas.'
            ], 400); // Código 400 para indicar error en la solicitud
        }
        // Eliminar el vehiculo
        $vehicle->delete();

        return response()->json([
            'success' => true,
            'message' => 'Vehículo eliminado correctamente.'
        ]);
    }

}
