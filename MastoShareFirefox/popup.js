var instanceUrl = '';

var message = '';
browser.tabs.query({active: true}, function(tabs){
	browser.storage.sync.set({
	    message: tabs[0].url
	});
});

browser.storage.sync.get('instanceUrl', function(items){

	if(items.instanceUrl == undefined || items.instanceUrl == '')
	{
		var options_url = browser.extension.getURL("options.html");
		browser.tabs.create({url: options_url});
	}
	else
	{
		browser.tabs.create({url: items.instanceUrl + '/web/statuses/new'});
	}

	window.close();

});