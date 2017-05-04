function getShortUrl(url, callback)
{
	$.post('https://frama.link/a', {format:"json", lsturl: url}, function(data){
		if(data.success)
		{
			return callback(data.short);
		}
	});
}

function sendToMastodon(instanceUrl, message){
	chrome.storage.sync.set({message: message});
	chrome.tabs.create({url: instanceUrl+'/web/statuses/new'});
}