<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('materi_siswa_unlock', function (Blueprint $table) {
    $table->id();
    $table->foreignId('siswa_id')->constrained('data_siswa')->onDelete('cascade');
    $table->foreignId('materi_id')->constrained('materis')->onDelete('cascade');
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materi_siswa_unlock');
    }
};
