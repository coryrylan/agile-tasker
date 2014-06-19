'use strict';

/* Filters */
angular.module('app.filters', []).

filter('example', function () {
    //..
})

filter('interpolateVersion', ['version', function (version) {
    return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
    };
}]);