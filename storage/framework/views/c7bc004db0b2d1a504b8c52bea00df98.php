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
<?php $__env->startSection('content'); ?>
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
                        <li class="breadcrumb-item"><a href="<?php echo e(route('dashboardadmin')); ?>"><i class="fas fa-home"></i> Dashboard</a></li>
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
                                        <?php $__empty_1 = true; $__currentLoopData = $leaderboard; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $entry): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                                            <?php
                                                $rank = ($leaderboard->currentPage() - 1) * $leaderboard->perPage() + $index + 1;
                                            ?>
                                            
                                            <tr class="<?php if($rank <= 3): ?> rank-<?php echo e($rank); ?> <?php endif; ?>">
                                                <td class="text-center">
                                                    <?php if($rank == 1): ?>
                                                        <span class="fa-stack fa-lg" title="Peringkat 1">
                                                            <i class="fas fa-certificate fa-stack-2x" style="color: #ffd700;"></i>
                                                            <strong class="fa-stack-1x fa-inverse text-dark"><?php echo e($rank); ?></strong>
                                                        </span>
                                                    <?php elseif($rank == 2): ?>
                                                        <span class="fa-stack fa-lg" title="Peringkat 2">
                                                            <i class="fas fa-certificate fa-stack-2x" style="color: #c0c0c0;"></i>
                                                            <strong class="fa-stack-1x fa-inverse text-dark"><?php echo e($rank); ?></strong>
                                                        </span>
                                                    <?php elseif($rank == 3): ?>
                                                        <span class="fa-stack fa-lg" title="Peringkat 3">
                                                            <i class="fas fa-certificate fa-stack-2x" style="color: #cd7f32;"></i>
                                                            <strong class="fa-stack-1x fa-inverse text-dark"><?php echo e($rank); ?></strong>
                                                        </span>
                                                    <?php else: ?>
                                                        <span class="h5 font-weight-bold"><?php echo e($rank); ?></span>
                                                    <?php endif; ?>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mr-3" style="width: 40px; height: 40px; font-weight: 600;">
                                                            
                                                            <?php if($entry->siswa): ?>
                                                                <?php echo e(strtoupper(substr($entry->siswa->nama, 0, 1))); ?>

                                                            <?php else: ?>
                                                                ?
                                                            <?php endif; ?>
                                                        </div>
                                                        <span class="font-weight-bold"><?php echo e($entry->siswa->nama ?? 'Siswa Dihapus'); ?></span>
                                                    </div>
                                                </td>
                                                <td class="text-center">
                                                    <span class="badge <?php echo e($entry->gelar['kelas']); ?> px-3 py-2" style="font-size: 0.9rem;">
                                                        <i class="fas fa-star mr-1"></i> <?php echo e($entry->gelar['teks']); ?>

                                                    </span>
                                                </td>
                                                <td class="text-center">
                                                    <span class="badge badge-dark px-3 py-2" style="font-size: 1rem;">
                                                        <?php echo e($entry->total_skor); ?>

                                                    </span>
                                                </td>
                                            </tr>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                                            <tr>
                                                <td colspan="4" class="text-center py-5">
                                                    <p class="mb-0">Belum ada data peringkat yang tersedia.</p>
                                                    <small class="text-muted">Hasil akan muncul setelah siswa mengerjakan kuis.</small>
                                                </td>
                                            </tr>
                                        <?php endif; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <?php if($leaderboard->hasPages()): ?>
                            <div class="card-footer clearfix">
                                <nav class="d-flex justify-content-center">
                                    <?php echo e($leaderboard->appends(request()->query())->links('vendor.pagination.bootstrap-4')); ?>

                                </nav>
                            </div>
                        <?php endif; ?>
                    </div>
                    </div>
            </div>
        </div>
    </section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/fadil/fadil/admin-ab/resources/views/skorhasil/index.blade.php ENDPATH**/ ?>