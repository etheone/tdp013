var app = angular.module('app', []);

app.directive('hello', [function () {
    return {
        restrict: 'CEMA',
        replace: true,
        template: '<span><br>Hello</span>'
    }
}]);
