//var exports = require('exports');

function getAllMessages(req, res, db) {

    db.find({}, function (err, docs) {
	try {
	    res.status(200).json(docs);
	} catch(err) {
	    res.status(500);
	}
    })
}

function saveMessage(req, res, db, url) {
    var urlParts = url.parse(req.url, true);
 
    var messageToAdd = urlParts.query['message'];

    if (messageToAdd != null && validMessage(messageToAdd)) {
	if (postMessage(messageToAdd, db)) {
	    res.sendStatus(200);
	} else {
	    res.sendStatus(500);
	}
    } else {
	res.sendStatus(400);
    }
}

function flagMessage(req, res, db, url) {
    
    var urlParts = url.parse(req.url, true);
    messageToFlag = urlParts.query['id'];
    try {
    db.find({'_id':messageToFlag}, function(err, docs) {
	if (messageToFlag != null && docs.length > 0 ) {

		db.findAndModify({ _id: messageToFlag }, { $set: {flag: true} });
		res.sendStatus(200);

	}  else {
	    res.sendStatus(400);
	}
	
    });
    } catch(err) {
	res.sendStatus(400);
    }
}

function postMessage(messageToAdd, db) {
    try {
	db.insert({message: messageToAdd, flag: false});
	return true;
    } catch(err) {
	console.log("There was an error inserting the message: " + err);
	return false;
    } 
}

function validMessage(message) {
    if (message.length > 140 || message.length == 0) {
	return false;
    }
    return true;
        
}


exports.saveMessage = saveMessage;
exports.flagMessage = flagMessage;
exports.getAllMessages = getAllMessages;
