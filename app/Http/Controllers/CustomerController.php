<?php
namespace App\Http\Controllers;
use Illuminate\Support\Str;
use App\Models\Customer;
use App\Services\DataTable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller{
    public function index(){
        return Inertia::render("Managements/Customers/Index");
    }

    public function store(Request $request){
        $customer=Customer::find($request->id);
        if(is_null($customer)){
            $customer = new Customer();
        }
        $customer->fill(request()->all());
        $customer->save();
        return redirect()->route("customers.index");
    }

    public function show(Customer $customer){
        return response()->json($customer);
    }

    public function list(Request $request){
        $grid=new DataTable($request);
        $grid->of(Customer::selectRaw("id,full_names,dni,phone,address")
        ->orderByDesc('id'));
        $result=$grid->json();
        return response()->json($result);
    }

    public function destroy(Customer $customer){
        $customer->delete();
        return response()->json('ok');
    }

    public function autocomplete(Request $request){
        $search='%'.Str::upper($request->input('search')).'%';
        $id = $request->id;
        $records=Customer::select('id','full_names')
        ->where(function($query) use($id,$search){
            if($id){
                $query->where('id',$id);
            }else{
                $query->whereRaw("trim(full_names) ilike ?", [$search])
                ->orWhereRaw("trim(dni) ilike ?", [$search]);
            }
        })
        ->limit(12)
        ->get();
        return response()->json($records);
    }
}
