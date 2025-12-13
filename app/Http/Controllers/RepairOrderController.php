<?php
namespace App\Http\Controllers;

use App\Actions\Pdfs\RepairOrderMpdfAction;
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
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
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

    /**
     * Upload - ADAPTADO PARA CLOUDINARY
     */
    public function upload(Request $request){
        $request->validate([
            'vehicle' => 'required',
            'images' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        $vehicle = Vehicle::findOrFail($request->vehicle);
        $directory = 'annexes/' . $vehicle->plate; // Cloudinary usa folders
        $image = $request->file('images');
        
        try {
            // Subir a Cloudinary
            $uploaded = Cloudinary::upload($image->getRealPath(), [
                'folder' => $directory,
                'resource_type' => 'image',
                'quality' => 'auto',
                'fetch_format' => 'auto'
            ]);
            
            // Retornar la URL segura de Cloudinary
            return $uploaded->getSecurePath();
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al subir imagen: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Revert - ADAPTADO PARA CLOUDINARY
     */
    public function revert(Request $request){
        try {
            // FilePond envía el path (URL de Cloudinary) como texto plano
            $url = $request->getContent();
            
            // Limpiar la URL
            $url = trim($url);
            $url = trim($url, '"\'');
            
            if (empty($url)) {
                return response()->json(['error' => 'URL no proporcionada'], 400);
            }
            
            // Extraer el public_id de la URL de Cloudinary
            $publicId = $this->extractPublicIdFromUrl($url);
            
            if ($publicId) {
                // Eliminar de Cloudinary
                Cloudinary::destroy($publicId);
            }
            
            // Eliminar el registro de la base de datos si existe
            $image = Image::where('path', $url)->first();
            if ($image) {
                $image->delete();
            }
            
            return response('', 200);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar la imagen'], 500);
        }
    }

    /**
     * Delete Image - ADAPTADO PARA CLOUDINARY
     */
    public function deleteImage(Request $request){
        $request->validate([
            'filename' => 'required|string',
        ]);
        
        try {
            // Si filename es una URL completa de Cloudinary
            if (filter_var($request->filename, FILTER_VALIDATE_URL)) {
                $publicId = $this->extractPublicIdFromUrl($request->filename);
            } else {
                // Si es solo el path (formato antiguo)
                $publicId = 'annexes/' . $request->filename;
            }
            
            if ($publicId) {
                Cloudinary::destroy($publicId);
            }
            
            return response()->json(['status' => 'ok']);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar imagen'], 500);
        }
    }

    /**
     * Extraer public_id de una URL de Cloudinary
     * Ejemplo URL: https://res.cloudinary.com/cloud_name/image/upload/v123456/annexes/ABC123/image.jpg
     * Public ID: annexes/ABC123/image
     */
    private function extractPublicIdFromUrl(string $url): ?string{
        // Remover el dominio y obtener solo el path
        $pattern = '/\/upload\/(?:v\d+\/)?(.+)\.\w+$/';
        
        if (preg_match($pattern, $url, $matches)) {
            return $matches[1];
        }
        
        return null;
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
        $vehicleParts = VehiclePart::all();
        $existingInspections = RepairOrderInspection::where('repair_order_id', $request->repair_order_id)
        ->pluck('id', 'vehicle_part_id');
        
        foreach ($vehicleParts as $part) {
            if (!isset($existingInspections[$part->id])) {
                RepairOrderInspection::create([
                    'repair_order_id' => $request->repair_order_id,
                    'vehicle_part_id' => $part->id,
                    'status' => 'good',
                    'observations' => '...',
                ]);
            } else {
                foreach ($request->inspections as $inspection) {
                    if ($inspection['vehicle_part_id'] == $part->id) {
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