$( document ).ready(function() {
    getAllMessages();
});

function postMessage() {
    
    var text = $('#newMessage').val();
    if (valid(text)) {	
	$.ajax({
	    url : "http://localhost:3000",
	    type : "POST",
	    
	    data : {
		message : text,
	    }
	})
	    .then(
		function success(userInfo) {
		    //alert("fukit");
		} );
    } else {
	textError();
    }
    getAllMessages();
    eraseText(); 
}

function getAllMessages() {
    $( "#messagesDiv" ).empty();
    $.ajax({	
	url : "http://localhost:3000/getAll",
	type : "GET"
	
    })
	.then(
	    function success(allMessages) {
		
		allMessages.forEach(function(message) {

		    var msgFlag = 'unread';
		    if (message['flag'] == true)
			{
			    msgFlag = 'read';
			}
		    jQuery('<div/>', {
			id: message['_id'] +'a',
			text: message['message'],
			class: msgFlag
		    }).prependTo('#messagesDiv');
		    if (message['flag'] == false)
			{
			    jQuery('<input>', {
				class: 'box',
				type: 'checkbox',
				id: message['_id'],
				onclick:'markAsRead($(this))',
			    }).appendTo('#' + message['_id']+'a');
			}
		});
	    });
}

function markAsRead(id) {
    var messageId = id.attr('id');
    $.ajax({
	url : "http://localhost:3000/flag?id=" +messageId,
	type : "GET",
    
	  })
    .then(
	function success(userInfo) {
	    getAllMessages();
	});
}

function valid(text) {
    if (text.length > 140 || text.length < 1) {
	return false;
    }
    document.getElementById("errorText").style.display = "none";
    return true;
}

function textError() {
    document.getElementById("errorText").style.display = "inline-block";
}

function eraseText() {
    document.getElementById("newMessage").value = "";
}


