function ForgotPasswordValidation() {
  var valid = true;
  $("#email").removeClass("error-field");
  $(".invalid-feedback").hide();

  var Email = $("#email").val();

  if (Email.trim() == "") {
    valid = false;
    $(".invalid-feedback").show();
    $("#email").addClass("error-field");
  }

  if (valid == false) {
    $(".error-field").first().focus();
    valid = false;
  }

  return valid;
}

function ResetPasswordValidation() {
  var valid = true;
  var passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  $("#password").removeClass("error-field");
  $("#confirm-password").removeClass("error-field");

  $("#signup-password-info").html("").hide();
  $("#confirm-password-info").html("").hide();

  var Password = $("#password").val();
  var ConfirmPassword = $("#confirm-password").val();

  if (Password.trim() == "") {
    $("#signup-password-info")
      .html("Password required.")
      .css("color", "#f06565")
      .show();
    $("#password").addClass("error-field");
    valid = false;
  }else if (!passwordRegex.test(Password)) {
    $("#signup-password-info")
      .html("Password should consist of at least one Upperletter, one lowerletter, a number and a special character.")
      .css("color", "#f06565")
      .show();
    $("#password").addClass("error-field");
    valid = false;
  }
  if (ConfirmPassword.trim() == "") {
    $("#confirm-password-info")
      .html("Password required.")
      .css("color", "#f06565")
      .show();
    $("#confirm-password").addClass("error-field");
    valid = false;
  }
  if (Password != ConfirmPassword) {
    $("#confirm-password-info")
      .html("Both passwords must be same.")
      .css("color", "#f06565")
      .show();
    valid = false;
  }
  if (valid == false) {
    $(".error-field").first().focus();
    valid = false;
  }
  return valid;
}


$("#ForgotPasswordForm").submit(function (e) {
  e.preventDefault();

  if (!ForgotPasswordValidation()) return false;

  $.ajax({
    url: BASE_URL + "forgot_password/forgotPassword",
    method: "POST",
    dataType: 'json',
    data: $(this).serialize(),
    success: function (response) {
      if (response["status"] == "success") {
        notifyme.showNotification(response["status"], response["message"]);
        $(".ForgotPasswordForm").hide();
        $(".reset-password").show();
      } else {
        notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });
});

$("#resetPasswordForm").submit(function (e) {
  e.preventDefault();

  if (!ResetPasswordValidation()) return false;

  $.ajax({
    url: BASE_URL + "forgot_password/resetPassword",
    method: "POST",
    dataType: 'json',
    data: $(this).serialize(),
    success: function (response) {
      if (response["status"] == "success") {
        notifyme.showNotification(response["status"], response["message"]);
        window.location.href = BASE_URL + "login";
      } else {
        notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });
});
