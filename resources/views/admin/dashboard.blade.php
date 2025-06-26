@extends('admin.layout')

@section('content')
    <section class="content-header">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-sm-6">
                    <h1 class="animate-fade-in">
                        <i class="fas fa-tachometer-alt mr-2"></i>Dashboard
                    </h1>
                    <p class="mb-0 text-white-50">Selamat datang kembali, {{ Session::get('ambilUser')->nama }}!</p>
                </div>
                <div class="col-sm-6 text-sm-right">
                    <span class="badge badge-light px-3 py-2 shadow-sm">
                        <i class="far fa-calendar-alt mr-1"></i>
                        {{ \Carbon\Carbon::now()->translatedFormat('l, d F Y') }}
                    </span>
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="stats-card animate-slide-up">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-user-graduate fa-3x mr-4"></i>
                            <div>
                                <div class="stats-number">{{ $jumlahSiswa }}</div>
                                <div class="stats-label">Total Siswa</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="stats-card bg-success animate-slide-up" style="animation-delay: 0.1s;">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-book-open fa-3x mr-4"></i>
                            <div>
                                <div class="stats-number">{{ $jumlahMateri }}</div>
                                <div class="stats-label">Total Materi</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="stats-card bg-warning animate-slide-up" style="animation-delay: 0.2s;">
                        <div class="d-flex align-items-center text-dark">
                            <i class="fas fa-question-circle fa-3x mr-4"></i>
                            <div>
                                <div class="stats-number">{{ $jumlahQuiz }}</div>
                                <div class="stats-label">Total Kuis</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-7">
                    <div class="card animate-slide-up" style="animation-delay: 0.3s;">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-chart-line text-primary mr-2"></i>Status Sistem
                            </h3>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-success border-0">
                                <h5 class="alert-heading"><i class="fas fa-check-circle"></i> Sistem Berjalan Normal</h5>
                                <p class="mb-0">Semua layanan dan fitur panel admin dapat diakses dan berfungsi sebagaimana mestinya. Tidak ada laporan masalah yang terdeteksi.</p>
                            </div>
                            <p class="text-center text-muted mt-3">Panel ini memberikan Anda kontrol penuh atas data aplikasi.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-5">
                    <div class="card animate-slide-up" style="animation-delay: 0.4s;">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-bolt text-primary mr-2"></i>Aksi Cepat
                            </h3>
                        </div>
                        <div class="card-body">
                            <a href="{{ route('tambahSiswa') }}" class="btn btn-primary btn-block mb-2">
                                <i class="fas fa-user-plus mr-2"></i>Tambah Siswa Baru
                            </a>
                            <a href="{{ route('tambahMateri') }}" class="btn btn-success btn-block mb-2">
                                <i class="fas fa-plus-circle mr-2"></i>Tambah Materi Baru
                            </a>
                            <a href="{{ route('tambahkuis') }}" class="btn btn-warning btn-block text-dark">
                                <i class="fas fa-plus-square mr-2"></i>Tambah Kuis Baru
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
