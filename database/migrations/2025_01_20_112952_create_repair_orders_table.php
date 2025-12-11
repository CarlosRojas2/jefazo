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
            $table->string('problem')->nullable();
            $table->string('observations')->nullable();
            $table->decimal('subtotal_services', 10, 2)->default(0)->after('observations');
            $table->decimal('subtotal_articles', 10, 2)->default(0)->after('subtotal_services');
            $table->decimal('total', 10, 2)->default(0)->after('subtotal_articles');
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
