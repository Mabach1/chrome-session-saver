document.addEventListener('DOMContentLoaded', function () {
  let saveSessionBtn = document.getElementById('saveSessionBtn');
  let sessionList = document.getElementById('sessionList');

  saveSessionBtn.addEventListener('click', function () {
    chrome.tabs.query({}, function (tabs) {
      let session = tabs.map(function (tab) {
        return { url: tab.url, title: tab.title };
      });

      chrome.storage.local.get('sessions', function (data) {
        var sessions = data.sessions || [];
        sessions.push(session);

        chrome.storage.local.set({ sessions: sessions }, function () {
          displaySessions();
        });
      });
    });
  });

  function displaySessions() {
    chrome.storage.local.get('sessions', function (data) {
      sessionList.innerHTML = '';

      let sessions = data.sessions || [];
      sessions.forEach(function (session, index) {
        let sessionItem = document.createElement('li');
        sessionItem.textContent = 'Session ' + (index + 1);
        sessionItem.setAttribute('data-session-index', index);

        sessionItem.addEventListener('click', function () {
          restoreSession(session);
        });

        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function (e) {
          e.stopPropagation();
          deleteSession(index);
        });

        sessionItem.appendChild(deleteButton);
        sessionList.appendChild(sessionItem);
      });
    });
  }

  function restoreSession(session) {
    let urls = session.map(function (tab) {
      return tab.url;
    });

    chrome.windows.create({ url: urls });
  }

  function deleteSession(index) {
    chrome.storage.local.get('sessions', function (data) {
      let sessions = data.sessions || [];
      sessions.splice(index, 1);

      chrome.storage.local.set({ sessions: sessions }, function () {
        displaySessions();
      });
    });
  }

  displaySessions();
});
