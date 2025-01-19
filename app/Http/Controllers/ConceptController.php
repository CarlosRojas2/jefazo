<?php
namespace App\Http\Controllers;

use App\Models\Concept;
use App\Services\DataTable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConceptController extends Controller{
    public function index(){
        return Inertia::render("Managements/Concepts/Index");
    }

    public function store(Request $request){
        $concept = Concept::find($request->id);
        if(is_null($concept)){
            $concept=new Concept();
        }
        $concept->fill( $request->all());
        $concept->save();
        return redirect()->route("concepts.index");
    }

    public function show(Concept $concept){
        return response()->json($concept);
    }

    public function list(Request $request){
        $grid=new DataTable($request);
        $grid->of(Concept::selectRaw("id,description")
        ->orderByDesc('id'));
        $result=$grid->json();
        return response()->json($result);
    }
}
