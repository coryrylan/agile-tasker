chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('index.html', {
        'bounds': {
            'width': 740,
            'height': 487
        },
        maxWidth: 740,
        maxHeight: 487,
        minWidth: 300,
        minHeight:487
    });
}); 