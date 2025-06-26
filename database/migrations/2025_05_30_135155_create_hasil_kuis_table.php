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
        Schema::create('hasil_kuis', function (Blueprint $table) {
          $table->id();
        $table->unsignedBigInteger('siswa_id');     // relasi ke data_siswa
        $table->unsignedBigInteger('kuis_id');      // relasi ke kuis
        $table->string('jawaban_user');             // jawaban yang dipilih siswa
        $table->integer('skor');                    // skor (0 atau 10 misalnya)
        $table->timestamp('waktu_dikerjakan');      // waktu pengerjaan
        $table->timestamps();

        $table->foreign('siswa_id')->references('id')->on('data_siswa')->onDelete('cascade');
        $table->foreign('kuis_id')->references('id')->on('kuis')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_kuis');
    }
};
