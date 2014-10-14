(function () {
    'use strict';

    var appServices = angular.module('app.services');

    appServices.factory('timerService', ['$timeout', 'appSettingsService', function ($timeout, appSettingsService) {
        var timerService = {};

        var startTime = new Date().toLocaleTimeString();
        var endTime = new Date().toLocaleTimeString();

        timerService.timerDate = new Date();
        timerService.timerDate.setMinutes(appSettingsService.defaultSettings.selectedTime.value); //$scope.settings.selectedTime.value
        timerService.timerDate.setSeconds(0);

        // Should be a filter
        timerService.getCurrentTimeFormated = function () {
            var minutes = timerService.timerDate.getMinutes();
            var seconds = timerService.timerDate.getSeconds();

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return minutes + ':' + seconds;
        };

        timerService.startTimer = function () {
            console.log('startTimer');
            startTime = new Date().toLocaleTimeString();
        }

        timerService.update = function () {
            if (timeIsUp()) {
                timerService.stopTimer();
                timerService.saveHistory();
            } else {
                timerService.timerDate.setSeconds(timerService.timerDate.getSeconds() - 1);
            }
        }

        timerService.stopTimer = function () {
            endTime = new Date().toLocaleTimeString();
            appSettingsService.defaultSettings.currentTime = appSettingsService.defaultSettings.selectedTime.value + ":" + "00";
            timerService.timerDate.setMinutes(appSettingsService.defaultSettings.selectedTime.value);
            timerService.timerDate.setSeconds(0);
        }

        timerService.saveHistory = function () {

        }

        function timeIsUp() {
            return (timerService.timerDate.getMinutes() === 0 && timerService.timerDate.getSeconds() === 0);
        }

        return timerService;
    }]);
})();