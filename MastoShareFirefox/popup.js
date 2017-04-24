var instanceUrl = '';
var message = '';
var url = '';

browser.tabs.query({active: true}, function(tabs){
	message = tabs[0].url;
	browser.storage.sync.set({message: message});
});

browser.storage.sync.get(null, function(items){

	shortner = items.shortner;
	if (items.instanceUrl == undefined || items.instanceUrl == '')
	{
		url = browser.extension.getURL("options.html");
		browser.tabs.create({url: url});
	}
	else
	{
		url = items.instanceUrl + '/web/statuses/new';

		if (shortner)
		{
			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'https://frama.link/a', true);
			xhr.onreadystatechange = function(event){
				if (this.readyState === XMLHttpRequest.DONE)
				{
					if (this.status === 200)
					{
						console.log("Réponse reçu: %s", this.responseText);
						var data = JSON.parse(this.responseText);

						if(data.success == true)
						{
							chrome.storage.sync.set({
								message: data.short
							});
							browser.tabs.create({url: url});
							window.close();
						}
					}
					else
					{
						console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
					}
				}
			};

			var params = new FormData();
			params.append('lsturl', message);
			params.append('format', 'json');

			xhr.send(params);
		}
		else
		{
			browser.tabs.create({url: url});
			window.close();
		}
	}
});
