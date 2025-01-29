<?php
namespace App\Http\Controllers;
use App\Models\RepairOrder;
use App\Models\Vehicle;
use App\Services\DataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RepairOrderController extends Controller{
    public function index(){
        return Inertia::render("RepairOrders/Index");
    }

    public function create(){
        return Inertia::render("RepairOrders/Create");
    }

    public function edit($id){
        $record=RepairOrder::findOrFail($id);
        return Inertia::render("RepairOrders/Create",[
            'repair_order'=>$record
        ]);
    }

    public function store(Request $request){
        $repair_order = RepairOrder::find($request->id);
        if(is_null($repair_order)){
            $repair_order=new RepairOrder();
        }
        $repair_order->fill( $request->all());
        $repair_order->save();
        return redirect()->route("repair_orders.index");
    }

    public function show(RepairOrder $repair_order){
        return response()->json($repair_order);
    }

    public function list(Request $request){
        $grid=new DataTable($request);
        $grid->of(RepairOrder::selectRaw("
            repair_orders.id,
            problem,
            correlative,
            entry_date_time,
            cus.full_names as customer,
            COALESCE(CONCAT_WS(' - ', ve.plate, ve.brand, ve.color), '') as vehicle
        ")
        ->join('customers as cus', 'cus.id','repair_orders.customer_id')
        ->join('vehicles as ve', 've.id','repair_orders.vehicle_id')
        ->orderByDesc('repair_orders.id'));
        $result=$grid->json();
        return response()->json($result);
    }

    public function upload(Request $request){
        // Validar que se suban solo imágenes
        $request->validate([
            'vehicle'=>'required',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:10240', // Limitar tamaño a 2MB
        ]);
        // Guardar las imágenes
        $images = [];
        $vehicle=Vehicle::find($request->vehicle);
        $directory=$vehicle->plate;
        foreach ($request->file('images') as $image) {
            $imageName = time() . '_' . $image->getClientOriginalName();
            // Guardar las imágenes en el disco 'public/ordenes'
            $path = $image->storeAs('annexes/' . $directory, $imageName);

            // Obtener la URL pública
            $url = Storage::url($path);

            // Extraer solo la ruta relativa eliminando el dominio y el prefijo '/storage/'
            $relativePath = str_replace('http://localhost/storage/', '', $url);

            // Agregar la ruta relativa al array de imágenes
            $images[] = $relativePath;
        }
        return $images;
    }
}
