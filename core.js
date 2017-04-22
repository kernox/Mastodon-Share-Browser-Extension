var instanceUrl = '';
var message = '';

chrome.storage.sync.get('instanceUrl', function(items){
	instanceUrl = items.instanceUrl;
});

chrome.storage.sync.get('message', function(items){
	message = items.message;

	if(document.location.href.match('^'+instanceUrl))
	{
		var field = document.querySelector('.autosuggest-textarea__textarea');
		if(field != undefined)
		{
			field.value = message;

			chrome.storage.sync.set({
		    message: ''
			});
		}
	}

});