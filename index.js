var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var users = require('./public/data.json').users;

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/login', function(request, response) {
  response.render('pages/login');
});

app.post('/login', function(request, response){
	var user = request.body.username;
	var pass = request.body.password;
	var newUser = {
		user: user,
		pass: pass
	};
	for (var i in users) {
		if (users[i].user === newUser.user){
			if (users[i].pass === newUser.pass){
				response.cookie('user', users[i]);
				response.render('pages/home', {
					user_name: users[i].name,
					user_img: users[i].img
				});
				return;
			}
			else {
				console.log("right user wrong pass");
				response.render('pages/login');
				return;
			}
		}

	}

	console.log("wrong user");
	response.render('pages/login');

});

app.get('/signup', function(request, response) {
  response.render('pages/signup');
});

app.get('/logout', function(request, response) {
	response.clearCookie('user');
  response.render('pages/login');
});

app.get('/home', function(request, response) {
	var cookie = request.cookies.user;
	if(cookie === undefined){
		console.log("error no cookie");
		response.render('pages/login');
	}
	else {
		response.render('pages/home', {
			user_name: cookie.name,
			user_img: cookie.img
		});
	}

});

app.get('/stats', function(request, response) {
  response.render('pages/stats');
});

app.get('/mission_browser', function(request, response) {
  response.render('pages/mission_browser');
});

app.get('/history', function(request, response) {
  response.render('pages/history');
});

app.get('/mission', function(request, response) {
  response.render('pages/mission');
});

app.get('/leaderboards', function(request, response) {
  response.render('pages/leaderboards');
});

app.get('/edit_profile', function(request, response) {
  response.render('pages/edit_profile');
});

io.on('connection', function(socket){
	console.log('a user connected');

	// socket.on('current time', function(msg){
 //    	io.emit('set time', msg);
	// 	console.log('time: ' + msg);
	// });
	
	// socket.on('new connection', function(msg){
 //    	io.emit('get time', msg);
	// });

	// socket.on('pause play video', function(msg){
 //    	io.emit('control video', msg);
	// });

});


http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

});