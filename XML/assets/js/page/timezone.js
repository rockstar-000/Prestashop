reloadTimeZone();

function reloadTimezoneSession(timezone) {
  var sessionGMT = $("#sessionGMT").val();
  let now = new Date();
  $.ajax({
    url: BASE_URL + "timezone/spTimezoneSession",
    method: "POST",
    data: {
      account_id: _account_id,
      timezone: timezone,
      baseGMT: now.getTimezoneOffset() / (-60)
    },
    success: function (response) {
      console.log(response);
      response = JSON.parse(response);
      console.log(response);
      
      if (response["status"] == "success") {
        var data = response["data"]['data'];
        console.log(data)
        $("#tableNumberTradeOpen tbody").empty();
        

        $.each( data, function( key, value ) {
      var OrderType = '';
      if (value.OrderType=='Buy') {
        OrderType = '<span class="badge light badge-success">Buy</span>';
      } else if (value.OrderType=='Sell') {
        OrderType = '<span class="badge light badge-danger">Sell</span>';
      }
      
      var ProfitType = '';
      if (value.Profit > 0) {
              ProfitType =  '<span class="badge light badge-success">WON</span>';
            } else {
              ProfitType = '<span class="badge light badge-danger">Loss </span>';
            }
          //alert( key + ": " + value );
          $("#tableNumberTradeOpen tbody").append(
            `<tr>
                  <td>${value.OrderNumber}</td>
                  <td class='ct'>${value.Symbol}</td>
                  <td class='ct'>${OrderType}</td>
                  <td class='ct'>${value.OrderSize}</td>
                  <td class='ct'>${ProfitType} ${value.Profit}</td>
             </tr>`
          );
        });

        
        $('#modalTimezoneSession').modal('show');
      } else {
        // notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });

  
}


function reloadTimeZone(sessionGMT) {
  let now = new Date();
  $.ajax({
    url: BASE_URL + '/timezone/getTableData',
    method: "POST",
    data: {
      profileGMT: _baseGMT,
      sessionGMT: sessionGMT,
      baseGMT: now.getTimezoneOffset() / (-60),
    },
    success: function (response) {
      try {
        response = JSON.parse(response);
        console.log(response);
      } catch {
        console.log("err");
      }
      
      if (response["status"] == "success") {
        var data = response["data"];
        var data1 = data.filter((d) => d.id == 1)[0];
        var data2 = data.filter((d) => d.id == 2)[0];
        var data3 = data.filter((d) => d.id == 3)[0];
        var data4 = data.filter((d) => d.id == 4)[0];
        var data5 = data.filter((d) => d.id == 5)[0];
        var data6 = data.filter((d) => d.id == 6)[0];
        var data7 = data.filter((d) => d.id == 7)[0]; 
        var MOT_total = +data1.MOT + +data2.MOT + +data3.MOT + +data4.MOT + +data5.MOT + +data6.MOT + +data7.MOT;
        var MCT_total = +data1.MCT + +data2.MCT + +data3.MCT + +data4.MCT + +data5.MCT + +data6.MCT + +data7.MCT;
        var MTW_total = +data1.MTW + +data2.MTW + +data3.MTW + +data4.MTW + +data5.MTW + +data6.MTW + +data7.MTW;
        var MTL_total = +data1.MTL + +data2.MTL + +data3.MTL + +data4.MTL + +data5.MTL + +data6.MTL + +data7.MTL;
        var PROFITTRADE_total = +data1.PROFITTRADE + +data2.PROFITTRADE + +data3.PROFITTRADE + +data4.PROFITTRADE + +data5.PROFITTRADE + +data6.PROFITTRADE + +data7.PROFITTRADE;

        var bpv = Math.max.apply(Math, data.map((o)=> { return o.PROFITTRADE; }));
        var bpid = Number(data.filter((d) => d.PROFITTRADE == bpv)[0].id);

        var bpclass= 'style="color: #fbc531; font-weight: bold;"';
        if(sessionGMT == undefined) {
          sessionGMT = _baseGMT;
        }
        $("#tableBrokerTimeZone tbody").empty();
        console.log(data2);
        $("#tableBrokerTimeZone tbody").append(
          `<tr>
                <td  rowspan="1" colspan="1">Time GMT${sessionGMT}</td>
                <td  rowspan="1" colspan="1" class='ct' ${data1.id==bpid?bpclass:''}><small>${data1.h_open} - ${data1.h_close}</small></td>
                <td  rowspan="1" colspan="1" class='ct' ${data2.id==bpid?bpclass:''}><small>${data2.h_open} - ${data2.h_close}</small></td>
                <td  rowspan="1" colspan="1" class='ct' ${data3.id==bpid?bpclass:''}><small>${data3.h_open} - ${data3.h_close}</small></td>
                <td  rowspan="1" colspan="1" class='ct' ${data4.id==bpid?bpclass:''}><small>${data4.h_open} - ${data4.h_close}</small></td>
                <td  rowspan="1" colspan="1" class='ct' ${data5.id==bpid?bpclass:''}><small>${data5.h_open} - ${data5.h_close}</small></td>
                <td  rowspan="1" colspan="1" class='ct' ${data6.id==bpid?bpclass:''}><small>${data6.h_open} - ${data6.h_close}</small></td>
                <td  rowspan="1" colspan="1" class='ct' ${data7.id==bpid?bpclass:''}><small>${data7.h_open} - ${data7.h_close}</small></td>
           </tr>`
        );
        $("#tableBrokerTimeZone tbody").append(
          `<tr>
                <td class="sorting_1">Number of Trades<br> Opened</td>
                <td  rowspan="1" colspan="1" class='ct' ${data1.id==bpid?bpclass:''}><a href="javascript:void(0)" data-timezone="" onclick="reloadTimezoneSession('SY')">${data1.MOT}</a></td>
                <td  rowspan="1" colspan="1" class='ct' ${data2.id==bpid?bpclass:''}><a href="javascript:void(0)" data-timezone="" onclick="reloadTimezoneSession('SYTO')">${data2.MOT}</a></td>
                <td  rowspan="1" colspan="1" class='ct' ${data3.id==bpid?bpclass:''}><a href="javascript:void(0)" data-timezone="" onclick="reloadTimezoneSession('TO')">${data3.MOT}</a></td>
                <td  rowspan="1" colspan="1" class='ct' ${data4.id==bpid?bpclass:''}><a href="javascript:void(0)" data-timezone="" onclick="reloadTimezoneSession('TOLN')">${data4.MOT}</a></td>
                <td  rowspan="1" colspan="1" class='ct' ${data5.id==bpid?bpclass:''}><a href="javascript:void(0)" data-timezone="" onclick="reloadTimezoneSession('LO')">${data5.MOT}</a></td>
                <td  rowspan="1" colspan="1" class='ct' ${data6.id==bpid?bpclass:''}><a href="javascript:void(0)" data-timezone="" onclick="reloadTimezoneSession('LONY')">${data6.MOT}</a></td>
                <td  rowspan="1" colspan="1" class='ct' ${data7.id==bpid?bpclass:''}><a href="javascript:void(0)" data-timezone="" onclick="reloadTimezoneSession('NY')">${data7.MOT}</a></td>
                <td  rowspan="1" colspan="1" class='ct'> ${MOT_total}</td>
           </tr>`
        );
        $("#tableBrokerTimeZone tbody").append(
          `<tr>
                  <td>Number of Trades Closed</td>
                  <td class='ct' ${data1.id==bpid?bpclass:''}>${data1.MCT}</td>
                  <td class='ct' ${data2.id==bpid?bpclass:''}>${data2.MCT}</td>
                  <td class='ct' ${data3.id==bpid?bpclass:''}>${data3.MCT}</td>
                  <td class='ct' ${data4.id==bpid?bpclass:''}>${data4.MCT}</td>
                  <td class='ct' ${data5.id==bpid?bpclass:''}>${data5.MCT}</td>
                  <td class='ct' ${data6.id==bpid?bpclass:''}>${data6.MCT}</td>
                  <td class='ct' ${data7.id==bpid?bpclass:''}>${data7.MCT}</td>
                  <td class='ct'> ${MCT_total}</td>
             </tr>`
        );
        $("#tableBrokerTimeZone tbody").append(
          `<tr>
                  <td>Total Number of<br> Wins</td>
                  <td class='ct' ${data1.id==bpid?bpclass:''}>${data1.MTW}</td>
                  <td class='ct' ${data2.id==bpid?bpclass:''}>${data2.MTW}</td>
                  <td class='ct' ${data3.id==bpid?bpclass:''}>${data3.MTW}</td>
                  <td class='ct' ${data4.id==bpid?bpclass:''}>${data4.MTW}</td>
                  <td class='ct' ${data5.id==bpid?bpclass:''}>${data5.MTW}</td>
                  <td class='ct' ${data6.id==bpid?bpclass:''}>${data6.MTW}</td>
                  <td class='ct' ${data7.id==bpid?bpclass:''}>${data7.MTW}</td>
                  <td class='ct'> ${MTW_total}</td>
             </tr>`
        );
        $("#tableBrokerTimeZone tbody").append(
          `<tr>
                  <td>Total Number of<br> Losses</td>
                  <td class='ct' ${data1.id==bpid?bpclass:''}>${data1.MTL}</td>
                  <td class='ct' ${data2.id==bpid?bpclass:''}>${data2.MTL}</td>
                  <td class='ct' ${data3.id==bpid?bpclass:''}>${data3.MTL}</td>
                  <td class='ct' ${data4.id==bpid?bpclass:''}>${data4.MTL}</td>
                  <td class='ct' ${data5.id==bpid?bpclass:''}>${data5.MTL}</td>
                  <td class='ct' ${data6.id==bpid?bpclass:''}>${data6.MTL}</td>
                  <td class='ct' ${data7.id==bpid?bpclass:''}>${data7.MTL}</td>
                  <td class='ct'> ${MTL_total}</td>
             </tr>`
        );
    $("#tableBrokerTimeZone tbody").append(
          `<tr>
                  <td>P&L</td>
                  <td class='ct' ${data1.id==bpid?bpclass:''}>${Number(data1.PROFITTRADE).toFixed(2)}</td>
                  <td class='ct' ${data2.id==bpid?bpclass:''}>${Number(data2.PROFITTRADE).toFixed(2)}</td>
                  <td class='ct' ${data3.id==bpid?bpclass:''}>${Number(data3.PROFITTRADE).toFixed(2)}</td>
                  <td class='ct' ${data4.id==bpid?bpclass:''}>${Number(data4.PROFITTRADE).toFixed(2)}</td>
                  <td class='ct' ${data5.id==bpid?bpclass:''}>${Number(data5.PROFITTRADE).toFixed(2)}</td>
                  <td class='ct' ${data6.id==bpid?bpclass:''}>${Number(data6.PROFITTRADE).toFixed(2)}</td>
                  <td class='ct' ${data7.id==bpid?bpclass:''}>${Number(data7.PROFITTRADE).toFixed(2)}</td>
                  <td class='ct'> ${Number(PROFITTRADE_total).toFixed(2)}</td>
             </tr>`
        );
    $("#tableBrokerTimeZone tbody").append(
          `<tr>
                  <td>Win Rate</td>
                  <td class='ct' ${data1.id==bpid?bpclass:''}>${Number((data1.MTW/data1.MOT)*100).toFixed(2)}</td>
                  <td class='ct' ${data2.id==bpid?bpclass:''}>${Number((data2.MTW/data2.MOT)*100).toFixed(2)}</td>
                  <td class='ct' ${data3.id==bpid?bpclass:''}>${Number((data3.MTW/data3.MOT)*100).toFixed(2)}</td>
                  <td class='ct' ${data4.id==bpid?bpclass:''}>${Number((data4.MTW/data4.MOT)*100).toFixed(2)}</td>
                  <td class='ct' ${data5.id==bpid?bpclass:''}>${Number((data5.MTW/data5.MOT)*100).toFixed(2)}</td>
                  <td class='ct' ${data6.id==bpid?bpclass:''}>${Number((data6.MTW/data6.MOT)*100).toFixed(2)}</td>
                  <td class='ct' ${data7.id==bpid?bpclass:''}>${Number((data7.MTW/data7.MOT)*100).toFixed(2)}</td>
                  <td class='ct'></td>
             </tr>`
        );
        // $("#tableBrokerTimeZone tbody").append(
        //   `<tr>
        //           <td>Total Number of Trades</td>
        //           <td ${data1.id==bpid?bpclass:''}>${data1.MTT}</td>
        //           <td ${data2.id==bpid?bpclass:''}>${data2.MTT}</td>
        //           <td ${data3.id==bpid?bpclass:''}>${data3.MTT}</td>
        //           <td ${data4.id==bpid?bpclass:''}>${data4.MTT}</td>
        //      </tr>`
        // );
      } else {
        // notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });

  $.ajax({
    url: BASE_URL + '/timezone/getBrokersTimeADayData',
    method: "POST",
    data: {
      profileGMT: _baseGMT,
      sessionGMT: sessionGMT,
      baseGMT: 3,
    },
    success: function (response) {
      console.log(response);
      response = JSON.parse(response);
      if (response["status"] == "success") {
        var data = response["data"][0];
        console.log(data);
        // console.log(data);
        $("#maxHourGMT").text(data.maxHourGMT + ':00 - ' + (parseInt(data.maxHourGMT) + 1) + ':00');
        $("#maxProfit").text(data.maxProfit);
        $("#minHourGMT").text(data.minHourGMT + ':00 - ' + (parseInt(data.minHourGMT) + 1) + ':00')
        $("#minProfit").text(data.minProfit);
      } else {
        // notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });
}

function modalBestWorstHrSession(timezone) {

  $.ajax({
    url: BASE_URL + "timezone/modalBestWorstHrSession",
    method: "POST",
    data: {
      timezone: timezone,
      baseGMT:2
    },
    success: function (response) {
      response = JSON.parse(response);
      // console.log(response);
      
      if (response["status"] == "success") {
        var data = response["data"];
        $("#tableNumberTradeOpen tbody").empty();
        

        $.each( data, function( key, value ) {
      var OrderType = '';
      if (value.OrderType=='Buy') {
        OrderType = '<span class="badge light badge-primary">Buy</span>';
      } else if (value.OrderType=='Sell') {
        OrderType = '<span class="badge light badge-danger">Sell</span>';
      }
      
      var ProfitType = '';
      if (value.Profit > 0) {
              ProfitType =  '<span class="badge light badge-primary">WON</span>';
            } else {
              ProfitType = '<span class="badge light badge-danger">Loss </span>';
            }
          $("#tableNumberTradeOpen tbody").append(
            `<tr>
                  <td>${value.OrderNumber}</td>
                  <td class='ct'>${value.Symbol}</td>
                  <td class='ct'>${OrderType}</td>
                  <td class='ct'>${value.OrderSize}</td>
                  <td class='ct'>${ProfitType} ${Number(value.Profit).toFixed(2)}</td>
             </tr>`
          );
        });
        if(timezone === 'min'){
          $('.best-worst-heading').html("Worst Hour Trade")
        }else{
          $('.best-worst-heading').html("Best Hour Trade")
        }
        $('#best_modal').modal();
      } else {
        // notifyme.showNotification(response["status"], response["message"]);
      }
    },
  });
  // $('#best_trade_modal').modal('show');
  //$("#best_modal").modal();

}

$('#timezone').change(function() {
  reloadTimeZone(this.value.slice(3));
});

$('#accounts').change(function(){
  $('#reload').trigger("click");
});

$('#reload').click(
  function reload() {
    window.location = BASE_URL + 'timezone?ac=' + $('#accounts').val();
  }
);
