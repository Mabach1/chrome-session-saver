chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: saveSession
    });
});

function saveSession() {
    chrome.tabs.query({}, function (tabs) {
        var session = tabs.map(function (tab) {
            return { url: tab.url, title: tab.title };
        });

        chrome.storage.local.get('sessions', function (data) {
            var sessions = data.sessions || [];
            sessions.push(session);

            chrome.storage.local.set({ sessions: sessions });
        });
    });
}
