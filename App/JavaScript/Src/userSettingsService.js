(function () {
    'use strict';

    var appServices = angular.module('app.services');

    appServices.factory('userSettingsService', function () {
        var _userSettings = {
            sound: { play: true },
            taskHistory: []
        };
        return _userSettings;
    });
})();