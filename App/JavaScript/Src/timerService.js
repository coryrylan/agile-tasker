(function () {
    'use strict';

    var appServices = angular.module('app.services');

    appServices.factory('timerService', ['$timeout', '$interval', 'settingsService', function ($timeout, $interval, settingsService) {
        var timerService = {};

        var startTime = new Date().toLocaleTimeString();
        var endTime = new Date().toLocaleTimeString();

        timerService.timerDate = new Date();
        timerService.timerDate.setMinutes(settingsService.defaultSettings.selectedTime.value); //$scope.settings.selectedTime.value
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
            console.log('starting');
            startTime = new Date().toLocaleTimeString();
        }

        timerService.update = function (timerInterval) {
            console.log('update ' + timerService.timerDate);
            if (timeIsUp()) {
                timerService.stopTimer(timerInterval);
            } else {
                timerService.timerDate.setSeconds(timerService.timerDate.getSeconds() - 1);
            }
        }

        timerService.stopTimer = function (timerInterval) {
            console.log('stoping');
            $interval.cancel(timerInterval);
            endTime = new Date().toLocaleTimeString();
            timerService.saveHistory();
        }

        timerService.resetTimer = function (timerInterval) {
            console.log('reseting');
            $interval.cancel(timerInterval);
        }

        timerService.saveHistory = function () {
            console.log('saving');
            var _text = "Unknown";
            if (settingsService.defaultSettings.taskTextBox !== "") {
                _text = settingsService.defaultSettings.taskTextBox;
            }

            settingsService.userSettings.taskHistory.push({ start: startTime, stop: endTime, text: _text });
            settingsService.defaultSettings.taskTextBox = "";
        }

        function timeIsUp() {
            return (timerService.timerDate.getMinutes() === 0 && timerService.timerDate.getSeconds() === 0);
        }

        return timerService;
    }]);
})();