<?php
namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller{
    public function index(){
        return Inertia::render("Managements/Customers/Index");
    }

    public function store(Request $request){}

    public function show(Customer $customer){
        return response()->json($customer);
    }

    public function list(Request $request){
        
    }
}
