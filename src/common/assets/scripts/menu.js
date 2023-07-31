//Will be fixed in future version
// chrome.storage.local.get(null, function(items){
// 	createMenuItem(items);
// });

// function createMenuItem(items){
// 	chrome.contextMenus.create({
// 		title: chrome.i18n.getMessage('share_selection'),
// 		contexts: ["selection"],
// 		onclick: shareSelection
// 	});
// }

// function shareSelection() {

// 	chrome.tabs.executeScript( {
// 		code: "window.getSelection().toString();"
// 	}, function(selection) {
// 		chrome.tabs.query({active: true}, function(tabs) {

// 			//Save title and selection
// 			chrome.storage.local.set({
// 				clipboard: {
// 					title: tabs[0].title,
// 					url: tabs[0].url,
// 					textSelection: selection
// 				}
// 			}, function(){
// 				chrome.action.setBadgeText({
// 					text: "*"
// 				});
// 			});
// 		});
// 	});
// }