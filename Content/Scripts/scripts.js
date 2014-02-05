function TimerCtrl($scope) {

    $scope.options = [{ value: 1, label: 1 },{ value: 25, label: 25 }, { value: 20, label: 20 }, { value: 15, label: 15 }, { value: 10, label: 10 }];
    $scope.tasks = [];

    $scope.selectedOption = $scope.options[1];
    $scope.currentTime = $scope.selectedOption.value + ":" + "00";
    $scope.playState = "Play";
    $scope.isPlaying = false;

    var startTime = new Date().toLocaleTimeString();
    var endTime = new Date().toLocaleTimeString();
    var timerInterval = 0;
    var desktopNotificationCalled = false;
    var timerDate = new Date();
        timerDate.setMinutes($scope.selectedOption.value);
        timerDate.setSeconds(0);

    $scope.startTimer = function () {
        resetTimer();
        timerInterval = setInterval(intervalTimer, 1000);
        startTime = new Date().toLocaleTimeString();
        $scope.isPlaying = true;
    };

    $scope.stopTimer = function () {
        resetTimer();
        $scope.isPlaying = "";
    };

    $scope.clearList = function () {
        $scope.tasks = [];
    };

    /* --- Helper Functons --- */
    function intervalTimer() {
        if (timerDate.getMinutes() === 0 && timerDate.getSeconds() === 0) {
            $scope.stopTimer();
            endTime = new Date().toLocaleTimeString();
            alertNotification();
            pushTask();
        }
        else {
            timerDate.setSeconds(timerDate.getSeconds() - 1);
            $scope.currentTime = timerDate.getMinutes() + ":" + timerDate.getSeconds();
            document.title = $scope.currentTime;            
        }
        $scope.$apply();
    };

    function pushTask() {
        $scope.tasks.push({ start: startTime, stop: endTime });
    };

    function resetTimer() {
        clearInterval(timerInterval);
        desktopNotificationCalled = false;
        $scope.currentTime = $scope.selectedOption.value + ":" + "00";
        timerDate.setMinutes($scope.selectedOption.value);
        timerDate.setSeconds(0); // Switch
    };

    function alertNotification() {
        //FlashTitle();
        //if ($('#SoundSelection:checked').is(':checked')) {
        //    PlaySound();
        //}

        if (desktopNotificationCalled === false) {
            alertDesktopNotification();
        }
    };

    function alertDesktopNotification() {
        if (window.webkitNotifications) {
            if (window.webkitNotifications.checkPermission() == 0) {
                var notification_test = window.webkitNotifications.createNotification(
                'Content/pom.png', 'Agility!', 'Time to take a break!');
                notification_test.ondisplay = function () { };
                notification_test.onclose = function () { };
                notification_test.show();
                desktopNotificationCalled = true;
            }
        }

        //Close Desktop Notification after 1 min
        setTimeout(function () {
            notification_test.cancel();
        }, 60000);
    };

    (function RequestDesktopNotification() {
        // If Webkit and supports Desktop Notifications Request Permission
        if (window.webkitNotifications){
            if (window.webkitNotifications.checkPermission() === 0) { // 0 is PERMISSION_ALLOWED
                // function defined 
            } else {
                window.webkitNotifications.requestPermission();
            }
        }
    }());
}