@extends('admin.layout')

@section('content')
    <section class="content-header">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-sm-6">
                    <h1 class="animate-fade-in">
                        <i class="fas fa-plus-circle mr-2"></i>Tambah Kuis Baru
                    </h1>
                    <p class="mb-0 text-white-50">Buat pertanyaan kuis baru beserta pilihan jawabannya.</p>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right animate-fade-in">
                        <li class="breadcrumb-item"><a href="{{ route('dashboardadmin') }}"><i class="fas fa-home"></i> Dashboard</a></li>
                        <li class="breadcrumb-item"><a href="{{ route('kuis') }}">Data Kuis</a></li>
                        <li class="breadcrumb-item active">Tambah Kuis</li>
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
                                <i class="fas fa-edit mr-2"></i>Formulir Pertanyaan Kuis
                            </h3>
                        </div>
                        @if($errors->any())
                            <div class="alert alert-danger mx-4 mt-4">
                                <i class="fas fa-exclamation-triangle mr-2"></i>
                                <strong>Terdapat Kesalahan:</strong>
                                <ul class="mb-0 mt-2 pl-4">
                                    @foreach($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        <form action="{{ route('prosestambahkuis') }}" method="POST">
                            @csrf
                            <div class="card-body p-4">

                                <div class="form-group">
                                    <label for="pertanyaan" class="font-weight-bold">Pertanyaan</label>
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="fas fa-question-circle"></i></span>
                                        </div>
                                        <input type="text" class="form-control" id="pertanyaan" name="pertanyaan" value="{{ old('pertanyaan') }}" placeholder="Tuliskan pertanyaan kuis di sini" required>
                                    </div>
                                </div>

                                <hr>
                                <h5 class="font-weight-bold mb-3">Pilihan Jawaban</h5>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="jawaban_a">Jawaban A</label>
                                            <div class="input-group">
                                                <div class="input-group-prepend"><span class="input-group-text font-weight-bold">A</span></div>
                                                <input type="text" class="form-control" name="jawaban_a" value="{{ old('jawaban_a') }}" placeholder="Teks untuk pilihan A" required>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="jawaban_b">Jawaban B</label>
                                            <div class="input-group">
                                                <div class="input-group-prepend"><span class="input-group-text font-weight-bold">B</span></div>
                                                <input type="text" class="form-control" name="jawaban_b" value="{{ old('jawaban_b') }}" placeholder="Teks untuk pilihan B" required>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="jawaban_c">Jawaban C</label>
                                            <div class="input-group">
                                                <div class="input-group-prepend"><span class="input-group-text font-weight-bold">C</span></div>
                                                <input type="text" class="form-control" name="jawaban_c" value="{{ old('jawaban_c') }}" placeholder="Teks untuk pilihan C" required>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="jawaban_d">Jawaban D</label>
                                            <div class="input-group">
                                                <div class="input-group-prepend"><span class="input-group-text font-weight-bold">D</span></div>
                                                <input type="text" class="form-control" name="jawaban_d" value="{{ old('jawaban_d') }}" placeholder="Teks untuk pilihan D" required>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr>
                                <h5 class="font-weight-bold mb-3">Konfigurasi Soal</h5>

                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="jawaban_benar">Jawaban Benar</label>
                                            <div class="input-group">
                                                <div class="input-group-prepend"><span class="input-group-text"><i class="fas fa-check-circle"></i></span></div>
                                                <select class="form-control" name="jawaban_benar" required>
                                                    <option value="" disabled selected>Pilih Kunci Jawaban</option>
                                                    <option value="A" {{ old('jawaban_benar') == 'A' ? 'selected' : '' }}>A</option>
                                                    <option value="B" {{ old('jawaban_benar') == 'B' ? 'selected' : '' }}>B</option>
                                                    <option value="C" {{ old('jawaban_benar') == 'C' ? 'selected' : '' }}>C</option>
                                                    <option value="D" {{ old('jawaban_benar') == 'D' ? 'selected' : '' }}>D</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="nilai">Poin Soal</label>
                                            <div class="input-group">
                                                <div class="input-group-prepend"><span class="input-group-text"><i class="fas fa-star"></i></span></div>
                                                <input type="number" class="form-control" name="nilai" value="{{ old('nilai', 10) }}" min="1" required>
                                            </div>
                                        </div>
                                    </div>
                                     <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="materi_id">Materi Terkait</label>
                                            <div class="input-group">
                                                <div class="input-group-prepend"><span class="input-group-text"><i class="fas fa-book"></i></span></div>
                                                <select class="form-control" name="materi_id" required>
                                                    <option value="" disabled selected>Pilih Materi</pre>
                                                    @foreach ($materis as $materi)
                                                        <option value="{{ $materi->id }}" {{ old('materi_id') == $materi->id ? 'selected' : '' }}>{{ $materi->judul }}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer text-right">
                                <a href="{{ route('kuis') }}" class="btn btn-secondary">
                                    <i class="fas fa-times mr-1"></i> Batal
                                </a>
                                <button type="submit" class="btn btn-primary ml-2">
                                    <i class="fas fa-save mr-1"></i> Simpan Kuis
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    @endsection
