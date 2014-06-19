"use strict";

beforeEach(function () {
    module('app.controllers');
});

describe("app Controller exampleCtrl", function () {
    it('does exist', inject(function ($controller) {
        var ctrl = $controller("exampleCtrl");
        expect(ctrl).not.toBeNull();
    }));
});