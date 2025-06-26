@extends('admin.layout')

@section('content')
    <section class="content-header">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-sm-6">
                    <h1 class="animate-fade-in">
                        <i class="fas fa-poll-h mr-2"></i>Rekap Hasil Kuis
                    </h1>
                    <p class="mb-0 text-white-50">Analisis dan rekapitulasi semua jawaban kuis dari siswa.</p>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right animate-fade-in">
                        <li class="breadcrumb-item"><a href="{{ route('dashboardadmin') }}"><i class="fas fa-home"></i> Dashboard</a></li>
                        <li class="breadcrumb-item active">Hasil Kuis</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-filter mr-2"></i>Filter dan Pencarian
                    </h3>
                </div>
                <div class="card-body">
                    <form action="{{ route('hasil-kuis') }}" method="GET">
                        <div class="row align-items-end">
                            <div class="col-lg-4 col-md-6 mb-3">
                                <label for="search" class="font-weight-bold">Cari Siswa / Materi</label>
                                <input type="text" id="search" name="search" class="form-control" placeholder="Ketik nama atau judul..." value="{{ request()->search }}">
                            </div>
                            <div class="col-lg-3 col-md-6 mb-3">
                                <label for="start_date" class="font-weight-bold">Dari Tanggal</label>
                                <input type="date" id="start_date" name="start_date" class="form-control" value="{{ request()->start_date }}">
                            </div>
                            <div class="col-lg-3 col-md-6 mb-3">
                                <label for="end_date" class="font-weight-bold">Hingga Tanggal</label>
                                <input type="date" id="end_date" name="end_date" class="form-control" value="{{ request()->end_date }}">
                            </div>
                            <div class="col-lg-2 col-md-6 mb-3">
                                <button type="submit" class="btn btn-primary w-100">
                                    <i class="fas fa-search mr-1"></i> Terapkan
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card animate-slide-up">
                <div class="card-body">
                    <div class="table-responsive table-container">
                        <table class="table table-hover w-100">
                            <thead>
                                <tr>
                                    <th>Nama Siswa</th>
                                    <th>Materi</th>
                                    <th>Jawaban User</th>
                                    <th>Kunci Jawaban</th>
                                    <th class="text-center">Skor</th>
                                    <th>Waktu Mengerjakan</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($hasilKuis as $hasil)
                                    <tr>
                                        <td class="font-weight-bold">{{ $hasil->siswa->nama ?? 'Siswa Dihapus' }}</td>
                                        <td>{{ $hasil->kuis->materi->judul ?? 'Materi Dihapus' }}</td>
                                        <td>
                                            @if($hasil->jawaban_user == $hasil->kuis->jawaban_benar)
                                                <span class="badge badge-success px-2 py-1">{{ $hasil->jawaban_user }}</span>
                                                <i class="fas fa-check-circle text-success ml-1" title="Benar"></i>
                                            @else
                                                <span class="badge badge-danger px-2 py-1">{{ $hasil->jawaban_user ?? 'Tidak Dijawab' }}</span>
                                                <i class="fas fa-times-circle text-danger ml-1" title="Salah"></i>
                                            @endif
                                        </td>
                                        <td>
                                            <span class="badge badge-info px-2 py-1">{{ $hasil->kuis->jawaban_benar ?? '-' }}</span>
                                        </td>
                                        <td class="text-center">
                                            <span class="badge badge-primary px-2 py-1" style="font-size: 0.9rem;">{{ $hasil->skor ?? 0 }}</span>
                                        </td>
                                        <td>
                                            {{ $hasil->waktu_dikerjakan ? \Carbon\Carbon::parse($hasil->waktu_dikerjakan)->translatedFormat('d F Y, H:i') : '-' }}
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="6" class="text-center py-4">
                                            <p class="mb-0">Tidak ada data hasil kuis yang cocok dengan filter Anda.</p>
                                            <a href="{{ route('hasil-kuis') }}">Tampilkan semua data</a>
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>

                    @if ($hasilKuis->hasPages())
                        <nav class="d-flex justify-content-center mt-4">
                            {{ $hasilKuis->appends(request()->query())->links('vendor.pagination.bootstrap-4') }}
                        </nav>
                    @endif
                </div>
                </div>
            </div>
    </section>
    @endsection
