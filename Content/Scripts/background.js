chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('index.html', {
        'bounds': {
            'width': 830,
            'height': 525
        },
        maxWidth: 830,
        maxHeight: 530,
        minWidth: 300,
        minHeight:525
    });
}); 