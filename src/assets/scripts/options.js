function init() {
    getJSON('assets/locales/locales.json', function(list){

        for(id in list)
        {
            var option = document.createElement('option');
            option.value=id;
            option.innerText = list[id];

            document.querySelector('#language').appendChild(option);
        }
    });

    if(document.location.hash == '#start'){
        document.querySelector('#startInfo').classList.remove('hide');
    }

    loadOptions();
}

function loadInstancesList() {
    /* find all instances known to the browser */

    // @if ENV='chrome'
    var browser = new ChromePromise();
    // @endif

    browser.cookies.getAll({name: "_mastodon_session"}).then((cookies) => {

        const mastodonList = document.querySelector("#instanceUrlList");
        const mastodonInput = document.querySelector("#instanceUrl");
        var mastodonInstances = [];

        for (let cookie of cookies) {
            let url = (cookie.secure ? "https://" : "http://") + cookie.domain;
            mastodonInstances.push(url);
            let option = document.createElement("option");
            option.setAttribute("value", url);
            mastodonList.appendChild(option);
        }

        if (mastodonInput.value.length)
            return;
        /* none configured, pick the first one with a user session */
        browser.cookies.getAll({name: "remember_user_token"}).then((cookies) => {
            for (let cookie of cookies) {
                let url = (cookie.secure ? "https://" : "http://") + cookie.domain;
                if (mastodonInstances.includes(url)) {
                    mastodonInput.value = url;
                    return;
                }
            }
        });
    });
}

function loadOptions() {
    chrome.storage.sync.get({
        instanceUrl: '',
        shortner: false,
        language: 'fr',
        accessKey: '',
        code: ''
    }, function(items) {
        document.querySelector('#instanceUrl').value = items.instanceUrl;
        document.querySelector('#shortner').checked = items.shortner;
        document.querySelector('#accessKey').value = items.accessKey;
        document.querySelector('#code').value = items.code;
        document.querySelector('#accessKey').value = items.accessKey;

        var lang = items.language;

        loadInstancesList();

        loadLocale(lang);
        document.querySelector('#language').value = lang;
    });
}

function saveOptions(e) {
    e.preventDefault();

    var status = document.querySelector('#status');

    chrome.storage.sync.set({
        instanceUrl: document.querySelector('#instanceUrl').value,
        shortner: document.querySelector('#shortner').checked,
        language: document.querySelector('#language').value,
        code: document.querySelector('#code').value
    }, function() {

        status.classList.remove('hide');
        document.querySelector('#startInfo').classList.add('hide');

        setTimeout(function() {
            status.classList.add('hide');
        }, 1000);

        var api = new MastodonAPI({
            instance: instanceUrl.value,
            api_user_token: ""
        });

        chrome.storage.sync.get(null, function(items){

            if (items.accessKey === ''){

                api.getAccessTokenFromAuthCode(
                    items.mastodon_client_id,
                    items.mastodon_client_secret,
                    items.mastodon_client_redirect_uri,
                    items.code,
                    function(data) {
                        chrome.storage.sync.set({
                            accessKey: data.access_token
                        }, function(){
                            document.querySelector('#accessKey').value = data.access_token;
                        });
                    }
                );
            }
        });

        var lang = document.querySelector('#language').value;
        loadLocale(lang);
    });
}

function connectInstance(){

    chrome.storage.sync.set({
        accessKey: ''
    }, function(){
        document.querySelector('#accessKey').value='';
        document.querySelector('#code').value='';
    });

    var instanceUrl = document.getElementById('instanceUrl').value;

    var api = new MastodonAPI({
        instance: instanceUrl,
        api_user_token: ""
    });

    openAuthDialog(api);
}


function openAuthDialog(api){
    //We do not have user token, need to register the app
    api.registerApplication("Mastodon Share", 'urn:ietf:wg:oauth:2.0:oob', ['read', 'write'],'', function(data) {

        //Save client id, secret and redirect uri
        chrome.storage.sync.set({
            "mastodon_client_id": data["client_id"],
            "mastodon_client_secret": data["client_secret"],
            "mastodon_client_redirect_uri": data['redirect_uri']
        });

        //Generate the authorization link
        var authorization = api.generateAuthLink(data["client_id"],
            'urn:ietf:wg:oauth:2.0:oob',
            "code",
            ["read", "write"]
        );

        //Open the authentification window
        chrome.tabs.create({url: authorization});
    });
}

document.addEventListener('DOMContentLoaded', init);
document.querySelector('#options').addEventListener('submit', saveOptions);
document.getElementById('btnConnectInstance').addEventListener('click', connectInstance);
