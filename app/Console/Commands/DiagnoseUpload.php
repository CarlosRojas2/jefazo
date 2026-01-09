<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DiagnoseUpload extends Command
{
    protected $signature = 'diagnose:upload';
    protected $description = 'Diagnostica problemas con carga de imágenes';

    public function handle()
    {
        $this->line('🔍 Diagnóstico de Carga de Imágenes');
        $this->line('==================================');
        $this->newLine();

        // 1. Verificar extensión GD
        $this->line('1️⃣ Verificando extensión GD (para comprimir imágenes)...');
        if (extension_loaded('gd')) {
            $this->info('✅ GD está habilitado');
            
            // Verificar funciones específicas
            $functions = ['imagecreatefromstring', 'imagecreatetruecolor', 'imagecopyresampled', 'imagejpeg'];
            foreach ($functions as $func) {
                if (function_exists($func)) {
                    $this->info("  ✅ $func disponible");
                } else {
                    $this->error("  ❌ $func NO disponible");
                }
            }
        } else {
            $this->error('❌ GD NO está habilitado');
            $this->line('  Solución: Instalar la extensión GD');
        }
        $this->newLine();

        // 2. Verificar permisos de storage
        $this->line('2️⃣ Verificando permisos de almacenamiento...');
        $storagePath = storage_path('app');
        
        if (is_writable($storagePath)) {
            $this->info('✅ storage/app es escribible');
        } else {
            $this->error('❌ storage/app NO es escribible');
            $this->line('  Solución: chmod -R 775 storage');
        }

        $tempPath = storage_path('app/temp');
        if (!is_dir($tempPath)) {
            $this->line("  Creando directorio temp...");
            mkdir($tempPath, 0777, true);
        }

        if (is_writable($tempPath)) {
            $this->info('✅ storage/app/temp es escribible');
        } else {
            $this->error('❌ storage/app/temp NO es escribible');
        }
        $this->newLine();

        // 3. Verificar configuración de Cloudinary
        $this->line('3️⃣ Verificando configuración de Cloudinary...');
        $cloudName = config('services.cloudinary.cloud');
        $key = config('services.cloudinary.key');
        $secret = config('services.cloudinary.secret');
        
        if ($cloudName && $key && $secret) {
            $this->info('✅ Credenciales configuradas');
            $this->line("  Cloud: {$cloudName}");
            $this->line("  Key: " . substr($key, 0, 5) . '...');
        } else {
            $this->error('❌ Credenciales NO configuradas');
            $this->line('  Revisa: .env CLOUDINARY_CLOUD_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET');
        }
        $this->newLine();

        // 4. Verificar límites de PHP
        $this->line('4️⃣ Verificando límites de PHP...');
        $uploadMax = ini_get('upload_max_filesize');
        $postMax = ini_get('post_max_size');
        $memoryLimit = ini_get('memory_limit');
        $maxExecTime = ini_get('max_execution_time');
        
        $this->line("  upload_max_filesize: {$uploadMax}");
        $this->line("  post_max_size: {$postMax}");
        $this->line("  memory_limit: {$memoryLimit}");
        $this->line("  max_execution_time: {$maxExecTime}s");
        
        if ($uploadMax === '100M' || $uploadMax === '200M' || $uploadMax === '500M') {
            $this->info('  ✅ Límite de upload adecuado');
        } else {
            $this->warn('  ⚠️ Considera aumentar upload_max_filesize');
        }
        $this->newLine();

        // 5. Crear archivo de prueba
        $this->line('5️⃣ Prueba de escritura...');
        try {
            $testFile = $tempPath . '/test_' . time() . '.txt';
            file_put_contents($testFile, 'test');
            unlink($testFile);
            $this->info('✅ Escritura en storage OK');
        } catch (\Exception $e) {
            $this->error('❌ Error al escribir: ' . $e->getMessage());
        }
        $this->newLine();

        // 6. Resumen
        $this->line('📊 RESUMEN');
        $this->line('==========');
        $this->line('Si ves ❌ en algún punto:');
        $this->line('1. GD: Instala con: apt-get install php8.x-gd');
        $this->line('2. Permisos: chmod -R 775 storage bootstrap');
        $this->line('3. Cloudinary: Verifica variables de entorno');
        $this->line('4. PHP: Aumenta límites en php.ini');
        $this->newLine();

        Log::info('Diagnóstico de upload completado');
    }
}
