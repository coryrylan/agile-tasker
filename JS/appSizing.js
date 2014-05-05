// Sizing functionality that must be done with JS
var setTimerView = function() {
    jQuery(".current-time").fitText(0.4, { minFontSize: '96px', maxFontSize: '175px' });

    var windowHeight = $(window).height();
    var timmerHeight = $('.timer-box').height();
    if (Modernizr.mq('(min-width: 50em)')) {
        $('.view-main  .task-list').height(windowHeight - timmerHeight - 320 + 'px');
    }

    $(window).resize(function () {
        if (Modernizr.mq('(min-width: 50em)')) {
            windowHeight = $(window).height();
            timmerHeight = $('.timer-box').height();

            $('.view-main  .task-list').height(windowHeight - timmerHeight - 320 + 'px');
        }
        else {
            $('.view-main  .task-list').height('initial');
        }
    });
}