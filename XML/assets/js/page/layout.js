"use strict";

function getUserAccounts($selected_account) {
  $.ajax({
    url: 'getUserAccounts',
    method: "POST",
    async: false,
    success: function (response) {
      try {
        response = JSON.parse(response);
      }
      catch (event) {
        notifyme.showNotification('error', response);
      }
      if (response["status"] == "success") {
        var data = response["data"];
      
        $("#accounts").empty();
        $("#accounts").append(`<option value="0" >Select</option>`);

        data.map((d) => {
          $("#accounts").append(
            `<option ${d.account_id == $selected_account ? 'selected="selected"' : ""
            }  value="${d.account_id}">${d.account_id}</option>`
          );
        });

        if($('#AddAccountsGrid').length > 0) {
          $("#AddAccountsGrid tbody").empty();
          data.map((d) => {
            if (d.is_plan_update == "1") {
              const status = `<div class="togglebutton"><label><input class="switchBox" type="checkbox" ${(d.is_active == "1" ? "checked" : "")} onclick="UpdateAccount(this,${d.account_id})" /><span class="toggle"></span><span class="checkBoxValue"></span></label></div>`;
              const remove = `<button type="button" class="btn btn-danger p-1 deleteAccount" onClick="delectAccount(${d.account_id})"><i class="ion-trash-a"></i></a></button>`;
              const gmt = d.BaseGMT!=undefined ? `<small style='color:gray;'>${d.BaseGMT}</small>` : '';
              const account= `
              <tr style='width:100%;'>
                  <td style='border:0;width:10em; white-space:nowrap;'><a href='#' onclick='selectAccount(${d.account_id})'>${d.account_id}</a>&nbsp;${gmt}</td>
                  <td style='border:0;width:14em; white-space:nowrap; font-size:.8em;'>${status}</td>
                  <td style='border:0;width:2em;'>${remove}</td>
              </tr>`;
              if (document.getElementById(`tr-${d.user_id}`)) {
                $(`#td-${d.user_id} table`).append(`${account}`);
              } else  {
                  $('#AddAccountsGrid').append(`<tr id='tr-${d.user_id}'>
                    <td>${d.username}</td>
                    <td>${d.email}</td>
                    <td id='td-${d.user_id}'>
                      <table style='width:100%;'>${account}</table>
                    </td>
                    </tr>`);
                    // <td><div id='user-${d.user_id}' rel='${d.user_id}'>loading ${d.user_id}<script>loadUser('user-${d.user_id}');</script></div></td>
                  $('.bootstrapSwitch .switchBox:checked').parent().addClass("checkWrap")
                  $('.bootstrapSwitch .switchBox:not(:checked)').parent().addClass("checkWrapNO")
                  $('.bootstrapSwitch .checkWrap .checkBoxValue').text('Active');
                  $('.bootstrapSwitch .checkWrapNO .checkBoxValue').text('Not Active');
                  $("#selectAccountIds [value=0]:selected").parent().parent().parent().addClass('hideStatus');
                  }
            }
            else {
              $('#AddAccountsGrid tbody').append(`<tr><td>${d.account_id}</td><td>${(d.is_active == "1" ? "<span class='badge badge-success as'>Active</span>" : "<span class='badge badge-danger as'>InActive</span>")}</td><td><button type="button" class="btn btn-danger p-1 deleteAccount" id="${d.account_id}" onClick="delectAccount(${d.account_id})"><i class="ion-trash-a"></i></button></td></tr>`);
              $('.bootstrapSwitch .switchBox:checked').parent().addClass("checkWrap")
              $('.bootstrapSwitch .switchBox:not(:checked)').parent().addClass("checkWrapNO")
              $('.bootstrapSwitch .checkWrap .checkBoxValue').text('Active');
              $('.bootstrapSwitch .checkWrapNO .checkBoxValue').text('Not Active');
            }
          });
        }
        
      } else {
        //notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });
};

function reloadCalTransactionData(date) {
    var startdate = date;
    var endDate = date;
  
  $.ajax({
    url: BASE_URL + "/summary/getJournalSummary",
    method: "POST",
    data: {
      account_id: _account_id,
      symbols: '',
      start_date: startdate,
      end_date: endDate,
    },
    success: function (response) {
      response = JSON.parse(response);
      if (response["status"] == "success") {
        var data = response["data"];
        $("#tableCalTransactionData tbody").empty();
        $.each( data, function( key, value ) {
          var OrderType = '';
          if (value.type=='Buy') {
            OrderType = '<span class="badge badge-success as px-3">Buy</span>';
          } else if (value.type=='Sell') {
            OrderType = '<span class="badge badge-danger as px-3">Sell</span>';
          }
          
          var ProfitType = '';
          if (value.outcome > 0) {
            ProfitType =  '<span class="badge badge-success as">WON</span>';
          } else {
            ProfitType = '<span class="badge badge-danger as">Loss </span>';
          }

          $("#tableCalTransactionData tbody").append(
            `<tr>
                  <td>${value.ticket}</td>
                  <td class='ct'>${value.symbol}</td>
                  <td class='ct'>${OrderType}</td>
                  <td class='ct'>${value.lots}</td>
                  <td class='ct'>${ProfitType} ${value.outcome}</td>
             </tr>`
          );
        });
        $('#cal_event_modal').modal('show');
      } else {
        // notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });
}

$('#calendar_c').fullCalendar({


    events: function(start, end, timezone, callback) {
        var calendarEl = document.getElementById('calendar_c');
        if(calendarEl) {

          jQuery.ajax({
              url: BASE_URL + '/dashboard/loadCalendarUpper',
              type: 'POST',
              dataType: 'json',
              data: {
                  account_id: _account_id
              },
              success: function(response) {
                  var response = response['data'];
                  // console.log(response);
                  var datadb=[];
                  var totalProfit = response;
                  var events = [];
                  response.map((d)=>{
                    var backgroundColor = 'rgba(200,200,100,.2)';

                    if (d.profit>0) {
                     backgroundColor = 'rgba(0,100,0,.7)';
                    d.profit = '+' + d.profit;
                    }

                    if (d.profit<0) {
                      backgroundColor = 'rgba(255,0,0,.5)';
                    }
                  
                    datadb.push({
                      allDay: 'true',
                      title: d.profit,
                      start: d.day,
                      backgroundColor: backgroundColor,
                      textColor: 'white',
                      borderColor: 'transparent',
                      classNames: ['profit', d.class]   
                    });

                });
                  
                callback(datadb);

              var current_month_total = 0;
              setTimeout(function() { 
                $('.fc-event-container .fc-content .fc-title').each(function(){
                  var current_event_price = $(this).html();
                  if(!$(this).parent().parent().parent().parent().parent().parent().parent().parent().hasClass('fc-day-other')){
                    current_month_total = current_month_total+parseFloat(current_event_price);
                      document.getElementById('total-profit').innerHTML = current_month_total;
                  }
                })
                if (Number(current_month_total).toFixed(2) > 0) {
                  $('.month-cal-total-bal').html("Monthly Profit: <span class='badge badge-success as'> "+Number(current_month_total).toFixed(2))+"</span>";
                  } else {
                  $('.month-cal-total-bal').html("Monthly Profit: <span class='badge badge-danger as'>"+Number(current_month_total).toFixed(2))+"</span>";
                  }
                
              },100);
            } 
          });
        }
      },
      eventClick: function(info) {
        reloadCalTransactionData(info.start._i);
        $('#cal_event_modal').modal();
      }
  });

$('#accountDetailsModalInsertUpdate').on('submit', function (event) {
    event.preventDefault();
    var account_id = _account_id;
    var user_email = $("#jEmail").val();
    
    var has = $("#jHas").val();

    var reasonForOutcome = $("#listReasonForOutcome2").val();
    var howICanImprove = $("#listHowICanImprove2").val();
    var strategyUsed = $("#listStrategyUsed2").val();
    var reasonForEntry = $("#listReasonForEntry2").val();
    var reasonForExit = $("#listReasonForExit2").val();

    var tickets = $('#JournalSummaryGridGrpValue').val();

    var TimeFrame1 = $("#TimeFrame11").val();
    var TimeFrame2 = $("#TimeFrame21").val();
    var TimeFrame3 = $("#TimeFrame31").val();

    $.ajax({
        url: BASE_URL + "summary/accountDetailsModalInsertUpdate",
        method: "POST",
        async: false,
        data: {
            user_email: user_email,
            account_id: account_id,
            tickets: tickets,

            reasonForOutcome: reasonForOutcome,
            howICanImprove: howICanImprove,
            strategyUsed: strategyUsed,
            reasonForEntry: reasonForEntry,
            reasonForExit: reasonForExit,

            TimeFrame1: TimeFrame1,
            TimeFrame2: TimeFrame2,
            TimeFrame3, TimeFrame3,

            has: has,
        },

        success: function (response) {
        response = JSON.parse(response);
        if (response["status"] == "success") {
            var arr = (tickets).toString().split(',');
            $.each(arr, function(i) {
                $('#'+ arr[i]).removeClass('btn-danger').addClass('btn-success');  
                })
            
            $('#modalOpenJournal').modal('hide');
            // notifyme.showNotification(response["status"], response["message"]);
            // $('#accountDetailsModalInsertUpdate').trigger("reset");
            } else {
                // notifyme.showNotification(response["status"], response["message"]);
            }
        }
    })
});

$('#journalDetailsModalInsertUpdate').on("submit", function (event) {
  event.preventDefault();
  var account_id = _account_id;
  var user_email = $("#jEmail").val();
  
  var has = $("#jHas").val();

  var reasonForExit = $("#listReasonForExit").val();

  var reasonForOutcome = $("#textBoxReasonForOutcome").val();
  var howICanImprove = $("#listHowICanImprove1").val();
  var strategyUsed = $("#textBoxStrategyUsed").val();
  var reasonForEntry = $("#textBoxReasonForEntry").val();

  var tickets = $('#JournalSummaryGridGrpValue').val();

  var TimeFrame1 = $("#TimeFrame1").val();
  var TimeFrame2 = $("#TimeFrame2").val();
  var TimeFrame3 = $("#TimeFrame3").val();

  $.ajax({
      url: BASE_URL + "summary/journalDetailsModalInsertUpdate",
      method: "POST",
      async: false,
      data: {
          user_email: user_email,
          account_id: account_id,
          tickets: tickets,

          reasonForOutcome: reasonForOutcome,
          howICanImprove: howICanImprove,
          strategyUsed: strategyUsed,
          reasonForEntry: reasonForEntry,
          reasonForExit: reasonForExit,

          TimeFrame1: TimeFrame1,
          TimeFrame2: TimeFrame2,
          TimeFrame3, TimeFrame3,

          has: has,
      },

      success: function (response) {
        console.log(response);
      response = JSON.parse(response);
      if (response["status"] == "success") {
          var arr = (tickets).toString().split(',');
          
          $('#trade_journal_modal').modal('hide');
          // notifyme.showNotification(response["status"], response["message"]);
          $('#JournalSummaryGrid').DataTable().ajax.reload();
          } else {
              // notifyme.showNotification(response["status"], response["message"]);
          }
      }
  })
});
function modalCalendar(){
  $('#cal_modal').modal();
}
