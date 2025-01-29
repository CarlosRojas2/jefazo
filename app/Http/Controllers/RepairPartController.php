<?php
namespace App\Http\Controllers;

use App\Models\RepairPart;
use App\Services\DataTable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RepairPartController extends Controller{
    public function index(){
        return Inertia::render("Managements/RepairParts/Index");
    }

    public function store(Request $request){
        $repair_part = RepairPart::find($request->id);
        if(is_null($repair_part)){
            $repair_part=new RepairPart();
        }
        $repair_part->fill( $request->all());
        $repair_part->save();
        return redirect()->route("repair_parts.index");
    }

    public function show(RepairPart $repair_part){
        return response()->json($repair_part);
    }

    public function list(Request $request){
        $grid=new DataTable($request);
        $grid->of(RepairPart::selectRaw("id,description")
        ->orderByDesc('id'));
        $result=$grid->json();
        return response()->json($result);
    }
}
