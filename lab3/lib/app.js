//Code below explains itself

var express = require('express');
var app = express();
var path = require('path');
var url = require('url');
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(cors());
app.use(bodyParser());



var db = require('monk')('localhost:27017/');
var messages = db.get('messages');

var functions = require('./functions.js');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');    
});

app.get('/styles.css', function(req, res){
    res.sendFile(__dirname + '/public/styles.css');
});

app.get('/scripts.js', function(req, res){
    res.sendFile(__dirname + '/public/scripts.js');
});

app.get('/getAll', function (req, res) {
    functions.getAllMessages(req, res, messages);
});

app.get('/flag', function (req, res) {    
    functions.flagMessage(req, res, messages, url);
});


app.post('/save', function (req, res) {
    var message = req.body['message'];
    var status = functions.saveMessage(req, res, messages, message);
    res.sendStatus(status);    // echo the result back
});


var messages = db.get('messages');
messages.index('message flag');

function start() {
    var server = app.listen(3000, function () {   
	console.log('Server started.');
    });
}

function clearDb() {
    messages.remove({}, function (err) {
    if (err) throw err;
    });
};

if (require.main === module) {
    clearDb();
    start(); 
}

exports.start = start;

