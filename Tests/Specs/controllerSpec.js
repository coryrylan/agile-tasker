"use strict";

beforeEach(function () {
    module('app.controllers');
});

describe("app.controllers exampleCtrl", function () {
    it('does exist', inject(function ($controller) {
        var ctrl = $controller("exampleCtrl");
        expect(ctrl).not.toBeNull();
    }));
});

//describe("app.controllers TimerCtrl", function () {
//    it('does exist', inject(function ($controller) {
//        var ctrl = $controller("TimerCtrl");
//        expect(ctrl).not.toBeNull();
//    }));
//});