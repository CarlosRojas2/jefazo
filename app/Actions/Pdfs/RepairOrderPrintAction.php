<?php
namespace App\Actions\Pdfs;
use App\Traits\functionsTrait;
use FPDF;
class RepairOrderPrintAction{
    use functionsTrait;
    public function execute($id){
        // Inicia FPDF
        $pdf = new FPDF();
        $pdf->setTitle($this->decodeUtf8('Impresión de orden de reparación'));
        $pdf->AddPage('P','A4');
        $pdf->SetDrawColor(149,165,166 );
        $pdf->SetFont('Calibri','B',10.2);

        // Contenido del PDF
        $pdf->Cell(40, 10, '¡Hola desde FPDF en Laravel!');
        $pdf->Ln();
        $pdf->Cell(40, 10, 'Esto es un PDF dinámico.');

        // Enviar el PDF al navegador
        return response($pdf->Output('S'), 200)
            ->header('Content-Type', 'application/pdf');
    }
}
?>
