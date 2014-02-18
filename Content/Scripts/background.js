chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('index.html', {
        'bounds': {
            'width': 740,
            'height': 490
        },
        maxWidth: 740,
        maxHeight: 490,
        minWidth: 300,
        minHeight:490
    });
});