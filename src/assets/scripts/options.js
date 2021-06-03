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
        defaultDisclaimer: "",
        shortner: false,
        showStatus: false,
        status: "",
        tootMaxSize: 800
    },
    mounted: function(){
        this.loadOptions();
    },
    methods: {
        connectInstance: function(){
            chrome.storage.sync.set({
                accessKey: ''
            }, function(){
                this.accessKey = '';
                this.accessCode = '';
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
        },
        loadOptions: function(){
            console.log('Loading options...');

            var that = this;

            chrome.storage.sync.get({
                instanceUrl: '',
                shortner: false,
                accessKey: '',
                code: '',
                tootMaxSize: 500,
                defaultDisclaimer: ''
            }, function(items) {

                that.instanceUrl = items.instanceUrl;
                that.shortner = items.shortner;
                that.accessKey = items.accessKey;
                that.accessCode = items.code;
                that.tootMaxSize = items.tootMaxSize;
                that.defaultDisclaimer = items.defaultDisclaimer;
            });
        },
        saveOptions: function() {

            var that = this;

            chrome.storage.sync.set({
                instanceUrl: this.instanceUrl,
                shortner: this.useShortner,
                code: this.accessCode,
                tootMaxSize: this.tootMaxSize,
                defaultDisclaimer: this.defaultDisclaimer
            }, function() {

                that.showStatus = true;
                that.status = that.labels.optionsSaved;
                that.showStartInfo = false;

                setTimeout(function() {
                    that.showStatus = false;
                }, 2000);

                that.api = new MastodonAPI({
                    instance: that.instanceUrl,
                    api_user_token: ""
                });

                chrome.storage.sync.get(null, function(items){

                    if (items.accessKey === ''){

                        that.api.getAccessTokenFromAuthCode(
                            items.mastodon_client_id,
                            items.mastodon_client_secret,
                            items.mastodon_client_redirect_uri,
                            items.code,
                            function(data) {
                                
                                chrome.storage.sync.set({
                                    accessKey: data.accessKey
                                }, function(){
                                    that.accessKey = data.accessKey;
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
