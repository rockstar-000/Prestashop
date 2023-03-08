
$("#AccountListingGridGrouped").submit(function (event) {
  event.preventDefault();

  var fname = $("#fname_setting").val();
  var lname = $("#lname_setting").val();
  var phone = $("#phone_setting").val();
  var street = $("#street_setting").val();
  var city = $("#city_setting").val();
  var state = $("#state_setting").val();
  var country = $("#country_setting").val();
  var zipcode = $("#zipcode_setting").val();
  console.log(zipcode);
  $.ajax({
    url: BASE_URL + "profile/updateUserProfile",
    method: "POST",
    data: {
      fname: fname,
      lname: lname,
      phone: phone,
      street: street,
      city: city,
      state: state,
      country: country,
      zipcode: zipcode,
    },
    success: function (response) {
      response = JSON.parse(response);
      if (response["status"] == "success") {
        window.location = BASE_URL + "/profile/profile";
      } else {
      }
    },
  });
});

$("#modalUsernameForm").submit(function (event) {
  event.preventDefault();

  var username = $("#modalUsernameForm #username").val();
  var birth_date = $("#birth_date").val();

  $.ajax({
    url: BASE_URL + "/profile/changeUsername",
    method: "POST",
    data: {
      username: username,
      birth_date : birth_date
    },
    success: function (response) {
      response = JSON.parse(response);
      if (response["status"] == "success") {
        setTimeout(function () {
          window.location.href = BASE_URL + "profile/profile";
        }, 1000);
      } else {
      }
    },
  });
});

$('#user_time_zone').change(function(){
  $.ajax({
    url: BASE_URL + "/profile/changeGMT",
    method: "POST",
    data: {
      timezone: $('#user_time_zone').val(),
    },
    success: function (response) {
      response = JSON.parse(response);
      console.log(response['status']);
      if (response["status"] == "success") {
          notifyme.showNotification(response["status"], response["message"]);
        setTimeout(function () {
          window.location.href = BASE_URL + "profile/profile";
        }, 1000);
      } else {
      }
    },
  });
})

$(document).ready(function(){
  $('#user_time_zone').val(_baseGMT);
});