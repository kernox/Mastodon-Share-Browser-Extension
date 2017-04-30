var instanceUrl = '';
var shortner = false;

chrome.storage.sync.get(null, function(items){

	instanceUrl = items.instanceUrl;
	shortner = items.shortner;

	//If mastodon instance not configured
	if (instanceUrl == '' || instanceUrl == undefined || instanceUrl == 'https://')
	{
		window.open('options.html#start');
	}
	else
	{
		//Get current tab
		chrome.tabs.getSelected(null, function(tab) {

			if (shortner)
			{
				//Use the url shortner
				$.post('https://frama.link/a', {format:"json", lsturl: tab.url}, function(data){

					if(data.success)
					{
						chrome.storage.sync.set({
							message: data.short
						});
					}

					window.open(instanceUrl+'/web/statuses/new');
				});

			}
			else
			{
				chrome.storage.sync.set({
					message: tab.url
				});

				window.open(instanceUrl+'/web/statuses/new');
			}
		});
	}
});

