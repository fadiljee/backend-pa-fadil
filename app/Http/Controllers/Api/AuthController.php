<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\UserModel1;
use App\Models\Materi;
use App\Models\Kuis;
use App\Models\HasilKuis;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    // Login menggunakan NISN dan buat token Sanctum
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nisn' => 'required|digits:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $siswa = UserModel1::where('nisn', $request->nisn)->first();

        if (!$siswa) {
            return response()->json(['message' => 'NISN tidak ditemukan'], 404);
        }

        // Hapus token lama (opsional)
        $siswa->tokens()->delete();

        // Buat token baru
        $token = $siswa->createToken('token-siswa')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'data_siswa' => $siswa,
            'token' => $token,
        ]);
    }

    // Tampilkan semua materi
    public function index()
    {
        $materis = Materi::all()->map(function ($materi) {
            return [
                'id' => $materi->id,
                'judul' => $materi->judul,
                'konten' => $materi->konten,
                'gambar_url' => $materi->gambar ? asset('storage/' . $materi->gambar) : null,
            ];
        });

        return response()->json($materis);
    }

    // Tampilkan materi berdasarkan ID
    public function show($id)
    {
        $materi = Materi::find($id);

        if (!$materi) {
            return response()->json(['message' => 'Materi tidak ditemukan'], 404);
        }

        return response()->json([
            'id' => $materi->id,
            'judul' => $materi->judul,
            'konten' => $materi->konten,
            'gambar_url' => $materi->gambar ? asset('storage/' . $materi->gambar) : null,
        ]);
    }

    // Cari materi berdasarkan judul (query param)
    public function searchByTitle(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|min:3',
        ]);

        $materis = Materi::where('judul', 'like', '%' . $request->judul . '%')->get();

        if ($materis->isEmpty()) {
            return response()->json(['message' => 'Materi tidak ditemukan'], 404);
        }

        return response()->json($materis);
    }

    // Tampilkan semua kuis dengan relasi materi
    public function kuis()
    {
        $kuis = Kuis::with('materi')->get();

        return response()->json(['kuis' => $kuis]);
    }

    // Tampilkan kuis berdasarkan materi_id
   public function kuisShow($id)
{
    $kuis = Kuis::select('id', 'pertanyaan', 'jawaban_a', 'jawaban_b', 'jawaban_c', 'jawaban_d', 'jawaban_benar', 'nilai', 'materi_id')
    ->with('materi')
    ->where('materi_id', $id)
    ->get();


    if ($kuis->isEmpty()) {
        return response()->json(['message' => 'Kuis tidak ditemukan'], 404);
    }

    return response()->json(['kuis' => $kuis]);
}


    // Simpan hasil kuis dengan validasi dan transaksi
 // Controller untuk menyimpan hasil kuis
public function storeHasilKuis(Request $request)
{
    $user = $request->user(); // User yang sedang login

    // Validasi input dari frontend
    $validator = Validator::make($request->all(), [
        'kuis_id' => 'required|integer|exists:kuis,id',
        'jawaban_user' => 'required|string|in:a,b,c,d', // Pastikan jawaban kecil
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Ambil kuis dari database
    $kuis = Kuis::find($request->kuis_id);

    // Menghitung skor
    $skor = ($kuis->jawaban_benar === $request->jawaban_user) ? ($kuis->nilai ?? 10) : 0;

    // Simpan hasil soal ke tabel HasilKuis
    $hasil = HasilKuis::create([
        'siswa_id' => $user->id,
        'kuis_id' => $request->kuis_id,
        'jawaban_user' => $request->jawaban_user,
        'skor' => $skor,
        'waktu_dikerjakan' => now(),
    ]);

    // Akumulasi total skor siswa
    $totalSkor = HasilKuis::where('siswa_id', $user->id)->sum('skor'); // Menjumlahkan semua skor

    return response()->json([
        'status' => 'success',
        'hasil' => $hasil,
        'total_skor' => $totalSkor, // Kirim total skor yang dihitung
    ]);
}

// Endpoint untuk menampilkan leaderboard atau total skor
public function leaderboard()
{
    // Ambil total skor untuk semua siswa
    $leaderboard = HasilKuis::select('siswa_id', DB::raw('SUM(skor) as total_skor'))
                           ->groupBy('siswa_id')
                           ->orderBy('total_skor', 'desc')
                           ->get();

    return response()->json([
        'leaderboard' => $leaderboard,
    ]);
}



private function getGelar($skor)
    {
        if ($skor >= 81) {
            return 'Juara Matematika';
        } elseif ($skor >= 61) {
            return 'Master Operasi Hitung';
        } elseif ($skor >= 41) {
            return 'Ahli Hitung Dasar';
        } elseif ($skor >= 21) {
            return 'Penjelajah Angka';
        } elseif ($skor >= 1) {
            return 'Pemula Matematika';
        } else {
            return 'Belum Ada Gelar';
        }
    }

    // PENAMBAHAN: Endpoint baru untuk mengambil skor dan gelar siswa
    public function getUserStats(Request $request)
    {
        $user = $request->user(); // Mendapatkan data siswa yang sedang login

        // Hitung total skor dari semua pengerjaan pertama siswa
        $totalSkor = HasilKuis::where('siswa_id', $user->id)->sum('skor');

        // Batasi skor maksimal menjadi 100
        $skorAkhir = min($totalSkor, 100);

        // Dapatkan gelar berdasarkan skor akhir
        $gelar = $this->getGelar($skorAkhir);

        // Kembalikan data dalam format JSON
        return response()->json([
            'total_skor' => $skorAkhir,
            'gelar' => $gelar,
        ]);
    }

}
