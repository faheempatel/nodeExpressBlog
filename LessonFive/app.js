// Create a list of blog posts formatted
// in a way that's usable in our templates
var blogPosts = {
  "my-first-webpage": {
    "title": "My first webpage",
    "excerpt": "I've taken a course at Code at Uni and created my own personal website with HTML and CSS.",
    "content": "\
    <p>My first paragraph as well!</p>\
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula ante nec neque lobortis, fringilla convallis elit dignissim.</p>\
    "
  },
  "hello-world": {
    "title": "Hello World",
    "excerpt": "This is the start of my online journal. I will take about my journey in learning how to code!",
    "content": "\
    <p>Hello World this is a paragraph.</p>\
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula ante nec neque lobortis, fringilla convallis elit dignissim.</p>\
    "
  },
};


// Load external dependencies
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var livereload = require('livereload');

// Livereload
var server = livereload.createServer({
  exts: ['css', 'hbs'],
});
server.watch([__dirname + '/public', __dirname + '/views']);

// Ready up Express so we can start using it
var app = express();

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

//enables us to reference static files in the public folder
app.use(express.static('public'));

//enables us to parse data received from the front end
app.use(bodyParser.urlencoded({ extended: false }));

// Homepage
app.get('/', function (request, response) {
    response.render('home');
});

// Contact Page
app.get('/contact', function (request, response) {
    response.render('contact');
});

//Post to contact page
app.post('/contact', function (request, response) {
  var formBody = {
    'name': request.body.name,
    'email': request.body.email,
    'subject': request.body.subject,
    'message': request.body.message
  }

  var missingName = (formBody.name === '');
  var missingEmail = (formBody.email === '');
  var missingMessage = (formBody.message === '');

  console.log(formBody);

  if(missingName || missingEmail || missingMessage){
    return response.render('contact', {
      error: true,
      message: 'Some fields are missing',
      formBody,
      missingName,
      missingEmail,
      missingMessage
    });
  }else {
    response.render('contact', {formBody});
  }
});

//Blog page
app.get('/blog', function (request, response) {
	var listOfPosts = [];
	Object.keys(blogPosts).forEach(function (postId) {
		var post = blogPosts[postId];
		post.id = postId;
		listOfPosts.push(post);
	});

	response.render('blog', {
		posts: listOfPosts
	})
});

//Individual blog page
app.get('/blog/:post_id', function (request, response) {
	var postId = request.params['post_id'];
	var post = blogPosts[postId];

	if(!post){
		response.render('Page not found!')
	} else {
		response.render('post', post);
	}
});

// Start our on port 5000
app.listen(5000, function () {
	console.log('Lesson 5 listening on port 5000!');
});
