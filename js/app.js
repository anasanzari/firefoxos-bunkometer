'use strict';

/* App Module */

var bunkapp = angular.module('bunkapp', [
    'ngRoute',   
    'AppControllers',
    'AppServices',
    'AppDirectives'
]);

bunkapp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
                when('/', {
                    templateUrl: 'partials/main.html',
                    controller: 'MainCtrl'
                }).when('/dashboard',{
                    templateUrl: 'partials/dashboard.html',
                    controller: 'DashBoardCtrl'
                }).when('/subjects',{
                    templateUrl: 'partials/subjects.html',
                    controller: 'SubjectCtrl'
                });
        $locationProvider.html5Mode(false).hashPrefix('!');
    }]);



