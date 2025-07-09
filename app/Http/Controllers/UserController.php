<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Siswa;
use App\Models\Kuis;
use Illuminate\Support\Facades\Hash;
use App\Models\Materi;
use App\Rules\LoginCheck;
use Illuminate\Support\Facades\Session;

class UserController extends Controller
{

    function login()
    {
        return view('admin.login');
    }
      public function index()
{
    // Hitung jumlah siswa, materi, dan quiz dari database
    $jumlahSiswa = Siswa::count();
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
    $peringkatSiswa = Siswa::where('id')
                          ->withAvg('hasilKuis', 'skor') // Asumsi relasi ada
                          ->orderByDesc('hasil_kuis_avg_skor')
                          ->take(3)
                          ->get();

    // 4. Data untuk Materi Terbaru
    $materiTerbaru = Materi::latest()->take(5)->get();

    return view('admin.layout', [ // Ganti dengan nama view Anda
        'jumlahSiswa' => $jumlahSiswa,
        'jumlahMateri' => $jumlahMateri,
        'jumlahQuiz' => $jumlahQuiz,
        'chartSiswa' => $chartSiswa,
        'chartKuis' => $chartKuis,
        'peringkatSiswa' => $peringkatSiswa,
        'materiTerbaru' => $materiTerbaru
    ]);
}

    public function dashboard()
{
    // Hitung jumlah siswa, materi, dan quiz dari database
    $jumlahSiswa = Siswa::count();
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
    $peringkatSiswa = Siswa::where('id')
                          ->withAvg('hasilKuis', 'skor') // Asumsi relasi ada
                          ->orderByDesc('hasil_kuis_avg_skor')
                          ->take(3)
                          ->get();

    // 4. Data untuk Materi Terbaru
    $materiTerbaru = Materi::latest()->take(5)->get();

    return view('admin.dashboard', [ // Ganti dengan nama view Anda
        'jumlahSiswa' => $jumlahSiswa,
        'jumlahMateri' => $jumlahMateri,
        'jumlahQuiz' => $jumlahQuiz,
        'chartSiswa' => $chartSiswa,
        'chartKuis' => $chartKuis,
        'peringkatSiswa' => $peringkatSiswa,
        'materiTerbaru' => $materiTerbaru
    ]);
}

    function tampilData()
    {
        // return view('User.dataUser');
        $users = Siswa::all();
        return view('User.dataUser', compact('users'));
    }
    function tambahUser()
    {
        return view('User.tambahUser');
    }

    function editData()
    {
        return view('User.editUser');
    }

    function daftar(Request $request)
    {
        $request->validate([
            'nama' => 'required|min:5|string|max:255',
            'nisn' => 'required|digits:10',
            'kelas' => 'required|string|max:10',

        ]);

        $dataInsert = [
            'nama' => $request->nama,
            'nisn' => $request->nisn,
            'kelas' => $request->kelas,
        ];

        Siswa::insert($dataInsert);

        return redirect()->route('dataSiswa')->with('success', 'Pendaftaran Berhasil');
    }

    function editUser($id)
    {
        $users = Siswa::where('id', $id)->first();
        $data = [
            'user' => $users
        ];
        return view('User.edituser', $data);
    }

    function updateUser(Request $request, $id)
    {
        $nama = $request->input('nama');
        $nisn = $request->input('nisn');
        $kelas = $request->input('kelas');

        $dataUpdate = [
            'nama' => $nama,
            'nisn' => $nisn,
            'kelas' => $kelas,
        ];

        Siswa::where('id', $id)->update($dataUpdate);
        return redirect()->route('dataSiswa')->with('success', 'Data Berhasil Diubah');
    }

    function deleteUser($id)
    {
        $user = Siswa::findOrFail($id);
        $user->delete();

        return redirect()->route('dataSiswa')->with('success', 'Data Berhasil Dihapus');
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
