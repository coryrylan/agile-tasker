app = angular.module('AgileTasker', ['LocalForageModule']);
app.controller('TimerCtrl', ['$scope', '$localForage', function($scope, $localForage) {

    /* --- Models --- */
    $scope.options = [{ value: 15, label: 15 }, { value: 20, label: 20 }, { value: 25, label: 25 }, { value: 30, label: 30 }];
    $scope.tasks = [];
    $localForage.bind($scope, {     // Bind Task list history to local storage
        key: 'tasks',
        defaultValue: { tasksJSON: ' ' },
        storeName: 'agileTaskStorage'
    }); 
    
    $scope.selectedOption = $scope.options[2];
    $scope.currentTime = $scope.selectedOption.value + ":" + "00";
    $scope.localTime = "";
    $scope.taskText = "";
    $scope.isPlaying = false;
    $scope.settingVisible = true;
    $scope.sound = true;

    var audio = new Audio();
    audio.src = Modernizr.audio.ogg ? 'Content/Audio/chime.ogg' :
                Modernizr.audio.mp3 ? 'Content/Audio/chime.mp3' :
                                      'Content/Audio/chime.m4a';
    
    var startTime = new Date().toLocaleTimeString();
    var endTime = new Date().toLocaleTimeString();
    var timerInterval = 0;
    var timerDate = new Date();
    timerDate.setMinutes($scope.selectedOption.value);
    timerDate.setSeconds(0);

    /* --- Click Events ---*/
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
        $scope.tasks = [];
    };

    $scope.toggleSound = function () {
        $scope.sound = !$scope.sound;
        playSound();
    };

    /* --- Timmer Helper Functons --- */
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
        if (timerDate.getMinutes() === 0 && timerDate.getSeconds() === 0) {
            $scope.stopTimer();
            endTime = new Date().toLocaleTimeString();
            alertNotification();
            pushTask();
        } else {
            timerDate.setSeconds(timerDate.getSeconds() - 1);
            $scope.currentTime = getCurrentTime(timerDate);
            document.title = $scope.currentTime;
        }
        $scope.$apply();
    }

    function resetTimer() {
        clearInterval(timerInterval);
        $scope.currentTime = $scope.selectedOption.value + ":" + "00";
        timerDate.setMinutes(0);  // $scope.selectedOption.value
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

    /* --- Alert/Notification Helper Functions -- */
    function pushTask() {
        var _text = "Unknown";
        if ($scope.taskText !== "") {
            _text = $scope.taskText;
        }

        $scope.tasks.push({ start: startTime, stop: endTime, text: _text });
        $scope.taskText = "";
    }

    function alertNotification() {
        // FlashTitle();     
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
        if ($scope.sound) {
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
}]);

app.controller('Dialog', function ($scope) {
    $scope.modalShown = false;
    $scope.toggleModal = function () {
        $scope.modalShown = !$scope.modalShown;
    };
});

app.directive('modalDialog', function () {
    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
        link: function (scope, element, attrs) {
            scope.dialogStyle = {};

            if (attrs.width) {
                scope.dialogStyle.width = attrs.width;
            }

            if (attrs.height) {
                scope.dialogStyle.height = attrs.height;
            }

            scope.hideModal = function () {
                scope.show = false;
            };
        },
        template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>" // See below
    };
});