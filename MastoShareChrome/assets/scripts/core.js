chrome.storage.sync.get(null, function(items){

	if(items)
	{
		var instanceUrl = items.instanceUrl;
		var message = items.message;

		if(document.location.href.match('^'+instanceUrl))
		{
			var field = document.querySelector('textarea.autosuggest-textarea__textarea');
			if(field != undefined)
			{
				field.value = message;
				chrome.storage.sync.set({message: ''});
			}
		}
	}
});