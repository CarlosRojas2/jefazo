<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration{
    public function up(): void{
        Schema::create('repair_order_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_order_id')->constrained('repair_orders')->onDelete('cascade'); // FK a repair_orders
            $table->foreignId('article_id')->constrained('articles')->onDelete('cascade'); // FK a articles
            $table->integer('quantity')->default(1); // Cantidad de partes
            $table->decimal('price', 10, 2)->default(0.00);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void{
        Schema::dropIfExists('repair_order_articles');
    }
};
