function TimerCtrl($scope) {

    $scope.options = [{ value: 25, label: 25 }, { value: 20, label: 20 }, { value: 15, label: 15 }, { value: 10, label: 10 }];
    $scope.selectedOption = $scope.options[1];
    $scope.currentTime = $scope.selectedOption.value + ":" + "00";
    $scope.playState = "Play";

    var isPauseState = false;
    var timerInterval = 0;
    var desktopNotificationCalled = false;

    var timerDate = new Date();
        timerDate.setMinutes($scope.selectedOption.value);
        timerDate.setSeconds(0);

    $scope.startTimer = function () {
        if (isPauseState === false) {
            isPauseState = true;
            $scope.playState = "Pause";
            timerInterval = setInterval(intervalTimer, 1000);
        }
        else {
            isPauseState = false;
            $scope.playState = "Play";
            clearInterval(timerInterval);
        }
    };

    $scope.stopTimer = function () {
        isPauseState = false;
        $scope.playState = "Play";
        resetTimer();
    };


    /* --- Helper Functons --- */
    function intervalTimer() {
        if (timerDate.getMinutes() === 0 && timerDate.getSeconds() === 0) {
            $scope.stopTimer();
            alertNotification();          
        }
        else {
            timerDate.setSeconds(timerDate.getSeconds() - 1);
            $scope.currentTime = timerDate.getMinutes() + ":" + timerDate.getSeconds();
            document.title = $scope.currentTime;
            $scope.$apply()
        }
    };

    function resetTimer() {
        clearInterval(timerInterval);
        $scope.currentTime = $scope.selectedOption.value + ":" + "00";
        timerDate.setMinutes($scope.selectedOption.value);
        timerDate.setSeconds(0);
    };

    function alertNotification() {
        //FlashTitle();
        //if ($('#SoundSelection:checked').is(':checked')) {
        //    PlaySound();
        //}

        if (desktopNotificationCalled === false) {
            alertDesktopNotification();
        }
    }

    function alertDesktopNotification() {
        if (window.webkitNotifications.checkPermission() == 0) {
            notification_test = window.webkitNotifications.createNotification(
            'Content/pom.png', 'Agility!', 'Time to take a break!');
            notification_test.ondisplay = function () { };
            notification_test.onclose = function () { };
            notification_test.show();
            desktopNotificationCalled = true;
        }

        //Close Desktop Notification after 1 min
        setTimeout(function () {
            notification_test.cancel();
        }, 60000);
    }
}