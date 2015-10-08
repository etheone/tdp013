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
	    $rootScope.currentUser = { username: user.local.username, firstname: user.local.firstName, lastname: user.local.lastName};
	    $rootScope.friends = user.local.friends;
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
	$rootScope.currentUser = $rootScope.setUser;

	// Logout function is available in any pages
	$rootScope.logout = function(){
	    $rootScope.message = 'Logged out.';
	    $http.post('/logout');
	    
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
		alert("Got registred");
		//currentUser = $scope.user.username;
		$rootScope.message = 'Authentication successful!';
		$location.url('/home');
		//$location.url('/');
	    })
	    .error(function(){
		alert("Didnt register");
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
    $scope.friends = [];
    $scope.posts = [];
    $scope.users = [];
    $scope.home = true;

    
    

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
app.controller('UserCtrl', function($scope, $rootScope, $http, $routeParams) {
  // List of users got from the server
    $scope.addFriend = function(){
	$http.post('/addfriend', {
	    userIdToAdd: $routeParams.userid
	})
	    .success(function(user){
		alert('Added a friend');
	    })
	    .error(function(){
		alert('Did not add a friend');
	    });
    };

	  
    $scope.Userinfo = [];
    $http({
	url: '/userinfo/',
	method: 'GET',
	params: {userid: $routeParams.userid}
    }).success(function(info){
	alert(info);
	$scope.Userinfo = info;
    });

 /*   $scope.visitPage = $scope.Userinfo[0];
    $scope.posts = $scope.Userinfo[1];*/
    if($rootScope.friends.indexOf($routeParams.userid) != -1) {
	$scope.notFriend = false;
    } else {
	$scope.notFriend = true;
    }
    $scope.users = [];
    $scope.home = false;

    
    
    // Fill the array to display it in the page
    $http.get('/users').success(function(users){
	for (var i in users)
	    $scope.users.push(users[i]);
    });

    
});




