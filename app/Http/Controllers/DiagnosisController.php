<?php
namespace App\Http\Controllers;
use App\Models\Diagnosis;
use App\Services\DataTable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiagnosisController extends Controller{
    public function index(){
        return Inertia::render("Diagnoses/Index");
    }

    public function create(){
        return Inertia::render("Diagnoses/Create");
    }

    public function store(Request $request){
        $diagnosis = Diagnosis::find($request->id);
        if(is_null($diagnosis)){
            $diagnosis=new Diagnosis();
        }
        $diagnosis->fill( $request->all());
        $diagnosis->save();
        return redirect()->route("diagnoses.index");
    }

    public function show(diagnosis $diagnosis){
        return response()->json($diagnosis);
    }

    public function list(Request $request){
        $grid=new DataTable($request);
        $grid->of(Diagnosis::selectRaw("id,description")
        ->orderByDesc('id'));
        $result=$grid->json();
        return response()->json($result);
    }
}
