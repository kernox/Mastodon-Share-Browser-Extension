const message = document.getElementById('message');
const btnToot = document.getElementById('btnToot');

const contentWarningPanel = document.getElementById('contentWarningPanel');
const contentWarning = document.getElementById('contentWarning');
const btnContentWarning = document.getElementById('btnContentWarning');
const btnClearContentWarning = document.getElementById('btnClearContentWarning');

const btnClear = document.getElementById('btnClear');
const loaderIcon = btnToot.querySelector('.loader');
const alert = document.getElementById('alert');
const alertContent = document.getElementById('alertContent');
const tootType = document.getElementById('tootType');
const tootSizeCounter = document.getElementById('tootSizeCounter');

const btnSchedule = document.getElementById('btnSchedule');
const schedulePanel = document.getElementById('schedulePanel');
const scheduleChoice = document.getElementById('scheduleChoice');

const selectedInstance = document.getElementById('selectedInstance');
let selectedInstanceIndex = 0;

let tootSize = 500;
let successMessage = '';
let instances = [];

//Hack firefox
chrome = window?.browser || chrome;

function init() {
    checkConfiguration();
    loadConfiguration();
    loadMessages();
    loadTabUrl();
};

function checkConfiguration() {
    chrome.storage.local.get({instances: []}, function (res) {

        if(res.instances.length == 0){
            chrome.tabs.create({ 'url': "/options.html" });
        }
    })
}

function loadConfiguration() {
    
    chrome.storage.local.get(null, function (items) {
        console.table(items);
    })

    chrome.storage.local.get(null, function (items) {

        instances = items['instances'];

        for(let index in instances){
            const instance = instances[index];

            const option = document.createElement('option');       
            option.value=index;
            option.append(instance.url);

            selectedInstance.append(option);
        }

        const instance = instances[selectedInstanceIndex];

        const api = new MastodonAPI({
            instance: instance.url,
            api_user_token: instance.accessKey
        });

        api.get("/instance").then(res => {
            tootSize = res?.configuration?.statuses?.max_characters || 500;
            message.maxLength = tootSize;

            updateCharsCounter()

        });

    })
}

function updateCharsCounter() {
    tootSizeCounter.innerText = message.value.length + " / " + tootSize;
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

    chrome.storage.local.get(null, async function (items) {

        const instances = items['instances'];

        if(instances.length < 2){
            selectedInstance.classList.add('hide');
        }else {
            selectedInstanceIndex = await getData('selected_instance_index') || 0;
            selectedInstance.value = selectedInstanceIndex;
        }

        if (items.clipboard != undefined) {

            const clipboard = items.clipboard;

            const draft = clipboard.title +
                "\n\n" + clipboard.textSelection +
                "\n\n" + clipboard.url;

            message.value = draft;
        } else {

            const storedMessage = await getData('message');
            const cwOpen = await getData('cw_is_open');
            const cwValue= await getData('cw');
            const scheduleOpen = await getData('schedule_is_open');
            const scheduleAt = await getData('schedule_at');

            if(scheduleAt != null){
                scheduleChoice.value = scheduleAt;
            }

            if(cwOpen){
                contentWarningPanel.classList.remove('hide');
            }

            if(scheduleOpen){
                schedulePanel.classList.remove('hide');
            }

            if(cwValue?.length != 0){
                contentWarning.value = cwValue;
            }

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

    chrome.storage.local.get(null, async function (items) {
        
        console.log(items);
        loaderIcon.classList.remove('hidden');
        btnToot.disabled = true;

        const instances = items['instances'];

        const instance = instances[selectedInstanceIndex];

        if (instance.accessKey !== '') {


            const api = new MastodonAPI({
                instance: instance.url,
                api_user_token: instance.accessKey
            });

            const finalMessage = message.value;
            const visibility = tootType.value;

            const contentWarningValue = (await getData('cw') || "").trim();

            const scheduledAt = scheduleChoice?.value;

            const request = api.post("statuses", {
                status: finalMessage,
                visibility: visibility,
                sensitive: (contentWarningValue.length > 0),
                spoiler_text: (contentWarningValue.length > 0) ? contentWarningValue : null,
                scheduled_at: scheduledAt
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

    // chrome.storage.local.remove('clipboard', function () {
    //     chrome.action.setBadgeText({
    //         text: ''
    //     });

    //     btnToot.disabled = 'disabled';
    // });

    removeData('message');
    removeData('cw_is_open');
    removeData('cw');
    removeData('schedule_at');

    updateCharsCounter();
}

function showAlert(content, type = 'info') {
    alertContent.innerText = content;
    alert.classList.add('alert-' + type);
    alert.classList.remove('hidden');
}

function hideAlert() {
    alert.classList.add('hidden');
    alert.classList.remove('alert-success alert-danger alert-info alert-warning');
}


$(window).keydown(function (event) {
    if (event.ctrlKey && event.keyCode == 13) {
        toot();
        event.preventDefault();
    }
});

function clearContentWarning(){
    removeData('cw');
    contentWarning.value = '';
}

function saveTabMessage() {
    saveData('message', message.value);
    updateCharsCounter();
}

function saveTabContentWarning() {
    saveData('cw', contentWarning.value.trim());
}

function saveTabSchedule(){
    saveData('schedule_at', scheduleChoice.value);
}

function toggleContentWarningPanel() {
    contentWarningPanel.classList.toggle('hide');

    const isOpen = !contentWarningPanel.classList.contains('hide');
    saveData('cw_is_open', isOpen);
}

function toggleSchedulePanel() {
    schedulePanel.classList.toggle('hide');

    const isOpen = !schedulePanel.classList.contains('hide');
    saveData('schedule_is_open', isOpen);
}

function selectInstance(){
    selectedInstanceIndex = selectedInstance.value;
    saveData('selected_instance_index', selectedInstanceIndex);
}

//Events
btnToot.addEventListener('click', toot);
btnClear.addEventListener('click', clear);
document.addEventListener('DOMContentLoaded', init);
message.addEventListener('keyup', saveTabMessage);
btnContentWarning.addEventListener('click', toggleContentWarningPanel);
btnSchedule.addEventListener('click', toggleSchedulePanel);
contentWarning.addEventListener('keyup', saveTabContentWarning)
btnClearContentWarning.addEventListener('click', clearContentWarning);

scheduleChoice.addEventListener('change', saveTabSchedule);
selectedInstance.addEventListener('change', selectInstance);

setInterval(function () {
    const currentTootSize = message.value.toString().length;

    if (currentTootSize == 0 || currentTootSize > 500) {
        btnToot.disabled = true;
    } else {
        btnToot.disabled = false;
    }
}, 1000);
