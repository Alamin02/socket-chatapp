var username = $("#username").val();
var link = "";
var isValid = false;

$("#username").keydown(function (event) {
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

  if (username) {
    $.get('validity', { name: username }, function (data) {
      if (data.valid) {
        let getUrl = window.location;
        var goto = getUrl.protocol + "//" + getUrl.host + data.link;
        window.location.replace(goto);
      }
    });
  }
}