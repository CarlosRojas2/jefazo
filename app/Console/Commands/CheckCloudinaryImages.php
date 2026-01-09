<?php

namespace App\Console\Commands;

use App\Models\Image;
use App\Models\RepairOrder;
use App\Services\CloudinaryService;
use Illuminate\Console\Command;

class CheckCloudinaryImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cloudinary:check {order_id? : ID de la orden a verificar}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica el estado de las imágenes en Cloudinary';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $orderId = $this->argument('order_id');

        if ($orderId) {
            $this->checkOrder($orderId);
        } else {
            $this->checkAllImages();
        }
    }

    /**
     * Verificar todas las imágenes
     */
    private function checkAllImages()
    {
        $images = Image::all();
        $this->info("Verificando " . count($images) . " imágenes...\n");

        $valid = 0;
        $invalid = 0;

        foreach ($images as $image) {
            $exists = CloudinaryService::imageExists($image->path);
            $status = $exists ? '✅ EXISTE' : '❌ NO EXISTE';
            $valid += $exists ? 1 : 0;
            $invalid += !$exists ? 1 : 0;

            $this->line("ID: {$image->id} | {$status}");
            $this->comment("URL: {$image->path}");
            $this->line('');
        }

        $this->info("Resumen:");
        $this->line("  ✅ Válidas: {$valid}");
        $this->line("  ❌ Inválidas: {$invalid}");
        $this->line("  📊 Total: " . count($images));
    }

    /**
     * Verificar orden específica
     */
    private function checkOrder($orderId)
    {
        $order = RepairOrder::with('images')->find($orderId);

        if (!$order) {
            $this->error("Orden {$orderId} no encontrada");
            return;
        }

        $this->info("Verificando orden #{$order->correlative}\n");

        // Verificar imágenes de orden
        if ($order->images->count() === 0) {
            $this->warn("La orden no tiene imágenes");
        } else {
            $this->line("Imágenes de la orden:");
            $valid = 0;
            $invalid = 0;

            foreach ($order->images as $image) {
                $exists = CloudinaryService::imageExists($image->path);
                $status = $exists ? '✅ EXISTE' : '❌ NO EXISTE';
                $valid += $exists ? 1 : 0;
                $invalid += !$exists ? 1 : 0;

                $this->line("  {$status} ID: {$image->id}");
                $this->comment("     {$image->path}");
            }

            $this->line('');
            $this->info("Resumen de imágenes:");
            $this->line("  ✅ Válidas: {$valid}");
            $this->line("  ❌ Inválidas: {$invalid}");
        }

        // Verificar firma
        if ($order->signature) {
            $this->line("\nVerificando firma del cliente:");
            $exists = CloudinaryService::imageExists($order->signature);
            $status = $exists ? '✅ EXISTE' : '❌ NO EXISTE';
            $this->line("  {$status}");
            $this->comment("  {$order->signature}");
        } else {
            $this->warn("La orden no tiene firma registrada");
        }

        // Resumen completo
        $this->line("\n" . str_repeat("=", 50));
        $this->info("Total de imágenes válidas: " . $order->countValidImages());
        $this->info("¿Tiene imágenes válidas?: " . ($order->hasValidImages() ? 'Sí' : 'No'));
    }
}
