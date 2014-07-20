"use strict";

beforeEach(function () {
    module('app.filters');
});

describe("app.filters example", function () {
    it('does exist', inject(function ($filter) {
        expect($filter('example')).not.toBeNull();
    }));
});

describe('app.filters interpolateVersion', function () {
    beforeEach(module(function ($provide) {
        $provide.value('version', 'TEST_VER');
    }));

    it('should replace VERSION', inject(function (interpolateVersionFilter) {
        expect(interpolateVersionFilter('before %VERSION% after')).toEqual('before TEST_VER after');
    }));
});