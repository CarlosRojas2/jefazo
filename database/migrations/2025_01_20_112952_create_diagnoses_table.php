<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration{
    public function up(): void{
        Schema::create('diagnoses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->string('reason');
            $table->string('diagnosis');
            $table->string('obssrvations');
            $table->timestamp('entry_date_time');
            $table->timestamps();
        });
    }

    public function down(): void{
        Schema::dropIfExists('diagnoses');
    }
};
