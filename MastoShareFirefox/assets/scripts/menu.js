chrome.contextMenus.create({
	title: "Partager la séléction sur Mastodon",
	contexts: ["selection"],
	onclick: function(){
		chrome.tabs.executeScript( {
			code: "window.getSelection().toString();"
		}, function(selection) {

			chrome.tabs.query({active: true}, function(tabs){
				currentUrl = tabs[0].url;
			});

			chrome.storage.sync.get(null, function(items){

				var instanceUrl = items.instanceUrl;

				if(items.shortner)
				{
					getShortUrl(currentUrl, function(url){
						sendToMastodon(instanceUrl, selection + "\n\n" + url);
					});
				}
				else
				{
					sendToMastodon(instanceUrl, selection + "\n\n" + currentUrl);
				}

			});

		});
	}
});