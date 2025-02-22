<?php
namespace App\Http\Controllers;
use App\Models\VehiclePart;
use App\Services\DataTable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
class VehiclePartController extends Controller{
    public function index(){
        return Inertia::render("Managements/VehicleParts/Index");
    }

    public function store(Request $request){
        $vehicle_part = VehiclePart::find($request->id);
        if(is_null($vehicle_part)){
            $vehicle_part=new VehiclePart();
        }
        $vehicle_part->fill( $request->all());
        $vehicle_part->save();
        return redirect()->route("vehicle_parts.index");
    }

    public function show(VehiclePart $vehicle_part){
        return response()->json($vehicle_part);
    }

    public function list(Request $request){
        $grid=new DataTable($request);
        $grid->of(VehiclePart::selectRaw("id,description")
        ->orderByDesc('id'));
        $result=$grid->json();
        return response()->json($result);
    }

    public function autocomplete(Request $request){
        $search='%'.Str::upper($request->input('search')).'%';
        $id = $request->id;
        $records=VehiclePart::select('id','description')
        ->where(function($query) use($id,$search){
            if($id){
                $query->where('id',$id);
            }else{
                $query->whereRaw("trim(description) ilike ?", [$search]);
            }
        })
        ->limit(12)
        ->get();
        return response()->json($records);
    }

    public function destroy(VehiclePart $vehicle_part){
        $vehicle_part->delete();
        return response()->json([
            'success' => true,
            'message' => 'pieza de vehículo eliminado correctamente.'
        ]);
    }
}
