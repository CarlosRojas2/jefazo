<?php
namespace App\Http\Controllers;
use App\Actions\Pdfs\RepairOrderPrintAction;
use App\Actions\RepairOrderStoreAction;
use App\Models\Image;
use App\Models\RepairOrder;
use App\Models\RepairOrderInspection;
use App\Models\Vehicle;
use App\Models\VehiclePart;
use App\Services\DataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $record=RepairOrder::findOrFail($id)->load('images');
        return Inertia::render("RepairOrders/Create",[
            'repair_order'=>$record
        ]);
    }

    public function store(Request $request,RepairOrderStoreAction $store){
        // Validación
        $request->validate([
            'customer_id' => [
                'required',
                'numeric'
            ],
            'vehicle_id' => 'required|numeric',
            'problem' => 'required|string',
        ]);
        return DB::transaction(function() use ($request,$store){
            $store->execute($request->all());
            return redirect()->route("repair_orders.index");
        });
    }

    public function list(Request $request){
        $grid=new DataTable($request);
        $grid->of(RepairOrder::selectRaw("
            repair_orders.id,
            problem,
            correlative,
            entry_date_time,
            cus.full_names as customer,
            COALESCE(CONCAT_WS(' - ', ve.plate, ve.brand, ve.color), '') as vehicle,
            status
        ")
        ->join('customers as cus', 'cus.id','repair_orders.customer_id')
        ->join('vehicles as ve', 've.id','repair_orders.vehicle_id')
        ->orderByDesc('repair_orders.id'));
        $result=$grid->json();
        return response()->json($result);
    }


    public function upload(Request $request){
        $request->validate([
            'vehicle' => 'required',
            'images' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        $vehicle = Vehicle::findOrFail($request->vehicle);
        $directory = $vehicle->plate;
        $image = $request->file('images');
        $imageName = time() . '_' . $image->getClientOriginalName();
        $path = $image->storeAs('annexes/' . $directory, $imageName,'public');

        return $path; // ← devuelve solo 1 string, no array
    }

    public function revert(Request $request){
        $request->validate([
            'path' => 'required|string',
        ]);
        $path = $request->input('path');
        // Asegúrate de eliminar el archivo del disco
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
        // Elimina o manda a papelera el registro si ya está en la BD
        $image = Image::where('path', $path)->first();
        if ($image) {
            $image->delete(); // Soft delete si tu modelo usa SoftDeletes
        }

        return response()->json(['message' => 'Imagen eliminada']);
    }

    public function deleteImage(Request $request){
        $request->validate([
            'filename' => 'required|string',
        ]);
        $path = 'annexes/' . $request->filename;
        Storage::disk('public')->delete($path);
        return response()->json(['status' => 'ok']);
    }

    public function show($id){
        $record=RepairOrder::with(['customer','vehicle','services','parts'])->findOrFail($id);
        return Inertia::render("RepairOrders/Diagnose",[
            'repair_order'=>$record
        ]);
    }

    public function diagnose(Request $request,RepairOrderStoreAction $store){
        return DB::transaction(function() use ($request,$store){
            $store->diagnose($request->all());
            return redirect()->route("repair_orders.index");
        });
    }

    public function print($id, RepairOrderPrintAction $print){
        return $print->execute($id);
    }

    public function inspection($id){
        $record=RepairOrder::with([
            'customer',
            'vehicle',
            'services',
            'parts',
            'inspections'=>function($i){
                $i->with('vehiclePart');
            }
        ])->findOrFail($id);
        return Inertia::render("RepairOrders/Inspection",[
            'repair_order'=>$record,
        ]);
    }

    public function generateInspection(Request $request){
        // Obtener todas las partes del vehículo
        $vehicleParts = VehiclePart::all();
        // Obtener inspecciones existentes de la orden de reparación
        $existingInspections = RepairOrderInspection::where('repair_order_id', $request->repair_order_id)
        ->pluck('id', 'vehicle_part_id');
        // Recorrer las partes del vehículo
        foreach ($vehicleParts as $part) {
            if (!isset($existingInspections[$part->id])) {
                // Si no existe la inspección, se crea una nueva
                RepairOrderInspection::create([
                    'repair_order_id' => $request->repair_order_id,
                    'vehicle_part_id' => $part->id,
                    'status' => 'good',
                    'observations' => '...',
                ]);
            } else {
                // Buscar si hay inspección en la petición para esta parte
                foreach ($request->inspections as $inspection) {
                    if ($inspection['vehicle_part_id'] == $part->id) {
                        // Actualizar el registro existente
                        RepairOrderInspection::where('repair_order_id', $request->repair_order_id)
                            ->where('vehicle_part_id', $part->id)
                            ->update([
                                'status' => $inspection['status'] ?? 'good',
                                'observations' => $inspection['observations'] ?? '...',
                            ]);
                    }
                }
            }
        }

    }

    public function destroy(RepairOrder $repair_order){
        $repair_order->delete();
        return response()->json([
            'success' => true,
            'message' => 'ordén de reparación eliminada correctamente.'
        ]);
    }
}
