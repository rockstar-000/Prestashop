<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no" name="viewport">
  <title>Components &rsaquo; Table &mdash; Stisla</title>

  <!-- General CSS Files -->
  <link rel="stylesheet" href="assets/modules/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/modules/fontawesome/css/all.min.css">

  <!-- CSS Libraries -->

  <!-- Template CSS -->
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/components.css">
<!-- Start GA -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-94034622-3"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-94034622-3');
</script>
<!-- /END GA --></head>
<body>
  <div id="app">
    <div class="main-wrapper main-wrapper-1">
      <!-- Main Content -->
      <div>
        <div class="row" style="justify-content: center; margin-top: 4rem">
            <div class="col-12 col-md-6 col-lg-6">
            <div class="card">
                <div class="card-header" >
                    <form method="POST" action="testxml.php" name="upload" style="display: flex; justify-content: space-between; width: 100%;">
                        <input type="text" class="form-control" name="url" style="margin-right: 25px">
                        <!-- <button type="submit" class="btn btn-primary">Upload</button> -->
                        <input type="submit" value="Upload" name="submit" class="btn btn-primary">
                    </form>
                </div>
                <div class="card-header" style="display: flex; justify-content: space-between">
                    <div>
                        <p class="btn btn-primary">Total: <span class="badge badge-transparent">100</span></p>
                        <p class="btn btn-success">Success: <span class="badge badge-transparent">30</span></p>
                        <p class="btn btn-danger">Failed: <span class="badge badge-transparent">70</span></p>
                    </div>
                    <button class="btn btn-icon icon-left btn-dark">Export(CSV)</button>
                </div>
                <div class="card-footer text-right">
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  </div>

  <!-- General JS Scripts -->
  <script src="assets/modules/jquery.min.js"></script>
  <script src="assets/modules/popper.js"></script>
  <script src="assets/modules/tooltip.js"></script>
  <script src="assets/modules/bootstrap/js/bootstrap.min.js"></script>
  <script src="assets/modules/nicescroll/jquery.nicescroll.min.js"></script>
  <script src="assets/modules/moment.min.js"></script>
  <script src="assets/js/stisla.js"></script>
  
  <!-- JS Libraies -->
  <script src="assets/modules/jquery-ui/jquery-ui.min.js"></script>

  <!-- Page Specific JS File -->
  <script src="assets/js/page/components-table.js"></script>
  
  <!-- Template JS File -->
  <script src="assets/js/scripts.js"></script>
  <script src="assets/js/custom.js"></script>
</body>
</html>