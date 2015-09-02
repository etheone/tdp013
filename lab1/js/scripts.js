messagesDiv = document.getElementbyId("messagesDiv");

function postMessage() {
    
    //return document.getElementById("newMessage").value;
    var text = document.getElementById("newMessage").value;
    if (valid(text)) {
	addNewMessage(text);
    } else {
	textError();
    }

    eraseText();	
}

function addNewMessage(text) {
    document.getElementById("errorText").style.display = "none";
    var newDiv = document.createElement('div');
    var divHtml = text + "<input class='box' type='checkbox' onclick='markAsRead(this)'>";

    newDiv.className = "unread";
    
    newDiv.innerHTML = divHtml;
    messagesDiv.appendChild(newDiv);   
}

function markAsRead(name) {   
    if (name.parentElement.className == "read") {
        name.parentElement.className = "unread";
    } else {
	name.parentElement.className = "read";
    } 
}

function valid(text) {
    if (text.length > 140 || text.length < 1) {
	return false;
    }
    return true;
}

function textError() {
    
    document.getElementById("errorText").style.display = "inline-block";
    
}

function eraseText() {
    document.getElementById("newMessage").value = "";
}

