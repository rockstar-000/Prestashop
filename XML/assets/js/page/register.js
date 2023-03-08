$("#registerForm").submit(function (e) {
  e.preventDefault();

  if (!signupValidation()) return false;

  $.ajax({
    url: BASE_URL + "register/registerUser",
    method: "POST",
    dataType: 'json',
    data: $(this).serialize(),
    success: function (response) {
      if (response["status"] == "success") {
        notifyme.showNotification(response["status"], response["message"]);
        $(".register-form-wrap").hide();
        $(".resend-email-verification").attr("data-email", $("#email").val());
        $("#change-email-id").attr("data-change-email", $("#email").val());
        $(".verification-success-confirmation").show();
        $(".verification-success-email").html($("#email").val());
      } else {
        notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });
});

function signupValidation() {
  var valid = true;
  var emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  var passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  $("#username").removeClass("error-field");
  $("#email").removeClass("error-field");
  $("#password").removeClass("error-field");
  $("#confirm-password").removeClass("error-field");

  $("#username-info").html("").hide();
  $("#email-info").html("").hide();
  $("#signup-password-info").html("").hide();
  $("#confirm-password-info").html("").hide();

  var UserName = $("#username").val();
  var email = $("#email").val();
  var Password = $("#password").val();
  var ConfirmPassword = $("#confirm-password").val();

  if (UserName.trim() == "") {
    $("#username-info")
      .html("Username required.")
      .css("color", "#f06565")
      .show();
    $("#username").addClass("error-field");
    valid = false;
  }else if(UserName.match(/\s/g)){
    $("#username-info")
      .html("Username should be without space.")
      .css("color", "#f06565")
      .show();
    $("#username").addClass("error-field");
    valid = false;
  }

  if (email == "") {
    $("#email-info").html("Email required").css("color", "#f06565").show();
    $("#email").addClass("error-field");
    valid = false;
  } else if (email.trim() == "") {
    $("#email-info")
      .html("Invalid email address.")
      .css("color", "#f06565")
      .show();
    $("#email").addClass("error-field");
    valid = false;
  } else if (!emailRegex.test(email)) {
    $("#email-info")
      .html("Invalid email address.")
      .css("color", "#f06565")
      .show();
    $("#email").addClass("error-field");
    valid = false;
  }
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

$("body").on("click", ".resend-email-verification", function (e) {
  e.preventDefault();

  var emailid = $(this).attr("data-email");
  $.ajax({
    url: BASE_URL + "register/resendVerificationEmail",
    method: "POST",
    data: {
      emailid: emailid,
    },
    success: function (response) {
      response = JSON.parse(JSON.stringify(response));
      if (response["status"] == "success") {
        notifyme.showNotification(response["status"], response["message"]);
      } else {
        notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });
});

$("#completeRegistration").submit(function (e) {
  e.preventDefault();

  if (!confirmationRegValidation()) return false;

  $.ajax({
    url: BASE_URL + "register/completeRegistration",
    method: "POST",
    data: $(this).serialize(),
    success: function (response) {
      response = JSON.parse(response);
      if (response["status"] == "success") {
        notifyme.showNotification(response["status"], response["message"]);
        setTimeout(function () {
          window.location.href = BASE_URL + "login";
        }, 3000);
        // $('.register-form-wrap').hide();
        // $('.resend-email-verification').attr('data-email',$("#email").val())
        // $('.verification-success-confirmation').show();
        // $('.verification-success-email').html($("#email").val());
      } else {
        notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });
});

function confirmationRegValidation() {
  var valid = true;

  $("#fname").removeClass("error-field");
  $("#lname").removeClass("error-field");
  $("#country").removeClass("error-field");
  $("#timezone").removeClass("error-field");

  $("#fname-info").html("").hide();
  $("#lname-info").html("").hide();
  $("#country-info").html("").hide();
  $("#timezone-info").html("").hide();

  var fname = $("#fname").val();
  var lname = $("#lname").val();
  var country = $("#country").val();
  var timezone = $("#timezone").val();

  if (fname.trim() == "") {
    $("#fname-info")
      .html("First name required.")
      .css("color", "#f06565")
      .show();
    $("#fname").addClass("error-field");
    valid = false;
  }

  if (lname == "") {
    $("#lname-info").html("Last name required").css("color", "#f06565").show();
    $("#lname").addClass("error-field");
    valid = false;
  }

  if (country.trim() == "") {
    $("#country-info").html("Country required.").css("color", "#f06565").show();
    $("#country").addClass("error-field");
    valid = false;
  }

  if (timezone.trim() == "") {
    $("#timezone-info")
      .html("Timezone required.")
      .css("color", "#f06565")
      .show();
    $("#timezone").addClass("error-field");
    valid = false;
  }

  if (valid == false) {
    $(".error-field").first().focus();
    valid = false;
  }
  return valid;
}

$("body").on("click", "#change-emailID", function (e) {
  e.preventDefault();

  var emailid = $("#change-email-id").attr("data-change-email");
  var emailchangeid = $("#change-email-id").val();

  $.ajax({
    url: BASE_URL + "register/changeEmail",
    method: "POST",
    data: {
      emailid: emailid,
      emailchangeid: emailchangeid,
    },
    success: function (response) {
      response = JSON.parse(response);
      if (response["status"] == "success") {
        notifyme.showNotification(response["status"], response["message"]);
      } else {
        notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });
});

$("body").on("click", "#see_password", function () {
  $("#password").attr("type", "text");
  $("#confirm-password").attr("type", "text");
  $("#hide_password").show();
  $("#see_password").hide();
});

$("body").on("click", "#hide_password", function () {
  $("#password").attr("type", "password");
  $("#confirm-password").attr("type", "password");
  $("#see_password").show();
  $("#hide_password").hide();
});