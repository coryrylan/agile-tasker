(function () {
    'use strict';

    var appServices = angular.module('app.services', []).value('version', '1.5.4');

    appServices.factory('userSettings', function () {
        var _userSettings = {
            sound: { play: true },
            taskHistory: []
        };
        return _userSettings;
    });
})();