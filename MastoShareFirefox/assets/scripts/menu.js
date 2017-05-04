chrome.storage.sync.get(null, function(items){

	if(items.share_selection != undefined)
	{
		chrome.contextMenus.create({
			title: items.share_selection,
			contexts: ["selection"],
			onclick: function(){
				chrome.tabs.executeScript( {
					code: "window.getSelection().toString();"
				}, function(selection) {

					chrome.tabs.query({active: true}, function(tabs){
						currentUrl = tabs[0].url;
					});

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
			}
		});
	}
});