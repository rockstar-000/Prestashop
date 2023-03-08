notifyme = {
  showNotification: function (title, message) {
    var type = "success";

    if (title == "error") {
      type = "error";
    }

    $.notify(
      message,
      {
        "position": "top center",
        "className": type
      }
    );
  },
};

// Overlay Section start
function showOverlay() {
  $(".loading-overlay").show();
}

function hideOverlay() {
  $(".loading-overlay").hide();
}
// Overlay Section end
