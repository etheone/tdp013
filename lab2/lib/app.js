//Code below explains itself

var express = require('express');
var app = express();
var path = require('path');
var url = require('url');

var db = require('monk')('localhost:27017/');
var messages = db.get('messages');

var functions = require('./functions.js');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/getAll', function (req, res) {
    var urlParts = url.parse(req.url, true);
    if (urlParts.search != '') {
	res.sendStatus(400);
    } else {
    
    functions.getAllMessages(req, res, messages);
    }
});

app.get('/save', function (req, res) {
    functions.saveMessage(req, res, messages, url);
});

app.get('/flag', function (req, res) {
    functions.flagMessage(req, res, messages, url);
});

app.get('*', function (req, res) { 
    res.sendStatus(404);
});

app.post('*', function (req, res) {
    res.sendStatus(405);  
});

var messages = db.get('messages');
messages.index('message flag');

function start() {
    var server = app.listen(3000, function () {
	var host = server.address().address;
	console.log(host);
	var port = server.address().port;
   
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

