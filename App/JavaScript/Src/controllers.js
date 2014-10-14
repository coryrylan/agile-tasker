(function () {
    'use strict';

    var appControllers = angular.module('app.controllers', []);

    appControllers.controller('TimerCtrl', ['$scope', '$localForage', 'userSettings', 'notificationService', function ($scope, $localForage, userSettings, notificationService) {
        var startTime = new Date().toLocaleTimeString();
        var timerInterval = null;
        var timerDate = new Date();
        timerDate.setMinutes(25);
        timerDate.setSeconds(0);

        $scope.isPlaying = false;
        $scope.settings = {
            options: [{ value: 15, label: 15 }, { value: 20, label: 20 }, { value: 25, label: 25 }, { value: 30, label: 30 }],
            currentTime: "",
            selectedTime: {},
            taskTextBox: ""
        };

        $scope.settings.selectedTime = $scope.settings.options[2];
        $scope.settings.currentTime = $scope.settings.options[2].value + ":00";

        // Bind userSettings service to local storage
        $scope.userSettings = userSettings;
        $localForage.bind($scope, {
            key: 'userSettings',
            defaultValue: userSettings,
            storeName: 'StorageSettings'
        });

        $scope.startTimer = startTimer;
        $scope.stopTimer = stopTimer;
        $scope.clearList = clearHistory;
        $scope.toggleSound = toggleSound;

        function startTimer() {
            resetTimer();
            timerInterval = setInterval(intervalTimer, 1000);
            startTime = new Date().toLocaleTimeString();
            $scope.isPlaying = true;

            if (notify.permissionLevel() === notify.PERMISSION_DEFAULT) {
                notify.requestPermission();
            }
        }

        function stopTimer() {
            resetTimer();
            $scope.isPlaying = '';
            document.title = 'Agile Tasker';
        }

        function clearHistory() {
            $scope.userSettings.taskHistory = [];
        }

        function toggleSound() {
            $scope.userSettings.sound.play = !$scope.userSettings.sound.play;
            if ($scope.userSettings.sound.play === true) {
                notificationService.playAudio();
            }
        }

        function intervalTimer() {
            if (timeIsUp()) {
                $scope.stopTimer();
                console.log($scope.userSettings.sound.play);
                notificationService.notify($scope.userSettings.sound.play);
                saveTaskToHistory();
            } else {
                timerDate.setSeconds(timerDate.getSeconds() - 1);
                $scope.settings.currentTime = getCurrentTime(timerDate);
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

        function getCurrentTime(currentTime) {
            var minutes = currentTime.getMinutes();
            var seconds = currentTime.getSeconds();

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return minutes + ':' + seconds;
        }

        function saveTaskToHistory() {
            var _text = "Unknown";
            if ($scope.settings.taskTextBox !== "") {
                _text = $scope.settings.taskTextBox;
            }

            $scope.userSettings.taskHistory.push({ start: startTime, stop: new Date().toLocaleTimeString(), text: _text });
            $scope.settings.taskTextBox = "";
        }
    }]);
})();
