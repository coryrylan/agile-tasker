(function () {
    'use strict';

    var appDirectives = angular.module('app.directives');

    appDirectives.directive('agileHistory', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                bindModel: '=ngModel'
            },
            template: [
                '<ul class="task-list">',
                    '<li ng-repeat="task in bindModel track by $index">',
                        '<div>{{task.text}}</div>',
                        '<span class="smallText"><span>{{task.start}}</span>&nbsp;<strong>to</strong>&nbsp;<span>{{task.stop}}</span></span>',
                    '</li>',
                '</ul>'
            ].join(''),
            link: function (scope, element, attrs) {

            }
        };
    });
})();