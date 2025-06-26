<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin Panel | Log in</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="{{asset('template/plugins/fontawesome-free/css/all.min.css')}}">
  <link rel="stylesheet" href="{{asset('template/dist/css/adminlte.min.css')}}">

  <style>
    :root {
      --primary-color: #4f46e5;
      --text-dark: #374151;
      --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      --border-radius: 12px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .login-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f4f6f9;
      /* Subtle geometric background pattern */
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23d8dde6' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .login-box {
      width: 100%;
      max-width: 400px;
      background-color: #ffffff;
      border-radius: var(--border-radius);
      box-shadow: var(--card-shadow);
      overflow: hidden;
      animation: slideUp 0.6s ease-out forwards;
    }

    .login-logo {
      padding: 2rem 1rem 0 1rem;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      text-align: center;
    }

    .login-logo img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 4px solid #fff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
    }

    .login-logo h3 {
        font-weight: 700;
        color: var(--text-dark);
    }

    .login-card-body {
      padding: 2rem;
    }

    .login-box-msg {
      font-weight: 500;
      color: #6c757d;
      margin-bottom: 1.5rem;
    }

    .form-control {
      height: 50px;
      border-radius: 8px;
    }
    .form-control:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 0.2rem rgba(79, 70, 229, 0.25);
    }

    .btn-primary {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
      border-radius: 8px;
      font-weight: 600;
      padding: 0.75rem;
      transition: var(--transition);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
    }

    /* Consistent Alert Styling */
    .alert-danger {
      background-color: #fee2e2;
      border: none;
      color: #991b1b;
      border-left: 5px solid #ef4444;
      border-radius: 10px;
      font-weight: 500;
    }
    .alert-danger ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }

    @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body class="hold-transition login-page">

  <div class="login-box">
    <div class="login-logo">
      <img src="{{asset('gambar/icon.jpg')}}" alt="School Logo">
      <h3>SMPN 1 MERAWANG</h3>
    </div>
    <div class="card-body login-card-body">
      <p class="login-box-msg text-center">Silakan masuk untuk melanjutkan</p>

      <form action="{{route('loginproses')}}" method="post">
        @csrf
        @if ($errors->any())
        <div class="alert alert-danger mb-3">
          <ul>
            @foreach ($errors->all() as $error)
              <li><i class="fas fa-exclamation-triangle mr-2"></i>{{$error}}</li>
            @endforeach
          </ul>
        </div>
        @endif

        <div class="input-group mb-3">
          <input type="email" class="form-control" name="email" placeholder="Email" required>
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-envelope"></span>
            </div>
          </div>
        </div>

        <div class="input-group mb-4">
          <input type="password" class="form-control" name="password" placeholder="Password" required>
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-lock"></span>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <button type="submit" class="btn btn-primary btn-block">MASUK</button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <script src="{{asset('template/plugins/jquery/jquery.min.js')}}"></script>
  <script src="{{asset('template/plugins/bootstrap/js/bootstrap.bundle.min.js')}}"></script>
  <script src="{{asset('template/dist/js/adminlte.min.js')}}"></script>
</body>
</html>
