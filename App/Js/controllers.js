'use strict';

/* Controllers */
angular.module('app.controllers', [])

.controller('TimerCtrl', ['$scope', '$localForage', 'UserSettings', 'Notification', function ($scope, $localForage, UserSettings, Notification) {
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

    //Bind userSettings service to local storage
    $scope.userSettings = UserSettings;
    $localForage.bind($scope, {
        key: 'userSettings',
        defaultValue: UserSettings,
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
        $scope.isPlaying = '';
        document.title = 'Agile Tasker';
    };

    $scope.clearList = function () {
        $scope.userSettings.taskHistory = [];
    };

    $scope.toggleSound = function () {
        $scope.userSettings.sound.play = !$scope.userSettings.sound.play;
        if ($scope.userSettings.sound.play === true) {
            Notification.playAudio();
        }
    };
    //#endregion

    //#region Timmer Helper Functons
    function intervalTimer() {
        if (timeIsUp()) {
            $scope.stopTimer();
            endTime = new Date().toLocaleTimeString();
            console.log($scope.userSettings.sound.play);
            Notification.notify($scope.userSettings.sound.play);
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

.controller('TimerSizing', ['$scope', function ($scope) { // Needs to be directive (modifiying dom)
    jQuery(".current-time").fitText(0.4, { minFontSize: '96px', maxFontSize: '175px' });
}]);
