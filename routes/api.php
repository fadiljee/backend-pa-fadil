<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// Endpoint login (tanpa middleware)
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/materi', [AuthController::class, 'index']);
    Route::get('/materi/{id}', [AuthController::class, 'show']);
    Route::get('/materi/cari', [AuthController::class, 'searchByTitle']);
    Route::get('/kuis', [AuthController::class, 'kuis']);
    Route::get('/kuis/{id}', [AuthController::class, 'kuisShow']);
    Route::post('/hasil-kuis', [AuthController::class, 'storeHasilKuis']);
     Route::get('/user/profile', [AuthController::class, 'userProfile']);

    // PENAMBAHAN: Rute ini yang terlewat.
    // Ini menghubungkan URL /api/user/stats ke fungsi getUserStats di AuthController.
    Route::get('/user/stats', [AuthController::class, 'getUserStats']);
    Route::post('/unlock-next-materi', [AuthController::class, 'unlockNextMateri']);
     Route::get('/materi-unlock', [AuthController::class, 'getUnlockedMateri']); // <== Tambahkan ini
});
