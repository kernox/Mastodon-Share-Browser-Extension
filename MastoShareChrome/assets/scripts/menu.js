chrome.storage.sync.get(null, function(items){
	createMenuItem(items);
});

function createMenuItem(items){
	chrome.contextMenus.create({
		title: "Partager",
		contexts: ["selection"],
		onclick: shareSelection
	});
}

function shareSelection() {

	chrome.tabs.executeScript( {
		code: "window.getSelection().toString();"
	}, function(selection) {
		chrome.tabs.query({active: true}, function(tabs) {

			//Save title and selection
			chrome.storage.sync.set({
				clipboard: {
					title: tabs[0].title,
					url: tabs[0].url,
					textSelection: selection
				}
			}, function(){
				chrome.browserAction.setBadgeText({
					text: 'S'
				});
			});
		});

	});
}