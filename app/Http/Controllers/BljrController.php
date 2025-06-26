<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;
use App\Models\QuizModel;
use App\Models\UserModel1;
use Illuminate\Support\Facades\Hash;
use App\Rules\LoginCheck;
use App\Models\Kuis;
use App\Models\Siswa;
use App\Models\Materi;
use App\Models\HasilKuis;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class BljrController extends Controller
{
    // Di dalam file controller Anda, misal: DashboardController.php

public function index()
{
    // Hitung jumlah siswa, materi, dan quiz dari database
    $jumlahSiswa = Siswa::where('role', 'siswa')->count();
    $jumlahMateri = Materi::count();
    $jumlahQuiz = Kuis::count();

    // 1. Data untuk Grafik Pertumbuhan Siswa
    $chartSiswa = [
        'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'], // Contoh label
        'data' => [12, 19, 3, 5, 2, 3] // Contoh data, ambil dari query database
    ];

    // 2. Data untuk Grafik Distribusi Nilai
    $chartKuis = [
        // Contoh data, ambil dari query yang menghitung rata-rata nilai kuis semua siswa
        'data' => [60, 30, 10] // % siswa dengan nilai >85, 70-85, <70
    ];

    // 3. Data untuk Peringkat Siswa (Contoh)
    $peringkatSiswa = Siswa::where('role', 'siswa')
                          ->withAvg('hasilKuis', 'skor') // Asumsi relasi ada
                          ->orderByDesc('hasil_kuis_avg_skor')
                          ->take(3)
                          ->get();

    // 4. Data untuk Materi Terbaru
    $materiTerbaru = Materi::latest()->take(5)->get();

    return view('admin.dashboard_content', [ // Ganti dengan nama view Anda
        'jumlahSiswa' => $jumlahSiswa,
        'jumlahMateri' => $jumlahMateri,
        'jumlahQuiz' => $jumlahQuiz,
        'chartSiswa' => $chartSiswa,
        'chartKuis' => $chartKuis,
        'peringkatSiswa' => $peringkatSiswa,
        'materiTerbaru' => $materiTerbaru
    ]);
}
    function login()
    {
        return view('admin.login');
    }

    function data()
    {
        $users = UserModel1::all();
        return view('user.tambahUser', compact('users'));
    }

    function daftar(Request $request)
    {
        $request->validate([
            'nama' => 'required|min:5|string|max:255',
            'nisn' => 'required|digits:10',

        ]);

        $dataInsert = [
            'nama' => $request->nama,
            'nisn' => $request->nisn,
        ];

        UserModel1::insert($dataInsert);

        return redirect()->route('dataSiswa')->with('success', 'Pendaftaran Berhasil');
    }

    function editUser($id)
    {
        $users = UserModel1::where('id', $id)->first();
        $data = [
            'user' => $users
        ];
        return view('admin.edituser', $data);
    }

    function updateUser(Request $request, $id)
    {
        $nama = $request->input('nama');
        $nisn = $request->input('nisn');

        $dataUpdate = [
            'nama' => $nama,
            'nisn' => $nisn,
        ];

        UserModel1::where('id', $id)->update($dataUpdate);
        return redirect()->route('formhitung')->with('success', 'Data Berhasil Diubah');
    }

    function deleteUser($id)
    {
        $user = UserModel1::findOrFail($id);
        $user->delete();

        return redirect()->route('formhitung')->with('success', 'Data Berhasil Dihapus');
    }

    function listgempa()
    {
        $url = 'https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json';
        $json = file_get_contents($url);

        $data = json_decode($json, true);

        $gempaData = $data['Infogempa']['gempa'] ?? [];
        return view('admin.listgempa', compact('gempaData'));
    }

    function proseslogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => ['required', new LoginCheck($request)]
        ]);
        return redirect()->route('dashboardadmin');
    }

    function logout()
    {
        session::flush();
        return redirect()->route('loginadmin');
    }
}
