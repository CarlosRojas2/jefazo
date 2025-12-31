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
use Cloudinary\Api\Upload\UploadApi;
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
            'observations' => 'nullable|string'
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

    public function upload(Request $request) {
        $request->validate([
            'vehicle' => 'required',
            'images' => 'required|image|max:10240',
        ]);
        $vehicle = Vehicle::findOrFail($request->vehicle);
        $file = $request->file('images');
        // Definimos la ruta completa. Cloudinary creará las carpetas automáticamente.
        $fullPath = 'annexes/' . $vehicle->plate;
        try {
            // IMPORTANTE: store() acepta la CARPETA como primer parámetro
            // El driver de Cloudinary usará esto para crear el 'folder' en la nube
            $path = $file->store($fullPath, 'cloudinary');
            // Para obtener la URL que guardarás en la BD
            $url = Storage::disk('cloudinary')->url($path);
            return $url;
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function revert(Request $request){
        try {
            // FilePond envía el path como texto plano en el body
            $path = $request->getContent();
            
            // Limpiar el path de posibles comillas, espacios y caracteres extraños
            $path = trim($path);
            $path = trim($path, '"\'');
            
            // Verificar que el path no esté vacío
            if (empty($path)) {
                return response()->json(['error' => 'Path no proporcionado'], 400);
            }
            
            // Eliminar el archivo del disco si existe
            if (Storage::disk('cloudinary')->exists($path)) {
                Storage::disk('cloudinary')->delete($path);
            } else {
            }
            
            // Eliminar el registro de la base de datos si existe
            $image = Image::where('path', $path)->first();
            if ($image) {
                $image->delete();
            }
            
            return response('', 200); // FilePond espera respuesta vacía con código 200
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar la imagen'], 500);
        }
    }

    public function deleteImage(Request $request){
        $request->validate([
            'filename' => 'required|string',
        ]);
        $path = 'annexes/' . $request->filename;
        Storage::disk('cloudinary')->delete($path);
        return response()->json(['status' => 'ok']);
    }

    public function show($id){
        $record=RepairOrder::with(['customer','vehicle','services','articles'])->findOrFail($id);
        return Inertia::render("RepairOrders/Diagnose",[
            'repair_order'=>$record
        ]);
    }

    public function diagnose(Request $request,RepairOrderStoreAction $store){
        $validated = $request->validate([
            'id' => 'required|exists:repair_orders,id',
            'status' => 'required|in:REVISADO',
            'services' => 'required|array',
            'services.*.id' => 'required|exists:services,id',
            'services.*.price' => 'required|numeric|min:0',
            'services.*.observations' => 'nullable|string',
            'articles' => 'required|array',
            'articles.*.id' => 'required|exists:articles,id',
            'articles.*.quantity' => 'required|numeric|min:1',
            'articles.*.price' => 'required|numeric|min:0',
        ]);
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
            'articles',
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
