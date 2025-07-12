<?php $__env->startSection('content'); ?>
    <section class="content-header">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-sm-6">
                    <h1 class="animate-fade-in">
                        <i class="fas fa-poll-h mr-2"></i>Rekap Hasil Kuis - <?php echo e($siswa->nama); ?>

                    </h1>
                    <p class="mb-0 text-white-50">Analisis dan rekapitulasi semua jawaban kuis dari siswa ini.</p>
                    <a href="<?php echo e(route('hasil-kuis')); ?>" class="btn btn-secondary btn-sm mt-3">
                        <i class="fas fa-arrow-left mr-1"></i> Kembali ke Daftar Siswa
                    </a>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right animate-fade-in">
                        <li class="breadcrumb-item"><a href="<?php echo e(route('dashboardadmin')); ?>"><i class="fas fa-home"></i> Dashboard</a></li>
                        <li class="breadcrumb-item"><a href="<?php echo e(route('hasil-kuis')); ?>">Hasil Kuis</a></li>
                        <li class="breadcrumb-item active"><?php echo e($siswa->nama); ?></li>
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
                                <?php $__empty_1 = true; $__currentLoopData = $hasilKuis; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $hasil): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                                    <tr>
                                        <td class="font-weight-bold"><?php echo e($siswa->nama); ?></td>
                                        <td><?php echo e($hasil->kuis->materi->judul ?? 'Materi Dihapus'); ?></td>
                                        <td>
                                            <?php if($hasil->jawaban_user == $hasil->kuis->jawaban_benar): ?>
                                                <span class="badge badge-success px-2 py-1"><?php echo e($hasil->jawaban_user); ?></span>
                                                <i class="fas fa-check-circle text-success ml-1" title="Benar"></i>
                                            <?php else: ?>
                                                <span class="badge badge-danger px-2 py-1"><?php echo e($hasil->jawaban_user ?? 'Tidak Dijawab'); ?></span>
                                                <i class="fas fa-times-circle text-danger ml-1" title="Salah"></i>
                                            <?php endif; ?>
                                        </td>
                                        <td>
                                            <span class="badge badge-info px-2 py-1"><?php echo e($hasil->kuis->jawaban_benar ?? '-'); ?></span>
                                        </td>
                                        <td class="text-center">
                                            <span class="badge badge-primary px-2 py-1" style="font-size: 0.9rem;"><?php echo e($hasil->skor ?? 0); ?></span>
                                        </td>
                                        <td>
                                            <?php echo e($hasil->waktu_dikerjakan ? \Carbon\Carbon::parse($hasil->waktu_dikerjakan)->translatedFormat('d F Y, H:i') : '-'); ?>

                                        </td>
                                    </tr>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                                    <tr>
                                        <td colspan="6" class="text-center py-4">
                                            <p class="mb-0">Tidak ada data hasil kuis.</p>
                                        </td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>

                    <?php if($hasilKuis->hasPages()): ?>
                        <nav class="d-flex justify-content-center mt-4">
                            <?php echo e($hasilKuis->links('vendor.pagination.bootstrap-4')); ?>

                        </nav>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/fadil/fadil/admin-ab/resources/views/hasilkuis/riwayat.blade.php ENDPATH**/ ?>