// Load external dependencies
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

// Ready up Express so we can start using it
var app = express();

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

// Homepage
app.get('/', function (request, response) {
    response.render('home');
});

// Contact Page
app.get('/contact', function (request, response) {
    response.render('contact');
});

// Start our on port 5000
app.listen(5000, function () {
	console.log('Lesson 2 listening on port 5000!');
});
