console.log('Selection menu')

function createMenuItem(){
	
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		
		const currentTab = tabs[0];
		const tabId = currentTab.id;		
		
		chrome.contextMenus.create({
			id: 'mastodon-share-selection_' + tabId,
			title: chrome.i18n.getMessage('share_selection'),
			contexts: ["selection"]
		});
		
	})
}

createMenuItem();

function getSelection(){
	return window.getSelection().toString();
}

function shareSelection() {
	
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		
		const currentTab = tabs[0];
		const tabId = currentTab.id;	
		
		chrome.scripting.executeScript({
			target: {tabId},
			func: getSelection
		}).then(selection => {

			//Save title and selection
			chrome.storage.sync.set({
				clipboard: {
					title: tabs[0].title,
					url: tabs[0].url,
					textSelection: selection[0].result
				}
			}, function(){
				chrome.action.setBadgeText({
					text: "*"
				});
			});
			
		});
	})
}

chrome.contextMenus.onClicked.addListener(shareSelection);