<?php
namespace App\Actions\Pdfs;

use App\Models\RepairOrder;
use App\Traits\FunctionsTrait;
use App\Services\CustomPdf as Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class PDFR extends Pdf {
    use FunctionsTrait;
    
    function Footer($mostrar=true){
        if($mostrar){
            $this->SetY(-22);
            
            // Línea superior decorativa
            $this->SetDrawColor(52, 73, 94);
            $this->SetLineWidth(0.5);
            $this->Line(10, $this->GetY(), 200, $this->GetY());
            
            $this->Ln(2);
            $this->SetFont('Arial', '', 7);
            $this->SetTextColor(100, 100, 100);
            
            // Información del footer en 3 columnas
            $this->Cell(63, 4, $this->decodeUtf8('www.jefazomotoservis.com'), 0, 0, 'L');
            $this->Cell(64, 4, $this->decodeUtf8('Telf: 937122245'), 0, 0, 'C');
            $this->Cell(63, 4, $this->decodeUtf8('Página ') . $this->PageNo(), 0, 0, 'R');
            
            $this->Ln(3);
            $this->SetFont('Arial', 'I', 6);
            $this->Cell(0, 3, $this->decodeUtf8('Documento generado el: ' . date('d/m/Y H:i:s')), 0, 0, 'C');
        }
    }
    
    // Función para texto rotado (marca de agua)
    function RotatedText($x, $y, $txt, $angle) {
        $this->Rotate($angle, $x, $y);
        $this->Text($x, $y, $txt);
        $this->Rotate(0);
    }
    
    function Rotate($angle, $x=-1, $y=-1) {
        if($x==-1) $x=$this->x;
        if($y==-1) $y=$this->y;
        if($this->angle!=0) $this->_out('Q');
        $this->angle=$angle;
        if($angle!=0) {
            $angle*=M_PI/180;
            $c=cos($angle);
            $s=sin($angle);
            $cx=$x*$this->k;
            $cy=($this->h-$y)*$this->k;
            $this->_out(sprintf('q %.5F %.5F %.5F %.5F %.2F %.2F cm 1 0 0 1 %.2F %.2F cm',$c,$s,-$s,$c,$cx,$cy,-$cx,-$cy));
        }
    }
    
    function _endpage() {
        if($this->angle!=0) {
            $this->angle=0;
            $this->_out('Q');
        }
        parent::_endpage();
    }
}

class RepairOrderPrintAction{
    use functionsTrait;
    
    public function execute($id){
        $order = RepairOrder::findOrFail($id);
        ob_get_clean();
        
        $pdf = new PDFR('P','mm','A4');
        $pdf->SetMargins(10,15,12);
        $pdf->SetAutoPageBreak(true, 25);
        $pdf->SetTitle($this->decodeUtf8($order->correlative));
        $pdf->AddPage();
        $pdf->SetDrawColor(149,165,166);
        
        // ============ ENCABEZADO PROFESIONAL ============
        // Fondo azul para header
        $pdf->SetFillColor(41, 128, 185);
        $pdf->Rect(0, 0, 210, 35, 'F');
        
        // Contenedor blanco para logo
        $logo = public_path('storage/logo/logo.jpg');
        if(file_exists($logo) && is_file($logo) && is_readable($logo)){
            $pdf->SetFillColor(255, 255, 255);
            $pdf->RoundedRect(8, 6, 35, 24, 2, 'F');
            $pdf->Image($logo, 10, 8, 30, 0,'JPG');
        }
        
        // Información de la empresa
        $pdf->SetFont('Arial','B',11);
        $pdf->SetTextColor(255, 255, 255);
        $pdf->SetXY(45, 8);
        $pdf->Cell(90, 5, $this->decodeUtf8('JEFAZO MOTOSERVIS'), 0, 1, 'L');
        
        $pdf->SetFont('Arial','',7);
        $pdf->SetXY(45, 14);
        $pdf->Cell(90, 3, $this->decodeUtf8('Dirección de la empresa'), 0, 1, 'L');
        $pdf->SetXY(45, 17.5);
        $pdf->Cell(90, 3, $this->decodeUtf8('Telf: 937122245 | Email: jefazo@gmail.com'), 0, 1, 'L');
        
        // Cuadro de información del documento
        $pdf->SetFillColor(255, 255, 255);
        $pdf->RoundedRect(145, 6, 57, 24, 2, 'DF');
        
        $pdf->SetTextColor(52, 73, 94);
        $pdf->SetFont('Helvetica','B',8);
        $pdf->SetXY(145, 9);
        $pdf->Cell(57, 4, $this->decodeUtf8('R.U.C. N° 20611473002'), 0, 1, 'C');
        
        $pdf->SetFont('Helvetica','B',9);
        $pdf->SetXY(145, 14);
        $pdf->Cell(57, 4, $this->decodeUtf8('INFORME TÉCNICO'), 0, 1, 'C');
        
        $pdf->SetTextColor(231, 76, 60);
        $pdf->SetFont('Helvetica','B',10);
        $pdf->SetXY(145, 19);
        $pdf->Cell(57, 4, $this->decodeUtf8('N° '.$order->correlative), 0, 1, 'C');
        
        $pdf->SetTextColor(0, 0, 0);
        $pdf->SetFont('Helvetica','',7);
        $pdf->SetXY(145, 25);
        $pdf->Cell(57, 3, $this->decodeUtf8('Fecha: ' . Carbon::parse($order->entry_date_time)->format('d/m/Y H:i')), 0, 1, 'C');
        
        // ============ INFORMACIÓN DEL CLIENTE ============
        $pdf->SetY(38);
        $pdf->SetFillColor(236, 240, 241);
        $pdf->RoundedRect(7, 38, 138, 26, 1.5, 'F');
        
        $pdf->SetXY(7, 39);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->SetTextColor(52, 73, 94);
        $pdf->Cell(138, 5, $this->decodeUtf8('INFORMACIÓN DEL CLIENTE'), 0, 1, 'L');
        
        $pdf->SetFont('Arial', '', 8);
        $pdf->SetTextColor(0, 0, 0);
        
        $pdf->SetX(9);
        $pdf->Cell(25, 5, $this->decodeUtf8('Cliente:'), 0, 0, 'L');
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(110, 5, $this->decodeUtf8($order->customer->full_names), 0, 1, 'L');
        
        $pdf->SetFont('Arial', '', 8);
        $pdf->SetX(9);
        $pdf->Cell(25, 5, $this->decodeUtf8('Dirección:'), 0, 0, 'L');
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(110, 5, $this->decodeUtf8($order->customer->address), 0, 1, 'L');
        
        $pdf->SetFont('Arial', '', 8);
        $pdf->SetX(9);
        $pdf->Cell(25, 5, $this->decodeUtf8('Vehículo:'), 0, 0, 'L');
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(110, 5, $this->decodeUtf8($order->vehicle->brand.' - '.$order->vehicle->model.' - '.$order->vehicle->color), 0, 1, 'L');
        
        // ============ RESUMEN DEL VEHÍCULO ============
        $pdf->SetFillColor(236, 240, 241);
        $pdf->RoundedRect(147, 38, 55, 26, 1.5, 'F');
        
        $pdf->SetXY(147, 39);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->SetTextColor(52, 73, 94);
        $pdf->Cell(55, 5, $this->decodeUtf8('DATOS DEL VEHÍCULO'), 0, 1, 'C');
        
        $pdf->SetFont('Arial', '', 8);
        $pdf->SetTextColor(0, 0, 0);
        $pdf->SetX(149);
        $pdf->Cell(20, 5, $this->decodeUtf8('Placa:'), 0, 0, 'L');
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(31, 5, $this->decodeUtf8($order->vehicle->plate), 0, 1, 'R');
        
        $pdf->SetFont('Arial', '', 8);
        $pdf->SetX(149);
        $pdf->Cell(20, 5, $this->decodeUtf8('Ingreso:'), 0, 0, 'L');
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(31, 5, Carbon::parse($order->entry_date_time)->format('d/m/Y'), 0, 1, 'R');
        
        // ============ SERVICIOS REALIZADOS ============
        $pdf->Ln(5);
        $pdf->SetFont('arial','B',10);
        $pdf->SetTextColor(52, 73, 94);
        $pdf->Cell(195, 6, $this->decodeUtf8('SERVICIOS REALIZADOS'),0,1,'C',false);
        $pdf->Ln(1);
        
        // Header de tabla con fondo oscuro
        $pdf->SetFillColor(52, 73, 94);
        $pdf->SetTextColor(255, 255, 255);
        $pdf->SetFont('arial','B',8);
        $pdf->Cell(9, 6, $this->decodeUtf8('ITEM'), 1, 0, 'C', true);
        $pdf->Cell(80, 6, $this->decodeUtf8('SERVICIO'), 1, 0, 'C', true);
        $pdf->Cell(106, 6, $this->decodeUtf8('OBSERVACIONES'), 1, 1, 'C', true);
        
        // Contenido con filas alternadas
        $pdf->SetFont('Helvetica','',8);
        $pdf->SetTextColor(0, 0, 0);
        
        foreach ($order->services as $k => $value) {
            $fill = ($k % 2 == 0);
            $pdf->SetFillColor($fill ? 245 : 255, $fill ? 245 : 255, $fill ? 245 : 255);
            
            $pdf->SetWidths(array(9, 80, 106));
            $pdf->Row(
                array(
                    str_pad(($k+1), 2, '0', 0),
                    $this->decodeUtf8($value->description),
                    $this->decodeUtf8($value->pivot->observations)
                ),
                array('C','L','L'),
                1,
                'Y',
                array($fill ? 1 : 0, $fill ? 1 : 0, $fill ? 1 : 0),
                3
            );
        }
        
        // ============ PARTES DE REPARACIÓN ============
        $pdf->Ln(5);
        $pdf->SetFont('arial','B',10);
        $pdf->SetTextColor(52, 73, 94);
        $pdf->Cell(195, 6, $this->decodeUtf8('PARTES DE REPARACIÓN'),0,1,'C',false);
        $pdf->Ln(1);
        
        $pdf->SetFillColor(52, 73, 94);
        $pdf->SetTextColor(255, 255, 255);
        $pdf->SetFont('arial','B',8);
        $pdf->Cell(9, 6, $this->decodeUtf8('ITEM'), 1, 0, 'C', true);
        $pdf->Cell(165, 6, $this->decodeUtf8('PRODUCTO'), 1, 0, 'C', true);
        $pdf->Cell(21, 6, $this->decodeUtf8('CANTIDAD'), 1, 1, 'C', true);
        
        $pdf->SetFont('Helvetica','',8);
        $pdf->SetTextColor(0, 0, 0);
        
        foreach ($order->articles as $k => $value) {
            $fill = ($k % 2 == 0);
            $pdf->SetFillColor($fill ? 245 : 255, $fill ? 245 : 255, $fill ? 245 : 255);
            
            $pdf->SetWidths(array(9, 165, 21));
            $pdf->Row(
                array(
                    str_pad(($k+1), 2, '0', 0),
                    $this->decodeUtf8($value->description),
                    $this->decodeUtf8($value->pivot->quantity)
                ),
                array('C','L','C'),
                1,
                'Y',
                array($fill ? 1 : 0, $fill ? 1 : 0, $fill ? 1 : 0),
                3
            );
        }
        
        // ============ OBSERVACIONES Y REQUERIMIENTOS ============
        $pdf->Ln(4);
        $pdf->SetFillColor(255, 243, 224);
        $pdf->RoundedRect(7, $pdf->GetY(), 195, 0, 1.5, 'F');
        
        $pdf->SetFont('Arial','B',8);
        $pdf->SetTextColor(52, 73, 94);
        $pdf->Cell(40, 5, $this->decodeUtf8('Requerimiento del cliente:'), 0, 0, 'L');
        $pdf->SetFont('Arial','',8);
        $pdf->SetTextColor(0, 0, 0);
        $pdf->MultiCell(155, 5, $this->decodeUtf8($order->problem), 0, 'L');
        
        $pdf->Ln(1);
        $pdf->SetFont('Arial','B',8);
        $pdf->SetTextColor(52, 73, 94);
        $pdf->Cell(25, 5, $this->decodeUtf8('Observaciones:'), 0, 0, 'L');
        $pdf->SetFont('Arial','',8);
        $pdf->SetTextColor(0, 0, 0);
        $pdf->MultiCell(170, 5, $this->decodeUtf8($order->observations), 0, 'L');
        
        // ============ NOTA IMPORTANTE ============
        $pdf->Ln(3);
        $pdf->SetFillColor(255, 243, 224);
        $pdf->RoundedRect(7, $pdf->GetY(), 195, 0, 1.5, 'F');
        
        $pdf->SetFont('Arial','B',8);
        $pdf->SetTextColor(231, 76, 60);
        $pdf->Cell(195, 5, $this->decodeUtf8('NOTA IMPORTANTE'), 0, 1, 'L');
        
        $pdf->SetFont('Arial','',7.5);
        $pdf->SetTextColor(0, 0, 0);
        $nota = "Una vez recibida la cotización, el cliente tiene un plazo de 48 horas para confirmar o no la ejecución del trabajo. De manera similar, una vez culminado el trabajo de mantenimiento y/o reparación, el cliente tendrá el mismo plazo para pagar por el servicio, y 7 días calendario para recoger su vehículo. En caso contrario, si el cliente no cumple con el plazo estipulado para el recojo, deberá pagar un monto de S/ 3.00 por día de guardianía.";
        $pdf->MultiCell(195, 4, $this->decodeUtf8($nota), 0, 'J');
        
        // ============ FIRMAS ============
        $pdf->SetY(-70);
        $pdf->Ln(5);
        
        $firmaCliente = public_path('storage/'.$order->signature);
        $firmaTecnico = public_path('storage/'.$order->signature);
        
        // Líneas para firmas
        $pdf->SetDrawColor(52, 73, 94);
        $pdf->SetLineWidth(0.5);
        $yFirma = $pdf->GetY() + 20;
        $pdf->Line(40, $yFirma, 90, $yFirma);
        $pdf->Line(140, $yFirma, 190, $yFirma);
        
        // Imágenes de firmas
        if(file_exists($firmaCliente)) {
            $pdf->Image($firmaCliente, 45, $pdf->GetY(), 40, 18);
        }
        if(file_exists($firmaTecnico)) {
            $pdf->Image($firmaTecnico, 145, $pdf->GetY(), 40, 18);
        }
        
        $pdf->SetY($yFirma + 2);
        
        // Etiquetas de firmas
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->SetTextColor(52, 73, 94);
        $pdf->Cell(95, 5, $this->decodeUtf8('FIRMA DEL CLIENTE'), 0, 0, 'C');
        $pdf->Cell(95, 5, $this->decodeUtf8('FIRMA DEL TÉCNICO'), 0, 1, 'C');
        
        $pdf->SetFont('Arial', '', 7);
        $pdf->SetTextColor(100, 100, 100);
        $pdf->Cell(95, 4, $this->decodeUtf8($order->customer->full_names), 0, 0, 'C');
        $pdf->Cell(95, 4, $this->decodeUtf8('Técnico Responsable'), 0, 1, 'C');
        
        // ============ PÁGINA DE INSPECCIÓN ============
        $pdf->AddPage();
        
        // Banner superior
        $pdf->SetFillColor(52, 73, 94);
        $pdf->Rect(0, 10, 210, 15, 'F');
        $pdf->SetTextColor(255, 255, 255);
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->SetXY(10, 15);
        $pdf->Cell(190, 8, $this->decodeUtf8('REPORTE DE INSPECCIÓN'), 0, 1, 'C');
        
        $pdf->Ln(5);
        
        // Encabezado de tabla de inspección
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->SetFillColor(52, 73, 94);
        $pdf->SetTextColor(255, 255, 255);
        $pdf->Cell(80, 6, $this->decodeUtf8('PARTE DEL VEHÍCULO'), 1, 0, 'C', true);
        $pdf->Cell(35, 6, $this->decodeUtf8('REVISADO OK'), 1, 0, 'C', true);
        $pdf->Cell(40, 6, $this->decodeUtf8('ATENCIÓN PRÓXIMA'), 1, 0, 'C', true);
        $pdf->Cell(40, 6, $this->decodeUtf8('ATENCIÓN INMEDIATA'), 1, 1, 'C', true);
        
        // Contenido de inspección
        $pdf->SetFont('Arial', 'B', 11);
        foreach ($order->inspections as $k => $inspection) {
            $fill = ($k % 2 == 0);
            $pdf->SetFillColor($fill ? 245 : 255, $fill ? 245 : 255, $fill ? 245 : 255);
            
            $pdf->SetTextColor(0, 0, 0);
            $pdf->SetFont('Arial', '', 8);
            $pdf->Cell(80, 6, $this->decodeUtf8($inspection->vehiclePart->description), 1, 0, 'L', $fill);
            
            $pdf->SetFont('Arial', 'B', 12);
            // Estado con colores y símbolos compatibles
            if($inspection->status == 'good') {
                $pdf->SetFillColor($fill ? 200 : 220, $fill ? 240 : 250, $fill ? 200 : 220); // Verde claro
                $pdf->SetTextColor(39, 174, 96); // Verde
                $pdf->Cell(35, 6, 'X', 1, 0, 'C', true);
                $pdf->SetFillColor($fill ? 245 : 255, $fill ? 245 : 255, $fill ? 245 : 255);
                $pdf->SetTextColor(0, 0, 0);
                $pdf->Cell(40, 6, '', 1, 0, 'C', $fill);
                $pdf->Cell(40, 6, '', 1, 1, 'C', $fill);
            } elseif($inspection->status == 'needs_repair') {
                $pdf->Cell(35, 6, '', 1, 0, 'C', $fill);
                $pdf->SetFillColor($fill ? 255 : 255, $fill ? 245 : 250, $fill ? 200 : 220); // Amarillo claro
                $pdf->SetTextColor(243, 156, 18); // Naranja
                $pdf->Cell(40, 6, 'X', 1, 0, 'C', true);
                $pdf->SetFillColor($fill ? 245 : 255, $fill ? 245 : 255, $fill ? 245 : 255);
                $pdf->SetTextColor(0, 0, 0);
                $pdf->Cell(40, 6, '', 1, 1, 'C', $fill);
            } else {
                $pdf->Cell(35, 6, '', 1, 0, 'C', $fill);
                $pdf->Cell(40, 6, '', 1, 0, 'C', $fill);
                $pdf->SetFillColor($fill ? 255 : 255, $fill ? 220 : 230, $fill ? 220 : 230); // Rojo claro
                $pdf->SetTextColor(231, 76, 60); // Rojo
                $pdf->Cell(40, 6, 'X', 1, 1, 'C', true);
                $pdf->SetTextColor(0, 0, 0);
            }
        }
        
        // ============ PÁGINA DE ANEXOS FOTOGRÁFICOS ============
        if(count($order->images) > 0) {
            $pdf->AddPage();
            
            // Banner superior para anexos
            $pdf->SetFillColor(52, 73, 94);
            $pdf->Rect(0, 10, 210, 15, 'F');
            $pdf->SetTextColor(255, 255, 255);
            $pdf->SetFont('Arial', 'B', 14);
            $pdf->SetXY(10, 15);
            $pdf->Cell(190, 8, $this->decodeUtf8('ANEXOS FOTOGRÁFICOS'), 0, 1, 'C');
            
            // Grid de imágenes profesional
            $imagesPerRow = 2;
            $imageWidth = 85;
            $imageHeight = 65;
            $marginX = 15;
            $marginY = 35;
            $spacingX = 10;
            $spacingY = 15;
            
            $xPos = $marginX;
            $yPos = $marginY;
            $imageCount = 0;
            
            foreach ($order->images as $index => $image) {
                $picture = public_path('storage/' . $image->path);
                
                if (file_exists($picture) && is_file($picture) && is_readable($picture)) {
                    list($originalWidth, $originalHeight) = getimagesize($picture);
                    $aspectRatio = $originalWidth / $originalHeight;
                    
                    if ($aspectRatio > ($imageWidth / $imageHeight)) {
                        $newWidth = $imageWidth;
                        $newHeight = $imageWidth / $aspectRatio;
                    } else {
                        $newHeight = $imageHeight;
                        $newWidth = $imageHeight * $aspectRatio;
                    }
                    
                    $xOffset = ($imageWidth - $newWidth) / 2;
                    $yOffset = ($imageHeight - $newHeight) / 2;
                    
                    if ($yPos + $imageHeight + 15 > 270) {
                        $pdf->AddPage();
                        $yPos = 25;
                        $xPos = $marginX;
                        $imageCount = 0;
                    }
                    
                    // Sombra sutil
                    // $pdf->SetFillColor(220, 220, 220);
                    // $pdf->RoundedRect($xPos + 1, $yPos + 1, $imageWidth, $imageHeight + 10, 2, 'F');
                    
                    // Contenedor blanco
                    $pdf->SetFillColor(255, 255, 255);
                    $pdf->SetDrawColor(200, 200, 200);
                    $pdf->RoundedRect($xPos, $yPos, $imageWidth, $imageHeight + 10, 2, 'DF');
                    
                    // Imagen centrada
                    $pdf->Image($picture, $xPos + $xOffset, $yPos + $yOffset + 2, $newWidth, $newHeight);
                    
                    // Etiqueta superior
                    $pdf->SetFont('Arial', 'B', 7);
                    $pdf->SetTextColor(255, 255, 255);
                    $pdf->SetFillColor(52, 73, 94);
                    $pdf->SetXY($xPos + 2, $yPos + 2);
                    $pdf->Cell(28, 4, $this->decodeUtf8('Anexo ' . ($index + 1)), 0, 0, 'C', true);
                    
                    // Descripción debajo
                    $pdf->SetFont('Arial', '', 7);
                    $pdf->SetTextColor(100, 100, 100);
                    $pdf->SetXY($xPos, $yPos + $imageHeight + 3);
                    $pdf->Cell($imageWidth, 5, $this->decodeUtf8('Fecha: ' . Carbon::parse($order->entry_date_time)->format('d/m/Y')), 0, 0, 'C');
                    
                    $imageCount++;
                    if ($imageCount % $imagesPerRow == 0) {
                        $xPos = $marginX;
                        $yPos += $imageHeight + $spacingY + 10;
                    } else {
                        $xPos += $imageWidth + $spacingX;
                    }
                }
            }
        }
        
        $pdf->Output('Orden_Reparacion_'.$order->correlative.'.pdf','I');
    }
}
?>