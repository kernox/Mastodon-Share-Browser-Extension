var instanceUrl = '';
var message = '';
var url = '';

chrome.tabs.query({active: true}, function(tabs){
	url = tabs[0].url;
	chrome.storage.sync.get(null, function(items){
		var shortner = items.shortner;

		if (items.instanceUrl == undefined || items.instanceUrl == '')
		{
			url = chrome.extension.getURL("options.html");
			chrome.tabs.create({url: url});
		}
		else
		{
			instanceUrl = items.instanceUrl;

			if(shortner)
			{
				getShortUrl(url, function(url){
					sendToMastodon(instanceUrl, url);
					window.close();
				});
			}
			else
			{
				sendToMastodon(instanceUrl, url)
				window.close();
			}
		}
	});
});
