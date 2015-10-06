var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    local: {
	username: String,
	password: String,
	firstName: String,
	lastName: String,
    }
});

module.exports = mongoose.model('User', userSchema);
