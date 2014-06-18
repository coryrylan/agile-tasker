'use strict';

/* Filters */
angular.module('app.filters', []).

filter('interpolateVersion', ['version', function (version) {
    return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
    };
}]);