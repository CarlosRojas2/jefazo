<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration{
    public function up(): void{
        Schema::create('repair_order_inspections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_order_id')
            ->constrained('repair_orders')
            ->onDelete('cascade'); // Si se elimina la orden, se eliminan las inspecciones
            $table->foreignId('vehicle_part_id')
            ->constrained('vehicle_parts')
            ->onDelete('cascade'); // Si se elimina la parte, se eliminan las inspecciones
            $table->enum('status', ['good', 'needs_repair', 'damaged'])->default('good');
            $table->text('observations')->nullable();
            $table->timestamps();
            // Evita que se duplique la inspección de una misma parte en una misma orden
            $table->unique(['repair_order_id', 'vehicle_part_id']);
        });
    }

    public function down(): void{
        Schema::dropIfExists('repair_order_inspections');
    }
};
