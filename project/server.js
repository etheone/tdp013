var express = require('express');
var app = express();
var path = require('path');
var url = require('url');

var db = require('monk')('localhost:27017');
var projectdb = db.get('messages');
//projectdb.index('Add indexes for db here');

app.get('*', function(req, res) {
    res.send('Hello Project!');
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

    projectdb.remove({}, function (err) {

    if (err) throw err;
    });

};


if (require.main === module) {
    clearDb();
    start();
    
}

exports.start = start;
