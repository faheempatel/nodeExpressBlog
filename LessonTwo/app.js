// Load external dependencies
var path = require('path');
var express = require('express');

//Load and Set up handlebars
var handlebars = require('express-handlebars').create({
  partialsDir: path.join(__dirname, "views/partials"),
  extname: 'hbs'
});

// Ready up Express so we can start using it
var app = express();

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

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
	console.log('Lesson 1 listening on port 5000!');
});






