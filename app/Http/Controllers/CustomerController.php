<?php
namespace App\Http\Controllers;
use Illuminate\Support\Str;
use App\Models\Customer;
use App\Models\RepairOrder;
use App\Models\Vehicle;
use App\Services\DataTable;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CustomerController extends Controller{
    public function index(){
        return Inertia::render("Managements/Customers/Index");
    }

    public function store(Request $request){
        $customer = null;
        // Si viene un ID, estamos editando
        if ($request->filled('id')) {
            $customer = Customer::withTrashed()->find($request->id);
        }

        // Validación
        $request->validate([
            'dni' => [
                'required',
                'string',
                Rule::unique('customers')->ignore(optional($customer)->id)->whereNull('deleted_at'),
            ],
            'full_names' => 'required|string',
            'phone'=>'required|numeric',
            'address'=>'required|string'
        ]);

        // Restaurar si fue eliminado
        if ($customer && $customer->trashed()) {
            $customer->restore();
        }

        // Crear si no existe
        if (!$customer) {
            $customer = new Customer();
        }

        $customer->fill($request->all());
        $customer->save();

        return response()->json($customer);
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
        // Verificar si el cliente tiene vehiculos asociadas
        $vehicleExists = Vehicle::where('customer_id', $customer->id)->exists();

        if ($vehicleExists) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el cliente porque tiene vehículos asociadas.'
            ], 400); // Código 400 para indicar error en la solicitud
        }

        // Eliminar el cliente
        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cliente eliminado correctamente.'
        ]);
    }

    public function autocomplete(Request $request){
        $search='%'.Str::upper($request->input('search')).'%';
        $id = $request->id;
        $records=Customer::select('id','full_names','phone','address','dni')
        ->with(['vehicles'])
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
