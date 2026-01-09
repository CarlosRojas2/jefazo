<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\CloudinaryService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class TestCloudinaryFolders extends Command
{
    protected $signature = 'test:cloudinary-folders';
    protected $description = 'Prueba la creación de carpetas en Cloudinary';

    public function handle()
    {
        $this->line('🧪 Pruebas de Carpetas en Cloudinary');
        $this->line('=====================================');
        $this->newLine();

        // 1. Verificar configuración
        $this->line('1️⃣ Verificando configuración de Cloudinary...');
        $config = config('filesystems.disks.cloudinary');
        
        if ($config) {
            $this->info('✅ Configuración encontrada');
            $this->line('Cloud Name: ' . config('services.cloudinary.cloud'));
        } else {
            $this->error('❌ No hay configuración de Cloudinary');
            return;
        }
        $this->newLine();

        // 2. Crear archivo de prueba
        $this->line('2️⃣ Creando archivo de prueba...');
        
        $testFileName = 'test_' . time() . '.txt';
        $testFilePath = storage_path('app/' . $testFileName);
        
        // Crear archivo temporal
        file_put_contents($testFilePath, 'Archivo de prueba para verificar carpetas en Cloudinary');
        $this->info('✅ Archivo temporal creado');
        $this->newLine();

        // 3. Crear UploadedFile
        $this->line('3️⃣ Preparando upload...');
        
        $uploadedFile = new UploadedFile(
            $testFilePath,
            $testFileName,
            'text/plain',
            null,
            true
        );
        $this->info('✅ UploadedFile preparado');
        $this->newLine();

        // 4. Prueba 1: Sin carpeta (ROOT)
        $this->line('4️⃣ Prueba 1: Subir sin carpeta (ROOT)...');
        $result1 = CloudinaryService::uploadImage($uploadedFile, 'root_test');
        
        if ($result1) {
            $this->info('✅ Subida exitosa');
            $this->line('URL: ' . $result1['url']);
            $this->line('Public ID: ' . $result1['public_id']);
            
            // Extraer carpeta del public_id
            $publicId = $result1['public_id'];
            if (strpos($publicId, '/') !== false) {
                $folder = explode('/', $publicId)[0];
                $this->info('📁 Carpeta detectada: ' . $folder);
            } else {
                $this->warn('⚠️ NO hay carpeta en public_id (está en ROOT)');
            }
        } else {
            $this->error('❌ Error en la carga');
        }
        $this->newLine();

        // 5. Prueba 2: Carpeta anidada
        $this->line('5️⃣ Prueba 2: Subir en carpeta anidada...');
        
        // Recrear archivo
        file_put_contents($testFilePath, 'Archivo de prueba 2');
        $uploadedFile2 = new UploadedFile(
            $testFilePath,
            $testFileName,
            'text/plain',
            null,
            true
        );
        
        $result2 = CloudinaryService::uploadImage($uploadedFile2, 'test_folder/subfolder');
        
        if ($result2) {
            $this->info('✅ Subida exitosa');
            $this->line('URL: ' . $result2['url']);
            $this->line('Public ID: ' . $result2['public_id']);
            
            if (strpos($result2['public_id'], 'test_folder/subfolder') !== false) {
                $this->info('✅ Carpeta anidada creada correctamente');
            } else {
                $this->warn('⚠️ La carpeta NO está en el public_id');
            }
        } else {
            $this->error('❌ Error en la carga');
        }
        $this->newLine();

        // 6. Verificar logs
        $this->line('6️⃣ Verificando logs...');
        $logFile = storage_path('logs/laravel.log');
        if (file_exists($logFile)) {
            $this->info('✅ Archivo de log existe');
            $this->line('Última línea: ' . trim(shell_exec('tail -1 ' . escapeshellarg($logFile))));
        }
        $this->newLine();

        // 7. Limpieza
        $this->line('7️⃣ Limpiando archivos temporales...');
        if (file_exists($testFilePath)) {
            unlink($testFilePath);
            $this->info('✅ Archivo temporal eliminado');
        }
        $this->newLine();

        // Resumen
        $this->line('📊 RESUMEN DE PRUEBAS');
        $this->line('====================');
        $this->line('✅ Si ves "Carpeta detectada" arriba, las carpetas se están creando correctamente');
        $this->line('❌ Si ves "NO hay carpeta", hay un problema con la configuración de Cloudinary');
        $this->newLine();

        $this->info('Revisa: https://cloudinary.com/console/media_library');
        $this->info('Deberías ver las carpetas: root_test, test_folder/subfolder');
    }
}
