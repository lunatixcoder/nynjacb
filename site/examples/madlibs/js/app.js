function reveal() {
  $(".madlib").removeClass("madlib-hidden");
  $("#reveal").hide();
  $("#hide").show();
}

function hide() {
  $(".madlib").addClass("madlib-hidden");
  $("#reveal").show();
  $("#hide").hide();
}

$("#reveal").click(reveal);
$("#hide").click(hide);
NynjaCB.config("cloneClicks", "#reveal, #hide");
