// Load external dependencies
var express = require('express');

// Ready up Express so we can start using it
var app = express();

// Homepage
app.get('/', function (req, res) {
	res.send('Hello World!');
});

// Start our on port 5000
app.listen(5000, function () {
	console.log('Lesson 1 listening on port 5000!');
});