<?php
namespace App\Http\Controllers;
use Illuminate\Support\Str;
use App\Models\Service;
use App\Services\DataTable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller{
    public function index(){
        return Inertia::render("Managements/Services/Index");
    }

    public function store(Request $request){
        $service = Service::find($request->id);
        if(is_null($service)){
            $service=new Service();
        }
        $service->fill( $request->all());
        $service->save();
        return redirect()->route("services.index");
    }

    public function show(Service $service){
        return response()->json($service);
    }

    public function list(Request $request){
        $grid=new DataTable($request);
        $grid->of(Service::selectRaw("id,description")
        ->orderByDesc('id'));
        $result=$grid->json();
        return response()->json($result);
    }

    public function autocomplete(Request $request){
        $search='%'.Str::upper($request->input('search')).'%';
        $id = $request->id;
        $records=Service::select('id','description')
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
}
