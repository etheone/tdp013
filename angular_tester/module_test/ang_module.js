angular.module("app", [])
.controller('TodoController', ['$scope', function ($scope) {
    $scope.todos = [
	{ name: 'Master HTML/CSS/Javascript', completed: true },
	{ name: 'Learn AngularJS', completed: true },
	{ name: 'Build NodeJS backend', completed: false },
	{ name: 'Get started with ExpressJS', completed: false },
	{ name: 'Setup MongoDB', completed: false },
	{ name: 'Be awesome', completed: false },
    ];
}]);
