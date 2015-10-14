this.onmessage = function (url) {
    getDataFromURL(url.data);
}
var HttpClient = function () {
    
    this.get = function (Url, Callback) {
        HttpRequest = new XMLHttpRequest();
        HttpRequest.onreadystatechange = function () {
            if (HttpRequest.readyState == 4 && HttpRequest.status == 200) {
                console.log(HttpRequest.responseText.length);
                Callback(HttpRequest.responseText);
            }              
        }        
        HttpRequest.open("GET", Url, true);
        HttpRequest.send(null);
    }
}
function getDataFromURL(url) { 
    var currentTime = Date.now();
    Client = new HttpClient();
    Client.get(url, function (answer) {
        postMessage(answer);
    });  
}
