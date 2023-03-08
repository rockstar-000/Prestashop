"use strict";

function getSymbolsChart() {
  $.ajax({
    url: BASE_URL + "summary/getSymbolsChart",
    method: "POST",
    data: {
      account_id: _account_id,
    },
    success: function (response) {
      response = JSON.parse(response);
      if (response["status"] == "success") {
        var data = response["data"];

        var xValues = [];
        var yValues = [];
        var barColors = [];
        var Xvalue = "";

        data.map((d) => { 
          yValues.push(Number(d.Strength).toFixed(2));
          if(d.StrategyUsed.length > 10) {
            d.StrategyUsed = d.StrategyUsed.slice(0, 10) + "..";
          }

          xValues.push(d.StrategyUsed);

          if(d.Strength > 0) {
            barColors.push("#001be5")
          }
          else {
            barColors.push("#fe0000");
          }
        });

        var ctx = document.getElementById("general_strategy_strength_chart").getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: xValues,
            datasets: [{
              backgroundColor: barColors,
              data: yValues,
              borderWidth: 2,
              borderColor: barColors,
              pointBackgroundColor: '#ffffff',
              pointRadius: 4
            }]
          },
          options: {
            responsive: false,
            legend: {
              display: false
            },
            scales: {
              yAxes: [{
                gridLines: {
                  drawBorder: false,
                  color: '#f2f2f2',
                },
                ticks: {
                  beginAtZero: true,
                  stepSize: 150
                }
              }],
              xAxes: [{
                ticks: {
                  autoSkip: false
                },
                gridLines: {
                  display: true
                }
              }]
            },
          }
        });
      } else {
        notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });
}

function getTakenSymbols() {
  $.ajax({
    url: "getTakenSymbols",
    method: "POST",
    data: {
      account_id: _account_id,
      plan_id: 3
    },
    success: function (response) {
      response = JSON.parse(response);
      if (response["status"] == "success") {
        var data = response["data"][0];
        document.getElementById("taken").innerText = data.TotalJournalCount;
        document.getElementById("jounal").innerText = data.TotalTradesCount;
        var xValues = ["Taken", "Journaled"];
        var yValues = [Number(data.TotalJournalCount), Number(data.TotalTradesCount)];
        var barColors = [
          "#fe0000",
          "#001be5",
        ];

        var ctxEl = document.getElementById("general_trades_chart");
        var ctx =  ctxEl.getContext('2d');
        ctxEl.height = 250;
        
        new Chart(ctx, {
          type: 'doughnut',
          responsive: true,
          maintainAspectRatio: false,
          scales: 1.6,
          data: {
            datasets: [{
              data: yValues,
              backgroundColor: barColors,
            }],
            labels: xValues,
          },
          options: {
            responsive: true,
            legend: {
              position: 'bottom',
              display: false,
            },
          }
        });        
      } else {
        notifyme.showNotification(response["status"], response["message"]);
      }
    }
  });
}

function modalAccountDetailShow(ticket_id){
  $('#JournalSummaryGridGrpValue').val(ticket_id);
  getJournalDetailsGroupModal(ticket_id);

  // $('#trade_journal_modal').modal()
}


$('body').on('click','.deleteTimeframe',function () {
  var timeframe = $(this).attr('data-timeframe');
  var ticket_id = $('#jTicket').val();
    $.ajax({
      url: BASE_URL + "summary/deleteSSTimeframe",
      method: "POST",
      data: {
        timeframe: timeframe,
        ticket_id: ticket_id,
      },
      success: function (response) {
        // console.log(response);
        response = JSON.parse(response);
        if (response["status"] == "success") {
          //$(this).parent('.timeframeId-wrap').first().find('.fancybox').attr("src",'data:image/jpg;charset=utf8;base64');
    $('#container-'+timeframe+' .fancybox').css("display",'none');
    $('#deleteTimeframe-' + timeframe).hide();
    $(this).hide(); 
          // notifyme.showNotification(response["status"], response["message"]);
        }else{
          // notifyme.showNotification(response["status"], response["message"]);
        }
      }
    });
});

$("body").on("click",".showmore-timframes", function(){
  $(".timeframe-wrap-hide").toggle(); 
})

function getFancyItems(pic) {
  var items = [];
    $(pic).find('a[class=fancybox]').each(function() {
      var href  = $(this).attr('href');
      var size  = $(this).data('size').split('x');
      var caption  = $(this).data('caption');
      var width  = size[0];
      var height = size[1];

      var item = {
        src : href,
        msrc : href,
        w   : width,
        h   : height,
        title : caption,
      }

      $(this).attr('gal-index',items.length);
      items.push(item);
  });
  return items;
}

function lightbox(event, pic, element) {
  event.preventDefault();
  var items = getFancyItems(pic);

  var sel = parseInt($(element).attr('gal-index'));
  var offset = $(element).find('img').offset();
  var width = $(element).find('img').width();
    
  var options = {
    index: sel,
    bgOpacity: 0.9,
    showHideOpacity: true,
    linkEl: false,
    shareEl: false,
    getThumbBoundsFn: function(index)
      {
      return {x:offset.left, y:offset.top, w:width};
          }
    }
    
  var $pswp = document.querySelectorAll('.pswp')[0];
  var light = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
  light.init();   
}    

function _rebiuld_photoswipe() {
  $(".fancygall").each( function() {
    var $pic = $(this);
    var items = getFancyItems($pic);
    var $thumb;

    var image = [];
    $.each(items, function(index, value)
  {
    image[index]     = new Image();
    image[index].src = value['src'];
  });

  $pic.find('a[class=fancybox]').each( function()
    {
    this.onclick = function(event)  {
      lightbox(event, $pic, this);
      }
    });
  });
}

function SSTimeFrameReload(ticket_id, el) {
  $.ajax({
    url: BASE_URL + "/summary/SSTimeFrameReload",
    method: "POST",
    data: {
      ticket_id: ticket_id,
      field: el
    },
    success: function (response) {
      response = JSON.parse(response);
      if (response["status"] == "success") {
        var image_data = response['data'][0];
        console.log(image_data);
        var image = image_data['SS'+el];
        $('#ava-'+ el).attr('src', image);
        $('#container-'+ el).attr('href', image);
        
        $('#ava-'+ el).show();
        $('#deleteTimeframe-' + el).show();

        _rebiuld_photoswipe();
      }
    }
  });
}

function _buysellBage(value) {
  var res = '';
  if (value=='Buy') {
    res = '<span class="badge light badge-success">Buy</span>';
    } else if (value=='Sell') {
      res = '<span class="badge light badge-danger">Sell</span>';
    }
  return res;
}

function _wonlossBage(value, show=false) {
  var res = (Number(value) > 0) 
    ? '<span class="badge light badge-primary">WON</span>'
    : '<span class="badge light badge-danger">LOSS</span>';
  if (show) {
    res = res + '&nbsp;' + ((Number(value) > 0 ) ? '+' : '') +  value;
    }
    return res;
}

function getJournalDetailsGroupModal(ticket_id) {
  var account_id = $("#selectAccountIds").val();


  $('#listReasonForEntry1 option:selected').removeAttr('selected');
  $('#listReasonForEntry1 option[value=""]').attr('selected', 'selected');

  $('#listReasonForExit option:selected').removeAttr('selected');
  $('#listReasonForExit option[value=""]').attr('selected', 'selected');

  $('#listReasonForOutcome1 option:selected').removeAttr('selected');
  $('#listReasonForOutcome1 option[value=""]').attr('selected', 'selected');

  $('#listStrategyUsed1 option:selected').removeAttr('selected');
  $('#listStrategyUsed1 option[value=""]').attr('selected', 'selected');

  $('#listHowICanImprove1').val('');

  $('#ticket-TimeFrame1').val(ticket_id);
  $('#ticket-TimeFrame2').val(ticket_id);
  $('#ticket-TimeFrame3').val(ticket_id);
  $('#ticket-TimeFrame4').val(ticket_id);
  $('#ticket-TimeFrame5').val(ticket_id);

  $('#TimeFrame1 option:selected').removeAttr('selected');
  $('#TimeFrame1 option[value=""]').attr('selected', 'selected');

  $('#TimeFrame2 option:selected').removeAttr('selected');
  $('#TimeFrame2 option[value=""]').attr('selected', 'selected');

  $('#TimeFrame3 option:selected').removeAttr('selected');
  $('#TimeFrame3 option[value=""]').attr('selected', 'selected');

  $('#ava-TimeFrame1').attr('src', '');
  $('#container-TimeFrame1').attr('href', '#');

  $('#ava-TimeFrame2').attr('src', '');
  $('#container-TimeFrame2').attr('href', '#');

  $('#ava-TimeFrame3').attr('src', '');
  $('#container-TimeFrame3').attr('href', '#');

  $('#ava-TimeFrame4').attr('src', '');
  $('#container-TimeFrame4').attr('href', '#');

  $('#ava-TimeFrame5').attr('src', '');
  $('#container-TimeFrame5').attr('href', '#');

  $.ajax({
    url: BASE_URL + "summary/getJournalMainDetailsModal",
    method: "POST",
    data: {
      account_id: account_id,
      ticket_id: ticket_id,
    },
    success: function (response) {
      var multiSelect = ((ticket_id).toString().indexOf(',') !== -1);
      response = JSON.parse(response);
      if (response["status"] == "success") {
        var data = response["data"][0];
        console.log(data);

        $('#TimeFrame1 option[value="' + data.TimeFrame1 + '"]').attr('selected', 'selected');
        $('#TimeFrame2 option[value="' + data.TimeFrame2 + '"]').attr('selected', 'selected');
        $('#TimeFrame3 option[value="' + data.TimeFrame3 + '"]').attr('selected', 'selected');

        var timeframe1 = $( "#TimeFrame1 option:selected" ).text();
        var timeframe2 = $( "#TimeFrame2 option:selected" ).text();
        var timeframe3 = $( "#TimeFrame3 option:selected" ).text();
        var timeframe4 = $( "#TimeFrame4 option:selected" ).text();
        var timeframe5 = $( "#TimeFrame5 option:selected" ).text();
        var img1 = _jpeg(data.SSTimeFrame1);
        var img2 = _jpeg(data.SSTimeFrame2);
        var img3 = _jpeg(data.SSTimeFrame3);
        var img4 = _jpeg(data.SSTimeFrame4);
        var img5 = _jpeg(data.SSTimeFrame5);


        $('#ava-TimeFrame1').attr('src', img1);
        $('#container-TimeFrame1').attr('href', img1);
        $('#container-TimeFrame1').data('caption', "TimeFrame 1 : <span class='colorYellow'>" + timeframe1 + "</span>");
        if (data.SSTimeFrame1) {
            $('#ava-TimeFrame1').show();
          } else {
            $('#ava-TimeFrame1').hide();
        $('#deleteTimeframe-TimeFrame1').hide();
          }

        $('#ava-TimeFrame2').attr('src', img2);
        $('#container-TimeFrame2').attr('href', img2);
        $('#container-TimeFrame2').data('caption', "TimeFrame 2 : <span class='colorYellow'>" + timeframe2 + "</span>");
        if (data.SSTimeFrame2) {
          $('#ava-TimeFrame2').show();
        } else {
          $('#ava-TimeFrame2').hide();
      $('#deleteTimeframe-TimeFrame2').hide();
        }

        $('#ava-TimeFrame3').attr('src', img3);
        $('#container-TimeFrame3').attr('href', img3);
        $('#container-TimeFrame3').data('caption', "TimeFrame 3 : <span class='colorYellow'>" + timeframe3 + "</span>");
        if (data.SSTimeFrame3) {
          $('#ava-TimeFrame3').show();
        } else {
          $('#ava-TimeFrame3').hide();
      $('#deleteTimeframe-TimeFrame3').hide();
        }

    $('#ava-TimeFrame4').attr('src', img4);
        $('#container-TimeFrame4').attr('href', img4);
        $('#container-TimeFrame4').data('caption', "TimeFrame 4 : <span class='colorYellow'>" + timeframe4 + "</span>");
        if (data.SSTimeFrame4) {
          $('#ava-TimeFrame4').show();
        } else {
          $('#ava-TimeFrame4').hide();
      $('#deleteTimeframe-TimeFrame4').hide();
        }
      
      $('#ava-TimeFrame5').attr('src', img5);
        $('#container-TimeFrame5').attr('href', img5);
        $('#container-TimeFrame5').data('caption', "TimeFrame 5 : <span class='colorYellow'>" + timeframe5 + "</span>");
        if (data.SSTimeFrame5) {
          $('#ava-TimeFrame5').show();
        } else {
          $('#ava-TimeFrame5').hide();
      $('#deleteTimeframe-TimeFrame5').hide();
        }

        $('#jHas').val(data.has);
        $('#jTicket').val(data.ticket);

        $('#jornalModalRows').html('');
        $.each(response["data"], function () {
          var row = this;
          var content = 
            "<tr>" +
              "<td>" + row.ticket + "</td>" +
              "<td>" + row.symbol + "</td>" +
              "<td>" + _buysellBage(row.type) + "</td>" +
              "<td>" + row.lots + "</td>" +
              "<td> " + _wonlossBage(row.outcome, true) + "</td>" +
            "</tr>";
          $('#jornalModalRows').append(content);
          });
          $('#listReasonForEntry1 option[value="' + data.ReasonForEntry + '"]').attr('selected', 'selected');
          $('#textBoxReasonForEntry').val(data.ReasonForEntry);
          $('#listReasonForOutcome1 option[value="' + data.ReasonForOutcome + '"]').attr('selected', 'selected');
          $('#textBoxReasonForOutcome').val(data.ReasonForOutcome);
          $('#listStrategyUsed1 option[value="' + data.StrategyUsed + '"]').attr('selected', 'selected');
          $('#textBoxStrategyUsed').val(data.StrategyUsed);
          $('#listHowICanImprove1').val(data.HowICanImprove);
        
          if(multiSelect){
            $('.outcomes-section').hide();
          }else{
            $('.outcomes-section').show();
            var res = (Number(data.outcome) > 0) ? '<h6 class="badge badge-success as px-3">WON</h6>': '<h6 class="badge badge-danger as px-3">LOSS</h6>';
            var outcome_sign = (Number(data.outcome) > 0) ? '+': '';
            $('.tradeoutcome-journal span').html(res+" "+ outcome_sign+" " +data.outcome);
            $('.drawdown-journal span').html(" - "+data.drawdown);
            $('.floatingpoint-journal span').html(" + " +data.floatingprofit);
            $('.tradeoutcome-journal-time').html(data.trade_diff);
            $('.drawdown-journal-time').html(data.drawdown_diff);
            $('.floatingpoint-journal-time').html(data.floating_diff);
          }
          
         $('#listStrategyUsed1').change(function() {
            $('#textBoxStrategyUsed').val($('#listStrategyUsed1').val());
         });

         $('#listReasonForOutcome1').change(function() {
            $('#textBoxReasonForOutcome').val($('#listReasonForOutcome1').val());
         });

         $('#listReasonForEntry1').change(function() {
            $('#textBoxReasonForEntry').val($('#listReasonForEntry1').val());
         });
        
        $("#trade_journal_modal").modal("show");
      $('.timeframe-wrap-hide').hide();
        _rebiuld_photoswipe();
      } else {
        notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });
}

function _jpeg(img) {
  return img.includes('data:')
    ? img
    : "data:image/jpg;charset=utf8;base64," + img;
}

function getGroupJournalModal(ticket_id, group_id) {
  
  if (group_id) {

    
    $.ajax({
      url: BASE_URL + "summary/getJournalGroupedTickets",
      method: "POST",
      data: { 
        group_id: group_id
      },
      success: function (response) {
          response = JSON.parse(response);
          
          if (response["status"] == "success") {
            $('#JournalSummaryGridGrpValue').val(response.data);
            getJournalDetailsGroupModal(response.data);
          } else {
            alert("Invalid group ID");
          }
      }
    });
    
  }
}

function getJournalTableFilter() {
  var cDate = new Date();
  $("#journal_grid_all").DataTable({
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
        url: BASE_URL + "summary/getJournalTableAllFilter",
        method: "POST",
        data: {
          account_id: _account_id,
          start_date: $('#journal_start_date').val(),
          end_date: $('#journal_end_date').val()
        },
        success: function (response) {
          response = JSON.parse(response);
          callback(response);
        },
      });
    },
    columns: [
      { render: function (data, type, full, meta) {
        
        return ('<div class="col-md-12 dChartCpT tooltipM"><span id="spanLargestProfitTrade" ><i class="far fa-clock"></i></span><div id="spanLargestProfitTradeTooltip"><ul><li><b>Open Time</b> : <span id="alptTicket">'+full.OpenTime+'</span></li><li><b>Close Time</b> : <span id="alptTicket">'+full.CloseTime+'</span></li></ul></div></div>');
        }
      },
      { data: "Symbol"
      },
      { data: "Profit",
        render: function (d) {
          if (d > 0) {
            return `<span class="badge light badge-success">WON</span>&nbsp;&nbsp;+${d}`;
          } else {
            return `<span class="badge light badge-danger">Loss </span>&nbsp;&nbsp;${d}`;
          }
        },
      },
      { data: "StrategyUsed" },
      { data: "ReasonForEntry" },
      { data: "ReasonForOutcome"},
      { data: "HowICanImprove"},
      { render: function (data, type, full, meta) {
        return (
          // 1
          '<a class=" modalOpenJournal px-3" href="javascript:void(0)" onClick="modalAccountDetailShow(' +
          full.OrderNumber + ',' + full.Acc_Id +
          ');" id="' +
          full.OrderNumber +
          '" ><img src="../assets/img/j-icon-1.png"></a>'
        );
      },
    },
    ],
  });
}

function getJournalTable() {
  var cDate = new Date();
  $("#journal_grid_all").DataTable({
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
        url: BASE_URL + "summary/getJournalTableAll",
        method: "POST",
        data: {
          account_id: _account_id,
          start_date: "",
          end_date: ""
        },
        success: function (response) {
          response = JSON.parse(response);
          callback(response);
        },
      });
    },
    columns: [
      { render: function (data, type, full, meta) {
        
        return ('<div class="col-md-12 dChartCpT tooltipM"><span id="spanLargestProfitTrade" ><i class="far fa-clock"></i></span><div id="spanLargestProfitTradeTooltip1"><ul><li><b>Open Time</b> : <span id="alptTicket">'+full.OpenTime+'</span></li><li><b>Close Time</b> : <span id="alptTicket">'+full.CloseTime+'</span></li></ul></div></div>');
        }
      },
      { data: "Symbol"
      },
      { data: "Profit",
        render: function (d) {
          if (d > 0) {
            return `<span class="badge light badge-success">WON</span>&nbsp;&nbsp;+${d}`;
          } else {
            return `<span class="badge light badge-danger">Loss </span>&nbsp;&nbsp;${d}`;
          }
        },
      },
      { data: "StrategyUsed" },
      { data: "ReasonForEntry" },
      { data: "ReasonForOutcome"},
      { data: "HowICanImprove"},
      { render: function (data, type, full, meta) {
        return (
          // 1
          '<a class=" modalOpenJournal px-3" href="javascript:void(0)" onClick="modalAccountDetailShow(' +
          full.OrderNumber + ',' + full.Acc_Id +
          ');" id="' +
          full.OrderNumber +
          '" ><img src="../assets/img/j-icon-1.png"></a>'
        );
      },
    },
    ],
  });
}

function getJournalTableGroup() {
  var cDate = new Date();
  $("#journal_grid_group").DataTable({
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
        url: "getJournalTableGroup",
        method: "POST",
        data: {
          account_id: _account_id
        },
        success: function (response) {
          response = JSON.parse(response);
          callback(response);
        },
      });
    },
    columns: [
      {
        render: function (data, type, full, meta) {
        
          return ('<i class="fas fa-plus-circle" data-expand-status="0" onclick="getExpandData(this,'+ full.journal_group_id+', '+ full.OrderNumber+')"></i>');
        }
      },
      { render: function (data, type, full, meta) {
        
        return ('<div class="col-md-12 dChartCpT tooltipM"><span id="spanLargestProfitTrade"><i class="far fa-clock"></i></span><div id="spanLargestProfitTradeTooltip"><ul><li><b>Open Time</b> : <span id="alptTicket">'+full.OpenTime+'</span></li><li><b>Close Time</b> : <span id="alptTicket">'+full.CloseTime+'</span></li></ul></div></div>');
        }
      },
      { data: "Symbol"
      },
      { data: "Profit",
        render: function (d) {
          if (d > 0) {
            return `<span class="badge light badge-success">WON</span>&nbsp;&nbsp;+${d}`;
          } else {
            return `<span class="badge light badge-danger">Loss </span>&nbsp;&nbsp;${d}`;
          }
        },
      },
      { data: "StrategyUsed" },
      { data: "ReasonForEntry" },
      { data: "ReasonForOutcome"},
      { data: "HowICanImprove"},
      { render: function (data, type, full, meta) {
        return (
          '<a class="btn btn-success modalOpenJournal px-3" href="javascript:void(0)" onClick="getGroupJournalModal(' +
          full.OrderNumber + ',' + full.journal_group_id +
          ');"  ><i class="fas fa-outdent"></i></a>'
        );
      },
    },
    ],
  });
}

function getExpandData(curr_obj, journal_group_id, curr_ticket){
  let status = curr_obj.getAttribute('data-expand-status');
  if(status == 0){
    $.ajax({
      url: "getJournalGroupedItems",
      method: "POST",
      data: { 
        journal_group_id: journal_group_id, 
        curr_ticket: curr_ticket,
        account_id: "2823029"
      },
      success: function (response) {
          response = JSON.parse(response);
          if (response["status"] == "success") {
            $('.journal-grouped-item-extra').remove();
            if(response.data != ''){
              response.data.forEach(function(data, index) {
                if(data.Profit>0){
                  var single_res = '<span class="badge light badge-success">WON</span>&nbsp;&nbsp;+'+ data.Profit;
                }else{
                  var single_res = '<span class="badge light badge-danger">Loss </span>&nbsp;&nbsp;'+data.Profit;
                }
                $('<tr role="row" class="odd journal-grouped-item-extra"><td class="sorting_1"></td><td><div class="col-md-12 dChartCpT tooltipM"><span id="spanLargestProfitTrade"><i class="far fa-clock"></i></span><div id="spanLargestProfitTradeTooltip"><ul><li><b>Open Time</b> : <span id="alptTicket">'+data.OpenTime+'</span></li><li><b>Close Time</b> : <span id="alptTicket">'+data.CloseTime+'</span></li></ul></div></div></td><td>'+data.Symbol+'</td><td>'+single_res+'</td><td>'+data.StrategyUsed+'</td><td>'+data.ReasonForEntry+'</td><td>'+data.ReasonForOutcome+'</td><td>'+data.HowICanImprove+'</td><td></td></tr>').insertAfter($(curr_obj).closest('tr'));
              });
              $(curr_obj).addClass('less-journal-group');
            }else{
              response.data.forEach(function(data, index) {
                $('<tr role="row" class="odd">No data found.</tr>').insertAfter($(curr_obj).closest('tr'));
              });
            }
          } else {
            $('<tr><td>new td</td></tr>').insertAfter($(curr_obj).closest('tr'));
          }
          curr_obj.className = "fas fa-minus-square";
          curr_obj.setAttribute('data-expand-status',1);
      }
    });
  }else{
    $('.journal-grouped-item-extra').remove();
    curr_obj.setAttribute('data-expand-status',0);
    curr_obj.className = "fas fa-plus-circle";
  }
}

$('#accounts').change(function(){
  $('#reload').trigger("click");
});

$('#reload').click(
  function reload() {
    window.location = BASE_URL + '/summary/journal?ac=' + $('#accounts').val();
  }
);

var getAccountReason = function(){
    $.ajax({
      url: BASE_URL + "summary/getAccountReason",
      method: "POST",
      data: {
        account_id: _account_id
      },
      success: function (response) {
        response = JSON.parse(response);
        if (response["status"] == "success") {
          var data = response["data"];
  
          var entry_reason = data.filter(
            (i) => i.reason == "ReasonForEntry"
          );
  
          entry_reason.map((d) => {
        if (d.valuess.length > 25) {
        var single_rfen =  d.valuess.substr(0, 25) + '...';  
        }else{
        var single_rfen = d.valuess;
        }
            $("#listReasonForEntry1").append(
              `<option value="${d.valuess}" title="${single_rfen}">${single_rfen}</option>`
            );
          });
  
          var exit_reason = data.filter(
            (i) => i.reason == "ReasonForExit"
          );
  
          exit_reason.map((d) => {
        if (d.valuess.length > 25) {
        var single_rfe =  d.valuess.substr(0, 25) + '...';  
        }else{
        var single_rfe = d.valuess;
        }
            $("#listReasonForExit").append(
              `<option value="${d.valuess}" title="${single_rfe}">${single_rfe}</option>`
            );
          });
  
          var outcome_reason = data.filter(
            (i) => i.reason == "ReasonForOutcome"
          );
  
          outcome_reason.map((d) => {
        
        if (d.valuess.length > 25) {
        var single_rfo =  d.valuess.substr(0, 25) + '...';  
        }else{
        var single_rfo = d.valuess;
        }
        
            $("#listReasonForOutcome1").append(
              `<option value="${d.valuess}" title="${single_rfo}">${single_rfo}</option>`
            );
          });
  
          var improve_reason = data.filter(
            (i) => i.reason == "HowICanImprove"
          );
  
          improve_reason.map((d) => {
            $("#listHowICanImprove1").append(
              `<option value="${d.valuess}">${d.valuess}</option>`
            );
          });
  
          var strategy_reason = data.filter(
            (i) => i.reason == "StrategyUsed"
          );
  
          strategy_reason.map((d) => {
        
        if (d.valuess.length > 25) {
        var single_sused =  d.valuess.substr(0, 25) + '...';  
        }else{
        var single_sused = d.valuess;
        }
            $("#listStrategyUsed1").append(
              `<option value="${d.valuess}" title="${d.valuess}">${single_sused}</option>`
            );
          });
        } else {
          notifyme.showNotification(response["status"], response["message"]);
        }
      },
    });
  }
$( document ).ready(function() {
  getSymbolsChart();
  getTakenSymbols();
  getJournalTable();
  getJournalTableGroup();
  getAccountReason();
});
