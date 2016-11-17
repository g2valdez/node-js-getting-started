var express = require('express'); //our http request handler
var bodyParser = require('body-parser'); //used to funnel in form data such as login
var cookieParser = require('cookie-parser'); //used to give users cookies when logging in
var fs = require('fs'); //file I/O for board map 
var users = require('./public/data.json').users; //reads data from data.json
var missions = require('./public/data.json').missions;
var items = require('./public/data.json').items;

read_map_files(); // for each mission, load its map data

load_user_items(); // for each user, load its corresponding item data

var app = express(); //creates a new web server
var http = require('http').Server(app); // funnels web server through http
var io = require('socket.io')(http); // new soccket.io instance

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public')); //sets the directory to ./public
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // use the cookie parser to populate request.cookies

// views is directory for all template files
app.set('views', __dirname + '/views'); // look for views in the ./views directory
app.set('view engine', 'ejs'); //set view engine to ejs

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
	var cookie = request.cookies.user;
	if(cookie === undefined){
		console.log("error no cookie");
		response.render('pages/login');
	}
	else {
		response.render('pages/stats', {
			user_name: cookie.name,
			user_img: cookie.img
		});
	}
});

app.get('/mission_browser', function(request, response) {
	var cookie = request.cookies.user;
	if(cookie === undefined){
		console.log("error no cookie");
		response.render('pages/login');
	}
	else {
		response.render('pages/mission_browser', {
  			missions: missions
  		});
	}

});

app.get('/history', function(request, response) {
  response.render('pages/history');
});

app.get('/mission/:missionName', function(request, response) {
	var cookie = request.cookies.user;
	if(cookie === undefined){
		console.log("error no cookie");
		response.render('pages/login');
	}
	else {
		var mission;
		for(var i = 0; i < missions.length; i++){
			if(request.params.missionName === missions[i].name){
				break;
			}
		}
		missions[i].users.push(cookie.user); // push to missions array
		for(var j = 0; j < users.length; j++){
			if(cookie.user === users[j].user){
				break;
			}

		}
		response.render('pages/mission', {
			mission:missions[i],
			user: users[j]
		});
	}

});

app.get('/leaderboards', function(request, response) {
  response.render('pages/leaderboards');
});

app.get('/edit_profile', function(request, response) {
  var cookie = request.cookies.user;
	if(cookie === undefined){
		console.log("error no cookie");
		response.render('pages/login');
	}
	else {
		for(var j = 0; j < users.length; j++){
			if(cookie.user === users[j].user){
				break;
			}
		}
	}

  	response.render('pages/edit_profile', {
  		user_name: users[j].name,
	    user_img: users[j].img

  	});
});

app.post('/saveProfile', function(request, response) {
	var cookie = request.cookies.user;
	if(cookie === undefined){
		console.log("error no cookie");
		response.render('pages/login');
	}
	else {
		for(var j = 0; j < users.length; j++){
			if(cookie.user === users[j].user){
				break;
			}
		}
	}
	console.log(request ,'\n\n', request.body, request.profileImage)
	users[j].img = request.body.profileImage;
  	response.render('pages/edit_profile', {
  		user_name: users[j].name,
	    user_img: users[j].img

  	});
});

var allClients = [];
io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('user info', function(pack){
		console.log('pushed user info');
		var client = {
			socket: socket,
			user: pack.user,
			mission: pack.mission
		}
		allClients.push(client);
		for(var i = 0; i < missions.length; i++){
			if(missions[i].name === pack.mission.name) {
				break;
			}

		}
		io.emit('update users', missions[i]);
	});

	socket.on('user ready', function(pack){
		for(var j = 0; j < missions.length; j++){
			console.log(j);
			console.log(missions[j].name);
			console.log(pack.mission.name);
			if(missions[j].name === pack.mission.name){
				missions[j].usersReady++;
				break;
			}
		}
		console.log(missions[j].usersReady);
		io.emit('begin game', missions[j].usersReady);
	});

	socket.on('user movement', function(pack){
		io.emit('user move', pack);
	});

	socket.on('update board', function(pack){
		io.emit('board update', pack);
	});

	socket.on('disconnect', function(){
		console.log('a user disconnected');
		// finds the right client (object with socket, user, mission)
		for(var i = 0; i < allClients.length; i++){
			if(socket === allClients[i].socket){
				break;
			}
		}
		//finds the right mission in the missions array
		for(var j = 0; j < missions.length; j++){
			if(missions[j].name === allClients[i].mission.name){
				break;
			}
		}
		//finds the right user index
		for(var k = 0; k < missions[j].users.length; k++){
			if(allClients[i].user.user === missions[j].users[k]){
				break;
			}
		}
		missions[j].users.splice(k, 1); // remove the user from the missions user array
		io.emit('update users', missions[j]);
	});

});

function read_map_files() {
	for(var i = 0; i < missions.length; i++){
		missions[i].board = []; // initialize empty array of board
		missions[i].usersReady = 0;
		var data = fs.readFileSync("maps/"+missions[i].mapfile).toString();
		if (data != null)
			missions[i].board = data.toString().split('|');
	}
	console.log(missions[0].board);
}

function load_user_items() {
	for(var i = 0; i < users.length; i++){
		users[i].items = []; // initialize empty array of item objects
		for(var j = 0; j < users[i].item_keys.length; j++){
			users[i].items.push(items[users[i].item_keys[j]]);
		}
	}
}

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

});