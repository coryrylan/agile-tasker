(function () {
    'use strict';

    var appControllers = angular.module('app.controllers', []);

    appControllers.controller('TimerCtrl', ['$scope', '$localForage', '$interval', 'appSettingsService', 'notificationService', 'timerService', function ($scope, $localForage, $interval, appSettingsService, notificationService, timerService) {
        var timerInterval = null;

        $scope.isPlaying = false;
        $scope.settings = appSettingsService.defaultSettings;
        $scope.userSettings = appSettingsService.userSettings;
        $localForage.bind($scope, {
            key: 'userSettings',
            defaultValue: appSettingsService.userSettings,
            storeName: 'StorageSettings'
        });

        $scope.currentTime = timerService.getCurrentTimeFormated();

        $scope.startTimer = function () {
            timerService.startTimer();
            timerInterval = $interval(function () {
                timerService.update();
                $scope.currentTime = timerService.getCurrentTimeFormated();
            }, 1000);
        }

        $scope.stopTimer = function () {
            timerService.stopTimer();
            $scope.currentTime = timerService.getCurrentTimeFormated();
            $interval.cancel(timerInterval);
        }
    }]);
})();