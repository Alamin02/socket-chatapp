var username = $("#username").val();
var link = "";
var isValid = false;

$("#username").keydown(function (event) {
  console.log(event.which);
  if (event.which == 13) {
    event.preventDefault();
    enterRoom();
  }
});

$("#start").click(function () {
  enterRoom();
});

function enterRoom() {
  username = $("#username").val();

  $j = jQuery.noConflict();

  $j.get('validity', { name: username }, function (data) {
    console.log(data.link);
    if (data.valid) {
      var goto = "http://localhost:3000" + data.link;
      window.location.replace(goto);
    }
  });
}