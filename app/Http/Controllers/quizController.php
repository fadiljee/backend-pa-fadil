<?php

namespace App\Http\Controllers;

use App\Models\Kuis;
use App\Models\Materi;
use Illuminate\Http\Request;
use App\Models\Siswa;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\HasilKuis;

class quizController extends Controller
{
    // Menampilkan daftar kuis
    public function index()
    {
        $kuis = Kuis::with('materi')->get();
        return view('quiz.index', compact('kuis'));
    }

    // Menampilkan form tambah kuis
    public function create()
    {
        $materis = Materi::all();
        return view('quiz.create', compact('materis'));
    }

    // Menyimpan kuis baru
    public function store(Request $request)
    {
        $request->validate([
            'pertanyaan' => 'required|string|max:255',
            'jawaban_a' => 'required|string|max:255',
            'jawaban_b' => 'required|string|max:255',
            'jawaban_c' => 'required|string|max:255',
            'jawaban_d' => 'required|string|max:255',
            'jawaban_benar' => 'required|in:A,B,C,D',
            'materi_id' => 'required|exists:materis,id',
        ]);

        Kuis::create($request->all());

        return redirect()->route('kuis')->with('success', 'Kuis berhasil ditambahkan');
    }


    // Menampilkan form edit kuis
    public function edit($id)
    {
        $kuis = Kuis::findOrFail($id);
        $materis = Materi::all();
        return view('quiz.edit', compact('kuis', 'materis'));
    }

    // Mengupdate kuis
    public function update(Request $request, $id)
    {
        $request->validate([
            'pertanyaan' => 'required|string|max:255',
            'jawaban_a' => 'required|string|max:255',
            'jawaban_b' => 'required|string|max:255',
            'jawaban_c' => 'required|string|max:255',
            'jawaban_d' => 'required|string|max:255',
            'jawaban_benar' => 'required|in:A,B,C,D',
            'materi_id' => 'required|exists:materis,id',
        ]);

        $kuis = Kuis::findOrFail($id);
        $kuis->update($request->all());

        return redirect()->route('kuis')->with('success', 'Kuis berhasil diperbarui');
    }

    // Menghapus kuis
    public function destroy($materi_id)
    {
        $kuis = Kuis::findOrFail($materi_id);
        $kuis->delete();

        return redirect()->route('kuis')->with('success', 'Kuis berhasil dihapus');
    }

    public function hasil(Request $request)
    {
        $query = HasilKuis::with(['siswa', 'kuis.materi']);

        if ($request->has('start_date') && $request->filled('start_date')) {
            $query->whereDate('waktu_dikerjakan', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->filled('end_date')) {
            $query->whereDate('waktu_dikerjakan', '<=', $request->end_date);
        }

        if ($request->has('search') && $request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('siswa', function ($q_siswa) use ($search) {
                    $q_siswa->where('nama', 'like', "%$search%");
                })
                ->orWhereHas('kuis.materi', function ($q_materi) use ($search) {
                    $q_materi->where('judul', 'like', "%$search%");
                });
            });
        }

        $hasilKuis = $query->orderBy('waktu_dikerjakan', 'desc')->paginate(15);

        return view('hasilkuis.index', compact('hasilKuis'));
    }

    public function storeHasilKuis(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|integer|exists:siswas,id',
            'kuis_id' => 'required|integer|exists:kuis,id',
            'jawaban_user' => 'required|string|in:A,B,C,D',
        ]);

        $existingHasil = HasilKuis::where('siswa_id', $request->siswa_id)
                                  ->where('kuis_id', $request->kuis_id)
                                  ->first();
        if ($existingHasil) {
            return response()->json([
                'status' => 'already_submitted',
                'message' => 'Anda sudah pernah mengerjakan kuis ini.',
                'hasil' => $existingHasil
            ], 409);
        }

        $kuis = Kuis::findOrFail($request->kuis_id);
        $benar = $kuis->jawaban_benar === $request->jawaban_user;
        $skor = $benar ? 10 : 0;

        $hasil = new HasilKuis();
        $hasil->siswa_id = $request->siswa_id;
        $hasil->kuis_id = $request->kuis_id;
        $hasil->jawaban_user = $request->jawaban_user;
        $hasil->skor = $skor;
        $hasil->waktu_dikerjakan = Carbon::now();
        $hasil->save();

        return response()->json(['status' => 'success','message' => 'Jawaban berhasil disimpan.','hasil' => $hasil], 201);
    }

    public function totalSkorSiswa($siswa_id)
    {
        $totalSkor = HasilKuis::where('siswa_id', $siswa_id)->sum('skor');
        $skorAkhir = min($totalSkor, 100);
        return response()->json(['status' => 'success', 'total_skor' => $skorAkhir]);
    }

    private function getGelar($skor)
    {
        if ($skor >= 81) {
            return ['teks' => 'Juara Matematika', 'kelas' => 'badge-warning text-dark'];
        } elseif ($skor >= 61) {
            return ['teks' => 'Master Operasi Hitung', 'kelas' => 'badge-info'];
        } elseif ($skor >= 41) {
            return ['teks' => 'Ahli Hitung Dasar', 'kelas' => 'badge-primary'];
        } elseif ($skor >= 21) {
            return ['teks' => 'Penjelajah Angka', 'kelas' => 'badge-success'];
        } elseif ($skor >= 1) {
            return ['teks' => 'Pemula Matematika', 'kelas' => 'badge-secondary'];
        } else {
            return ['teks' => 'Belum Ada Gelar', 'kelas' => 'badge-light text-dark'];
        }
    }

    public function showLeaderboard()
    {
        $leaderboard = HasilKuis::select(
                                'siswa_id',
                                DB::raw('LEAST(SUM(skor), 100) as total_skor')
                            )
                           ->groupBy('siswa_id')
                           ->orderBy('total_skor', 'desc')
                           ->with('siswa')
                           ->paginate(10);

        // Loop untuk menambahkan properti 'gelar' ke setiap item leaderboard
        foreach ($leaderboard as $item) {
            $item->gelar = $this->getGelar($item->total_skor);
        }

        return view('skorhasil.index', compact('leaderboard'));
    }
}
