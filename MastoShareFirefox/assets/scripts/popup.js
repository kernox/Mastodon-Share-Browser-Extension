
var instance = 'https://framapiaf.org';

var api = new MastodonAPI({
    instance: instance,
    api_user_token: ""
});

function run(){

    chrome.storage.sync.get(null, function(items) {
        if(items.api_user_token){
            testAccessToken(items.api_user_token);
        }else if(items.mastodon_auth_code){
            getUserAccessToken(items);
        }else{
            openAuthDialog();
        }

    });
}

function openAuthDialog(){
    //We do not have user token, need to register the app
    api.registerApplication("Mastodon Share", instance, ['read', 'write'],'', function(data) {

        //Save id, secret and redirect_uri
        chrome.storage.sync.set({
            "mastodon_client_id": data["client_id"],
            "mastodon_client_secret": data["client_secret"],
            "mastodon_client_redirect_uri": data["redirect_uri"]
        });

        //Generate the authorization link
        var authorization = api.generateAuthLink(data["client_id"],
            data['redirect_uri'],
            "code",
            ["read", "write"]
            );

        //Open the authentification window
        chrome.tabs.create({url: authorization});
        window.close();
    });
}

function getUserAccessToken(items) {

    api.getAccessTokenFromAuthCode(
        items.mastodon_client_id,
        items.mastodon_client_secret,
        items.mastodon_client_redirect_uri,
        items.mastodon_auth_code,
        function(data) {

            //Save the user access token for future uses and remove the mastodon auth code
            chrome.storage.sync.set({
                //mastodon_auth_code: null,
                api_user_token: data.access_token
            }, function(){
                run();
            });
        }
    );
}

function testAccessToken(token){
    api.setConfig("api_user_token", token);

    api.get('accounts/verify_credentials', function(data){
            console.log(data);
            if(data.username){

            } else {
                run();
            }
    });

}

function toot() {

}

run();