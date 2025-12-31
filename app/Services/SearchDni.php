<?php
namespace App\Services;
use Illuminate\Support\Facades\Http;
class SearchDni{
    protected $gender;
    protected $birth;
    protected $address;
    protected $city;
    protected $full_name; //Nombre Completo
    protected $last_name; //Apellido Paterno
    protected $maternal_surname; //Apellido Materno
    protected $dni;
    protected $error=null;
    protected $name;

    public function get($dni){
        $this->dni=$dni;
        $this->reset();
        $this->sendApisNetPe();
        return $this;
    }

    private function sendApisNetPe() {
        $apiToken = 'apis-token-2141.QpXipJ6cMUTUArHM3XKUNWkCHhcrrp1l';
        $response = Http::asJson()->asForm()
            ->withHeaders([
                'Referer' => 'http://apis.net.pe/consulta-dni-api',
                'Authorization: Bearer ' . $apiToken,
            ])->get('https://api.apis.net.pe/v1/dni?numero=' . $this->dni);
        if ($response->successful()) {
            $data = $response->json();
            $this->full_name = $data['nombres'];
            $this->last_name = $data['apellidoPaterno'];
            $this->maternal_surname = $data['apellidoMaterno'];
            $this->name = $data['nombres'] . ' ' . $response['apellidoPaterno'] . ' ' . $response['apellidoMaterno'];
            return $this;
        }
        if (!$response->ok()) {
            $this->error = 'Número de DNI no valido';
            return $this;
        }
        $this->error = 'Error al consumir servicio';
        return $this;
    }

    private function reset() {
        $this->name = '';
        $this->full_name = '';
        $this->last_name = '';
        $this->maternal_surname = '';
        $this->gender = '';
        $this->birth = '';
        $this->address = '';
        $this->error = null;
    }

    public function toArray(){
        return [
            'full_name' => $this->full_name,
            'last_name' => $this->last_name,
            'maternal_surname' => $this->maternal_surname,
            'name' => $this->name,
            'gender' => $this->gender,
            'birth' => $this->birth,
            'address' => $this->address,
            'city' => $this->city
        ];
    }
    public function getError(){
        return $this->error;
    }


}
