var testApp = angular.module('testApp', []);

testApp.controller('PhoneListCtrl', function ($scope) {
  $scope.phones = [
    {'name': 'Nexus S',
     'snippet': 'Fast just got faster with Nexus S.',
    'price':'100k$'},
    {'name': 'Motorola XOOM with Wi-Fi',
     'snippet': 'The Next, Next Generation tablet.',
    'price':'10000$'},
    {'name': 'MOTOROLA XOOM',
     'snippet': 'The Next, Next Generation tablet.',
    'price':'5000$'}
  ];
});
