var express = require('express');
var app = express();
var path = require('path');
var body_parser = require('body-parser');
var url = require('url');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var root = __dirname;
var functions = require('./functions.js');

var cors = require('cors');
app.use(cors());
app.use(body_parser.json());

app.use(express.static('app'));

/*************************************************
                   DATABASES
**************************************************/
var db = require('monk')('localhost:27017');
var usersdb = db.get('useCol');
//usersdb.index('username firstName lastName pwd friends');
//var projectdb = db.get('messages');


//projectdb.index('Add indexes for db here');

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

/*****************************************************
                  CALLS TO USERS
******************************************************/

app.get('/api/users', function(req, res) {
    //getAll();
});


app.get('/api/users/*', function(req, res) {
    //getAll();
});

app.post('/api/users', function(req, res) {
    var user = req.body;
    functions.createUser(req, res, user, usersdb);
    //console.log(req.body); //Contains user information
    
    for(var x = 0; x < 10; x++)
	console.log("Called the try to registration function thing ");
    res.success = true;
    res.sendStatus(200);
});

//*****************LOGIN**************
app.post('/api/authenticate', function(req, res) {
    console.log("body below");
    console.log(req.body);
    functions.login(req, res, req.body, usersdb);
});

function start() {
    var server = app.listen(3000, function () {
	var host = server.address().address;
	//console.log(host);
	var port = server.address().port;
	console.log('Server started.');
    });
}

function clearDb() {

    usersdb.remove({}, function (err) {

    if (err) throw err;
    });

};


if (require.main === module) {
    //clearDb();
    start();
    
}

exports.start = start;
