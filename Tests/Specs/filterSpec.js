"use strict";

// Example
describe("My First Test", function () {
    it("should be true", function () {
        expect(true).toBe(true);
    });
});

// Example
describe('JavaScript addition operator', function () {
    it('adds two numbers together', function () {
        expect(1 + 2).toEqual(3);
    });
});

describe("Filters", function () {

    beforeEach(function () {
        module('AgileTasker');
    });

    describe('version filter', function () {
        it('has a version filter', inject(function ($filter) {
            expect($filter('interpolateVersion')).not.toBeNull();
        }));

        //it('Should format version number', inject(function ($filter) {
            //expect(interpolateVersion("1.5.1")).toEqual("v1.5.1");
        //}));
    });
});