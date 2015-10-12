var express = require('express');
var http = require('http');

var path = require('path');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var session = require('express-session');
var Negotiator = require('negotiator');
var errorHandler = require('errorhandler');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

var functions = require('./functions.js');

var DBconfig = require('./db.js');
mongoose.connect(DBconfig.url);

var User = require('./user');

//==================================================================
// Define the strategy to be used by PassportJS

passport.use(new LocalStrategy(
    function(username, password, done) {
	if (username === "admin" && password === "admin") // stupid example
	    return done(null, {name: "admin"});

	return done(null, false, { message: 'Incorrect username.' });
    }
));

passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},function(req, username, password, done) {
    process.nextTick(function() {
	User.findOne({'local.username': username }, function(err, user){
	    if(err)
		return done(err);
	    if(!user)
		return done(null, false, { message: 'Incorrect username' });
	    if(user.local.password != password)
		return done(null, false, { message: 'Incorrect password' });
	    return done(null, user);
	})
    })
}));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
    
}, function(req, username, password, done) {

    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

	// find a user whose email is the same as the forms email
	// we are checking to see if the user trying to login already exists
	User.findOne({ 'local.username' :  username }, function(err, user) {
	    // if there are any errors, return the error
	    if (err)
		return done(err);

	    // check to see if theres already a user with that email
	    if (user) {
		console.log(user);
		console.log("User exists");
		return done(null, false);
	    } else {

		var newUser = new User();
		newUser.local.username = username;
		newUser.local.password = password;;
		newUser.firstName = req.body.firstname;
		newUser.lastName = req.body.lastname;
		// save the user
		functions.createUser(newUser);
		return done(null, newUser);
	    }

	});    

    });

}));



// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
    console.log(req.isAuthenticated());
  if (!req.isAuthenticated()) 
  	res.send(401);
  else
  	next();
};
//==================================================================

// Start express application
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(morgan('dev'));
app.use(cookieParser()); 
app.use(bodyParser.json());
//app.use(express.methodOverride());
app.use(session({
    secret: 'securedsession',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport initialization

//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

//==================================================================
// routes
app.get('/', function(req, res){
  res.render('index', { title: 'Express' });
});


app.get('/users', auth, function(req, res){
    var searchValue = req.value;
    //var usersArr = [];
    functions.findUsers(User, res);
});

app.get('/posts', auth, function(req, res){
    
    var postToGet = req.query.userid;
    if(postToGet == undefined){
	postToGet = req.user._id;
    }

       
    User.findOne({ _id : postToGet }, function(err, user){
	if (err) {
	    throw err;
	} else {
	    
	    console.log("Successfully got posts from " + postToGet);
	    
	}
	res.send(user.posts);
    }); 
  
});

app.post('/newpost', auth, function(req, res){
    var author = req.user.firstName + " " + req.user.lastName;
    //    var timePosted = Date(); TO (MAY)BE IMPLEMENTED
    var text = req.body.text;
    var userToRecieve = req.body.userToRecieve;
    var post = {'author': author, 'text':text };
    console.log("AUTHOR IS");
    console.log(author);
    console.log("DATE IS");
    console.log("today =))))");
    console.log("USER TO RECIEVE THIS SHIT IS");
    console.log(userToRecieve);
    console.log("TEXT IS");
    console.log(text);
    
    
    User.findByIdAndUpdate(userToRecieve, {$push: { posts: post }}, {new: true}, function(err, user){
	if(err) {
	    throw err;
	}
	else {
	    console.log(user);
	    
	    
	}
	res.send(post);
    });
});

app.get('/friends', auth, function(req, res){
   
    var userToFind = req.user._id;
    console.log(userToFind);
    console.log("***********USER TO FIND IN /FRIENDS *******");
    var userInfo = []
    User.findOne({ _id : userToFind }, function(err, user){
	if (err) {
	    throw err;
	} else {
	   // console.log(user);
	    console.log(".......................................");


	}
	res.send(user.friends);
    });
    
    //var usersArr = [];
    
});

app.post('/addfriend', auth, function(req, res){
    console.log(req.user._id);
    console.log(req.body.userIdToAdd);
    var currUser = req.user._id;
    var userToAdd = req.body.userIdToAdd;
    var nameToAdd = req.body.nameToAdd;

    User.findByIdAndUpdate(currUser, {$push: { friends: {userid: userToAdd, name: nameToAdd } }}, {new: true}, function(err, user){
	if(err) {
	    throw err;
	}
	else {
	   // console.log(user);
	    
	    
	}
	res.send(user.friends);
    });
    
    
});
		       
	

app.get('/userinfo', auth, function(req, res){
    console.log(req.query.userid);
    var userToFind = req.query.userid;
    console.log("******************");
    var userInfo = []
    User.findOne({ _id : userToFind }, function(err, user){
	if (err) {
	    throw err;
	} else {
	    console.log(user);
	    userInfo.push(user.firstName + " " + user.lastName);
	    userInfo.push(user.posts);
	}
	res.send(userInfo);
    });
    
});


// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
    console.log(req.user);
    console.log("************************************************REQ:BODY ABOEV***********************");
  res.send(req.isAuthenticated() ? req.user : '0');
});

app.post('/register', passport.authenticate('local-signup'), function(req, res) {
    res.send(req.user);
});

// route to log in
app.post('/login', passport.authenticate('local-login'), function(req, res) {
  res.send(req.user);
});

// route to log out
app.post('/logout', function(req, res){
  req.logOut();
  res.send(200);
});
//==================================================================

/*http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});*/

var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});






//
					       /* function(req, username, password, done) {
    process.nextTick(function() {
	console.log(req);
	var newUser = new User();
	newUser.local.username = username;
	newUser.local.password = password;
	newUser.local.firstName = req.body.firstname;
	newUser.local.lastName = req.body.lastname;
	console.log(newUser.local.username);
	console.log(newUser.local.password);
	console.log(newUser.local.firstName);
	console.log(newUser.local.lastName);
	functions.createUser(newUser);
	return done(null, newUser);
    })
}));

passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},


};*/


/*
app.get('/users', auth, function(req, res){
    var usersArr = [];
    User.find({}, function(err, users) {
	if(err) {
	    console.log(err);
	    throw err;
	} else {
	    //console.log(users[2].local.firstName);
	    for(var x in users) {
		
		var temp = {};
		temp['name'] = (users[x].local.firstName + " " + users[x].local.lastName);
		//console.log(temp);
	//	console.log(users[x].local.firstName);
		usersArr.push(temp);
	    }
	}
	
	res.send(usersArr);
    });
    
 // res.send([{name: "user1"}, {name: "user2"}]);
});*/
//==================================================================

//==================================================================
