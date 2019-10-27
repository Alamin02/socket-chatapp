var socket = io();


var username = $("#user").val();

var message = {
    sender: "",
    text: ""
};

$(document).ready(function () {
    console.log(username);
    socket.emit('new user', username);
});

$("#msg").keydown(function (event) {
    console.log(event.which);
    if (event.which == 13) {
        message.text = $(this).val();
        message.sender = $("#user").val();
        $(this).val("");
        socket.emit('new message', message);
    }
});


var pm = {
    sender: "",
    reciever: "",
    text: ""
};


$("#pm").keydown(function (event) {
    console.log(event.which);
    if (event.which == 13) {
        pm.sender = $("#username").val();
        pm.reciever = $("#reciever").val();
        pm.text = $(this).val();
        $(this).val("");
        socket.emit('new pm', pm);
    }
});

socket.on('new user', function (user) {
    $("#gc").append("<li>" + user.new + " entered the room..." + "</li>");
    updateScroll();
    updateUsers(user.userlist);
});

socket.on('user left', function (user) {
    $("#gc").append("<li>" + user.left + " left the room..." + "</li>");
    updateScroll();
    updateUsers(user.userlist);
});


socket.on('message rcvd', function (msg) {
    console.log(msg);
    $("#gc").append("<li>" + msg.sender + " says : " + msg.text + "</li>");
    updateScroll();
});

socket.on('pm', function (msg) {
    console.log(msg);
});


function updateScroll() {
    console.log("called");
    var element = document.getElementById("group-chat");
    element.scrollTop = element.scrollHeight;
}

function updateUsers(users) {
    console.log(users);
    $("#active-users").empty();
    for (var i = 0; i < users.length; i++) {
        $("#active-users").append('<li class="list-group-item">' + users[i] + '</li>');

    }
}