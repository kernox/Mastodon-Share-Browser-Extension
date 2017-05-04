$('#stream-items-id').delegate('.ProfileTweet-action', 'click', function(){
	$('.share-via-mastodon').remove();

	$('li.share-via-dm').before(
		'<li class="share-via-mastodon" data-nav="share_tweet_dm" role="presentation">'+
			'<button type="button" class="dropdown-link" role="menuitem">Partager via Mastodon</button>'+
			'</li>'
	);

	$('.share-via-mastodon button').on('click', function(){
		var content = $(this).parents('.tweet');
		var author_fullname = content.data('name');
		var author_username = '@'+content.data('screen-name');
		var permalink = 'https://twitter.com'+content.data('permalink-path');
		var tweet = content.find('.tweet-text').text();


		chrome.storage.sync.get(null, function(items){
			instanceUrl = items.instanceUrl;
			var message = author_fullname + "  " + author_username + "\n" + tweet + "\n\n" + permalink;
			sendToMastodonFromTwitter(instanceUrl, message);
		});

	})
});