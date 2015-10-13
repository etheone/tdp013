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
    socket.emit('send:message', {
	message: 'Clark!!!'
    });

  // send the new user their name and a list of users


  // notify other clients that a new user has joined
  socket.broadcast.emit('user:join', {
    //name: name
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.emit('send:message', {
	user: data.user,
      text: data.message
    });
  });

  // validate a user's name change, and broadcast it on success


  // clean up when a user leaves, and broadcast it to other users

};
