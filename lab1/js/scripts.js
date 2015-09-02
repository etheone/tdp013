messagesDiv = document.getElementbyId("messagesDiv");

function postMessage() {
    
    alert(document.getElementById("newMessage").value);
    //return document.getElementById("newMessage").value;
    addNewMessage(document.getElementById("newMessage").value);
}


function addNewMessage(text) {
    var message = document.createElement('div');
    message.className = "message";
    message.innerHTML = text;
    messagesDiv[0].appendChild(iDiv);
    



    



   
}
