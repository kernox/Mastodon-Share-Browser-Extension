var instanceUrl = '';
var message = '';

chrome.storage.sync.get(null, function(items){

	if(items)
	{
		instanceUrl = items.instanceUrl;
		message = items.message;

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