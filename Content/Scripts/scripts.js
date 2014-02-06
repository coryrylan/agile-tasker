function TimerCtrl($scope) {

    $scope.options = [{ value: 1, label: 1 },{ value: 25, label: 25 }, { value: 20, label: 20 }, { value: 15, label: 15 }, { value: 10, label: 10 }];
    $scope.tasks = [];

    $scope.selectedOption = $scope.options[1];
    $scope.currentTime = $scope.selectedOption.value + ":" + "00";
    $scope.playState = "Play";
    $scope.taskText = "";
    $scope.isPlaying = false;

    var startTime = new Date().toLocaleTimeString();
    var endTime = new Date().toLocaleTimeString();
    var timerInterval = 0;
    var timerDate = new Date();
        timerDate.setMinutes($scope.selectedOption.value);
        timerDate.setSeconds(0);

    $scope.startTimer = function() {
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
            $scope.currentTime = getCurrentTime(timerDate);
            document.title = $scope.currentTime;            
        }
        $scope.$apply();
    };

    function getCurrentTime(currentTime) {
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();

        if (minutes < 10)
            minutes = '0' + minutes;

        if (seconds < 10)
            seconds = '0' + seconds;

        return minutes + ':' + seconds;
    }

    function pushTask() {
        $scope.tasks.push({ start: startTime, stop: endTime, text: $scope.taskText });
    };

    function resetTimer() {
        clearInterval(timerInterval);
        $scope.currentTime = $scope.selectedOption.value + ":" + "00";
        timerDate.setMinutes(0);
        timerDate.setSeconds($scope.selectedOption.value); // Switch
    };

    function alertNotification() {
        //FlashTitle();
        //if ($('#SoundSelection:checked').is(':checked')) {
        //    PlaySound();
        //}
        alertDesktopNotification();
    };

    function alertDesktopNotification() {
        if (window.webkitNotifications) {
            if (window.webkitNotifications.checkPermission() == 0) {
                var notification_test = window.webkitNotifications.createNotification(
                'Content/pom.png', 'Agility!', 'Time to take a break!');
                notification_test.ondisplay = function () { };
                notification_test.onclose = function () { };
                notification_test.onClick = function () { };
                notification_test.show();
            }
        }
    };
    
    document.querySelector('#Startbtn').addEventListener('click', function () {
        if (window.webkitNotifications.checkPermission() === 0) { // 0 is PERMISSION_ALLOWED
            // function defined 
        } else {
            window.webkitNotifications.requestPermission();
        }
    }, false);
}