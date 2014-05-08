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
    $scope.options = [{ value: 15, label: 15 }, { value: 20, label: 20 }, { value: 25, label: 25 }, { value: 30, label: 30 }];
    $scope.selectedTime = $scope.options[2];
    $scope.currentTime = $scope.selectedTime.value + ":" + "00";
    $scope.localTime = "";
    $scope.taskText = { value: "" };  // Note: Must define object so child view can copy parent object for scope inheritence
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
    timerDate.setMinutes($scope.selectedTime.value);
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
    setInterval(updateLocalTime, 1000);

    function updateLocalTime() {
        $scope.localTime = toLocalTime(new Date());
        $scope.$apply();
    }

    function toLocalTime(date) {
        var h = date.getHours();
        var m = date.getMinutes();
        var x = h >= 12 ? 'pm' : 'am';
        h = h % 12;
        h = h ? h : 12;
        m = m < 10 ? '0' + m : m;
        var mytime = h + ':' + m + ' ' + x;
        return mytime;
    }

    function intervalTimer() {
        if (timeIsUp()) {
            $scope.stopTimer();
            endTime = new Date().toLocaleTimeString();
            alertNotification();
            saveTaskToHistory();
        } else {
            timerDate.setSeconds(timerDate.getSeconds() - 1);
            $scope.currentTime = getCurrentTime(timerDate);
            document.title = $scope.currentTime;
        }
        $scope.$apply();
    }

    function timeIsUp() {
        return (timerDate.getMinutes() === 0 && timerDate.getSeconds() === 0);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        $scope.currentTime = $scope.selectedTime.value + ":" + "00";
        timerDate.setMinutes(0);  // $scope.selectedTime.value
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
        console.log($scope.taskText.value);
        if ($scope.taskText.value !== "") {
            _text = $scope.taskText.value;
        }

        $scope.userSettings.taskHistory.push({ start: startTime, stop: endTime, text: _text });
        $scope.taskText.value = "";
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

//#region Needs to be directive (modifiying dom)
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
//#endregion Start new controller