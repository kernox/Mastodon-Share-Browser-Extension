function getShortUrl(url, callback)
{
	post('https://frama.link/a', {format: 'json', lsturl: url}, 'json', function(data){

		if(data.success)
			return callback(data.short);
	});
}


function sendToMastodon(instanceUrl, message){
	chrome.storage.sync.set({message: message});
	chrome.tabs.create({url: instanceUrl+'/web/statuses/new'});
}

function sendToMastodonFromTwitter(instanceUrl, message){
	chrome.storage.sync.set({message: message});
	window.open(instanceUrl+'/web/statuses/new');
}

function loadLocale(code){

	getJSON('assets/locales/' + code + '.json', function(lang){
		document.querySelector('#startInfo').innerHTML= lang.start_info;
		document.querySelector('#status').innerHTML=lang.options_saved;
		document.querySelector('#options .panel-heading').innerHTML=lang.settings;
		document.querySelector('label[for="instanceUrl"]').innerHTML=lang.instance_url;
		document.querySelector('label[for="shortner"]').innerHTML=lang.short_url_checkbox;
		document.querySelector('label[for="language"]').innerHTML=lang.language;
		document.querySelector('#instanceUrlHelp').innerHTML=lang.url_form_needed;
		document.querySelector('#save').value = lang.save;

		chrome.storage.sync.set({
			loading_message: lang.mastodon_instance_opening.split(' ').join('&nbsp;'),
			share_selection: lang.share_selection
		});
	});
}

function getJSON(url, callback)
{
	return ajax('GET', url, null, 'json', callback);
}

function post(url, data, type, callback)
{
	return ajax('POST', url, data, type, callback);
}

function ajax(method, url, data, type, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.overrideMimeType('application/json');

	xhr.onload = function(){
		if(xhr.status >= 200 && xhr.status < 400)
		{
			if(type == 'json')
				var response = JSON.parse(xhr.responseText);
			else
				var response = xhr.responseText;

			return callback(response);
		}
		else
		{
			console.log('erf');
		}
	}

	if(data!=null)
	{
		var formData = new FormData();

		for ( var key in data ) {
	    	formData.append(key, data[key]);
		}

		xhr.send(formData);
	}
	else
	{
		xhr.send();
	}

}