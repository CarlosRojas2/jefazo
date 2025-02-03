<?php
namespace App\Http\Controllers;
use App\Models\Customer;
use Inertia\Inertia;
class HomeController extends Controller{
    public function index(){
        return Inertia::render('Dashboard',[
            'customers'=>Customer::count()
        ]);
    }
}
