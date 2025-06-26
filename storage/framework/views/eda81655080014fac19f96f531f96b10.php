<?php $__env->startSection('content'); ?>
    <section class="content-header">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-sm-6">
                    <h1 class="animate-fade-in">
                        <i class="fas fa-plus-circle mr-2"></i>Tambah Materi Baru
                    </h1>
                    <p class="mb-0 text-white-50">Buat dan publikasikan materi pembelajaran baru.</p>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right animate-fade-in">
                        <li class="breadcrumb-item"><a href="<?php echo e(route('dashboardadmin')); ?>"><i class="fas fa-home"></i> Dashboard</a></li>
                        <li class="breadcrumb-item"><a href="<?php echo e(route('materi')); ?>">Data Materi</a></li>
                        <li class="breadcrumb-item active">Tambah Materi</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card animate-slide-up">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-edit mr-2"></i>Formulir Materi Baru
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

                        <form action="<?php echo e(route('prosestambah')); ?>" method="POST" enctype="multipart/form-data">
                            <?php echo csrf_field(); ?>
                            <div class="card-body p-4">

                                <div class="form-group">
                                    <label for="judul" class="font-weight-bold">Judul Materi</label>
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="fas fa-heading"></i></span>
                                        </div>
                                        <input type="text" class="form-control" id="judul" name="judul" value="<?php echo e(old('judul')); ?>" placeholder="Contoh: Pengenalan Aljabar" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="konten" class="font-weight-bold">Konten Materi</label>
                                    <textarea class="form-control" id="konten" name="konten" placeholder="Tuliskan isi materi di sini..." rows="8" required><?php echo e(old('konten')); ?></textarea>
                                    <small class="form-text text-muted">Tips: Untuk pengalaman menulis yang lebih baik, pertimbangkan untuk menggunakan editor teks kaya (rich-text editor) di masa mendatang.</small>
                                </div>

                                <div class="form-group">
                                    <label for="gambar" class="font-weight-bold">Gambar Pendukung (Opsional)</label>
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="fas fa-image"></i></span>
                                        </div>
                                        <div class="custom-file">
                                            <input type="file" class="custom-file-input" id="gambar" name="gambar" accept="image/png, image/jpeg, image/gif">
                                            <label class="custom-file-label" for="gambar">Pilih gambar...</label>
                                        </div>
                                    </div>
                                    <small class="form-text text-muted">Format yang didukung: JPG, PNG, GIF. Ukuran maks: 2MB.</small>
                                </div>

                            </div>
                            <div class="card-footer text-right">
                                <a href="<?php echo e(route('materi')); ?>" class="btn btn-secondary">
                                    <i class="fas fa-times mr-1"></i> Batal
                                </a>
                                <button type="submit" class="btn btn-primary ml-2">
                                    <i class="fas fa-save mr-1"></i> Simpan Materi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <?php $__env->stopSection(); ?>

<?php $__env->startSection('scripts'); ?>
<script>
// Skrip untuk menampilkan nama file pada input file custom Bootstrap
$(function () {
  $('.custom-file-input').on('change', function () {
    let fileName = $(this).val().split('\\').pop();
    $(this).next('.custom-file-label').addClass("selected").html(fileName);
  });
});
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/fadil/fadil/admin-ab/resources/views/materi/tambahMateri.blade.php ENDPATH**/ ?>