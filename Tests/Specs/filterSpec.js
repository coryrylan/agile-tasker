"use strict";

beforeEach(function () {
    module('app.filters');
});

describe("app Filter example", function () {
    it('does exist', inject(function ($filter) {
        expect($filter('example')).not.toBeNull();
    }));
});

describe("Filters", function () {

    //beforeEach(function () {
    //    module('AgileTasker');
    //});

    describe('version filter', function () {
        it('has a version filter', inject(function ($filter) {
            expect($filter('interpolateVersion')).not.toBeNull();
        }));

        //it('Should format version number', inject(function (interpolateVersion) {
        //    expect(interpolateVersion("1.5.1")).toEqual("v1.5.1");
        //}));
    });
});