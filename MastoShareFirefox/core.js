var instanceUrl = '';
var message = '';

browser.storage.sync.get(null , function(items){

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
				browser.storage.sync.set({ message: ''});
			}
		}
	}
});