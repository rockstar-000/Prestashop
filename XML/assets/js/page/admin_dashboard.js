"use strict";

function delete_user(user_id){
  if (confirm('Are you sure you want to delete this User with all Accounts?')) {
      $.ajax({
      url: "deleteUser",
      method: "POST",
      async: false,
      data: {
          user_id: user_id,
      },
      success: function (response) {
        response = JSON.parse(response);
        if (response["status"] == "success") {
            notifyme.showNotification(response["status"], response["message"]);
            window.location.reload();
         } else if (response["status"] == "error"){
            notifyme.showNotification(response["status"], response["message"]);
        }
      }
    });
  } 
}

function load_accounts(elem) {
  const user_id = $(`#${elem}`).attr('rel');
  $.ajax({
    url: BASE_URL + "/dashboard/getAccounts",
    method: "POST",
    async: false,
    data: {
       user_id: user_id,
    },
    success: function (response) {
        response = JSON.parse(response);
        var replace = '<small><table>';
        if (response["status"] == "success") {
          response["data"].map((d) => {
            var gmt = d.BaseGMT!=undefined ? d.BaseGMT : '';
            replace = replace + `<tr>
              <td style='border:0; width:2em;'>${(d.is_active == "1" ? "<span class='badge badge-success as'>Active</span>" : "<span class='badge badge-danger as'>InActive</span>")}</td>
              <td style='border:0; width:4em;'><a href='#' onclick='selectAccount(${d.acct})'>${d.acct}</a></td>
              <td style='border:0; white-space:nowrap; color:gray;'>${gmt}</td>
              </tr>`;
            });
            replace = replace + '</table></small>';
            $(`#${elem}`).replaceWith(replace);
          } else {
            notifyme.showNotification(response["status"], response["message"]);
          }
    },
    });
}

function get_client_status() {
  var cDate = new Date();
  var default_image = BASE_URL + 'assets/img/avatar/avatar-1.png';
  $("#admin_dashboard_client_list").DataTable({
    language: {
      paginate: {
        next: '&#62;', // or '→'
        previous: '&#60;' // or '←' 
      }
    },
    order: [[5, 'asc']],
    ajax: function (data, callback, settings) {
      $.ajax({
        url: BASE_URL + "/dashboard/getTableData",
        method: "POST",
        success: function (response) {
          response = JSON.parse(response);
          callback(response);
        },
      });
    },
    columns: [
      {
        data: "active",
        render: function (d) {
          if (d == 1) {
            return '<span class="badge badge-success as">active</span>';
          } else {
            return '<span class="badge badge-danger as">inactive</span>';
          }
        },
      },
      { data: "avatar", 
        render: function (d) {
          return (d)
            ? `<div class='user-avatar'><img class="client-avatar" src='${d}'></div>`
            : `<div class='user-avatar'><img class="client-avatar" src=`+ default_image +`></div>`;
          }
        },
      { data: "username" },
      { data: "email" },
      { data: "name" },
      { data: "start_date",
        render: function(d) { return (d === null) ? '-' :  local_date_time(d); } },
      { data: "end_date" ,
        render: function(d) { return (d === null) ? '-' :  local_date_time(d); } },
      { data: "user_id", 
        render: function(d) { return `<div id='account-${d}' rel='${d}'>loading ${d}<script>load_accounts('account-${d}');</script></div>`; } ,},
      { data: "amountspend" },
      { data: "user_id", 
        render: function(d) { return `<button type="button" class="btn btn-danger" onclick="delete_user(${d});"><i class="ion-trash-a"></i></button>` } },
    ],
  });


}

function local_date_time(d) {
  var dateTimeParts= d.split(/[- :]/);
  dateTimeParts[1]--;
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute:'numeric' };
  const dateObject = new Date(...dateTimeParts);
  return dateObject.toLocaleDateString('en-En', options);
}

function selectAccount(user_id) {
  console.log($(user_id));
  window.location = BASE_URL + '/dashboard?ac=' + user_id;
}

$('#accounts').change(function(){
  $('#reload').trigger("click");
});

$('#reload').click(
  function reload() {
    window.location = BASE_URL + '/dashboard?ac=' + $('#accounts').val();
  }
);

$(document).ready(function(){
  get_client_status();
});
