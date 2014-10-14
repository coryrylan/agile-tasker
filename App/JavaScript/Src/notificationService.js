(function () {
    'use strict';

    var appServices = angular.module('app.services');

    appServices.factory('notificationService', function () {

        var notificationService = {};

        notificationService.notify = function (playSound) {
            vibrationNotification();
            setTimeout(function () { nativeNotification(); toggleAudio(playSound); }, 1600); // Set timeout because html5 Vibrate API does not take a callback ( Alert stops vibration )
        };

        notificationService.playAudio = function () {
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        };

        var audio = new Audio();
        audio.src = Modernizr.audio.ogg ? 'Content/Audio/chime.ogg' :
                    Modernizr.audio.mp3 ? 'Content/Audio/chime.mp3' :
                                          'Content/Audio/chime.m4a';

        function nativeNotification() {
            // Refactor to case statement
            if (notify.permissionLevel() === notify.PERMISSION_DEFAULT) {
                notify.requestPermission();
            } else if (notify.permissionLevel() === notify.PERMISSION_GRANTED) {
                notify.createNotification('Agile Task Complete', {
                    body: 'Time to take a break!',
                    icon: 'Content/Images/icon.png'
                });
            } else if (notify.permissionLevel() === notify.PERMISSION_DENIED) {
                alert("Agile Task Complete");
            } else {
                alert("Agile Task Complete");
            }
        }

        function toggleAudio(playSound) {
            if (playSound === true) {
                audio.pause();
                audio.currentTime = 0;
                audio.play();
            }
        }

        function vibrationNotification() {
            navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

            if (navigator.vibrate) {
                navigator.vibrate([500, 200, 500]);
            }
        }

        return notificationService;
    });
})();