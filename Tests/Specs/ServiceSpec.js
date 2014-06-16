"use strict";

describe("Services", function () {

    beforeEach(function () {
        module('AgileTasker');
    });

    describe('User Settings Service', function () {
        it('Should return history array object', inject(function (UserSettings) {
            expect(UserSettings.taskHistory).toBeDefined();
        }));

        it('Should return that play is true', inject(function (UserSettings) {
            expect(UserSettings.sound.play).toBe(true);
        }));
    });

    describe('Notification Service', function () {
        //it('Has a Notification service', inject(function (Notification) {
            // expect(Notification).not.toBeNull(); // Pass modernizr as dependency?
        //}));
    });
});