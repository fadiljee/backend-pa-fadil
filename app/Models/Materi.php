<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use App\Models\Kuis;

class Materi extends Model
{
    use HasApiTokens;

    protected $fillable = ['judul', 'konten', 'gambar'];

    public function kuis()
    {
        return $this->hasMany(Kuis::class);
    }

    // Accessor untuk URL gambar lengkap
    public function getGambarUrlAttribute()
    {
        if ($this->gambar) {
            return asset('storage/materi/' . $this->gambar);
        }
        return null;
    }
}
