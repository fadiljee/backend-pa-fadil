<?php $__env->startSection('content'); ?>
    <section class="content-header">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-sm-6">
                    <h1 class="animate-fade-in">
                        <i class="fas fa-user-plus mr-2"></i>Tambah Data Siswa
                    </h1>
                    <p class="mb-0 text-white-50">Formulir untuk mendaftarkan siswa baru.</p>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right animate-fade-in">
                        <li class="breadcrumb-item"><a href="<?php echo e(route('dashboardadmin')); ?>"><i class="fas fa-home"></i> Dashboard</a></li>
                        <li class="breadcrumb-item"><a href="<?php echo e(route('dataSiswa')); ?>">Data Siswa</a></li>
                        <li class="breadcrumb-item active">Tambah Siswa</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card animate-slide-up">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-edit mr-2"></i> Formulir Pendaftaran Siswa
                            </h3>
                        </div>
                        <?php if($errors->any()): ?>
                            <div class="alert alert-danger mx-4 mt-4">
                                <i class="fas fa-exclamation-triangle mr-2"></i>
                                <strong>Terdapat Kesalahan:</strong>
                                <ul class="mb-0 mt-2 pl-4">
                                    <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <li><?php echo e($error); ?></li>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </ul>
                            </div>
                        <?php endif; ?>

                        <form action="<?php echo e(route('prosesregister')); ?>" method="POST">
                            <?php echo csrf_field(); ?>
                            <div class="card-body p-4">

                                <div class="form-group">
                                    <label for="nama" class="font-weight-bold">Nama Lengkap</label>
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="fas fa-user"></i></span>
                                        </div>
                                        <input type="text" class="form-control" id="nama" name="nama" value="<?php echo e(old('nama')); ?>" placeholder="Masukkan Nama Lengkap Siswa" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="nisn" class="font-weight-bold">NISN</label>
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="fas fa-id-card"></i></span>
                                        </div>
                                        <input type="number" class="form-control" id="nisn" name="nisn" value="<?php echo e(old('nisn')); ?>" placeholder="Masukkan Nomor Induk Siswa Nasional" required>
                                    </div>
                                    <small class="form-text text-muted">Pastikan NISN unik dan belum terdaftar.</small>
                                </div>

                            </div>
                            <div class="card-footer text-right">
                                <a href="<?php echo e(route('dataSiswa')); ?>" class="btn btn-secondary">
                                    <i class="fas fa-times mr-1"></i> Batal
                                </a>
                                <button type="submit" class="btn btn-primary ml-2">
                                    <i class="fas fa-save mr-1"></i> Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                    </div>
            </div>
        </div>
    </section>
    <?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/fadil/fadil/admin-ab/resources/views/User/tambahUser.blade.php ENDPATH**/ ?>