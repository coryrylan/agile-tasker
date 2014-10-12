"use strict";

beforeEach(function () {
    module('app.services');
});

describe("app.services Factory example", function () {
    it('does exist', inject(function (example) {
        expect(example).not.toBeNull();
    }));
});

describe("app.services Factory notification (needs tests)", function () {
    it('does exist', inject(function (notification) {
        expect(notification).not.toBeNull();
    }));
});

describe('app.services Factory userSettings', function () {
    it('Should return history array object', inject(function (userSettings) {
        expect(userSettings.taskHistory).toBeDefined();
    }));

    it('Should return that play is true', inject(function (userSettings) {
        expect(userSettings.sound.play).toBe(true);
    }));
});

describe('app.services Factory notification', function () {
    it('Has a Notification service', inject(function (notification) {
        expect(notification).not.toBeNull(); // Pass modernizr as dependency?
    }));

    it('Has a notify() method', inject(function (notification) {
        expect(notification.notify).not.toBeNull();
    }));

    it('Has a playAudio() method', inject(function (notification) {
        expect(notification.playAudio).not.toBeNull();
    }));
});
