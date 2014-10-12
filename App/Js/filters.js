(function () {
    'use strict';

    var appFilters = angular.module('app.filters', []);

    appFilters.filter('interpolateVersion', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }]);
})();