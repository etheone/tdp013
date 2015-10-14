/********************************************
             USERDB FUNCTIONS
*********************************************/

function createUser(user) {
    //Check if users exists else create user
    console.log(user);
    try {
	user.save(function(err) {
	    if(err)
		throw err;
	    console.log("SAVED A USER");
	});
	console.log("new user created");
    } catch(err) {
	console.log("There was an error creating the user: " + err);
    }
    
}

//Temporary find users functions to test stuff
function findUsers(user, res) {
    var usersArr = [];
    user.find({}, function(err, users) {
	if(err) {
	    console.log(err);
	    throw err;
	} else {
	    //console.log(users[2].local.firstName);
	    for(var x in users) {
		
		var temp = {};
		temp['name'] = (users[x].firstName + " " + users[x].lastName);
		temp['userid'] = users[x]._id;
		//console.log(temp);
		//	console.log(users[x].local.firstName);
		usersArr.push(temp);
	    }
	}	
	res.send(usersArr);
    });
}

function mkdirSync(fs, path) {
    try {
	fs.mkdirSync(path);
    } catch(e) {
	if ( e.code != 'EEXIST' ) throw e;
    }   
}

function addFriend(currentUser, userToAdd, user, res) {   
}




exports.createUser = createUser;
exports.findUsers = findUsers;
exports.mkdirSync = mkdirSync;
//exports.login = login;


/*
function login(req, res, user, usersdb) {
    //var docs = searchDb(usersdb, 'username', user['username']);
    usersdb.find({'username':user['username']}, function(err, docs) {
	try {
	    if(docs.length > 0) {
		console.log(docs[0]);
		if ( docs[0]['pwd'] == user['password'] ) {
		    console.log("User found and password correct");
		    res.status(200).json(docs);
		} else {
		    console.log("User found but password incorrect");
		    res.status(400);
		}
	    } else {
		console.log("Sumthing wrong user not found");
		res.status(400);
	    }
	    console.log("Success!");
	    //console.log(docs);
	    //res.sendStatus(200).json(docs);
	} catch(err) {
	    res.status(500);
	}
    });
}

function isUser(req, res, user, usersdb) {
    var userToCheck = user['username'];

    
} 

function searchDb(db, key, value) {
    console.log(db);
    db.find({key:value}, function(err, docs) {
	return docs;
	try {
	    res.status(200).json(docs);
	} catch(err) {
	    res.status(500);
	}
    });
    
}*/

		
/*function getAllMessages(req, res, db) {

    db.find({}, function (err, docs) {
	try {
	    res.status(200).json(docs);
	} catch(err) {
	    res.status(500);
	}
    })
}

function saveMessage(req, res, db, message) {

    if (message != null && validMessage(message)) {
	if (postMessage(message, db)) {
	    return 200;
	} else {
	    return 500;
	}
    } else {
	return 400;
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
*/
