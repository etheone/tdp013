/*module.exports = function (socket) {
    console.log("TRYING");
  socket.emit('send:message', {
    message: 'Clark!!!'
    });

    setInterval(function () {
    socket.emit('send:time', {
    time: (new Date()).toString()
    });
    }, 1000);
    };*/

// export function for listening to the socket
module.exports = function (socket) {

    // broadcast a user's message to other users
    socket.on('send:message', function (data) {
	
	console.log("********************************************");
	for(var x in data)
	{
	    console.log(data[x]);
	    console.log(x);
	}
	
	console.log("********************************************");
	socket.broadcast.emit('send:message', {
	    sender: data.user,
	    reciever: data.reciever,
	    text: data.message
	});
	socket.emit('send:message', {
	    sender: data.user,
	    reciever: data.reciever,
	    text: data.message
	});
    });

};
