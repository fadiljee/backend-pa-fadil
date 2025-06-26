<?php $__env->startSection('content'); ?>
    <section class="content-header">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-sm-6">
                    <h1 class="animate-fade-in">
                        <i class="fas fa-users mr-2"></i>Kelola Data Siswa
                    </h1>
                    <p class="mb-0 text-white-50">Manajemen data siswa terpusat.</p>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right animate-fade-in">
                        <li class="breadcrumb-item"><a href="<?php echo e(route('dashboardadmin')); ?>"><i class="fas fa-home"></i> Dashboard</a></li>
                        <li class="breadcrumb-item active">Data Siswa</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-lg-4 col-md-6">
                    <div class="stats-card animate-slide-up">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-users fa-3x mr-4"></i>
                            <div>
                                <div class="stats-number"><?php echo e(count($users)); ?></div>
                                <div class="stats-label">Total Siswa</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="card animate-slide-up" style="animation-delay: 0.2s;">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h3 class="card-title">
                            <i class="fas fa-list mr-2"></i>Daftar Siswa
                        </h3>
                        <a href="<?php echo e(route('tambahSiswa')); ?>" class="btn btn-primary">
                            <i class="fas fa-user-plus mr-2"></i>Tambah Siswa
                        </a>
                    </div>
                </div>

                <div class="card-body">
                    <?php if(session('success')): ?>
                        <div class="alert alert-success alert-dismissible fade show animate-fade-in" role="alert">
                            <i class="fas fa-check-circle mr-2"></i><?php echo e(session('success')); ?>

                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    <?php endif; ?>

                    <?php if($errors->any()): ?>
                        <div class="alert alert-danger alert-dismissible fade show animate-fade-in" role="alert">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            <strong>Terdapat kesalahan:</strong>
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
                        <table id="studentsTable" class="table table-hover w-100">
                            <thead>
                                <tr>
                                    <th class="text-center" style="width: 5%;">No</th>
                                    <th style="width: 45%;">Nama Lengkap</th>
                                    <th style="width: 25%;">NISN</th>
                                    <th class="text-center" style="width: 25%;">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <tr>
                                    <td class="text-center"><?php echo e($index + 1); ?></td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mr-3" style="width: 40px; height: 40px; font-weight: 600;">
                                                <?php echo e(strtoupper(substr($user->nama, 0, 1))); ?>

                                            </div>
                                            <span class="font-weight-bold"><?php echo e($user->nama); ?></span>
                                        </div>
                                    </td>
                                    <td><code class="text-dark"><?php echo e($user->nisn); ?></code></td>
                                    <td class="text-center">
                                        <a href="<?php echo e(route('useredit', $user->id)); ?>" class="btn btn-sm btn-warning btn-action" title="Edit">
                                            <i class="fas fa-edit"></i> Edit
                                        </a>
                                        <button type="button" class="btn btn-sm btn-danger btn-action" title="Hapus" onclick="confirmDelete('<?php echo e($user->id); ?>', '<?php echo e($user->nama); ?>')">
                                            <i class="fas fa-trash-alt"></i> Hapus
                                        </button>
                                        <form id="delete-form-<?php echo e($user->id); ?>" action="<?php echo e(route('userdelete', $user->id)); ?>" method="POST" style="display: none;">
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
    </section>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('scripts'); ?>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
$(document).ready(function() {
    // DataTable initialization
    $("#studentsTable").DataTable({
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
function confirmDelete(userId, userName) {
    Swal.fire({
        title: 'Anda Yakin?',
        html: `Anda akan menghapus data siswa: <br><b>${userName}</b>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('delete-form-' + userId).submit();
        }
    });
}
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/fadil/fadil/admin-ab/resources/views/User/dataUser.blade.php ENDPATH**/ ?>