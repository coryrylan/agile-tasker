(function () {
    'use strict';

    var appServices = angular.module('app.services');

    appServices.factory('settingsService', function () {
        var settingsService = {};

        settingsService.userSettings = {
            sound: { play: true },
            taskHistory: []
        };

        settingsService.defaultSettings = {
            options: [{ value: 0, label: 0 }, { value: 15, label: 15 }, { value: 20, label: 20 }, { value: 25, label: 25 }, { value: 30, label: 30 }],
            currentTime: "",
            selectedTime: {},
            taskTextBox: ""
        };

        settingsService.defaultSettings.selectedTime = settingsService.defaultSettings.options[2];
        settingsService.defaultSettings.currentTime = settingsService.defaultSettings.options[2].value + ":00";

        return settingsService;
    });
})();