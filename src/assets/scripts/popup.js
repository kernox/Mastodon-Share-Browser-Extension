var message = document.getElementById('message');
var btnToot = document.getElementById('btnToot');
var btnPicture = document.getElementById('btnPicture');
var disclaimer = document.getElementById('disclaimer');
var btnClear = document.getElementById('btnClear');
var loaderIcon = btnToot.querySelector('.loader');
var alert = document.getElementById('alert');
var tootType = document.getElementById('tootType');
var tootSize = 500;
var uploader = document.getElementById('uploader');
var pictures = document.getElementById('pictures');

var successMessage = '';

function init(){
    loadMessages();
    loadOptions();
};

function loadMessages(){
    successMessage = chrome.i18n.getMessage('success');

    document.getElementById('btnClear').innerText= chrome.i18n.getMessage('clear');
    document.getElementById('btnToot').innerText= chrome.i18n.getMessage('toot');

    tootType.querySelector('option[value="public"]').text =  chrome.i18n.getMessage('public');
    tootType.querySelector('option[value="direct"]').text =  chrome.i18n.getMessage('direct');
    tootType.querySelector('option[value="private"]').text =  chrome.i18n.getMessage('private');
    tootType.querySelector('option[value="unlisted"]').text =  chrome.i18n.getMessage('unlisted');
}

function loadOptions(){
    chrome.storage.sync.get({
        defaultDisclaimer: '',
        tootMaxSize: 500
    }, function(items){
        document.getElementById('disclaimer').value = items.defaultDisclaimer;
        document.getElementById('message').maxLength = items.tootMaxSize;
    });
}

(function loadTabUrl() {

    chrome.storage.sync.get(null, function(items){

        if(items.clipboard != undefined){

            var clipboard = items.clipboard;

            var draft = clipboard.title +
            "\n\n" + clipboard.textSelection +
            "\n\n"+clipboard.url;

            message.value = draft;
        } else {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                message.value= tabs[0].title + "\n" + tabs[0].url;
                // extract page keywords to use as hashtags
                chrome.tabs.executeScript( {
                    code: "var kw = document.querySelector('meta[name=keywords]'); var keywords = kw.getAttribute('content'); keywords;"
                }, function(keywords) {
                    if (!keywords[0])
                        return;
                    // TODO: sanitize better
                    message.value += "\n\n" + keywords[0].split(',').map(function (e) {return e ? '#' + e.trim().replace(' ', '_').replace("'", '') : '';}).join(' ');
                });
            });
        }
    });

})();

function uploadPictures(){

    btnPicture.querySelector('.icon').style.display = 'none';
    btnPicture.querySelector('.loader').classList.remove('hidden');

    var files = uploader.files;

    for(var i=0; i< files.length; i++){

        var data = new FormData();
        data.append('file', files[i]);

        chrome.storage.sync.get(null, function(items) {
            var api = new MastodonAPI({
                instance: items.instanceUrl,
                api_user_token: items.accessKey
            });

            api.postMedia("media", data, function(response){
                btnPicture.querySelector('.icon').style.display = '';
                btnPicture.querySelector('.loader').classList.add('hidden');

                var image = document.createElement('img');
                image.src = response.preview_url;

                var item = document.createElement('li');
                item.appendChild(image);

                pictures.append(item);
            });
        });
    }
}

function toot(){
    chrome.storage.sync.get(null, function(items) {

        loaderIcon.classList.remove('hidden');
        btnToot.disabled = true;

        if (items.accessKey !== '') {


            var api = new MastodonAPI({
                instance: items.instanceUrl,
                api_user_token: items.accessKey
            });
            var finalMessage = message.value;
            var visibility = tootType.value;
            var spoilerText = disclaimer.value;

            var request = api.post("statuses", {
                status: finalMessage,
                visibility: visibility,
                spoiler_text: spoilerText

            }, function(data){

                showAlert(successMessage, 'success');
                loaderIcon.classList.add('hidden');
                btnToot.disabled = false;

                message.value = '';
            });

            request.fail(function(data){
                showAlert('Can\'t connect to the instance !', 'danger');
                btnToot.disabled = false;
                loaderIcon.classList.add('hidden');

                setTimeout(function(){
                    hideAlert();
                },2000);
            });
        }
    });
}

function clear(){
    message.value = '';

    chrome.storage.sync.remove('clipboard', function(){
        chrome.browserAction.setBadgeText({
            text: ''
        });

        btnToot.disabled='disabled';
    });
}

function showAlert(content, type = 'info'){
    alert.innerHTML = '<p>'+ content +'</p>';
    alert.classList.add('alert-'+ type);
    alert.classList.remove('hidden');
}

function hideAlert(){
    alert.classList.add('hidden');
    alert.classList.remove('alert-success alert-danger alert-info alert-warning');
}

btnToot.addEventListener('click', toot);

$(window).keydown(function(event) {
  if(event.ctrlKey && event.keyCode == 13) { 
    toot();
    event.preventDefault(); 
  }
});

btnClear.addEventListener('click', clear);
document.addEventListener('DOMContentLoaded', init);
// btnPicture.addEventListener('click', addPicture);
uploader.addEventListener('change', uploadPictures);

setInterval(function(){
    var currentTootSize = message.value.toString().length;

    if( currentTootSize == 0 || currentTootSize > 500){
        btnToot.disabled = true;
    } else {
        btnToot.disabled = false;
    }
},1000);
