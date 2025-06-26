@extends('admin.layout')
<style>
    /* Memberikan warna latar untuk baris juara di tabel peringkat */
.table-hover tbody tr.rank-1:hover,
.table-hover tbody tr.rank-1 {
    background-color: rgba(255, 215, 0, 0.1); /* Emas lembut */
    font-weight: 600;
}
.table-hover tbody tr.rank-2:hover,
.table-hover tbody tr.rank-2 {
    background-color: rgba(192, 192, 192, 0.1); /* Perak lembut */
}
.table-hover tbody tr.rank-3:hover,
.table-hover tbody tr.rank-3 {
    background-color: rgba(205, 127, 50, 0.1); /* Perunggu lembut */
}
</style>
@section('content')
    <section class="content-header">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-sm-6">
                    <h1 class="animate-fade-in">
                        <i class="fas fa-trophy mr-2"></i>Peringkat Siswa
                    </h1>
                    <p class="mb-0 text-white-50">Daftar siswa dengan perolehan skor kuis tertinggi.</p>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right animate-fade-in">
                        <li class="breadcrumb-item"><a href="{{ route('dashboardadmin') }}"><i class="fas fa-home"></i> Dashboard</a></li>
                        <li class="breadcrumb-item active">Peringkat Siswa</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card animate-slide-up">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-medal mr-2"></i>Papan Peringkat Teratas
                            </h3>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover w-100">
                                    <thead>
                                        <tr>
                                            <th class="text-center" style="width: 10%;">Peringkat</th>
                                            <th>Nama Siswa</th>
                                            <th class="text-center" style="width: 25%;">Gelar</th>
                                            <th class="text-center" style="width: 20%;">Total Skor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @forelse($leaderboard as $index => $entry)
                                            @php
                                                $rank = ($leaderboard->currentPage() - 1) * $leaderboard->perPage() + $index + 1;
                                            @endphp
                                            {{-- PENAMBAHAN KELAS DINAMIS PADA TR --}}
                                            <tr class="@if($rank <= 3) rank-{{ $rank }} @endif">
                                                <td class="text-center">
                                                    @if($rank == 1)
                                                        <span class="fa-stack fa-lg" title="Peringkat 1">
                                                            <i class="fas fa-certificate fa-stack-2x" style="color: #ffd700;"></i>
                                                            <strong class="fa-stack-1x fa-inverse text-dark">{{ $rank }}</strong>
                                                        </span>
                                                    @elseif($rank == 2)
                                                        <span class="fa-stack fa-lg" title="Peringkat 2">
                                                            <i class="fas fa-certificate fa-stack-2x" style="color: #c0c0c0;"></i>
                                                            <strong class="fa-stack-1x fa-inverse text-dark">{{ $rank }}</strong>
                                                        </span>
                                                    @elseif($rank == 3)
                                                        <span class="fa-stack fa-lg" title="Peringkat 3">
                                                            <i class="fas fa-certificate fa-stack-2x" style="color: #cd7f32;"></i>
                                                            <strong class="fa-stack-1x fa-inverse text-dark">{{ $rank }}</strong>
                                                        </span>
                                                    @else
                                                        <span class="h5 font-weight-bold">{{ $rank }}</span>
                                                    @endif
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mr-3" style="width: 40px; height: 40px; font-weight: 600;">
                                                            {{-- Perbaikan kecil untuk mencegah error jika siswa null --}}
                                                            @if($entry->siswa)
                                                                {{ strtoupper(substr($entry->siswa->nama, 0, 1)) }}
                                                            @else
                                                                ?
                                                            @endif
                                                        </div>
                                                        <span class="font-weight-bold">{{ $entry->siswa->nama ?? 'Siswa Dihapus' }}</span>
                                                    </div>
                                                </td>
                                                <td class="text-center">
                                                    <span class="badge {{ $entry->gelar['kelas'] }} px-3 py-2" style="font-size: 0.9rem;">
                                                        <i class="fas fa-star mr-1"></i> {{ $entry->gelar['teks'] }}
                                                    </span>
                                                </td>
                                                <td class="text-center">
                                                    <span class="badge badge-dark px-3 py-2" style="font-size: 1rem;">
                                                        {{ $entry->total_skor }}
                                                    </span>
                                                </td>
                                            </tr>
                                        @empty
                                            <tr>
                                                <td colspan="4" class="text-center py-5">
                                                    <p class="mb-0">Belum ada data peringkat yang tersedia.</p>
                                                    <small class="text-muted">Hasil akan muncul setelah siswa mengerjakan kuis.</small>
                                                </td>
                                            </tr>
                                        @endforelse
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        @if ($leaderboard->hasPages())
                            <div class="card-footer clearfix">
                                <nav class="d-flex justify-content-center">
                                    {{ $leaderboard->appends(request()->query())->links('vendor.pagination.bootstrap-4') }}
                                </nav>
                            </div>
                        @endif
                    </div>
                    </div>
            </div>
        </div>
    </section>
@endsection
