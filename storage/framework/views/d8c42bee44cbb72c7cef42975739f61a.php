<?php $__env->startSection('content'); ?>
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
                <form action="<?php echo e(route('hasil-kuis')); ?>" method="GET" class="mb-3">
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <input type="text" name="search" class="form-control" placeholder="Cari nama siswa..." value="<?php echo e(request('search')); ?>">
                        </div>
                        <div class="col-md-4 mb-2">
                            <select name="kelas" class="form-control">
                                <option value="">Filter kelas</option>
                                <?php $__currentLoopData = $kelasList; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $kelas): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <option value="<?php echo e($kelas); ?>" <?php echo e(request('kelas') == $kelas ? 'selected' : ''); ?>><?php echo e($kelas); ?></option>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
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
                        <?php $__empty_1 = true; $__currentLoopData = $siswa; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                            <tr>
                                <td><?php echo e($item->nama); ?></td>
                                <td><?php echo e($item->kelas); ?></td>
                                <td class="text-center">
                                    <a href="<?php echo e(route('hasil-kuis.riwayat', $item->id)); ?>" class="btn btn-primary btn-sm">Riwayat Kuis</a>
                                </td>
                            </tr>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                            <tr>
                                <td colspan="3" class="text-center">Tidak ada siswa yang sesuai.</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>

                <?php echo e($siswa->withQueryString()->links('vendor.pagination.bootstrap-4')); ?>

            </div>
        </div>
    </div>
</section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/fadil/fadil/admin-ab/resources/views/hasilkuis/index.blade.php ENDPATH**/ ?>