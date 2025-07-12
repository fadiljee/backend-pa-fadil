@extends('admin.layout')

@section('content')
<section class="content-header">
    <div class="container-fluid">
        <h1><i class="fas fa-users mr-2"></i>Daftar Siswa</h1>
        <p>Daftar siswa yang sudah mengikuti kuis.</p>
    </div>
</section>

<section class="content">
    <div class="container-fluid">
        <div class="card animate-slide-up">
            <div class="card-body">
                <form action="{{ route('hasil-kuis') }}" method="GET" class="mb-3">
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <input type="text" name="search" class="form-control" placeholder="Cari nama siswa..." value="{{ request('search') }}">
                        </div>
                        <div class="col-md-4 mb-2">
                            <select name="kelas" class="form-control">
                                <option value="">Filter kelas</option>
                                @foreach($kelasList as $kelas)
                                    <option value="{{ $kelas }}" {{ request('kelas') == $kelas ? 'selected' : '' }}>{{ $kelas }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-md-2 mb-2">
                            <button type="submit" class="btn btn-primary w-100">Filter</button>
                        </div>
                    </div>
                </form>

                <table class="table table-hover w-100">
                    <thead>
                        <tr>
                            <th>Nama Siswa</th>
                            <th>Kelas</th>
                            <th class="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($siswa as $item)
                            <tr>
                                <td>{{ $item->nama }}</td>
                                <td>{{ $item->kelas }}</td>
                                <td class="text-center">
                                    <a href="{{ route('hasil-kuis.riwayat', $item->id) }}" class="btn btn-primary btn-sm">Riwayat Kuis</a>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="3" class="text-center">Tidak ada siswa yang sesuai.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>

                {{ $siswa->withQueryString()->links('vendor.pagination.bootstrap-4') }}
            </div>
        </div>
    </div>
</section>
@endsection
