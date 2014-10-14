(function () {
    'use strict';

    var appServices = angular.module('app.services');

    appServices.factory('appSettingsService', function () {
        var appSettingsService = {};

        appSettingsService.userSettings = {
            sound: { play: true },
            taskHistory: []
        };

        appSettingsService.defaultSettings = {
            options: [{ value: 15, label: 15 }, { value: 20, label: 20 }, { value: 25, label: 25 }, { value: 30, label: 30 }],
            currentTime: "",
            selectedTime: {},
            taskTextBox: ""
        };

        appSettingsService.defaultSettings.selectedTime = appSettingsService.defaultSettings.options[2];
        appSettingsService.defaultSettings.currentTime = appSettingsService.defaultSettings.options[2].value + ":00";

        return appSettingsService;
    });
})();