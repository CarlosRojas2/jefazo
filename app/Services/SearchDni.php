<?php
namespace App\Services;
use Illuminate\Support\Facades\Http;
class SearchDni{
    protected $dni;
    protected $error=null;
    protected $name;

    public function get($dni){
        $this->dni=$dni;
        $this->sendApisNetPe();
        return $this;
    }

    private function sendApisNetPe(){
        $apiToken='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImNhcmxlbzcwMjM0MTkzQGdtYWlsLmNvbSJ9.Z-PDlch-y55T6HwE4DeTgxjqLygi-kXUiPzpk02rKmg';
        $response=Http::asJson()
            ->asForm()
            ->withHeaders([
                // 'Referer'=>'http://apis.net.pe/consulta-dni-api',
                'Authorization: Bearer ' . $apiToken,
            ])
            ->get('https://dniruc.apisperu.com/api/v1/dni/'.$this->dni.'?token='.$apiToken);
        if($response->successful()){
            $data=$response->json();
            if($data['success']){
                $this->name=$data['nombres'].' '.$response['apellidoPaterno'].' '.$response['apellidoMaterno'];
            }else{
                $this->error = $data['message'];
            }
            return $this;
        }
        if($response->ok()==false){
            $this->error='Número de DNI no valido';
            return $this;
        }
        $this->error='Error al consumir servicio';
        return $this;
    }

    public function toArray(){
        return [
            'name'=>$this->name,
        ];
    }
    public function getError(){
        return $this->error;
    }


}
