// Load external dependencies
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var livereload = require('livereload');
var mailgun = require('mailgun-js')({ 
  apiKey: 'key-31facac671b2b0af91c9b4118bafdf58', 
  domain: 'sandbox3a4e53f45ca441429d637dd312f322bb.mailgun.org' 
});

var fs = require('fs');
var blogPosts = require('./blog-posts.json');

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

// Handle the contact form submission
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

  if(missingName || missingEmail || missingMessage) {
    response.render('contact',{
      error: true,
      message: 'Some fields are missing',
      formBody: formBody,
      missingName: missingName,
      missingEmail: missingEmail,
      missingMessage: missingMessage
    })
  } else {

    var emailOptions = {
      from: formBody.name + '<' + formBody.email + '>',
      to: 'paulfitz99@gmail.com',
      subject: 'Website contact form - ' + formBody.subject,
      text: formBody.message
    }

    mailgun.messages().send(emailOptions, function (error, res) {
      console.log(res);
      if(error) {
        response.render('contact', {
          error: true,
          message: 'There was an error sending the message',
          formBody: request.body
        })
      } else {
        response.render('contact', {
          success: true,
          message: 'Your message has been successfully sent!'
        })
      }
    })
  }
});

//Create post page
app.get('/create-post', function (request, response) {
  response.render('create-post');
});

//Handle /create-post form submission
app.post('/create-post', function (request, response) {
  
  var formBody = {
    'title': request.body.title,
    'excerpt': request.body.excerpt,
    'content': request.body.content
  }

  if(!formBody.title) {
    return response.render('create-post', {
      error: true,
      message: 'The title is required',
      missingTitle: true,
      formBody: formBody
    }) 
  } else {
    var timestamp = Date.now();
    var postId = timestamp;

    savePost(postId, blogPosts, {
      id: postId,
      title: formBody.title,
      excerpt: formBody.excerpt,
      content: formBody.content
    });

    response.render('create-post', {
      success: true,
      message: 'New post created successfully!',
      postId: postId
    })
  }
});

app.get('/edit-post/:post_id', function (request, response) {
  var postId = request.params['post_id'];
  var post = blogPosts[postId];

  if(!post) {
    response.send('Not found!')
  } else {
    response.render('edit-post', {
      formBody: post,
      postId: postId
    })
  }
});

// Handle editing a blog post
app.post('/edit-post/:post_id', function (request, response) {
  var postId = request.params['post_id'];
  var post = blogPosts['post_id'];

  var formBody = {
    'title': request.body.title,
    'excerpt': request.body.excerpt,
    'content': request.body.content
  }

  if(!formBody.title) {
    return response.render('edit-post', {
      error: true,
      message: 'The title is required',
      missingTitle: true,
      postId: postId,
      formBody: formBody
    })
  }

  var newPost = {
    id: postId,
    title: formBody.title,
    excerpt: formBody.excerpt,
    content: formBody.content
  }

  savePost(postId, blogPosts, newPost);

  response.render('edit-post', {
    success: true,
    message: 'Post successfully saved',
    postId: postId,
    formBody: newPost
  });

});

app.get('/delete-post/:post_id', function (request, response) {
  var postId = request.params['post_id'];
  var post = blogPosts[postId];

  if(!post) {
    response.send('Not found!');
  } else {
    response.render('delete-post', {
      postId: postId,
      postTitle: post.title
    })
  }
});

app.post('/delete-post/:post_id', function (request, response) {
  var postId = request.params['post_id'];

  // Delete the post from the blogPosts object
  delete blogPosts[postId];

  // Save the updated object to file
  saveJSONToFile('blog-posts.json', blogPosts);

  // Tell the browser we're done
  response.redirect('/blog?delete=true');
});


//Blog page
app.get('/blog', function (request, response) {
	var listOfPosts = [];
	Object.keys(blogPosts).forEach(function (postId) {
		var post = blogPosts[postId];
		post.id = postId;
		listOfPosts.push(post);
	});

  console.log(listOfPosts)

	response.render('blog', {
		posts: listOfPosts,
    delete: request.query['delete'],
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
	console.log('Lesson 6 listening on port 5000!');
});

function saveJSONToFile(filename, json){
  fs.writeFile(filename, JSON.stringify(json, null, '\t') + '\n', function (err) {
    // If there is an error let us know
    // otherwise give us a success message
    if (err) {
      throw err;
    } else {
      console.log('It\'s saved!');
    }
  })
}

function savePost(id, object, data) {
  object[id] = data;
  saveJSONToFile('blog-posts.json', object);
}