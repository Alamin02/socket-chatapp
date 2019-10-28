var express = require('express');

// Init App
var app = express();

var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Set Port
app.set('port', (process.env.PORT || 3000));

http.listen(app.get('port'), function () {
	console.log('Server started on port ' + app.get('port'));
});

//set url for home
app.get('/', function (req, res) {
	res.render('home');
});

//set url for chatroom
app.get('/chat', function (req, res) {
	var user_name = req.query;
	if (!users[user_name]) {
		res.render('chat', user_name);
	}
});



var users = [];
var ids = [];

//checks primary validity
app.get('/validity', function (req, res) {
	var user_name = req.query.name;
	if (userValidator(user_name)) {
		var link = '/chat?user=' + user_name;
		var data = {
			link: link,
			valid: true
		}
		res.send(data);
	}
	else {
		var data = {
			link: "#",
			valid: false
		}
		res.send(data);
	}
});


// Socket IO configuration for realtime chatting.

io.on('connection', function (socket) {
	socket.on('new user', function (user) {
		if (userValidator(user)) {
			users.push(user);
			ids.push(socket.id);

			io.emit('new user', {
				new: user,
				userlist: users
			});
		}
		else {
			socket.disconnect(socket.id);
		}
	});

	socket.on('new message', function (msg) {
		io.emit('message rcvd', msg);
	});

	socket.on('disconnect', function (user) {
		var userLeft = removeUserByID(socket.id);
		io.emit('user left', {
			left: userLeft,
			userlist: users
		});
	});
});


function userValidator(name) {
	if (users.indexOf(name) >= 0) {
		return false;
	}
	else if (name.length < 3 && name.length > 10) {
		return false;
	}
	else {
		return true;
	}
}

function removeUserByID(id) {
	var index = ids.indexOf(id);
	var left = [];
	if (index >= 0) {
		//remove the damn user
		left = users[index];
		users.splice(index, 1);
		ids.splice(index, 1);
	}
	return left;
}