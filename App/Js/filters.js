'use strict';

/* Filters */
angular.module('app.filters', []).

filter('checkmark', function () {
    return function (input) {
        return input ? '\u2713' : '\u2718';
    };
}).

filter('interpolateVersion', ['version', function (version) {
    return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
    };
}]);