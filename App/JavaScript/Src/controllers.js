(function () {
    'use strict';

    var appControllers = angular.module('app.controllers', []);

    appControllers.controller('TimerCtrl', ['$scope', '$localForage', '$interval', 'settingsService', 'notificationService', 'timerService', function ($scope, $localForage, $interval, settingsService, notificationService, timerService) {

        var timerInterval = null;
        $scope.isPlaying = false;
        $scope.taskTextBox = settingsService.defaultSettings.taskTextBox;
        $scope.settings = settingsService.defaultSettings;
        $scope.userSettings = settingsService.userSettings;
        $localForage.bind($scope, {
            key: 'userSettings',
            defaultValue: settingsService.userSettings,
            storeName: 'StorageSettings'
        });

        $scope.startTimer = function () {
            timerService.startTimer();
            timerInterval = $interval(function () {
                timerService.update(timerInterval);
                $scope.settings.currentTime = timerService.getCurrentTimeFormated();
                $scope.userSettings = settingsService.userSettings;
            }, 1000);
        }

        $scope.stopTimer = function () {
            timerService.resetTimer(timerInterval);
            $scope.settings.currentTime = $scope.settings.selectedTime.value + ":" + "00";
            timerService.timerDate.setMinutes($scope.settings.selectedTime.value);
            timerService.timerDate.setSeconds(0);
        }
    }]);
})();