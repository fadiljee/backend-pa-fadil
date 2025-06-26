<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('materis', function (Blueprint $table) {
        $table->id();
        $table->string('judul');
        $table->text('konten');
         $table->string('gambar')->nullable(); 
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down()
{
    // Hapus foreign key di tabel kuis
    Schema::table('kuis', function (Blueprint $table) {
        $table->dropForeign(['materi_id']); // Ganti dengan nama kolom yang mengacu pada materi_id
    });

    // Sekarang hapus tabel materis
    Schema::dropIfExists('materis');
}

};
