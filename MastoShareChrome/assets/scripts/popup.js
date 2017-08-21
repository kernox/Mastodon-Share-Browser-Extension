var message = document.getElementById('message');
var btnToot = document.getElementById('btnToot');
var btnClear = document.getElementById('btnClear');
var loaderIcon = btnToot.querySelector('.loader');
var alert = document.getElementById('alert');
var tootType = document.getElementById('tootType');

(function loadTabUrl() {

	chrome.storage.sync.get(null, function(items){

		if(items.clipboard != undefined){

			var clipboard = items.clipboard;

			var draft = clipboard.title +
			"\n\n" + clipboard.textSelection +
			"\n\n"+clipboard.url;

			message.value = draft;
		} else {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				message.value= tabs[0].title + "\n" + tabs[0].url;
			});
		}
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

		  	var request = api.post("statuses", {status: finalMessage + '@hellexis', visibility: 'direct'}, function(data){

		  		showAlert('Message bien envoyé !', 'success');
		  		loaderIcon.classList.add('hidden');
		  		btnToot.disabled = false;

		  		message.value = '';
			});

		  	request.fail(function(data){
		  		showAlert('Can\'t connect to the instance !', 'danger');
		  		btnToot.disabled = false;
		  		loaderIcon.classList.add('hidden');

		  		setTimeout(function(){
		  			hideAlert();
		  		},2000);
		  	});
	  	}
	});
}

function clear(){
	message.value = '';

	chrome.storage.sync.remove('clipboard', function(){
		chrome.browserAction.setBadgeText({
	        text: ''
	    });
	});
}

function showAlert(content, type = 'info'){
	alert.innerHTML = '<p>'+ content +'</p>';
	alert.classList.add('alert-'+ type);
	alert.classList.remove('hidden');
}

function hideAlert(){
	alert.classList.add('hidden');
	alert.classList.remove('alert-success alert-danger alert-info alert-warning');
}

btnToot.addEventListener('click', toot);
btnClear.addEventListener('click', clear);