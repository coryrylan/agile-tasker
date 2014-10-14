(function () {
    'use strict';

    var appDirectives = angular.module('app.directives');

    appDirectives.directive('agileClock', ['$timeout', 'dateFilter', function ($timeout, dateFilter) { // http://jsdo.it/can.i.do.web/zHbM
        return function (scope, element, attrs) {
            var timeoutId; // timeoutId, so that we can cancel the time updates

            // schedule update in one second
            function updateLater() {
                // save the timeoutId for canceling
                timeoutId = $timeout(function () {
                    element.text(dateFilter(new Date(), 'shortTime'));
                    updateLater(); // schedule another update
                }, 1000);
            }

            // listen on DOM destroy (removal) event, and cancel the next UI update
            // to prevent updating time ofter the DOM element was removed.
            element.bind('$destroy', function () {
                $timeout.cancel(timeoutId);
            });

            updateLater(); // kick off the UI update process.
        };
    }]);
})();