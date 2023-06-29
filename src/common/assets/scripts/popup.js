var message = document.getElementById('message');
var btnToot = document.getElementById('btnToot');
var btnClear = document.getElementById('btnClear');
var loaderIcon = btnToot.querySelector('.loader');
var alert = document.getElementById('alert');
var tootType = document.getElementById('tootType');
var tootSize = 500;

var successMessage = '';

function init() {

    checkConfiguration();
    loadMessages();
};

function checkConfiguration() {
    chrome.storage.sync.get(null, function (items) {
        console.log(items);
        if (!items.instanceUrl || !items.accessKey) {
            chrome.tabs.create({ 'url': "/options.html" });
        }
    })
}

function loadMessages() {
    successMessage = chrome.i18n.getMessage('success');

    document.getElementById('btnClear').innerText = chrome.i18n.getMessage('clear');
    document.getElementById('btnToot').innerText = chrome.i18n.getMessage('toot');

    tootType.querySelector('option[value="public"]').text = chrome.i18n.getMessage('public');
    tootType.querySelector('option[value="direct"]').text = chrome.i18n.getMessage('direct');
    tootType.querySelector('option[value="private"]').text = chrome.i18n.getMessage('private');
    tootType.querySelector('option[value="unlisted"]').text = chrome.i18n.getMessage('unlisted');
}

function captureKeywords() {
    const meta = document.querySelector('meta[name=keywords]');

    if (meta) {
        const keywords = meta.getAttribute('content');
        const list = keywords.split(',').map((keyword) => keyword.trim());

        return list;
    }

    return [];

}

(function loadTabUrl() {

    chrome.storage.sync.get(null, function (items) {

        if (items.clipboard != undefined) {

            var clipboard = items.clipboard;

            var draft = clipboard.title +
                "\n\n" + clipboard.textSelection +
                "\n\n" + clipboard.url;

            message.value = draft;
        } else {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                message.value = tabs[0].title + "\n" + tabs[0].url;

                const tabId = tabs[0].id;

                // extract page keywords to use as hashtags
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: captureKeywords
                }).then((res) => {
                    const keywords = res[0].result;

                    if (keywords.length > 0) {
                        message.value += "\n\n" + keywords.map(keyword => '#' + keyword).join(' ');
                    }
                });
            });
        }
    });

})();

function toot() {
    chrome.storage.sync.get(null, function (items) {

        loaderIcon.classList.remove('hidden');
        btnToot.disabled = true;

        if (items.accessKey !== '') {

            var api = new MastodonAPI({
                instance: items.instanceUrl,
                api_user_token: items.accessKey
            });

            var finalMessage = message.value;
            var visibility = tootType.value;

            var request = api.post("statuses", { status: finalMessage, visibility: visibility }, function (data) {

                showAlert(successMessage, 'success');
                loaderIcon.classList.add('hidden');
                btnToot.disabled = false;

                message.value = '';
            });

            request.fail(function (data) {
                showAlert('Can\'t connect to the instance !', 'danger');
                btnToot.disabled = false;
                loaderIcon.classList.add('hidden');

                setTimeout(function () {
                    hideAlert();
                }, 2000);
            });
        }
    });
}

function clear() {
    message.value = '';

    chrome.storage.sync.remove('clipboard', function () {
        chrome.action.setBadgeText({
            text: ''
        });

        btnToot.disabled = 'disabled';
    });
}

function showAlert(content, type = 'info') {
    alert.innerHTML = '<p>' + content + '</p>';
    alert.classList.add('alert-' + type);
    alert.classList.remove('hidden');
}

function hideAlert() {
    alert.classList.add('hidden');
    alert.classList.remove('alert-success alert-danger alert-info alert-warning');
}

btnToot.addEventListener('click', toot);

$(window).keydown(function (event) {
    if (event.ctrlKey && event.keyCode == 13) {
        toot();
        event.preventDefault();
    }
});

btnClear.addEventListener('click', clear);
document.addEventListener('DOMContentLoaded', init);

setInterval(function () {
    var currentTootSize = message.value.toString().length;

    if (currentTootSize == 0 || currentTootSize > 500) {
        btnToot.disabled = true;
    } else {
        btnToot.disabled = false;
    }
}, 1000);
