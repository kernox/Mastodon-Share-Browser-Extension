var instanceUrl = '';
var finalUrl = '';
var shortner = false;
chrome.storage.sync.get('instanceUrl', function(items){
	instanceUrl = items.instanceUrl;

	if(instanceUrl == '' || instanceUrl == undefined)
		window.open('options.html');
});

chrome.storage.sync.get('shortner', function(items){

	shortner = items.shortner;

	chrome.tabs.getSelected(null, function(tab) {

		if(shortner)
		{
			$.post('https://frama.link/a', {format:"json", lsturl: tab.url}, function(data){
				if(data.success)
				{
					chrome.storage.sync.set({
				    	message: data.short
					});
				}

				window.open(instanceUrl);
			});

		}
		else
		{
			chrome.storage.sync.set({
		    	message: tab.url
			});

			window.open(instanceUrl);
		}
	});
});

