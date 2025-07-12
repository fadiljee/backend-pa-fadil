<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MateriSiswaUnlock extends Model
{
    protected $table = 'materi_siswa_unlock';

    protected $fillable = ['siswa_id', 'materi_id'];
}
