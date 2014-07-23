chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('index.html', {
        'bounds': {
            'width': 340,
            'height': 550
        },
        //maxWidth: 768,
        //maxHeight: 487,
        //minWidth: 300,
        //minHeight: 487,
        //"resizable": false
    });
}); 