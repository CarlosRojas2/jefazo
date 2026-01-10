<?php
namespace App\Http\Controllers;
use App\Models\Customer;
use App\Models\RepairOrder;
use Inertia\Inertia;
class HomeController extends Controller{
    public function index(){
        // Contar órdenes por estado
        $ingresados = RepairOrder::where('status', 'INGRESADO')->count();
        $revisados = RepairOrder::where('status', 'REVISADO')->count();
        $totalOrdenes = RepairOrder::count();

        return Inertia::render('Dashboard',[
            'customers' => Customer::count(),
            'ingresados' => $ingresados,
            'revisados' => $revisados,
            'totalOrdenes' => $totalOrdenes
        ]);
    }
}

