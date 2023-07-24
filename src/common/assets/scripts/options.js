let selectedInstance = null;
const btnRemoveInstance = document.getElementById('btnRemoveInstance');

function init() {
    
    loadMessages();
    loadUserInstances();
    // loadInstancesList();
}

function loadMessages(){
    document.title = chrome.i18n.getMessage('settings');
    document.querySelector('label[for="instanceUrl"]').innerText = chrome.i18n.getMessage('instance_url');
    document.querySelector('#options .panel-heading').innerText = chrome.i18n.getMessage('settings');
    document.getElementById('btnConnectInstance').value = chrome.i18n.getMessage('obtain_access_code');
    document.querySelector('label[for="code"]').innerText = chrome.i18n.getMessage('access_code');
    document.querySelector('label[for="accesskey"]').innerText = chrome.i18n.getMessage('access_key');
    document.querySelector('label[for="shortner"]').innerText = chrome.i18n.getMessage('short_url_checkbox');
    document.getElementById('save').value = chrome.i18n.getMessage('save');
}

function loadUserInstances(){    
    
    chrome.storage.sync.get({
        instances: []
    }).then(res => {
        
        if(res['instances'].length > 0){
            
            for(let index in res['instances']){
                
                const instance = res['instances'][index];
                const list = document.getElementById('instancesList');
                const icon = document.createElement('img');
                icon.width = 16;
                icon.height = 16;
                icon.src=`${instance.url}/favicon.ico`;
                icon.style="margin-right: 1em;"
                
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.append(icon);
                
                const a = document.createElement('a');
                a.href="#";
                a.append(instance.url);
                li.append(a);
                li.onclick = () => loadOptions(index, instance);
                
                list.append(li);
            }
            
        } else {
            console.log('No instances');
        }
    })
}

function removeUserInstance(){
    
    chrome.storage.sync.get({
        instances: []
    }, (res) => {
        
        const updatedInstances = res['instances'].filter((instance, index) => {
            if(index != selectedInstance){
                return instance;
            }
        })
        
        chrome.storage.sync.set({
            instances: updatedInstances
        }, () => {
            location.reload();
        })
        
    })
}

function loadInstancesList() {
    /* find all instances known to the browser */
    
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

function loadOptions(index, instance) {
    
    selectedInstance = index;
    
    console.log(selectedInstance);
    
    document.querySelector('#instanceUrl').value = instance.url;
    document.querySelector('#shortner').checked = instance.shortner;
    document.querySelector('#accessKey').value = instance.accessKey;
    document.querySelector('#code').value = instance.code;
}

function saveOptions(e) {
    e.preventDefault();
    
    const instanceUrl = document.querySelector('#instanceUrl').value;
    const code = document.querySelector('#code').value;
    const shortner = document.querySelector('#shortner').checked;
    const accessKeyField = document.getElementById('accessKey');
    let accessKey = null;
    
    
    //Retrieve the access key
    const api = new MastodonAPI({
        instance: instanceUrl,
        api_user_token: ""
    });    
    
    chrome.storage.sync.get(null, function(items){
        
        if (accessKey == null){
            
            api.getAccessTokenFromAuthCode(
                items.mastodon_client_id,
                items.mastodon_client_secret,
                items.mastodon_client_redirect_uri,
                code,
                function(data) {                    
                    
                    //Catch access token
                    accessKey =  data.access_token
                    accessKeyField.value = accessKey;
                    
                    //Load exists instances
                    chrome.storage.sync.get({instances: []}).then(res => {
                        
                        let instances = res['instances'];
                        
                        const instance = {
                            url: instanceUrl,
                            code,
                            shortner,
                            accessKey
                        }
                        
                        //Add the new instance
                        instances.push(instance);
                        
                        chrome.storage.sync.set({
                            instances
                        },() => {
                            location.reload();
                        })
                    })                   
                    
                });
            }
        });

        //TODO: reuse this part of code
        // var status = document.querySelector('#status');    
        
        //     status.classList.remove('hide');
        //     status.innerText = chrome.i18n.getMessage('options_saved');
        //     document.querySelector('#startInfo').classList.add('hide');
        
        //     setTimeout(function() {
        //         status.classList.add('hide');
        //     }, 2000);
        
        //  document.querySelector('#accessKey').value = data.access_token;
        
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
    btnRemoveInstance.addEventListener('click', removeUserInstance);