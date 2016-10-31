var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var users = [{user:"japple", pass: "seed", name: "Johnny Appleseed", img: "http://popularpittsburgh.com/wp-content/uploads/2015/02/johnny-appleseed-article.jpg"},
	{user:"jhan", pass: "cock", name: "John Hancock", img: "https://www.wikitree.com/photo.php/7/7a/JohnHancockSmall.jpeg"}
];

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

app.get('/home', function(request, response) {
  response.render('pages/home');
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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


