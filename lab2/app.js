//Code below explains itself

var express = require('express');
var app = express();
var path = require('path');
var url = require('url');

var db = require('monk')('localhost:27017/');
var messages = db.get('messages');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/getAll', function (req, res) {
     messages.find({}, function (err, docs) {
	 try {
	     res.status(200).json(docs);
	 } catch(err) {
	     res.status(500);
	 }
     });
});

app.get('/save', function (req, res) {
    var urlParts = url.parse(req.url, true);
    console.log(urlParts);
    var messageToAdd = urlParts.query['message'];
    if (messageToAdd != null) {
	console.log(messageToAdd);
	if (postMessage(messageToAdd)) {
	    console.log("It worked!");
	    res.sendStatus(200);
	} else {
	    res.sendStatus(500);
	}
    } else {
	res.sendStatus(400);
    }
});

app.get('/flag', function (req, res) {
    var urlParts = url.parse(req.url, true);
    var messageToFlag = urlParts.query['id'];
    if (messageToFlag != null) {
	try {
	    users.find({_id:messageToFlag}, function (err, docs){ if (err) throw err;});
	    messages.findAndModify({ _id: messageToFlag }, { $set: {flag: true} });
	    console.log('Done.');
	    res.send('Flagged a message');
	} catch (err) {
	    console.log('parameter fail');
	    res.sendStatus(400);
	}
    } else {
	res.sendStatus(400);
    }
});

app.get('*', function (req, res) {
    
    res.sendStatus(404);
 
});

app.post('*', function (req, res) {
    res.sendStatus(405);  
});

var messages = db.get('messages');
messages.index('message flag');

var server = app.listen(3000, function () {
    var host = server.address().address;
    console.log(host);
    var port = server.address().port;
   
  console.log('Example app listening at http://%s:%s', host, port);
});

function postMessage(messageToAdd) {
    try {
	messages.insert({message: messageToAdd, flag: false});
	return true;
    } catch(err) {
	console.log("There was an error inserting the message: " + err);
	return false;
    } 
}


function clearDb() {

    messages.remove({}, function (err) {

    if (err) throw err;
    });

};

function exitHandler(err) {
    console.log("Exiting");
    clearDb();
    db.close();
    console.log("Database is now closed");
    process.exit();
}



//do something when app is closing
//process.on('exit', exitHandler.bind(null));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind({exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind({exit:true}));


