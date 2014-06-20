'use strict';

/* Controllers */
var appControllers = angular.module('app.controllers', []);

appControllers.controller('exampleCtrl', function () {
    //..
})

appControllers.controller('TimerCtrl', ['$scope', '$localForage', 'userSettings', 'notification', function ($scope, $localForage, userSettings, notification) {
    //#region Models
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
    //#endregion

    //#region Globals
    var startTime = new Date().toLocaleTimeString();
    var endTime = new Date().toLocaleTimeString();
    var timerInterval = 0;
    var timerDate = new Date();
    timerDate.setMinutes($scope.settings.selectedTime.value);
    timerDate.setSeconds(0);
    //#endregion

    //#region Click Events
    $scope.startTimer = startTimer;
    $scope.stopTimer = stopTimer;
    $scope.clearList = clearHistory;
    $scope.toggleSound = toggleSound;
    //#endregion

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
    };

    function clearHistory() {
        $scope.userSettings.taskHistory = [];
    };

    function toggleSound() {
        $scope.userSettings.sound.play = !$scope.userSettings.sound.play;
        if ($scope.userSettings.sound.play === true) {
            notification.playAudio();
        }
    };

    //#region Timmer Helper Functons
    function intervalTimer() {
        if (timeIsUp()) {
            $scope.stopTimer();
            endTime = new Date().toLocaleTimeString();
            console.log($scope.userSettings.sound.play);
            notification.notify($scope.userSettings.sound.play);
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
        timerDate.setSeconds(0);                                   // Test Switch 
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

        $scope.userSettings.taskHistory.push({ start: startTime, stop: endTime, text: _text });
        $scope.settings.taskTextBox = "";
    }
    //#endregion
}])