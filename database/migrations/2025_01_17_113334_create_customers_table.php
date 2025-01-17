<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration{
    public function up(): void{
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('full_names');
            $table->string('dni',8)->unique();
            $table->string('phone');
            $table->string('address')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void{
        Schema::dropIfExists('customers');
    }
};
