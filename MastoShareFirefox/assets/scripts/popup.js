var instanceUrl = '';
var shortner = false;

chrome.storage.sync.get(null, function(items){

	instanceUrl = items.instanceUrl;
	shortner = items.shortner;
	loading_message = items.loading_message;

	document.body.innerText = loading_message;

	//If mastodon instance not configured
	if (instanceUrl == '' || instanceUrl == undefined || instanceUrl == 'https://')
	{
		chrome.tabs.create({url: 'options.html#start'});
	}
	else
	{
		//Get current tab
		chrome.tabs.query({active: true}, function(tabs){

			var tab = tabs[0];
			var message = tab.title + "\n";

			if (shortner)
			{
				getShortUrl(tab.url, function(url){
					message += url;
					sendToMastodon(instanceUrl, message);
				});
			}
			else
			{
				message += tab.url;
				sendToMastodon(instanceUrl, message);
			}
		});
	}

});