var instanceUrl = '';
var message = '';

browser.storage.sync.get('instanceUrl', function(items){
	console.log(items);
	instanceUrl = items.instanceUrl;
});

browser.storage.sync.get('message', function(items){
	message = items.message;

	if(document.location.href.match('^'+instanceUrl))
	{
		var field = document.querySelector('.autosuggest-textarea__textarea');
		if(field != undefined)
		{
			field.value = message;

			browser.storage.sync.set({
		    	message: ''
			});
		}
	}

});

