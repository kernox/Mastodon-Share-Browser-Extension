function getShortUrl(url, callback)
{
	$.post('https://frama.link/a', {format:"json", lsturl: url}, function(data){
		if(data.success)
		{
			return callback(data.short);
		}
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
	$.get('assets/locales/' + code + '.json', function(data){
		var lang = JSON.parse(data);

		//Apply translation
		$('#startInfo').html(lang.start_info);
		$('#status').html(lang.options_saved);
		$('#options .panel-heading').html(lang.settings);
		$('label[for="instanceUrl"]').html(lang.instance_url);
		$('label[for="shortner"]').html(lang.short_url_checkbox);
		$('label[for="language"]').html(lang.language);
		$('#instanceUrlHelp').html(lang.url_form_needed);
		$('#save').val(lang.save);

		chrome.storage.sync.set({
			loading_message: lang.mastodon_instance_opening.split(' ').join('&nbsp;'),
			share_selection: lang.share_selection
		});

	});
}