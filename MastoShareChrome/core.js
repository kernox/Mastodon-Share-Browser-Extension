var instanceUrl = '';
var message = '';

chrome.storage.sync.get(null, function(items){
	instanceUrl = items.instanceUrl;
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


console.log('debug:',chrome.contextMenu);
/*chrome.contextMenus.create({
 title: "Envoyer la séléction à Mastodon",
 contexts:["selection"],  // ContextType
 onclick: function(){
 	alert('test');
 }
});*/