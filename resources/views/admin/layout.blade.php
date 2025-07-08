<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SMPN 1 Merawang | Admin Panel</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="{{asset('template/plugins/fontawesome-free/css/all.min.css')}}">
  <link rel="stylesheet" href="{{asset('template/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css')}}">
  <link rel="stylesheet" href="{{asset('template/plugins/datatables-responsive/css/responsive.bootstrap4.min.css')}}">
  <link rel="stylesheet" href="{{asset('template/dist/css/adminlte.min.css')}}">
  <link rel="stylesheet" href="{{asset('template/plugins/overlayScrollbars/css/OverlayScrollbars.min.css')}}">

  <style>
    :root {
      /* === PALET WARNA SOLID (SOLID COLOR PALETTE) === */
      --primary-color: #4f46e5;   /* Indigo 600 */
      --success-color: #16a34a;   /* Green 600 */
      --warning-color: #f59e0b;   /* Amber 500 */
      --danger-color:  #dc2626;   /* Red 600 */
      --dark-color:    #1f2937;   /* Gray 800 */
      --text-dark:     #374151;   /* Gray 700 */
      --light-gray:    #f8f9fa;

      --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      --hover-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
      --border-radius: 12px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      --sidebar-width: 260px;
      --header-height: 70px;
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: #f4f6f9;
    }

    /* Main Header & Sidebar */
    .main-header {
      background: #ffffff;
      border-bottom: 1px solid #dee2e6;
      height: var(--header-height);
    }
    .main-sidebar {
      background-color: var(--dark-color);
      width: var(--sidebar-width);
    }
    .brand-link {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .nav-sidebar .nav-link.active {
        background-color: var(--primary-color) !important;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    .content-wrapper {
      background-color: #f4f6f9;
      padding-top: 1rem;
    }

    /* Enhanced Content Header */
    .content-header {
      background-color: var(--primary-color);
      color: white;
      border-radius: 0 0 var(--border-radius) var(--border-radius);
      margin: -1rem -1rem 2rem -1rem;
      padding: 2rem;
      box-shadow: var(--card-shadow);
    }
    .content-header h1 {
        font-weight: 700;
        font-size: 2.2rem;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    .breadcrumb {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        border-radius: 25px;
    }
    .breadcrumb-item a { color: rgba(255, 255, 255, 0.8); }
    .breadcrumb-item a:hover { color: white; }
    .breadcrumb-item.active { color: white; }

    /* Card Styling */
    .card {
      border: none;
      border-radius: var(--border-radius);
      box-shadow: var(--card-shadow);
      transition: var(--transition);
      overflow: hidden;
      margin-bottom: 2rem;
    }
    .card:hover {
      box-shadow: var(--hover-shadow);
      transform: translateY(-3px);
    }
    .card-header {
      background-color: #fff;
      border-bottom: 1px solid #e9ecef;
      padding: 1.5rem;
    }
    .card-title {
      font-weight: 600;
      font-size: 1.25rem;
      color: var(--text-dark);
    }

    /* Button Styling */
    .btn {
      border-radius: 8px;
      font-weight: 500;
      padding: 0.6rem 1.25rem;
      transition: var(--transition);
      border: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .btn-primary { background-color: var(--primary-color); color: white; }
    .btn-warning { background-color: var(--warning-color); color: var(--dark-color); }
    .btn-danger  { background-color: var(--danger-color);  color: white; }
    .btn-success { background-color: var(--success-color); color: white; }
    .btn-action  { padding: 0.4rem 0.8rem; font-size: 0.875rem; margin: 0 0.2rem; }

    /* Alert Styling */
    .alert {
      border: none;
      border-radius: 10px;
      padding: 1rem 1.5rem;
      border-left: 5px solid;
    }
    .alert-success { background-color: #d1fae5; border-color: #10b981; color: #065f46; }
    .alert-danger  { background-color: #fee2e2; border-color: #ef4444; color: #991b1b; }

    /* Table Styling */
    .table thead th {
        background-color: #f8f9fa;
        color: var(--text-dark);
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.85rem;
        border-bottom: 2px solid var(--primary-color);
        border-top: none;
    }
    .table tbody tr:hover { background-color: #f8f9ff; }
    .table td, .table th { vertical-align: middle; padding: 1rem; }

    /* DataTables Customization */
    .dataTables_wrapper .dataTables_paginate .paginate_button.current,
    .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
        background: var(--primary-color) !important;
        color: white !important;
        border-radius: 8px;
        border: none;
    }

    /* Stats Cards */
    .stats-card {
        color: white;
        border-radius: var(--border-radius);
        padding: 1.5rem;
        box-shadow: var(--card-shadow);
        transition: var(--transition);
        background-color: var(--primary-color); /* Warna default */
    }
    .stats-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--hover-shadow);
    }
    /* Warna spesifik untuk stats-card */
    .stats-card.bg-success { background-color: var(--success-color); }
    .stats-card.bg-warning { background-color: var(--warning-color); }
    .stats-card.bg-danger  { background-color: var(--danger-color); }

    .stats-number { font-size: 2.5rem; font-weight: 700; }
    .stats-label  { font-size: 1rem; opacity: 0.9; }

    /* Animation Classes */
    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
    .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* === Perbaikan UI Brand Link di Sidebar === */

/* Memberikan efek transisi yang halus untuk semua elemen di dalam link */
.brand-link,
.brand-link .brand-image,
.brand-link .brand-text {
    transition: all 0.3s ease-in-out;
}

/* Sedikit menggelapkan latar belakang saat di-hover */
.brand-link:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

/* Membuat logo sedikit membesar dan berputar saat di-hover */
.brand-link:hover .brand-image {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2); /* Bayangan lebih menonjol */
}
/* Menengahkan konten di dalam brand-link jika memiliki class text-center */
.brand-link.text-center {
    justify-content: center;
}
/* Membuat teks sedikit bergeser dan lebih cerah saat di-hover */
.brand-link:hover .brand-text {
    transform: translateX(4px);
    color: #ffffff !important;
    letter-spacing: 0.5px; /* Memberi sedikit jarak antar huruf */
}
</style>
</head>

<body class="hold-transition sidebar-mini layout-fixed layout-navbar-fixed">
  <div class="wrapper">
    <div class="preloader flex-column justify-content-center align-items-center">
      <img class="animation__shake" src="{{asset('gambar/icon.jpg')}}" alt="SchoolLogo" height="80" width="80" style="border-radius: 50%;">
    </div>

    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item">
                <a class="nav-link" data-widget="fullscreen" href="#" role="button">
                  <i class="fas fa-expand-arrows-alt"></i>
                </a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link" data-toggle="dropdown" href="#">
                    <i class="far fa-user-circle"></i>
                    <span class="ml-1">{{Session::get('ambilUser')->nama}}</span>
                </a>
                <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                    <div class="dropdown-divider"></div>

                    <a href="#" class="dropdown-item dropdown-footer text-danger" onclick="event.preventDefault(); confirmLogout();">
                        <i class="fas fa-sign-out-alt mr-2"></i> Log Out
                    </a>

                </div>
            </li>
        </ul>
    </nav>
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
     <a href="{{ route('dashboardadmin') }}" class="brand-link text-center" title="Dashboard SMPN 1 Merawang">
    <span class="brand-text font-weight-bold">SMPN 1 MERAWANG</span>
</a>

      <div class="sidebar">
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <li class="nav-header">MENU UTAMA</li>
                <li class="nav-item">
                    <a href="{{route('dashboardadmin')}}" class="nav-link {{ Request::routeIs('dashboardadmin') ? 'active' : '' }}">
                        <i class="nav-icon fas fa-tachometer-alt"></i><p>Dashboard</p>
                    </a>
                </li>
                <li class="nav-header">KELOLA DATA</li>
                <li class="nav-item">
                    <a href="{{route('dataSiswa')}}" class="nav-link {{ Request::routeIs('dataSiswa') ? 'active' : '' }}">
                        <i class="nav-icon fas fa-users"></i><p>Data Siswa</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{route('materi')}}" class="nav-link {{ Request::routeIs('materi') ? 'active' : '' }}">
                        <i class="nav-icon fas fa-book-open"></i><p>Kelola Materi</p>
                    </a>z
                </li>
                <li class="nav-item">
                    <a href="{{route('kuis')}}" class="nav-link {{ Request::routeIs('kuis') ? 'active' : '' }}">
                        <i class="nav-icon fas fa-puzzle-piece"></i><p>Kelola Kuis</p>
                    </a>
                </li>
                <li class="nav-header">ANALISIS & LAPORAN</li>
                <li class="nav-item">
                    <a href="{{route('hasil-kuis')}}" class="nav-link {{ Request::routeIs('hasil-kuis') ? 'active' : '' }}">
                        <i class="nav-icon fas fa-poll"></i><p>Hasil Kuis</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{route('leaderboard')}}" class="nav-link {{ Request::routeIs('leaderboard') ? 'active' : '' }}">
                        <i class="nav-icon fas fa-trophy"></i><p>Peringkat Siswa</p>
                    </a>
                </li>
                {{-- <li class="nav-header">AKUN</li> --}}

                {{-- <li class="nav-item">
                    <a href="#" class="nav-link" onclick="event.preventDefault(); confirmLogout();">
                        <i class="nav-icon fas fa-sign-out-alt text-danger"></i><p>Log-out</p>
                    </a>
                </li> --}}
            </ul>
        </nav>
        </div>
      </aside>

    <div class="content-wrapper">
      @yield('content')
    </div>
    <footer class="main-footer">
      <strong>Copyright &copy; {{ date('Y') }} <a href="#" class="text-dark">SMP Negeri 1 Merawang</a>.</strong>
    </footer>

  </div>
  <script src="{{asset('template/plugins/jquery/jquery.min.js')}}"></script>
  <script src="{{asset('template/plugins/bootstrap/js/bootstrap.bundle.min.js')}}"></script>
  <script src="{{asset('template/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js')}}"></script>
  <script src="{{asset('template/dist/js/adminlte.js')}}"></script>
  <script src="{{asset('template/plugins/datatables/jquery.dataTables.min.js')}}"></script>
  <script src="{{asset('template/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js')}}"></script>
  <script src="{{asset('template/plugins/datatables-responsive/js/dataTables.responsive.min.js')}}"></script>
  <script src="{{asset('template/plugins/datatables-responsive/js/responsive.bootstrap4.min.js')}}"></script>

  {{-- TAMBAHKAN SweetAlert2 CDN --}}
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

  @yield('scripts')

  <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
      @csrf
  </form>

  <script>
    function confirmLogout() {
        Swal.fire({
            title: 'Anda Yakin Ingin Keluar?',
            text: "Sesi Anda akan diakhiri setelah ini.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Log-out!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                // Jika dikonfirmasi, kirim form log-out
                document.getElementById('logout-form').submit();
            }
        });
    }
  </script>

</body>
</html>
