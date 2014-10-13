(function () {
    'use strict';

    var appServices = angular.module('app.services');

    appServices.factory('timerService', function () {
        var timerService = {};

        // Should be a filter
        timerService.getCurrentTimeFormated = function (currentTime) {
            var minutes = currentTime.getMinutes();
            var seconds = currentTime.getSeconds();

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return minutes + ':' + seconds;
        };

        return timerService;
    });
})();