
var message = document.getElementById('message');
var btnToot = document.getElementById('btnToot');

(function loadTabUrl() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		message.value= tabs[0].title + "\n" + tabs[0].url;
	});
})();

function toot(){
	chrome.storage.sync.get(null, function(items) {

	  	if(items.accessKey !=='') {

		  	var api = new MastodonAPI({
	            instance: items.instanceUrl,
	            api_user_token: items.accessKey
	        });

	        var finalMessage = message.value;

		  	api.post("statuses", {status: finalMessage}, function (data) {
		  		console.log(data);
		  	});
	  	}
	});
}

btnToot.addEventListener('click', toot);