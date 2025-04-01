<?php
namespace App\Actions\Pdfs;

use App\Models\RepairOrder;
use App\Traits\functionsTrait;
use App\Services\CustomPdf as Pdf;
use Carbon\Carbon;
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
        $pdf->Text(169, 36, Carbon::parse($order->entry_date_time)->format('d/m/Y H:i'));

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
        $pdf->SetWidths(array(35,180));
        $pdf->Row(array($this->decodeUtf8("Requerimiento del cliente : "),$this->decodeUtf8($order->problem)),array("L","L"),0,'Y',array(0),2);
        $pdf->Ln(1);

        $pdf->SetWidths(array(25,180));
        $pdf->Row(array($this->decodeUtf8("Observaciones : "),$this->decodeUtf8($order->observations)),array("L","L"),0,'Y',array(0),2);
        $pdf->Ln(1);

        // Mover el cursor a la parte inferior del PDF
        $pdf->Ln(1);
        $pdf->SetY(-60); // Ajusta la posición vertical según necesites

        $pdf->SetWidths(array(10,180));
        $nota="Una vez recibida la cotización, el cliente tiene un plazo de 48 horas para confirmar o no la ejecición del trabajo. De manera similar, una vez culminado el trabajo de mantenimiento y/o reparación, el cliente tendrá el mismo plazo para pagar por el servicio, y 7 días calendario para recoger su vehículo. en caso contrario, si el cliente no cumple con el plazo estipulado para el recojo, deberá pagar un monto de S/ 3.00 por día de guardianía.";
        $pdf->Row(array($this->decodeUtf8("Nota : "),$this->decodeUtf8($nota)),array("L","L"),0,'Y',array(0),3);

        // Rutas de las imágenes de las firmas
        $firmaCliente = public_path('storage/'.$order->signature);
        $firmaTecnico =public_path('storage/'.$order->signature);

        // Agregar firma del Cliente
        $pdf->SetX(40); // Posiciona en X
        $pdf->Image($firmaCliente, 40, $pdf->GetY(), 50, 25); // (ruta, x, y, ancho, alto)
        $pdf->Ln(20); // Espacio entre firma e identificación
        $pdf->SetX(40);
        $pdf->Cell(50, 6, 'Firma del Cliente', 0, 0, 'C'); // Texto debajo de la firma
        // Agregar firma del Técnico
        $pdf->SetX(140);
        $pdf->Image($firmaTecnico, 140, $pdf->GetY() - 20, 50, 25); // Ajusta `y` si es necesario
        $pdf->SetX(140);
        $pdf->Cell(50, 6, $this->decodeUtf8('Firma del técnico'), 0, 0, 'C'); // Texto debajo de la firma

        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 12);

        // Título
        $pdf->Cell(190, 10, $this->decodeUtf8('Reporte de Inspección'), 0, 1, 'C');
        $pdf->Ln(5);

        // Encabezado de tabla
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(80, 5, 'Parte', 1);
        $pdf->Cell(35, 5, 'Revisado Ok', 1, 0, 'C');
        $pdf->Cell(35, 5, 'Atencion Proxima', 1, 0, 'C');
        $pdf->Cell(35, 5, 'Atencion Inmediata', 1, 1, 'C');

        // Contenido de la tabla
        $pdf->SetFont('Arial', '', 10);
        foreach ($order->inspections as $inspection) {
            $status = [
                'good' => '',
                'needs_repair' => '',
                'damaged' => ''
            ];
            $status[$inspection->status] = 'X';

            $pdf->Cell(80, 5, $this->decodeUtf8($inspection->vehiclePart->description), 1);
            $pdf->Cell(35, 5, $this->decodeUtf8($status['good']), 1, 0, 'C');
            $pdf->Cell(35, 5, $status['needs_repair'], 1, 0, 'C');
            $pdf->Cell(35, 5, $status['damaged'], 1, 1, 'C');
        }

        $pdf->Output('name123','I');
    }
}
?>
