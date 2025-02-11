<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration{
    public function up(): void{
        Schema::create('repair_orders', function (Blueprint $table) {
            $table->id();
            $table->string('correlative');
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->string('problem');
            $table->string('observations');
            $table->timestamp('entry_date_time');
            $table->string('status');
            $table->string('signature');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void{
        Schema::dropIfExists('repair_orders');
    }
};
