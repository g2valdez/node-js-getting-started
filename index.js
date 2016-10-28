var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/login', function(request, response) {
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


