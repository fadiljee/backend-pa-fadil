<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HasilKuis extends Model
{
    use HasFactory;

    protected $fillable = ['siswa_id', 'kuis_id', 'jawaban_user', 'skor', 'waktu_dikerjakan'];


    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function kuis()
    {
        return $this->belongsTo(Kuis::class);
    }
}

