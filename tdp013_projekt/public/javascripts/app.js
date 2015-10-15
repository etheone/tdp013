'use strict';

/**********************************************************************
 * Angular Application
 **********************************************************************/
var app = angular.module('app', ['ngResource', 'ngRoute', 'mm.foundation'])
    .config(function($routeProvider, $locationProvider, $httpProvider) {
	
	//================================================
	// Check if the user is connected
	//================================================
	
	var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
	    // Initialize a new promise
	    var deferred = $q.defer();

	    // Make an AJAX call to check if the user is logged in
	    $http.get('/loggedin').success(function(user){
		// Authenticated
		/*	  for(var x in user.local)
			  {
			  alert(user.local[x]);
			  }*/

		if (user !== '0') {
		    /*$timeout(deferred.resolve, 0);*/
		    $rootScope.currentUser = { username: user.local.username, firstname: user.firstName, lastname: user.lastName, id: user._id};
		    $rootScope.friends = user.friends;
		    deferred.resolve();
		}
		// Not Authenticated
		else {
		    $rootScope.message = 'You need to log in.';
		    //$timeout(function(){deferred.reject();}, 0);
		    deferred.reject();
		    $location.url('/login');
		}
	    });

	    return deferred.promise;
	};
	//================================================
	
	//================================================
	// Add an interceptor for AJAX errors
	//================================================
	$httpProvider.interceptors.push(function($q, $location) {
	    return {
		response: function(response) {
		    // do something on success
		    return response;
		},
		responseError: function(response) {
		    if (response.status === 401)
			$location.url('/login');
		    return $q.reject(response);
		}
	    };
	});

	//================================================

	//================================================
	// Define all the routes
	//================================================
	$routeProvider
	    .when('/', {
		templateUrl: '/views/home.html',
		controller: 'HomeCtrl',
		resolve: {
		    loggedin: checkLoggedin
		}

	    })
	    .when('/home', {
		templateUrl: 'views/home.html',
		controller: 'HomeCtrl',
		resolve: {
		    loggedin: checkLoggedin
		}

	    })
	    .when('/user', {
		templateUrl: 'views/home.html',
		controller: 'UserCtrl',
		resolve: {
		    loggedin: checkLoggedin
		}
	    })
	
	    .when('/login', {
		templateUrl: 'views/login.html',
		controller: 'LoginCtrl',

	    })
            .when('/register', {
		templateUrl: 'views/register.html',
		controller: 'RegCtrl'
	    })
	    .otherwise({
		redirectTo: '/login'
	    });
	//================================================

    }) // end of config()



    .run(function($rootScope, $http){
	$rootScope.message = '';
	//$rootScope.currentUser = $rootScope.setUser;
	$rootScope.chats = [];
	// Logout function is available in any pages
	$rootScope.logout = function(){
	    $rootScope.message = 'Logged out.';
	    $http.post('/logout');
	    
	};
    });

app.directive('resize', function ($window) {
    return function (scope, element, attr) {

        var w = angular.element($window);
        scope.$watch(function () {
            return {
                'h': window.innerHeight, 
                'w': window.innerWidth
            };
        }, function (newValue, oldValue) {
            console.log(newValue, oldValue);
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.resizeWithOffset = function (offsetH) {
                scope.$eval(attr.notifier);
                return { 
                    'height': (newValue.h - offsetH) + 'px'                    
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
}); 

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);



app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
	    
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
	    
	    
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
			//alert(callback);
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});


/**********************************************************************
 * Login controller
 **********************************************************************/
app.controller('LoginCtrl', function($scope, $rootScope, $http, $location) {
    // This object will be filled by the form
    $scope.user = {};

    // Register the login() function
    $scope.login = function(){
	$http.post('/login', {
	    username: $scope.user.username,
	    password: $scope.user.password,
	})
	    .success(function(user){
		// No error: authentication OK
		//currentUser = $scope.user.username;
		$rootScope.message = 'Authentication successful!';
		$location.url('/home');
	    })
	    .error(function(){
		// Error: authentication failed
		$rootScope.message = "Authentication failed!";
      		$location.path('/login');
		//	$route.reload();
	    });
    };
});

/**********************************************************************
 * Register controller
 **********************************************************************/
app.controller('RegCtrl', function($scope, $rootScope, $http, $location) {
    // This object will be filled by the form
    $scope.user = {};

    $scope.register = function(){
	$http.post('/register', {
	    username: $scope.user.username,
	    password: $scope.user.password,
	    firstname: $scope.user.firstName,
	    lastname: $scope.user.lastName
	})
	    .success(function(user){
		// No error: authentication OK
		//alert(user);
		//alert("Got registred");
		//currentUser = $scope.user.username;
		$rootScope.message = 'Authentication successful!';
		$location.url('/home');
		//$location.url('/');
	    })
	    .error(function(){
		//alert("Didnt register");
		// Error: authentication failed
		$rootScope.message = 'Registration failed.';
		$location.path('/register');
		//	$route.reload();
		//$window.location.reload();
		
	    });
    };
});


/**********************************************************************
 * Home controller
 **********************************************************************/
app.controller('HomeCtrl', function($scope, $rootScope, $http) {



    // List of users got from the server
 /*   $scope.newPost = false;
    $scope.writePost = function(){
	if($scope.newPost === false) {
	    $scope.newPost = true;
	} else {
	    $scope.newPost = false;
	}
	
    };
*/
    $scope.notifyServiceOnChage = function(){
	console.log($scope.windowHeight);
    };
   
    $scope.atPost = 1;
   $scope.changeView = function(setter) {
	$scope.atPost = setter;
/*	if ($scope.atPost == true){
	    $scope.atPost = images;
	} else {
	    $scope.atPost = posts
	}*/
    };


    $scope.searchText;
    $scope.search = false;

    $scope.getResults = function() {
	$scope.findUsers($scope.searchText);

    };

    $scope.findUsers = function(sValue) {
	var result;
	$scope.users.forEach(function(obj, i){
	    $scope.search = true;
	    if(obj.name == sValue){
		//alert(obj.userid);
		//alert(obj.name);
		$scope.searchResult = obj;
		//alert("Result is " + $scope.searchResult.name + "id is " + $scope.searchResult.userid);
		
	    }
	});
    };

    $scope.startChat = function(userid, uname) {
	$rootScope.chats.push({ messages: [], ownid: $rootScope.currentUser.id, otherid: userid, name: uname });
	
    };
    
    $scope.users = [];
    $scope.home = true;

    
    $http({
	url: '/friends',
	method: 'GET',
    }).success(function(friends){
	$scope.friends = friends;
    });

    $http({
	url: '/posts',
	method: 'GET',
    }).success(function(posts){
	$scope.posts = posts;

    });
    
    
    //alert($rootScope.currentUser);
    /*  $scope.addFriend = function() {
	$http.post('/addFriend', {
	userToAdd = this.userId;
	})
	};*/
    //alert($rootScope.currentUser);
    // Fill the array to display it in the page
    $http.get('/users').success(function(users){
	for (var i in users)
	    $scope.users.push(users[i]);
    });

    
});

/**********************************************************************
 * User controller
 **********************************************************************/
app.controller('UserCtrl', function($scope, $rootScope, $http, $routeParams, $timeout) {

    $scope.atPost = 1;
    
    $scope.changeView = function(setter) {
	$scope.atPost = setter;
    };

    $scope.startChat = function(userid, name) {
	alert("Chat is only availible on your home page");
    };
    
    
    $scope.addFriend = function(){
	
	$http.post('/addfriend', {
	    userIdToAdd: $routeParams.userid,
	    nameToAdd: $scope.Userinfo[0]
	})
	    .success(function(friends){
		//alert(friends);
		$scope.friends = friends;
		$scope.notFriend = false;
		//$timeout(callAtTimeout, 3000);
		
	    })
	    .error(function(){
		//alert('Friend could not be added at this time');
	    });
    };
    
    $scope.Userinfo = [];
    $http({
	url: '/userinfo/',
	method: 'GET',
	params: {userid: $routeParams.userid}
    }).success(function(info){
	$scope.Userinfo = info;
	$scope.visitPage = $scope.Userinfo[0];
	//loadFriends();
    });


    $http({
	url: '/friends',
	method: 'GET',
    }).success(function(friends){
	$scope.notFriend = true;
	$scope.friends = friends;
	$scope.friends.forEach(function(friend, i){
	    if(friend.userid == $routeParams.userid){
		$scope.notFriend = false;
	    }

	});
    });
    
    
    $http({
	url: '/posts',
	method: 'GET',
	params: {userid: $routeParams.userid}
    }).success(function(posts){
	$scope.posts = posts;
	//Do something with posts
    });

    $scope.users = [];
    $scope.home = false;
    //loadFriends();

    // Fill the array to display it in the page
    $http.get('/users').success(function(users){
	for (var i in users)
	    $scope.users.push(users[i]);
    });

    
});


app.controller('ChatCtrl', function($scope, $rootScope, $timeout, socket) {

    socket.on('init', function (data) {

	$scope.name = data.name;
	$scope.chatusers = data.users;
    });

    socket.on('send:message', function (message) {
	//alert("message is " + message);


	if(message.sender == $rootScope.currentUser.id){
	    $rootScope.chats.forEach(function(obj, i){
	//	alert("foreach");
		if(obj.otherid == message.reciever) {
	//	    alert("if");
		    obj.messages.push(message);
		}
	    });
	}

	if(message.reciever == $rootScope.currentUser.id) {

	    $rootScope.chats.forEach(function(obj, i){
		if(obj.otherid == message.sender) {

		    obj.messages.push(message);
		}
	    });
	}
	
	//alert("hej");
	//alert(message.sender);



	
	//$scope.messages.push(message);
    });


    $scope.message = {text: ""}
    
    $scope.messages = [];

    $scope.sendMessage = function(recieveId) {
	var messageText = $scope.message.text;

	socket.emit('send:message', {
	    user: $rootScope.currentUser.id,
	    reciever: recieveId,
	    message: $rootScope.currentUser.firstname + " said: " + messageText
	});

	// add the message to our model locally
	//$scope.messages.push($scope.message.text);
	//Apend our own message to the results
/*	var message = $rootScope.currentUser.firstname + " said: " + messageText;
	$rootScope.chats.forEach(function(obj, i){
	    alert("foreach");
	    if(obj.otherid == recieveId) {
		alert("if");
		
		obj.messages.push(message);
		
		
	    }
	});*/
	

	

	// clear message box
	$scope.message.text = '';
    };
    
    $scope.chatPopover = "fName said";
    $scope.chatTitle = "fName lName";
    

});

app.controller('PostCtrl', function($scope, $http, $routeParams) {
    // List of users got from the server
 
    
    $scope.newPost = false;
    $scope.writePost = function(){
	if($scope.newPost === false) {
	    $scope.newPost = true;
	} else {
	    $scope.newPost = false;
	}
    };

    $scope.posttext;
    
    $scope.sendPost = function(){
	//alert($scope.posttext);
	$http.post('/newpost', {
	    userToRecieve: $routeParams.userid,
	    text: $scope.posttext
	})
	    .success(function(posts){
		$scope.newPost = false;
		$scope.posts.push(posts);
		//alert(posts);
	    })
	    .error(function(){
		//alert('Post could not be sent at this time');
	    });
    };

    $http({
	url: '/posts',
	method: 'GET',
	params: {userid: $routeParams.userid}
    }).success(function(posts){
	$scope.posts = posts;
	//Do something with posts
    });

 
});

app.controller('ImageCtrl', function($q, $rootScope, $scope, $http, $routeParams) {
    
 
    $scope.newImage = false;
    $scope.uploadImage = function(){
	if($scope.newImage === false) {
	    $scope.newImage = true;
	} else {
	    $scope.newImage = false;
	}
    };

    
//    $scope.createWorker = function() {
    $scope.worker = new Worker('javascripts/worker.js');
    console.log("LoADED WEBWORKER");
  //  };
   // $scope.createWorker(); 
    var latest;
    var theUser = $routeParams.userid;
    $scope.getImages = function(){
	$http({
	    url: '/images',
	    method: 'GET',
	    params: {userid: $routeParams.userid}
	}).success(function(images){
	    //alert("Success getting images");
	    //console.log("Success getting images");
	    $scope.images = images;
	    //console.log(images);
	    
	    if(images.length)
		latest = (images.slice(-1)[0]).split("/")[3];
	    else
		latest = 0;
	    //console.log(latest);
	    //$scope.worker.terminate();
	    //$scope.createWorker();
	    if (theUser != undefined) {
		$scope.worker.postMessage([latest, theUser]);
	    } else {
		$scope.worker.postMessage(latest);
	    }
	    
	}).error(function(err) {
	    console.log("error while getting messages");
	    //alert("error while getting images");
	}); 
    }
    $scope.getImages();

    
    $scope.worker.onmessage = function(event) {
	console.log(event);
	console.log("Worker callback in app.js above");
	//alert(event.data);
//	if(event.data === "true") {
	    
	    console.log("trying to call scope.getImages");
	    $scope.getImages();
	    
	    //$scope.createWorker();
	    
//	}
    };

   

    /*$scope.startWorker = function(latest) {
	if(theUser != undefined) {
	    $scope.worker.postMessage([latest, theUser]);
	} else {
	    $scope.worker.postMessage(latest);
	}
    };*/


    
    $scope.sendImage = function(files){

	var fd = new FormData();
	//Take the first selected file
	fd.append("file", files);

	$http.post('/upload', fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
	})        
	    .success(function(){
		//alert("file upload success");
		
            })
            .error(function(){
		//alert("file upload error");
            });
    };
});





