<?php
namespace App\Actions\Pdfs;

use App\Models\RepairOrder;
use App\Traits\functionsTrait;
use App\Services\CustomPdf as Pdf;
use Illuminate\Support\Facades\Storage;

class PDFR extends Pdf {
    use FunctionsTrait;
    function Footer($mostrar=true){
        if($mostrar){
            // Pie de página
            $this->SetFont('Arial','',7);
            $this->SetY(-19.7);
            $this->Ln(4);
            // $this->Cell(0, 5, getConvertFecha().' '.date("h:i:s a").' ', 0,  'R', 0);
            //Para el paginado
            $this->SetFont('Arial','I',8);
            $this->SetFont('Arial','',18);
            $this->SetTextColor(128);
            $this->Text(7, 279, '_______________________________________________________');
            $this->SetFont('Arial','',8);
            $this->SetTextColor(128);
            $this->Ln(4);
            $this->Cell(0,5,$this->decodeUtf8('Página ').$this->PageNo().' ',0,0,'R');
        }
    }
}

class RepairOrderPrintAction{
    use functionsTrait;
    public function execute($id){
        // Datos de ejemplo
        $order=RepairOrder::findOrFail($id);
        ob_get_clean();
        $pdf = new PDFR('P','mm','A4');
        #Establecemos los margenes y el encabezado HEADER
        $pdf->SetMargins(10,15,12);
        $pdf->SetAutoPageBreak(true, 22);
        $pdf->SetTitle($this->decodeUtf8($order->correlative));
        $pdf->AddPage();
        $pdf->SetDrawColor(149,165,166 ); // COLOR DEL LINEA DE LOS CUADROS
        #mostramos el logo, si existe!
        $logo = public_path('storage/logo/logo.jpg');
        if(file_exists($logo) && is_file($logo) && is_readable($logo)){
            $pdf->Image($logo, 6, 4, 40, 0,'JPG');
        }

        $pdf->SetFont('Arial','B',10.2);
        $pdf->SetTextColor(233,41,14);
        #Razon social
        $pdf->SetXY(39, 7);
        $pdf->SetMargins(39,15,12);
        $pdf->SetTextColor(0,0,0);
        $pdf->SetWidths(array(95));

        //STAR PARA MOSTRAR DATOS DE EMPRESA O SUCURSAL
        $pdf->Row(array($this->decodeUtf8('JEFAZO MOTOSERVIS')),array("C"),'N','Y',array(0),4);
        $info_direccion = 'direccion';
        $info_telefonos = '937122245';
        $info_email = 'jefazo@gmail.com';
        $info_objeto_negocio = 'GRTH YT JYTUIK Y MTUY UIKJ YTUMJN JYUT KYUI KM UYKUY IKMHTKMJ U6I KYTR UYJI IYT KUYT JHJ YY5TIJK';

        //END PARA MOSTRAR DATOS DE EMPRESA O SUCURSAL

        #Direccion, telefonos y correo
        $pdf->Ln(0.5);
        $pdf->SetFont('Arial','',6.4);
        $pdf->SetWidths(array(95));

        $pdf->Row(array($this->decodeUtf8($info_direccion)),array("C"),'N','Y',array(0),2.6);
        $pdf->Row(array($this->decodeUtf8('Telf. '.$info_telefonos)),array("C"),'N','Y',array(0),3.2);
        $pdf->Row(array($this->decodeUtf8('E-mail: '.$info_email)),array("C"),'N','Y',array(0),2.8);

        #Objeto Negocio
        $pdf->Ln(1.3);
        $pdf->SetTextColor(38,38,38);
        $pdf->SetFont('Arial','',6.3);
        $pdf->SetWidths(array(95));
        $pdf->Row(array($this->decodeUtf8($info_objeto_negocio)),array("C"),'N','Y',array(0),3);
        #CUADRO DEL NRO DE FACTURA
        $pdf->SetLineWidth(0.1);
        $pdf->RoundedRect(144, 11, 58, 17, 0.5, 'B');

        #Datos del comprobante
        $pdf->SetXY(144, 14);
        $pdf->SetFillColor(254,255,240);
        $pdf->SetTextColor(0,0,0);
        $pdf->SetFont('Helvetica','B',8.3);
        $pdf->SetWidths(array(56));
        $pdf->Row(array($this->decodeUtf8('R.U.C. N° 20611473002')),array("C"),'N','Y',array(0),3);
        $pdf->SetXY(144, 18.6);
        $pdf->SetWidths(array(56));
        $pdf->Row(array($this->decodeUtf8('INFORME TÉCNICO')),array("C"),'N','Y',array(0),3);
        $pdf->SetXY(144, 23);
        $pdf->SetTextColor(255,36,0);
        $pdf->SetWidths(array(56));
        $pdf->Row(array($this->decodeUtf8('N° '.$order->correlative)),array("C"),'N','Y',array(0),3);
        $pdf->SetTextColor(0,0,0);
        //END

        $pdf->SetFont('Helvetica','',8.3);
        $pdf->Text(153, 36, 'FECHA : ');
        $pdf->SetFont('Helvetica','B',8.3);
        $pdf->Text(169, 36, $order->entry_date_time);

        #DATOS DEL CLIENTE
        $pdf->SetXY(7, 35);
        $pdf->SetMargins(7,15,12);
        $pdf->Ln(1);
        $pdf->SetFont('arial','',8);
        $html = 'CLIENTE  : <b>'.$order->customer->full_names.'</b><br>';
        $html.= 'DIRECCIÓN  : <b>'.$order->customer->address.'</b><br>';
        $html.= 'VEHÍCULO   :  <b>'.$order->vehicle->brand.' - '.$order->vehicle->model.' - '.$order->vehicle->color.'</b>         Placa : <b>'.$order->vehicle->plate.'</b><br><br>';
        $pdf->HtmlWrite($this->decodeUtf8($html),3.5);
        //END

        #Cotizacion de precios
        $pdf->Ln(3);
        $pdf->SetFont('arial','B',10);
        $pdf->Cell(180, 6, $this->decodeUtf8('Servicios realizados'),0,1,'C',false);
        $pdf->SetFont('arial','',7.5);
        $pdf->Ln(0.5);
        //END
        $pdf->SetTextColor(0,0,0);
        $pdf->SetFont('Helvetica','',12);
        //THEAD DE LA PROFORMA
        $pdf->SetFillColor(245,245,245);//COLOR DE LA LO HEADS
        //$this->SetFillColor(255,231,186);
        $pdf->SetFont('arial','B',7);
        $pdf->Cell(9, 5, $this->decodeUtf8('ITEM'), 1,0, 'C', true);
        $pdf->Cell(80, 5, $this->decodeUtf8('SERVICIO.'), 1, 0, 'C', true);
        $pdf->Cell(106, 5, $this->decodeUtf8('OBSERVACIONES '), 1,0 ,'C', true);
        $pdf->SetFont('Helvetica','',7.8);
        $pdf->Ln(6);
        foreach ($order->services as $k => $value) {
            $pdf->SetWidths(array(9, 80, 106));
            $pdf->Row(array(str_pad(($k+1),2,'0',0),
                $this->decodeUtf8($value->description),
                $this->decodeUtf8($value->pivot->observations)
            ),array('C','L','L'),1,'Y',array(0),3);

            $pdf->Ln(1.1);
        }

        #Cotizacion de precios
        $pdf->Ln(3);
        $pdf->SetFont('arial','B',10);
        $pdf->Cell(180, 6, $this->decodeUtf8('Partes de reparación'),0,1,'C',false);
        $pdf->SetFont('arial','',7.5);
        $pdf->Ln(0.5);
        //END
        $pdf->SetTextColor(0,0,0);
        $pdf->SetFont('Helvetica','',12);
        //THEAD DE LA PROFORMA
        $pdf->SetFillColor(245,245,245);//COLOR DE LA LO HEADS
        //$this->SetFillColor(255,231,186);
        $pdf->SetFont('arial','B',7);
        $pdf->Cell(9, 5, $this->decodeUtf8('ITEM'), 1,0, 'C', true);
        $pdf->Cell(165, 5, $this->decodeUtf8('PRODUCTO.'), 1, 0, 'C', true);
        $pdf->Cell(21, 5, $this->decodeUtf8('CANTIDAD '), 1,0 ,'C', true);
        $pdf->SetFont('Helvetica','',7.8);
        $pdf->Ln(6);
        foreach ($order->parts as $k => $value) {
            $pdf->SetWidths(array(9, 165, 21));
            $pdf->Row(array(str_pad(($k+1),2,'0',0),
                $this->decodeUtf8($value->description),
                $this->decodeUtf8($value->pivot->quantity)
            ),array('C','L','C'),1,'Y',array(0),3);

            $pdf->Ln(1.1);
        }
        $pdf->Ln(3);
        $pdf->SetWidths(array(20,60));
        $pdf->Row(array($this->decodeUtf8("ASESOR : "),$this->decodeUtf8(strtok('$this->proforma->seller->nombres', " "))),array("L","L"),0,'Y',array(0),3);
        $pdf->Ln(1);
        $pdf->Output('name123','I');
    }
}
?>
