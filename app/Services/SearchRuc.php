<?php
namespace App\Services;
use Illuminate\Support\Facades\Http;
class SearchRuc{
    protected $ruc;
    protected $error;
    protected $name;
    protected $address;
    protected $anexos;
    public function get($ruc){
        $this->ruc=$ruc;
        $this->reset();
        $this->send();
        return $this;
    }

    private function reset(){
        $this->name='';
        $this->address='';
        $this->anexos=[];
        $this->error=null;
    }

    private function send(){
        $token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImNhcmxlbzcwMjM0MTkzQGdtYWlsLmNvbSJ9.Z-PDlch-y55T6HwE4DeTgxjqLygi-kXUiPzpk02rKmg';
        $response=Http::asJson()
            ->get('https://dniruc.apisperu.com/api/v1/ruc/'.$this->ruc.'?token='.$token);
        if(!$response->successful()){
            $this->error='Error al consumir servicio';
            return $this;
        }
        $data=$response->json();
        $this->name=$data['razonSocial'];
        $this->address=$data['direccion'];
        return $this;
    }

    public function toArray(){
        return [
            'name'=>$this->name,
            'address'=>$this->address
        ];
    }

    public function getError(){
        return $this->error;
    }
}
