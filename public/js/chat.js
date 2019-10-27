var socket = io();

var username = $("#user").val();

var message = {
    sender: "",
    text: ""
};

$(document).ready(function () {
    socket.emit('new user', username);
});


$("#msg").keydown(function (event) {
    if (event.which == 13) {
        message.text = $(this).val();
        message.sender = $("#user").val();
        $(this).val("");
        socket.emit('new message', message);
    }
});


socket.on('new user', function (user) {
    $("#gc").append(
        `<li class="entry-info text-info">` +
        user.new +
        ` entered the room... </li>`
    );
    updateScroll();
    updateUsers(user.userlist);
});

socket.on('user left', function (user) {
    $("#gc").append(
        `<li class="entry-info text-secondary">` +
        user.left +
        ` left the room... </li>`
    );
    updateScroll();
    updateUsers(user.userlist);
});


socket.on('message rcvd', function (msg) {
    $("#gc").append(
        `<li> <b>` + msg.sender + `: </b> ` + msg.text + `</li>`
    );
    updateScroll();
});

function updateScroll() {
    var element = document.getElementById("group-chat");
    element.scrollTop = element.scrollHeight;
}

function updateUsers(users) {
    $("#active-users").empty();
    for (var i = 0; i < users.length; i++) {
        $("#active-users").append('<li class="list-group-item user-list-item">' + users[i] + '</li>');
    }
}