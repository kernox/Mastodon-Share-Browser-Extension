var app = new Vue({
    el: '#app',
    data: {
        labels: {
            instanceUrl: chrome.i18n.getMessage('instance_url'),
            settings: chrome.i18n.getMessage('settings'),
            obtainAccessCode: chrome.i18n.getMessage('obtain_access_code'),
            accessCode: chrome.i18n.getMessage('access_code'),
            accessKey: chrome.i18n.getMessage('access_key'),
            shortUrlCheckbox: chrome.i18n.getMessage('short_url_checkbox'),
            tootMaxSize: chrome.i18n.getMessage('toot_max_size'),
            defaultDisclaimer: chrome.i18n.getMessage('default_disclaimer'),
            save: chrome.i18n.getMessage('save'),
            optionsSaved: chrome.i18n.getMessage('options_saved')
        },
        api: null,
        instanceUrl : "",
        accessKey: "",
        accessCode: "",
        defaultDisclaimer,
        shortner: false
    },
    mounted: function(){
        this.loadOptions();
        // console.log(chrome.storage.sync.get({
        //     instanceUrl: ''
        // }));
    },
    methods: {
        create: function() {
            console.log('start');
        },
        connectInstance: function(){
            chrome.storage.sync.set({
                accessKey: ''
            }, function(){
                this.accessKey = '';
                this.accessCode = 'nop';
            });   
        
            this.api = new MastodonAPI({
                instance: this.instanceUrl,
                api_user_token: ""
            });
        
            this.openAuthDialog();
        },
        openAuthDialog: function() {
            var that = this;
            //We do not have user token, need to register the app
            this.api.registerApplication("Mastodon Share", 'urn:ietf:wg:oauth:2.0:oob', ['read', 'write'],'', function(data) {

                //Save client id, secret and redirect uri
                chrome.storage.sync.set({
                    "mastodon_client_id": data["client_id"],
                    "mastodon_client_secret": data["client_secret"],
                    "mastodon_client_redirect_uri": data['redirect_uri']
                });

                //Generate the authorization link
                var authorization = that.api.generateAuthLink(data["client_id"],
                    'urn:ietf:wg:oauth:2.0:oob',
                    "code",
                    ["read", "write"]
                );

                //Open the authentification window
                chrome.tabs.create({url: authorization});
            });

            console.log(this.api);
        },
        loadOptions: function(){
            console.log('Loading options...');
            chrome.storage.sync.get({
                instanceUrl: '',
                shortner: false,
                accessKey: '',
                code: '',
                tootMaxSize: 500,
                defaultDisclaimer: ''
            }, function(items) {
                this.instanceUrl = items.instanceUrl;
                this.shortner = items.shortner;
                this.accessKey = items.accessKey;
                this.code = items.code;
                this.tootMaxSize = items.tootMaxSize;
                this.defaultDisclaimer = items.defaultDisclaimer;
            });
        },
        saveOptions: function() {

            var that = this;

            var status = document.querySelector('#status');

            chrome.storage.sync.set({
                instanceUrl: instanceUrl,
                shortner: this.useShortner,
                code: this.accessCode,
                tootMaxSize: this.tootMaxSize,
                defaultDisclaimer: this.defaultDisclaimer
            }, function() {

                status.classList.remove('hide');
                that.status = that.labels.optionsSaved;
                document.querySelector('#startInfo').classList.add('hide');

                setTimeout(function() {
                    status.classList.add('hide');
                }, 2000);

                that.api = new MastodonAPI({
                    instance: that.instanceUrl,
                    api_user_token: ""
                });

                chrome.storage.sync.get(null, function(items){

                    if (items.accessKey === ''){

                        console.log(items);

                        api.getAccessTokenFromAuthCode(
                            items.mastodon_client_id,
                            items.mastodon_client_secret,
                            items.mastodon_client_redirect_uri,
                            items.code,
                            function(data) {
                                chrome.storage.sync.set({
                                    accessKey: data.access_token
                                }, function(){
                                    this.accessKey = data.access_token;
                                });
                            }
                        );
                    }
                });
            });
        }
    }
});



/*


function init() {

	loadMessages();
	loadOptions();
    //loadInstancesList();
}

function loadInstancesList() {
	// find all instances known to the browser

    //@if ENV='chrome'
    //var browser = chrome;
    //var browser = new ChromePromise();
    //@endif

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
    	// none configured, pick the first one with a user session
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
*/
