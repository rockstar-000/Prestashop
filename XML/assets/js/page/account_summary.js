  "use strict";

var baseGMT = _baseGMT;
var profileGMT = _baseGMT;

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
    ? '<span class="badge light badge-success">WON</span>'
    : '<span class="badge light badge-danger">LOSS</span>';
  if (show) {
    res = res + '&nbsp;' + ((Number(value) > 0 ) ? '+' : '') +  value;
    }
    return res;
}

function _dateTZ(date, baseGMT, profileGMT, show=true) {
  var o_date = new Date(date);
  const diff = profileGMT - baseGMT;
  if (diff!=0) { o_date.setTime(o_date.getTime() + diff * 60 * 60 * 1000); }
  return o_date.toLocaleString('en-US', { year:'numeric', month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit'}) +
   (show ? 
      ((diff!=0) ? "&nbsp;<small class='colorGreen'>" + ( (diff>0) ? '+' : '') + diff + " hours</small>" : '')
      : '');
   }

function getAccountHistory() {
  $("#account_summary_history").DataTable({
    language: {
      paginate: {
        next: '&#62;', // or '→'
        previous: '&#60;' // or '←' 
      }
    },
    order: [[5, 'asc']],
    ajax: function (data, callback, settings) {
      $.ajax({
        url: BASE_URL + "summary/getAccountHistory",
        method: "POST",
        data: {
          account_id: _account_id,
          plan_id: _plan_id,
        },
        success: function (response) {
          response = JSON.parse(response);
          callback(response);
        }
      });
    },
    columns: [
      { data: "OpenTime",  render: function(d) {
        return _dateTZ(d, baseGMT, profileGMT);
      }},
      { data: "CloseTime",  render: function(d) {
        return _dateTZ(d, baseGMT, profileGMT);
      }},
      { data: "OrderNumber" },
      { data: "Symbol" },
      {
        data: "OrderType",
        render: function (d) {
          if (d == "Buy") {
            return '<span class="badge light badge-success">Buy</span>';
          } else {
            return '<span class="badge light badge-danger">Sell</span>';
          }
        },
      },

      { data: "EntryPrice",
        render: function(d) {
          return Number(d).toFixed(4);
        } },
      { data: "SLPrice",
        render: function(d) {
          return Number(d).toFixed(4);
        } },
      { data: "TPPrice",
        render: function(d) {
          return Number(d).toFixed(4);
        } },
      { data: "Commission" },
      { data: "Swap",
        render: function(d) {
          return Number(d).toFixed(2);
        } },
      { data: "ExitPrice",
        render: function(d) {
          return Number(d).toFixed(4);
        } },
      { data: "Profit" },
    ],
  });
}

function modalAccountDetailShow(ticket_id, account_id) {
  $('#JournalSummaryGridGrpValue').val(ticket_id);
  getAccountDetailsModal(ticket_id);
  }      

function getGroupJournalModal() {
  var ticket_id = $('#JournalSummaryGridGrpValue').val();
  if (ticket_id) {
    getAccountDetailsModal(ticket_id);
    }
}

$('.deleteTimeframe').click(function() {
  var timeframe1 = $(this).attr('data-timeframe');
  var ticket_id = $('#jTicket').val();

  var timeframe = timeframe1.slice(0, 10);
    $.ajax({
      url: BASE_URL + "summary/deleteSSTimeframe",
      method: "POST",
      data: {
        timeframe: timeframe,
        ticket_id: ticket_id,
      },
      success: function (response) {
        response = JSON.parse(response);
        if (response["status"] == "success") {
          //$(this).parent('.timeframeId-wrap').first().find('.fancybox').attr("src",'data:image/jpg;charset=utf8;base64');
          console.log(timeframe);
    $('#container-'+timeframe+ 1 +' .fancybox').css("display",'none');
    $('#deleteTimeframe1-' + timeframe+1).hide();
          // notifyme.showNotification(response["status"], response["message"]);
        }else{
          // notifyme.showNotification(response["status"], response["message"]);
        }
      }
    });
});

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
        var image = image_data['SS'+el.slice(0, 10)];
        $('#ava-'+ el).attr('src', image);

        $('#container-'+ el).attr('href', image);
        $('#ava-'+ el).show();
        $('#deleteTimeframe1-' + el).show();
        _rebiuld_photoswipe();
      }
    }
  });
}

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
            $("#listReasonForEntry2").append(
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
        
            $("#listReasonForOutcome2").append(
              `<option value="${d.valuess}" title="${single_rfo}">${single_rfo}</option>`
            );
          });
  
          var improve_reason = data.filter(
            (i) => i.reason == "HowICanImprove"
          );
  
          improve_reason.map((d) => {
            $("#listHowICanImprove2").append(
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
            $("#listStrategyUsed2").append(
              `<option value="${d.valuess}" title="${d.valuess}">${single_sused}</option>`
            );
          });
        } else {
          notifyme.showNotification(response["status"], response["message"]);
        }
      },
    });
}

function getAccountDetailsModal(ticket_id) {


  $('#listReasonForEntry2 option:selected').removeAttr('selected');
  $('#listReasonForEntry2 option[value=""]').attr('selected', 'selected');

  // $('#listReasonForExit option:selected').removeAttr('selected');
  // $('#listReasonForExit option[value=""]').attr('selected', 'selected');

  $('#listReasonForOutcome2 option:selected').removeAttr('selected');
  $('#listReasonForOutcome2 option[value=""]').attr('selected', 'selected');

  $('#listStrategyUsed2 option:selected').removeAttr('selected');
  $('#listStrategyUsed2 option[value=""]').attr('selected', 'selected');

  $('#listHowICanImprove2').val('');

  $('#ticket-TimeFrame11').val(ticket_id);
  $('#ticket-TimeFrame21').val(ticket_id);
  $('#ticket-TimeFrame31').val(ticket_id);
  $('#ticket-TimeFrame41').val(ticket_id);
  $('#ticket-TimeFrame51').val(ticket_id);

  $('#TimeFrame11 option:selected').removeAttr('selected');
  $('#TimeFrame11 option[value=""]').attr('selected', 'selected');

  $('#TimeFrame21 option:selected').removeAttr('selected');
  $('#TimeFrame21 option[value=""]').attr('selected', 'selected');

  $('#TimeFrame31 option:selected').removeAttr('selected');
  $('#TimeFrame31 option[value=""]').attr('selected', 'selected');

  $('#ava-TimeFrame11').attr('src', '');
  $('#container-TimeFrame11').attr('href', '#');

  $('#ava-TimeFrame21').attr('src', '');
  $('#container-TimeFrame21').attr('href', '#');

  $('#ava-TimeFrame31').attr('src', '');
  $('#container-TimeFrame31').attr('href', '#');

  $('#ava-TimeFrame41').attr('src', '');
  $('#container-TimeFrame41').attr('href', '#');

  $('#ava-TimeFrame51').attr('src', '');
  $('#container-TimeFrame51').attr('href', '#');

  $.ajax({
    url: BASE_URL + "summary/getAccountDetailsModal",
    method: "POST",
    data: {
      account_id: _account_id,
      ticket_id: ticket_id,
    },
    success: function (response) {
      var multiSelect = ((ticket_id).toString().indexOf(',') !== -1);
      response = JSON.parse(response);
      if (response["status"] == "success") {
        var data = response["data"][0];

        $('#TimeFrame11 option[value="' + data.TimeFrame1 + '"]').attr('selected', 'selected');
        $('#TimeFrame21 option[value="' + data.TimeFrame2 + '"]').attr('selected', 'selected');
        $('#TimeFrame31 option[value="' + data.TimeFrame3 + '"]').attr('selected', 'selected');

        var timeframe1 = $( "#TimeFrame11 option:selected" ).text();
        var timeframe2 = $( "#TimeFrame21 option:selected" ).text();
        var timeframe3 = $( "#TimeFrame31 option:selected" ).text();
        var timeframe4 = $( "#TimeFrame41 option:selected" ).text();
        var timeframe5 = $( "#TimeFrame51 option:selected" ).text();
        var img1 = _jpeg(data.SSTimeFrame1);
        var img2 = _jpeg(data.SSTimeFrame2);
        var img3 = _jpeg(data.SSTimeFrame3);
        var img4 = _jpeg(data.SSTimeFrame4);
        var img5 = _jpeg(data.SSTimeFrame5);


        $('#ava-TimeFrame11').attr('src', img1);
        $('#container-TimeFrame11').attr('href', img1);
        $('#container-TimeFrame11').data('caption', "TimeFrame 11 : <span class='colorYellow'>" + timeframe1 + "</span>");
        if (data.SSTimeFrame1) {
            $('#ava-TimeFrame11').show();
          } else {
            $('#ava-TimeFrame11').hide();
            $('#deleteTimeframe1-TimeFrame11').hide();
          }

        $('#ava-TimeFrame21').attr('src', img2);
        $('#container-TimeFrame21').attr('href', img2);
        $('#container-TimeFrame21').data('caption', "TimeFrame 21 : <span class='colorYellow'>" + timeframe2 + "</span>");
        if (data.SSTimeFrame2) {
          $('#ava-TimeFrame21').show();
        } else {
          $('#ava-TimeFrame21').hide();
          $('#deleteTimeframe1-TimeFrame21').hide();
        }

        $('#ava-TimeFrame31').attr('src', img3);
        $('#container-TimeFrame31').attr('href', img3);
        $('#container-TimeFrame31').data('caption', "TimeFrame 31 : <span class='colorYellow'>" + timeframe3 + "</span>");
        if (data.SSTimeFrame3) {
          $('#ava-TimeFrame31').show();
        } else {
          $('#ava-TimeFrame31').hide();
          $('#deleteTimeframe1-TimeFrame31').hide();
        }
      
      $('#ava-TimeFrame41').attr('src', img4);
        $('#container-TimeFrame41').attr('href', img4);
        $('#container-TimeFrame41').data('caption', "TimeFrame 41 : <span class='colorYellow'>" + timeframe4 + "</span>");
        if (data.SSTimeFrame4) {
          $('#ava-TimeFrame41').show();
        } else {
          $('#ava-TimeFrame41').hide();
          $('#deleteTimeframe1-TimeFrame41').hide();
        }
      
      $('#ava-TimeFrame51').attr('src', img5);
        $('#container-TimeFrame51').attr('href', img5);
        $('#container-TimeFrame51').data('caption', "TimeFrame 51 : <span class='colorYellow'>" + timeframe5 + "</span>");
        if (data.SSTimeFrame5) {
          $('#ava-TimeFrame51').show();
        } else {
          $('#ava-TimeFrame51').hide();
          $('#deleteTimeframe1-TimeFrame51').hide();
        }


        $('#jHas').val(data.has);
        $('#jTicket').val(data.ticket);

        $('#accountModalRows').html('');
        $.each(response["data"], function () {
          var row = this;
          var content = 
            "<tr>" +
              "<td class='sect_td1'>" + row.ticket + "</td>" +
              "<td class='sect_td1'>" + row.symbol + "</td>" +
              "<td class='sect_td1'>" + _buysellBage(row.type) + "</td>" +
              "<td class='sect_td1'>" + row.lots + "</td>" +
              "<td class='sect_td1'> " + _wonlossBage(row.outcome, true) + "</td>" +
            "</tr>";
          $('#accountModalRows').append(content);
          });

          $('#listReasonForExit option[value="' + data.ReasonForExit + '"]').attr('selected', 'selected');
          $('#listReasonForEntry2 option[value="' + data.ReasonForEntry + '"]').attr('selected', 'selected');
          $('#listReasonForEntry2').attr('title', data.ReasonForEntry);
          $('#listReasonForOutcome2 option[value="' + data.ReasonForOutcome + '"]').attr('selected', 'selected');
          $('#listReasonForOutcome2').attr('title', data.ReasonForOutcome);
          $('#listStrategyUsed2').attr('title', data.StrategyUsed);
          $('#listStrategyUsed2 option[value="' + data.StrategyUsed + '"]').attr('selected', 'selected');
          $('#listHowICanImprove2').val(data.HowICanImprove);

        $("#modalOpenJournal").modal("show");
        $('.timeframe-wrap1-hide').hide();
        _rebiuld_photoswipe();
      } else {
        notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });
}

function getAccountDetails(
  account_id,
  filterType,
  startDate,
  endDate,
  symbols
) {
  _account_id = account_id;
  _filterType = filterType;
  _startDate = startDate;
  _endDate = endDate;
  _symbols = symbols;

  dTableAccountSummaryAll.ajax.reload();
  dTableAccountSummaryDrowDown.ajax.reload();
  if (dTableAccountSummaryFloatingProfit) {
  dTableAccountSummaryFloatingProfit.ajax.reload();
  }
}

$(".reasonAdd").click(function () {

    var current_type_id = $(this).attr("id");

    if (current_type_id == "addReasonForEntry") {

        $("#reasonAdd .modal-title").text("Add Reason For Entry");
        $("#reasonAdd .reasonValue").attr("placeholder", "Enter Reason For Entry");
        $("#reasonAdd .reasonValue").val("");
        $("#reasonAdd .reasonType").val("ReasonForEntry");
        $("#reasonAdd").modal("show");

    } else if (current_type_id == "addReasonForOutcome") {

        $("#reasonAdd .modal-title").text("Add Reason For Outcome");
        $("#reasonAdd .reasonValue").attr("placeholder", "Enter Reason For Outcome");
        $("#reasonAdd .reasonValue").val("");
        $("#reasonAdd .reasonType").val("ReasonForOutcome");
        $("#reasonAdd").modal("show");

    } else if (current_type_id == "addHowICanImprove") {

        $("#reasonAdd .modal-title").text("Add How I Can Improve");
        $("#reasonAdd .reasonValue").attr("placeholder", "Enter How I Can Improve");
        $("#reasonAdd .reasonValue").val("");
        $("#reasonAdd .reasonType").val("HowICanImprove");
        $("#reasonAdd").modal("show");

    } else if (current_type_id == "addStrategyUsed") {

        $("#reasonAdd .modal-title").text("Add Strategy Used");
        $("#reasonAdd .reasonValue").attr("placeholder", "Enter Strategy Used");
        $("#reasonAdd .reasonValue").val("");
        $("#reasonAdd .reasonType").val("StrategyUsed");
        $("#reasonAdd").modal("show");

    } else if (current_type_id == "addReasonForExit") {

        $("#reasonAdd .modal-title").text("Add Reason For Exit");
        $("#reasonAdd .reasonValue").attr("placeholder", "Enter Reason For Exit");
        $("#reasonAdd .reasonValue").val("");
        $("#reasonAdd .reasonType").val("ReasonForExit");
        $("#reasonAdd").modal("show");

    }

    getAccountReason();
});

$('#reasonAdd').on('submit', function (event) {
      event.preventDefault();
      $.ajax({
          url: BASE_URL + "summary/addNewReason",
          method: "POST",
          async: false,
          data: {
          action: "addNewReason",
          user_id: $("#user_id").val(),
          reasonType: $("#reasonType").val(),
          reasonValue: $("#reasonValue").val(),
          },
          success: function (response) {
          response = JSON.parse(response);
          if (response["status"] == "success") {
              var data = response["data"];
              $('#list' + data.reasonType).append('<option value="' + data.reasonValue + '" selected="selected">' + data.reasonValue + '</option>');
              $('#reasonAdd').modal('hide');

          }
          }
      })
    });


function _jpeg(img) {
  return img.includes('data:')
    ? img
    : "data:image/jpg;charset=utf8;base64," + img;
}
var isChanged = false;
$("body").on('change', '#listStrategyUsed2, #listReasonForEntry2, #listReasonForOutcome2', function () {
  isChanged = true;
});

$("body").on('keyup','#listHowICanImprove2', function(){
  isChanged = true;
})

$('body').on('click','.custom-modal-click-close', function () {
  if(isChanged){
    if(confirm("It seems some data has been modified. Do you want to close anyway?")){
     $('#modalOpenJournal').modal('toggle');
    }
  }else{
    $('#modalOpenJournal').modal('toggle');
  }
})

function filterTable(el) {
  var table = '#' + $(el).attr('rel');
  var term = $(el).val();

  var checked = $(el).is(":checked");
  if (checked) {
    $(table).DataTable().search(term).draw();
  }
  console.log(checked);
  return checked;
}

function switchSummaryGrp(el) {
  var res=[];
  var table = '#' + $(el).attr('rel');
  $.each($(table).find('input:checkbox:checked'), function() {
    res.push($(this).attr('rel-ticket'));
  });
  return res;
}

function clearfilterJournalSummary(el) {
  var table = '#' + $(el).attr('rel');
  $(table).DataTable().search('').draw();
  $(table).find('input:checkbox').prop('checked', false);
  $('#JournalSummaryGroup').val('');
  $('#JournalSummaryGridGrpBtn').hide(300);
  $('#JournalSummaryGrid').find('.modalOpenJournal').show(300);
}

function filterJournalSummary(el) {
  var state = filterTable(el);
  if (state) {
    $('#JournalSummaryGridGrpBtn').show(300);
    $('#JournalSummaryGrid').find('.modalOpenJournal').show(300);
  }
  var tickets = switchSummaryGrp(el);
  $('#JournalSummaryGridGrpValue_view').val(tickets.toString());
  //console.log($('#JournalSummaryGridGrpValue1').val(tickets)[0].value);

  if ($('#JournalSummaryGridGrpValue').val(tickets)[0].value==''){
    $('#JournalSummaryGridGrpJournalBtn').hide();
  } else {
    $('#JournalSummaryGridGrpJournalBtn').show();
  }
}

function getAccountSummaryJournal() {
  $("#JournalSummaryGrid").DataTable({
    language: {
      paginate: {
        next: '&#62;', // or '→'
        previous: '&#60;' // or '←' 
      }
    },
    order: [[5, 'asc']],
   ajax: function (data, callback, settings) {
      $.ajax({
        url: BASE_URL + '/summary/getAccountSummaryJournal',
        method: "POST",
        data: {
          account_id: _account_id,
          start_date: $("#journal_start_date").val(),
          end_date: $("#journal_end_date").val(),
          symbols: ""
        },
        success: function (response) {
          var response = JSON.parse(response);
          console.log(response['data']);
          var data = response;
          callback(response);
        }
      });
    },
    columns: [
      { render: function (data, type, full, meta) {
          return "<span class='checkbox' style='padding-left: 20px'><label><input type='checkbox' class='form-check-input' onclick='filterJournalSummary(this);' rel='JournalSummaryGrid' rel-ticket='" + full.ticket + "' value='" + full.symbol + "'>&nbsp;<small style='color:grey'>" + full.ticket + "</small></label></span>";
        },
        data: "ticket" 
      },      
      { data: "opentime", render: function(d) {
        return _dateTZ(d, baseGMT, profileGMT,false);
        }},
      { data: "closetime", render: function(d) {
        return _dateTZ(d, baseGMT, profileGMT,false);
        }},

      { data: "symbol" },
      {
        data: "type",
        render: function (d) {
          return _buysellBage(d);
        },
      },

      { data: "lots" },
      {
        data: "outcome",
        render: function (d) {
          return _wonlossBage(d, true);
        },
      },
      {
        render: function (data, type, full, meta) {
          var clas = full.has=='0' ? 'success' : 'secondary';
          return (
            '<a class="modalOpenJournal px-3 btn btn-' + clas +'" href="javascript:void(0)" onClick="modalAccountDetailShow(' +
            full.ticket + ',' + _account_id +
            ');" id="' +
            full.ticket +
            '" ><i class="ion-ios-paper-outline" /></a>'
          );
        },
      },
    ],
  });
}


function getAccountSummaryJournalFilter() {
  $("#JournalSummaryGrid").DataTable({
    language: {
      paginate: {
        next: '&#62;', // or '→'
        previous: '&#60;' // or '←' 
      }
    },
    order: [[5, 'asc']],
   ajax: function (data, callback, settings) {
      $.ajax({
        url: BASE_URL + '/summary/getAccountSummaryJournalFilter',
        method: "POST",
        data: {
          account_id: _account_id,
          start_date: $("#journal_start_date").val(),
          end_date: $("#journal_end_date").val(),
          symbols: ""
        },
        success: function (response) {
          var response = JSON.parse(response);
          var data = response;
          callback(response);
        }
      });
    },
    columns: [
      { render: function (data, type, full, meta) {
          return "<span class='checkbox'><label><input type='checkbox' class='form-check-input' onclick='filterJournalSummary(this);' rel='JournalSummaryGrid' rel-ticket='" + full.ticket + "' value='" + full.symbol + "'>&nbsp;<small style='color:grey'>" + full.ticket + "</small></label></span>";
        },
        data: "ticket" 
      },      
      { data: "opentime", render: function(d) {
        return _dateTZ(d, baseGMT, profileGMT,false);
        }},
      { data: "closetime", render: function(d) {
        return _dateTZ(d, baseGMT, profileGMT,false);
        }},

      { data: "symbol" },
      {
        data: "type",
        render: function (d) {
          return _buysellBage(d);
        },
      },

      { data: "lots" },
      {
        data: "outcome",
        render: function (d) {
          return _wonlossBage(d, true);
        },
      },
      {
        render: function (data, type, full, meta) {
          var clas = full.has=='0' ? 'success' : 'secondary';
          return (
            '<a class="modalOpenJournal px-3 btn btn-' + clas +'" href="javascript:void(0)" onClick="modalAccountDetailShow(' +
            full.ticket + ',' + _account_id +
            ');" id="' +
            full.ticket +
            '" ><i class="ion-ios-paper-outline" /></a>'
          );
        },
      },
    ],
  });
}

$('#accounts').change(function(){
  $('#reload').trigger("click");
});

$('#reload').click(
  function reload() {
    window.location = BASE_URL + '/summary/account?ac=' + $('#accounts').val();
  }
);



$(document).ready(function(){
  getAccountHistory();
  getAccountSummaryJournal();
  getAccountReason();
});