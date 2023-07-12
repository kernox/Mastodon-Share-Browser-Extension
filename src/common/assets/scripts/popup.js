let message = document.getElementById('message');
let btnToot = document.getElementById('btnToot');
let btnClear = document.getElementById('btnClear');
let loaderIcon = btnToot.querySelector('.loader');
let alert = document.getElementById('alert');
let tootType = document.getElementById('tootType');
let tootSizeCounter = document.getElementById('tootSizeCounter');
let tootSize = 500;

var successMessage = '';

//Hack firefox
chrome = window?.browser || chrome;

function init() {
    checkConfiguration();
    loadConfiguration();
    loadMessages();
    loadTabUrl();
};

function checkConfiguration() {
    chrome.storage.sync.get(null, function (items) {

        if (!items.instanceUrl || !items.accessKey) {
            chrome.tabs.create({ 'url': "/options.html" });
        }
    })
}

function loadConfiguration(){
    chrome.storage.sync.get(null, function (items) {
        const api = new MastodonAPI({
            instance: items.instanceUrl,
            api_user_token: items.accessKey
        });

        api.get("/instance").then(res => {            
            tootSize = res?.configuration?.statuses?.max_characters || 500;
            message.maxLength = tootSize;

            updateCharsCounter()
            
        });

    })
}

function updateCharsCounter(){
    tootSizeCounter.innerHTML=message.value.length + " / "+ tootSize;
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

function loadTabUrl() {

    chrome.storage.sync.get(null, async function (items) {

        if (items.clipboard != undefined) {

            var clipboard = items.clipboard;

            var draft = clipboard.title +
                "\n\n" + clipboard.textSelection +
                "\n\n" + clipboard.url;

            message.value = draft;
        } else {
        
            const storedMessage = await getData('message');

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

                const currentTab = tabs[0];
                const tabId = currentTab.id;

                if (storedMessage) {
                    message.value = storedMessage;
                } else {
                    message.value = currentTab.title + "\n" + currentTab.url;

                    //Store message value for current tab
                    saveData('message', message.value);

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
                }


            });
        }
    });

}

function toot() {
    chrome.storage.sync.get(null, function (items) {

        loaderIcon.classList.remove('hidden');
        btnToot.disabled = true;

        if (items.accessKey !== '') {

            var api = new MastodonAPI({
                instance: items.instanceUrl,
                api_user_token: items.accessKey
            });

            console.log(api);

            var finalMessage = message.value;
            var visibility = tootType.value;

            var request = api.post("statuses", { 
                status: finalMessage, 
                visibility: visibility,
                // sensitive: true,
                // spoiler_text: "Essai"
            }, function (data) {

                showAlert(successMessage, 'success');
                loaderIcon.classList.add('hidden');
                btnToot.disabled = false;

                clear();
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

    removeData('message');
    

    updateCharsCounter();
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

function saveTabMessage() {
    saveData('message', message.value);
    updateCharsCounter();
}

btnClear.addEventListener('click', clear);
document.addEventListener('DOMContentLoaded', init);
message.addEventListener('keyup', saveTabMessage);

setInterval(function () {
    var currentTootSize = message.value.toString().length;

    if (currentTootSize == 0 || currentTootSize > 500) {
        btnToot.disabled = true;
    } else {
        btnToot.disabled = false;
    }
}, 1000);
