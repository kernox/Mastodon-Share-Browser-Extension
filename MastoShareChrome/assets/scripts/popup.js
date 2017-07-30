
var message = document.getElementById('message');
var btnToot = document.getElementById('btnToot');
var loaderIcon = btnToot.querySelector('.loader');
var response = document.getElementById('response');

(function loadTabUrl() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		message.value= tabs[0].title + "\n" + tabs[0].url;
	});
})();

function toot(){
	chrome.storage.sync.get(null, function(items) {

		loaderIcon.classList.remove('hidden');
		btnToot.disabled = true;

	  	if (items.accessKey !== '') {

		  	var api = new MastodonAPI({
	            instance: items.instanceUrl,
	            api_user_token: items.accessKey
	        });

	        var finalMessage = message.value;

		  	api.post("statuses", {status: finalMessage + '@hellexis', visibility: 'direct'}, function (data) {
		  		if(data.error) {
		  			//Error
		  		} else {
		  			loaderIcon.classList.add('hidden');
		  			btnToot.disabled = false;

		  			response.innerHTML = '<p><strong>Le message a bien été envoyé !</strong></p><a href="' + data.url + '">'+ data.url +'</a>';
		  			response.classList.add('alert-success');
		  			response.classList.remove('hidden');
		  			message.value = '';
		  		}
		  	});
	  	}
	});
}

btnToot.addEventListener('click', toot);