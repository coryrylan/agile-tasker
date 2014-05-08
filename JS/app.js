var app = angular.module('AgileTasker', ['ngRoute', 'LocalForageModule']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/Partials/timer.html'
    });
    $routeProvider.when('/about', {
        templateUrl: '/Partials/about.html'
    });
    $routeProvider.when('/history', {
        templateUrl: '/Partials/history.html'
    });
    $routeProvider.when('/settings', {
        templateUrl: '/Partials/settings.html'
    });
    $routeProvider.otherwise({redirectTo: '/'});
}]);

app.factory('UserSettings',['$localForage', function ($localForage) {
    _userSettings = {
        sound: { play: true },
        taskHistory: []
    }
    return _userSettings;
}]);

app.controller('MainCtrl', ['$scope', '$localForage', 'UserSettings', function ($scope, $localForage, UserSettings) {

}]);

app.controller('TimerCtrl', ['$scope', '$localForage', 'UserSettings', function ($scope, $localForage, UserSettings) {

    //#region Models
    $scope.settings = {
        options: [{ value: 15, label: 15 }, { value: 20, label: 20 }, { value: 25, label: 25 }, { value: 30, label: 30 }],
        currentTime: "",
        selectedTime: {},
        taskTextBox: ""
    };
    $scope.settings.selectedTime = $scope.settings.options[2];
    $scope.settings.currentTime = $scope.settings.options[2].value + ":00";

    $scope.isPlaying = false;
    //#endregion

    //#region Bind userSettings service to local storage
    $scope.userSettings = UserSettings;
    $localForage.bind($scope, {
        key: 'userSettings',
        defaultValue: UserSettings,
        storeName: 'StorageSettings'
    });
    //#endregion

    //#region Globals
    var audio = new Audio();
    audio.src = Modernizr.audio.ogg ? 'Content/Audio/chime.ogg' :
                Modernizr.audio.mp3 ? 'Content/Audio/chime.mp3' :
                                      'Content/Audio/chime.m4a';
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
        playSound();
    };
    //#endregion

    //#region Timmer Helper Functons
    function intervalTimer() {
        if (timeIsUp()) {
            $scope.stopTimer();
            endTime = new Date().toLocaleTimeString();
            alertNotification();
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
        timerDate.setSeconds(0);                            // Test Switch 
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
    //#endregion

    //#region Alert/Notification Helper Functions
    function saveTaskToHistory() {
        var _text = "Unknown";
        console.log($scope.settings.taskTextBox);
        if ($scope.settings.taskTextBox !== "") {
            _text = $scope.settings.taskTextBox;
        }

        $scope.userSettings.taskHistory.push({ start: startTime, stop: endTime, text: _text });
        $scope.settings.taskTextBox = "";
    }

    function alertNotification() {
        vibrationNotification();
        setTimeout(function () { nativeNotification(); playSound(); }, 1600); // Set timeout because html5 Vibrate API does not take a callback ( Alert stops vibration ) :(
    }

    function nativeNotification() {
        if (notify.permissionLevel() === notify.PERMISSION_DEFAULT) {
            notify.requestPermission();
        } else if (notify.permissionLevel() === notify.PERMISSION_GRANTED) {
            notify.createNotification('Agile Task Complete', {
                body: 'Time to take a break!',
                icon: 'Content/icon.png'
            });
        } else if (notify.permissionLevel() === notify.PERMISSION_DENIED) {
            alert("Agile Task Complete");
        } else {
            alert("Agile Task Complete");
        }
    }

    function playSound() {
        if ($scope.userSettings.sound.play) {
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        } else {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    function vibrationNotification() {
        // enable vibration support
        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

        if (navigator.vibrate) {
            navigator.vibrate([500, 200, 500]);
        }
    }
    //#endregion

}]);

// Needs to be directive (modifiying dom)
app.controller('TimerSizing', ['$scope', function ($scope) {
    jQuery(".current-time").fitText(0.4, { minFontSize: '96px', maxFontSize: '175px' });

    var windowHeight = $(window).height();
    var timerHeight = $('.timer-box').height();
    if (Modernizr.mq('(min-width: 50em)')) {
        $('.view-main  .task-list').height(windowHeight - timerHeight - 360 + 'px');
    }

    $(window).resize(function () {
        if (Modernizr.mq('(min-width: 50em)')) {
            windowHeight = $(window).height();
            timmerHeight = $('.timer-box').height();

            $('.view-main  .task-list').height(windowHeight - timerHeight - 360 + 'px');
        }
        else {
            $('.view-main  .task-list').height('initial');
        }
    });
}]);

// http://jsdo.it/can.i.do.web/zHbM
app.directive('clock', function ($timeout, dateFilter) {
    return function (scope, element, attrs) {
        var timeoutId; // timeoutId, so that we can cancel the time updates

        // schedule update in one second
        function updateLater() {
            // save the timeoutId for canceling
            timeoutId = $timeout(function () {
                element.text(dateFilter(new Date(), 'shortTime'));
                updateLater(); // schedule another update
            }, 1000);
        }

        // listen on DOM destroy (removal) event, and cancel the next UI update
        // to prevent updating time ofter the DOM element was removed.
        element.bind('$destroy', function () {
            $timeout.cancel(timeoutId);
        });

        updateLater(); // kick off the UI update process.
    }
});

