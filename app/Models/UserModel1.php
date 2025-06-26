<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserModel1 extends Model
{
     use HasApiTokens;
    protected $table = 'data_siswa';

    // Menentukan kolom yang bisa diisi (fillable)
    protected $fillable = ['nisn', 'nama'];
}
