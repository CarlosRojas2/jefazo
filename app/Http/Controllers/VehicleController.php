<?php
namespace App\Http\Controllers;

use App\Models\Customer;
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
        $grid->of(Vehicle::selectRaw("id,cu.full_names,brand,model,plate,color")
        ->join('customers as cu','cu.id','vehicles.customer_id')
        ->orderByDesc('id'));
        $result=$grid->json();
        return response()->json($result);
    }
}
