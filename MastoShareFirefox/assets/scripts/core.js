var code = window.location.search.match('code=([A-z0-9]{64})');

if(code != null && code.length == 2)
{
	chrome.storage.sync.set({
		mastodon_auth_code: code[1]
	}, function(){
			alert('Fin');
			window.close();
	});
}