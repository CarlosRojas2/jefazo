<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Services\SearchDni;
use App\Services\SearchRuc;

class WebServiceController extends Controller{
    public function searchDni($document,SearchDni $searchDni){
        $response=$searchDni->get($document);
        if($response->getError()){
            return response()->json($response->getError(),404);
        }
        return response()->json($response->toArray());
    }

    public function  searchRuc($document,SearchRuc $searchRuc){
        $response=$searchRuc->get($document);
        if($response->getError()){
            return response()->json($response->getError(),404);
        }
        return response()->json($response->toArray());
    }
}
