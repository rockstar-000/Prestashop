function ChoosePlan(id, current_plan, amount) {
  $("#paypal-button-container").html("");
  if (amount == 0) {
    UpdateStatus(id, "free", "COMPLETED", "Paypal");
  } else {
    paypal
      .Buttons({
        // Set up the transaction
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                },
              },
            ],
          });
        },

        // Finalize the transaction
        onApprove: function (data, actions) {
          return actions.order.capture().then(function (orderData) {
            // // Successful capture! For demo purposes:
            console.log(
              "Capture result",
              orderData,
              JSON.stringify(orderData, null, 2)
            );

            var transaction = orderData.purchase_units[0].payments.captures[0];
            if (transaction.status == "COMPLETED") {
              UpdateStatus(
                id,
                transaction.id,
                transaction.status,
                "Paypal",
                amount
              );
            } else {
              notifyme.showNotification("error", "Payment not completed.");
            }
          });
        },
      })
      .render("#paypal-button-container");

    $("#modalPaymentMethod").modal();
    if (current_plan == 1) {
      $(".already-plan-message").html(
        '<p>You have a ' +
          current_plan +
          " month currently active. <br/> Would you like to purchase another plan that will begin at the end of your current plan?<p>"
      );
    } else if (current_plan == 2 || current_plan == 3) {
      $(".already-plan-message").html(
        '<p>You already have an existing plan. Please wait for the plan to complete before purchasing a new one.<p>'
      );
      $("#paypal-button-container").hide();
    }
  }
}

$(".bootstrapSwitch .switchBox").click(function () {
  if ($(this).is(":checked")) {
    $(this).attr("checked", true);
    $(this).parent().removeClass("checkWrapNO");
    $(this).parent().addClass("checkWrap");
    $(".bootstrapSwitch .checkWrap .checkBoxValue").text("Active");
  } else {
    $(this).removeAttr("checked");
    $(this).parent().removeClass("checkWrap");
    $(this).parent().addClass("checkWrapNO");
    $(".bootstrapSwitch .checkWrapNO .checkBoxValue").append("Not Active");
  }
});

function UpdateStatus(id, refno, status, paymentMethod, amount) {
  const price = amount ? amount : 0;
  $.ajax({
    url: BASE_URL + "plan/updatePlanStatus",
    method: "POST",
    dataType: "json",
    data: {
      paymentMethod: paymentMethod,
      id: id,
      status: status,
      refno: refno,
      amount: price
    },
    dataType: "json",
    success: function(response) {
      if (response["status"] == "success") {
        $('#modalPaymentMethod').modal('hide');
        notifyme.showNotification(response["status"], response["message"]);
        setTimeout(function () {
          window.location.href = BASE_URL + "profile";
        }, 2000);
      } else {
        if (status == "COMPLETED") {
          notifyme.showNotification('COMPLETED', 'Payment successful but an error occured while updating plan details, please contact support.');
        } else {
          notifyme.showNotification(response["status"], response["message"]);
        }
      }
    }
  });
}

function getUserAccountList() {

  $("#plan_users_list").DataTable({
    language: {
      paginate: {
        next: '&#62;', // or '→'
        previous: '&#60;' // or '←' 
      }
    },
    destroy: true,
    ordering:false,
    ajax: function (data, callback, settings) {
      $.ajax({
        url: BASE_URL + "/profile/getUserAccountList",
        method: "POST",
        async: false,
        success: function (response) {
          response = JSON.parse(response);
          callback(response);
        },
      });
    },
    columns: [
      { data: "email"},
      { data: "account_id",
        render: function (d) {
          return (`
            <a href='#' onclick='selectAccount(${d})'>${d}</a></td>
          `)
        }
      },
      { data: "broker"},
      { data: "created_date"},
      { data: "price"},
      { data: "end_date"},
      { data: "is_active",
        render: function (d) {
          return (`
            <label>
             <input type="checkbox" name="custom-switch-checkbox" class="custom-switch-input" ${(d == "1" ? "checked" : "")} onchange="changeStatus(this)">
             <span class="custom-switch-indicator"></span>
            </label>`)
        },
      },
      { data: "account_id",
        render: function (d) {
          return (`<button type="button" class="btn btn-danger p-1 deleteAccount" onClick="delectAccount(${d})"><a><i class="ion-trash-a"></i></a></button>`)
        },
      },
    ],
  });
}

function AddAccount() {
  console.log(this);
  if ($("#txtAccountId").val() == "") {
    notifyme.showNotification("error", "Please write account to add.");
    return false;
  }
  $.ajax({
    url: BASE_URL + "profile/addAccount",
    method: "POST",
    data: { account_id: $("#txtAccountId").val() },
    success: function (response) {
      response = JSON.parse(response);
      if (response["status"] == "success") {
        // notifyme.showNotification(response["status"], response["message"]);
        $("#plan_users_list").DataTable().ajax.reload();
      } else {
        // notifyme.showNotification(response["status"], response["message"]);z
      }
    },
  });
}

function UpdateAccount(Sender, AccountId) {
  if (confirm("Are you sure you want to " + Sender + " the account?")) {
    $.ajax({
      url: BASE_URL + "profile/updateAccountStatus",
      method: "POST",
      data: {
        account_id: AccountId,
        status: Sender,
      },
      success: function (response) {
        response = JSON.parse(response);
        if (response["status"] == "success") {
          $("#plan_users_list").DataTable().ajax.reload();
          // notifyme.showNotification(response["status"], response["message"]);
        } else {
          // notifyme.showNotification(response["status"], response["message"]);
        }
      },
    });
  } else {
    if ($(Sender).is(":checked")) {
      $(Sender).prop("checked", false);
    } else {
      $(Sender).prop("checked", true);
    }
  }
}

function delectAccount(account_id) {
  if (confirm("Are you sure you want to delete this account?")) {
    $.ajax({
      url: BASE_URL + "profile/delectAccount",
      method: "POST",
      async: false,
      data: {
        account_id: account_id,
      },
      success: function (response) {
        response = JSON.parse(response);
        if (response["status"] == "success") {
          // notifyme.showNotification(response["status"], response["message"]);
          $("#plan_users_list").DataTable().ajax.reload();
        } else if (response["status"] == "error") {
          // notifyme.showNotification(response["status"], response["message"]);
        }
        
      },
    });
  }
}

function getUserInvoices(current_account_id) {
  var cDate = new Date();
  $("#plan_invoice_list").DataTable({
    language: {
      paginate: {
        next: "&#62;", // or '→'
        previous: "&#60;", // or '←'
      },
    },
    destroy: true,
    order: [[3, "desc"]],
    ajax: function (data, callback, settings) {
      $.ajax({
        url: BASE_URL + "profile/getUserInvoices",
        method: "POST",
        success: function (response) {
          response = JSON.parse(response);
          callback(response);
        },
      });
    },
    columns: [
      { data: "payment_reference_id" },
      {
        render: function (data, type, full, meta) {
          if (
            typeof full.invoice_date != "undefined" &&
            full.invoice_date != null
          ) {
            var invoice_date =
              full.invoice_date == "" ? "-" : full.invoice_date.split(" ")[0];
            return invoice_date;
          } else {
            return "-";
          }
        },
      },
      {
        //data: "invoice_date"
        render: function (data, type, full, meta) {
          return full.start_date.split(" ")[0];
        },
      },
      {
        data: "end_date",
      },
      { data: "amount" },
      {
        render: function (data, type, full, meta) {
          var payment_status =
            full.payment_reference_id == "" ? "Unpaid" : "Paid";
          return payment_status;
        },
      },
    ],
  });
}

function selectAccount(user_id) {
  console.log($(user_id));
  window.location = BASE_URL + '/profile?ac=' + user_id;
}

$("#addaccount").click(function () {
  AddAccount();
  $("#plan_users_list").ajax.reload();
});

function changeStatus(obj){
  var status = $(obj).is(":checked") ? "Activate" : "DeActivate";
  var account_id = $(obj).parent().parent().parent().children()[1].innerHTML;
  UpdateAccount(status, account_id);
}

$(document).ready(function () {
  getUserAccountList();
  getUserInvoices();
});