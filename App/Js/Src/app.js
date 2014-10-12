(function () {
    'use strict';

    var app = angular.module('AgileTasker', [
        'ngRoute',
        'LocalForageModule',
        'app.filters',
        'app.services',
        'app.directives',
        'app.controllers'
    ]);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'Partials/timer.html'
        });
        $routeProvider.when('/about', {
            templateUrl: 'Partials/about.html'
        });
        $routeProvider.when('/history', {
            templateUrl: 'Partials/history.html'
        });
        $routeProvider.when('/settings', {
            templateUrl: 'Partials/settings.html'
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }]);
})();