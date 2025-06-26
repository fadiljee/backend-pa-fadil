@extends('admin.layout')

@section('content')
    <section class="content-header">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-sm-6">
                    <h1 class="animate-fade-in">
                        <i class="fas fa-puzzle-piece mr-2"></i>Kelola Data Kuis
                    </h1>
                    <p class="mb-0 text-white-50">Manajemen semua pertanyaan kuis.</p>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right animate-fade-in">
                        <li class="breadcrumb-item"><a href="{{ route('dashboardadmin') }}"><i class="fas fa-home"></i> Dashboard</a></li>
                        <li class="breadcrumb-item active">Data Kuis</li>
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
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h3 class="card-title">
                                <i class="fas fa-list mr-2"></i>Daftar Pertanyaan Kuis
                            </h3>
                            <a href="{{ route('tambahkuis') }}" class="btn btn-primary">
                                <i class="fas fa-plus mr-2"></i>Tambah Kuis
                            </a>
                        </div>
                        <div class="card-body">
                            @if(session('success'))
                                <div class="alert alert-success alert-dismissible fade show" role="alert">
                                    <i class="fas fa-check-circle mr-2"></i>{{ session('success') }}
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            @endif
                            @if($errors->any())
                                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i class="fas fa-exclamation-triangle mr-2"></i>
                                    <strong>Terdapat Kesalahan:</strong>
                                    <ul class="mb-0 mt-2 pl-3">
                                        @foreach($errors->all() as $error)
                                            <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            @endif

                            <div class="table-responsive table-container">
                                <table id="kuisTable" class="table table-hover w-100">
                                    <thead>
                                        <tr>
                                            <th>Pertanyaan</th>
                                            <th>Jawaban A</th>
                                            <th>Jawaban B</th>
                                            <th>Jawaban C</th>
                                            <th>Jawaban D</th>
                                            <th class="text-center">Jawaban Benar</th>
                                            <th>Materi Terkait</th>
                                            <th class="text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($kuis as $item)
                                            <tr>
                                                <td class="font-weight-bold" title="{{ $item->pertanyaan }}">{{ \Str::limit($item->pertanyaan, 40) }}</td>
                                                <td>{{ \Str::limit($item->jawaban_a, 20) }}</td>
                                                <td>{{ \Str::limit($item->jawaban_b, 20) }}</td>
                                                <td>{{ \Str::limit($item->jawaban_c, 20) }}</td>
                                                <td>{{ \Str::limit($item->jawaban_d, 20) }}</td>
                                                <td class="text-center">
                                                    <span class="badge badge-success px-2 py-1">{{ $item->jawaban_benar }}</span>
                                                </td>
                                                <td>{{ $item->materi->judul }}</td>
                                                <td class="text-center">
                                                    <div class="btn-group">
                                                        <a href="{{ route('kuisedit', $item->id) }}" class="btn btn-sm btn-warning btn-action" title="Edit">
                                                            <i class="fas fa-edit"></i>
                                                        </a>
                                                        <button type="button" class="btn btn-sm btn-danger btn-action" title="Hapus" onclick="confirmDelete('{{ $item->id }}', '{{ \Str::limit($item->pertanyaan, 50) }}')">
                                                            <i class="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                    <form id="delete-form-{{ $item->id }}" action="{{ route('kuisdelete', $item->id) }}" method="POST" style="display: none;">
                                                        @csrf
                                                        @method('DELETE')
                                                    </form>
                                                </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        </div>
                    </div>
            </div>
        </div>
    </section>
    @endsection

@section('scripts')
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
$(document).ready(function() {
    // DataTable initialization
    $("#kuisTable").DataTable({
        "responsive": true,
        "autoWidth": false,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.12.1/i18n/id.json"
        },
        "columnDefs": [
            { "orderable": false, "targets": 7 } // Disable sorting on 'Aksi' column
        ]
    });

    // Auto-hide alerts
    setTimeout(function() {
        $('.alert').alert('close');
    }, 5000);
});

// Delete confirmation with SweetAlert2
function confirmDelete(kuisId, kuisPertanyaan) {
    Swal.fire({
        title: 'Anda Yakin?',
        html: `Anda akan menghapus pertanyaan: <br><b>"${kuisPertanyaan}..."</b>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('delete-form-' + kuisId).submit();
        }
    });
}
</script>
@endsection
