/*! Cory Bateman www.webdesignis.me */
$(document).ready(function () {

    $("#CurrentPomodoro").fitText();
    $("#CurrentPomodoro").fitText(0.75);

    var snd1 = new Audio("resources/alarm2.mp3"); // buffers automatically when created
    var snd2 = new Audio("resources/alarm2.wav"); // buffers automatically when created
    var timerDate = new Date();
    var timerInterval;
    var isPaused = false;
    var notification_test;
    var desktopNotificationCalled = false;

    timerDate.setMinutes($("#TimeSelection").val());
    timerDate.setSeconds(0);

    /* Button Events */
    $('#Start').click(function () {
        Start();
        $(".button").removeClass("boxShadowRed");
        $("#Start > div").addClass("boxShadowRed");
    });

    $('#Stop').click(function () {
        Stop();
        $(".button").removeClass("boxShadowRed");
        $("#Stop > div").addClass("boxShadowRed");
    });

    $('#Pause').click(function () {
        Pause();
        $(".button").removeClass("boxShadowRed");
        $("#Pause > div").addClass("boxShadowRed");
    });

    $('#Alarm').click(function () {
        PlaySound();
    });

    // If Webkit and supports Desktop Notifications Request Permission
    document.querySelector('#Start').addEventListener('click', function () {
        if (window.webkitNotifications.checkPermission() === 0) { // 0 is PERMISSION_ALLOWED
            // function defined 
        } else {
            window.webkitNotifications.requestPermission();
        }
    }, false);

    function Start() {
        if (isPaused === true) {
            timerInterval = setInterval(Timer, 1000);
            isPaused = false;
        }
        else {
            Stop();
            SetNewTimer();
            SetStartTime();
            isPaused = false;
        }
    }

    function Stop() {
        ResetHTML();
        clearInterval(timerInterval);
        isPaused = false; 
        desktopNotificationCalled = false; //reset notification
    }

    function Pause() {
        isPaused = true;
        clearInterval(timerInterval);
    }

    function SetNewTimer() {
        timerInterval = setInterval(Timer, 1000); //Call timer function every 1 sec
        timerDate.setMinutes($("#TimeSelection").val());
        timerDate.setSeconds(0);
    }

    function SetStartTime() {
        var startTime = new Date();
        $('#StartTime').html(startTime.toLocaleTimeString());
    }

    /* Set Local Time */
    setInterval(function () { currentTime() }, 1000);
    function currentTime() {
        var d = new Date();
        var t = d.toLocaleTimeString();
        $('#LocalTime').html(t);
    }

    /* Set Current Pomodoro Timer */
    function Timer() {
        if (timerDate.getMinutes() === 0 && timerDate.getSeconds() === 0) {
            Alarm();
        }
        else {
            timerDate.setSeconds(timerDate.getSeconds() - 1);
            var sec = timerDate.getSeconds();
            var min = timerDate.getMinutes();
            $('#CurrentPomodoro').html(min + " mins" + " " + sec + " sec");
            document.title = min + " Mins" + " " + sec + " Sec";
        }
    }

    function Alarm() {
        FlashTitle();
        if ($("#SoundSelection").val() === 'On') {
            PlaySound();
        }

        if (desktopNotificationCalled === false) {
            alertDesktopNotification();
        }
    }

    function alertDesktopNotification() {
        if (window.webkitNotifications.checkPermission() == 0) {
            notification_test = window.webkitNotifications.createNotification(
            'resources/pom.png', 'Pomodoro!', 'Time to take a break!');
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

    function PlaySound() {
        snd1.play();
        snd2.play();
    }

    /* Alarm Title */
    var isOldTitle = true;
    var oldTitle = "* 5 Min Break *";
    var newTitle = "*  Alarm  *";

    function FlashTitle() {
        var t = isOldTitle ? oldTitle : newTitle;
        $('#CurrentPomodoro').html(t);
        document.title = isOldTitle ? oldTitle : newTitle;
        isOldTitle = !isOldTitle;
    }

    function ResetHTML() {
        $("#CurrentPomodoro").html('Pomodoro');
        $('#CurrentPomodoro').html("0 mins 0 sec");
        document.title = 'Pomodoro';
    }
});