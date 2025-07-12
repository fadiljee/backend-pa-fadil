@extends('admin.layout')

@section('content')
    <section class="content-header">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-sm-6">
                    <h1 class="animate-fade-in">
                        <i class="fas fa-poll-h mr-2"></i>Rekap Hasil Kuis - {{ $siswa->nama }}
                    </h1>
                    <p class="mb-0 text-white-50">Analisis dan rekapitulasi semua jawaban kuis dari siswa ini.</p>
                    <a href="{{ route('hasil-kuis') }}" class="btn btn-secondary btn-sm mt-3">
                        <i class="fas fa-arrow-left mr-1"></i> Kembali ke Daftar Siswa
                    </a>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right animate-fade-in">
                        <li class="breadcrumb-item"><a href="{{ route('dashboardadmin') }}"><i class="fas fa-home"></i> Dashboard</a></li>
                        <li class="breadcrumb-item"><a href="{{ route('hasil-kuis') }}">Hasil Kuis</a></li>
                        <li class="breadcrumb-item active">{{ $siswa->nama }}</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">

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
                                        <td class="font-weight-bold">{{ $siswa->nama }}</td>
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
                                            <p class="mb-0">Tidak ada data hasil kuis.</p>
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>

                    @if ($hasilKuis->hasPages())
                        <nav class="d-flex justify-content-center mt-4">
                            {{ $hasilKuis->links('vendor.pagination.bootstrap-4') }}
                        </nav>
                    @endif
                </div>
            </div>
        </div>
    </section>
@endsection
