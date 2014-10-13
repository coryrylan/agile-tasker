(function () {
    'use strict';

    var appControllers = angular.module('app.controllers', []);

    appControllers.controller('TimerCtrl', ['$scope', '$localForage', 'appSettingsService', 'notificationService', 'timerService', function ($scope, $localForage, appSettingsService, notificationService, timerService) {
        $scope.isPlaying = false;
        $scope.settings = appSettingsService.defaultSettings;
        $scope.userSettings = appSettingsService.userSettings;
        $localForage.bind($scope, {
            key: 'userSettings',
            defaultValue: appSettingsService.userSettings,
            storeName: 'StorageSettings'
        });

        //#region Globals
        var startTime = new Date().toLocaleTimeString();
        var endTime = new Date().toLocaleTimeString();
        var timerInterval = 0;
        var timerDate = new Date();
        timerDate.setMinutes($scope.settings.selectedTime.value);
        timerDate.setSeconds(0);
        //#endregion

        $scope.startTimer = function () {
            resetTimer();
            timerInterval = setInterval(intervalTimer, 1000);
            startTime = new Date().toLocaleTimeString();
            $scope.isPlaying = true;

            if (notify.permissionLevel() === notify.PERMISSION_DEFAULT) {
                notify.requestPermission();
            }
        };

        $scope.stopTimer = function () {
            resetTimer();
            $scope.isPlaying = false;
            document.title = 'Agile Tasker';
        };

        $scope.clearHistory = function () {
            $scope.userSettings.taskHistory = [];
        };

        $scope.toggleSound = function () {
            $scope.userSettings.sound.play = !$scope.userSettings.sound.play;
            if ($scope.userSettings.sound.play) {
                notificationService.playAudio();
            }
        };

        //#region Timmer Helper Functons
        function intervalTimer() {
            if (timeIsUp()) {
                $scope.stopTimer();
                endTime = new Date().toLocaleTimeString();
                console.log($scope.userSettings.sound.play);
                notificationService.notify($scope.userSettings.sound.play);
                saveTaskToHistory();
            } else {
                timerDate.setSeconds(timerDate.getSeconds() - 1);
                $scope.settings.currentTime = timerService.getCurrentTimeFormated(timerDate);
                document.title = $scope.settings.currentTime;
            }
            $scope.$apply();
        }

        function timeIsUp() {
            return (timerDate.getMinutes() === 0 && timerDate.getSeconds() === 0);
        }

        function resetTimer() {
            clearInterval(timerInterval);
            $scope.settings.currentTime = $scope.settings.selectedTime.value + ":" + "00";
            timerDate.setMinutes($scope.settings.selectedTime.value);  // $scope.settings.selectedTime.value
            timerDate.setSeconds(0);
        }

        function saveTaskToHistory() {
            var _text = "Unknown";
            if ($scope.settings.taskTextBox !== "") {
                _text = $scope.settings.taskTextBox;
            }

            $scope.userSettings.taskHistory.push({ start: startTime, stop: endTime, text: _text });
            $scope.settings.taskTextBox = "";
        }
        //#endregion
    }]);
})();