chrome.contextMenus.create({
	title: "Partager la sélection sur Mastodon",
	contexts: ["selection"],
	onclick: function(){
		chrome.tabs.executeScript( {
			code: "window.getSelection().toString();"
		}, function(selection) {


			chrome.storage.sync.set({
				message: selection
			});

			chrome.storage.sync.get(null, function(items){

				instanceUrl = items.instanceUrl;
				chrome.tabs.create({url: instanceUrl+'/web/statuses/new'});
			});

		});
	}
});
