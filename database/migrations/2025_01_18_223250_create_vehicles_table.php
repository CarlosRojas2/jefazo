<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration{
    public function up(): void{
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id'); // FK - clientes
            $table->string('brand', 100); // Marca de la moto
            $table->string('model', 100); // Modelo de la moto
            $table->string('plate', 50)->unique(); // Matrícula única
            $table->string('color', 50)->nullable(); // Color de la moto
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void{
        Schema::dropIfExists('vehicles');
    }
};
