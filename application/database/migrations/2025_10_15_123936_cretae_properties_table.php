<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Framework\Constraint\Constraint;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function(Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('municipality');
            $table->string('uf', 2);
            $table->string('state_registration')->nullable();
            $table->decimal('area_total', 10, 2);


            $table->foreignId('producer_id')
            ->constrained('producers')
            ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
