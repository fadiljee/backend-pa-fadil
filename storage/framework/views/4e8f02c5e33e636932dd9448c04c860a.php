<?php $__env->startSection('content'); ?>
    <section class="content-header">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-sm-6">
                    <h1 class="animate-fade-in">
                        <i class="fas fa-book-open mr-2"></i>Kelola Data Materi
                    </h1>
                    <p class="mb-0 text-white-50">Manajemen semua materi pembelajaran.</p>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right animate-fade-in">
                        <li class="breadcrumb-item"><a href="<?php echo e(route('dashboardadmin')); ?>"><i class="fas fa-home"></i> Dashboard</a></li>
                        <li class="breadcrumb-item active">Data Materi</li>
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
                                <i class="fas fa-list mr-2"></i>Daftar Materi
                            </h3>
                            <a href="<?php echo e(route('tambahMateri')); ?>" class="btn btn-primary">
                                <i class="fas fa-plus mr-2"></i>Tambah Materi
                            </a>
                        </div>
                        <div class="card-body">
                            <?php if(session('success')): ?>
                                <div class="alert alert-success alert-dismissible fade show" role="alert">
                                    <i class="fas fa-check-circle mr-2"></i><?php echo e(session('success')); ?>

                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            <?php endif; ?>
                            <?php if($errors->any()): ?>
                                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i class="fas fa-exclamation-triangle mr-2"></i>
                                    <strong>Terdapat Kesalahan:</strong>
                                    <ul class="mb-0 mt-2 pl-3">
                                        <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <li><?php echo e($error); ?></li>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </ul>
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            <?php endif; ?>

                            <div class="table-responsive table-container">
                                <table id="materiTable" class="table table-hover w-100">
                                    <thead>
                                        <tr>
                                            <th style="width: 25%;">Judul</th>
                                            <th style="width: 40%;">Konten (Ringkasan)</th>
                                            <th style="width: 15%;">Gambar</th>
                                            <th style="width: 20%;" class="text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php $__currentLoopData = $materis; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $materi): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <tr>
                                                <td class="font-weight-bold"><?php echo e($materi->judul); ?></td>
                                                <td><?php echo e(\Str::limit($materi->konten, 70)); ?></td>
                                                <td>
                                                    <?php if($materi->gambar): ?>
                                                        <img src="<?php echo e(asset('storage/' . $materi->gambar)); ?>" alt="Gambar Materi" class="img-fluid rounded shadow-sm" style="max-width: 120px;">
                                                    <?php else: ?>
                                                        <span class="text-muted small">Tidak ada</span>
                                                    <?php endif; ?>
                                                </td>
                                                <td class="text-center">
                                                    <div class="btn-group">
                                                        <a href="<?php echo e(route('materiedit', $materi->id)); ?>" class="btn btn-sm btn-warning btn-action" title="Edit">
                                                            <i class="fas fa-edit"></i> Edit
                                                        </a>
                                                        <button type="button" class="btn btn-sm btn-danger btn-action" title="Hapus" onclick="confirmDelete('<?php echo e($materi->id); ?>', '<?php echo e($materi->judul); ?>')">
                                                            <i class="fas fa-trash-alt"></i> Hapus
                                                        </button>
                                                    </div>
                                                    <form id="delete-form-<?php echo e($materi->id); ?>" action="<?php echo e(route('materidelete', $materi->id)); ?>" method="POST" style="display: none;">
                                                        <?php echo csrf_field(); ?>
                                                        <?php echo method_field('DELETE'); ?>
                                                    </form>
                                                </td>
                                            </tr>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        </div>
                    </div>
            </div>
        </div>
    </section>
    <?php $__env->stopSection(); ?>

<?php $__env->startSection('scripts'); ?>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
$(document).ready(function() {
    // DataTable initialization
    $("#materiTable").DataTable({
        "responsive": true,
        "autoWidth": false,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.12.1/i18n/id.json"
        },
        "columnDefs": [
            { "orderable": false, "targets": 3 } // Disable sorting on 'Aksi' column
        ]
    });

    // Auto-hide alerts
    setTimeout(function() {
        $('.alert').alert('close');
    }, 5000);
});

// Delete confirmation with SweetAlert2
function confirmDelete(materiId, materiJudul) {
    Swal.fire({
        title: 'Anda Yakin?',
        html: `Anda akan menghapus materi: <br><b>${materiJudul}</b>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('delete-form-' + materiId).submit();
        }
    });
}
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/fadil/fadil/admin-ab/resources/views/materi/index.blade.php ENDPATH**/ ?>