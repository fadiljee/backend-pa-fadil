<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Kuis extends Model
{
    use HasApiTokens;
    use HasFactory;

    protected $fillable = [
        'pertanyaan',
        'jawaban_a',
        'jawaban_b',
        'jawaban_c',
        'jawaban_d',
        'jawaban_benar',
        'nilai',
        'materi_id',
    ];

    // Relasi ke materi
    public function materi()
    {
        return $this->belongsTo(Materi::class);
    }

    // Relasi ke hasil kuis
    public function hasilKuis()
    {
        return $this->hasMany(HasilKuis::class);
    }
}
