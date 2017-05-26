var stream = document.querySelector('#stream-items-id');

stream.addEventListener('click', addMenu);

function addMenu(event){

	var that = event.target;

	if(that.className.match('ProfileTweet-actionButton'))
	{
		var menu = document.createElement('li');
		menu.className='share-via-mastodon';
		menu.dataset.nav = 'share_tweet_dm';
		menu.setAttribute('role', 'presentation');
		menu.addEventListener('click', shareViaMastodon);

		var button = document.createElement('button');
		button.type = 'button';
		button.className ='dropdown-link';
		button.setAttribute('role', 'menuitem');
		button.innerHTML = 'Partager via Mastodon';

		menu.appendChild(button);

		var menu_action = that.parentNode.parentNode.parentNode.querySelector('ul');
		var firstElementOfMenu = menu_action.firstElementChild;

		if(firstElementOfMenu.className!=menu.className)
			menu_action.insertBefore(menu, firstElementOfMenu);
	}

	return false;
}

function shareViaMastodon(event){

	var tweetDIV = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
	var author_fullname = tweetDIV.dataset.name;
	var author_username = tweetDIV.dataset.screenName;
	var permalink = 'https://twitter.com'+tweetDIV.dataset.permalinkPath;
	var tweet = tweetDIV.querySelector('.tweet-text').innerText;


	chrome.storage.sync.get(null, function(items){

		if(items.shortner)
		{
			getShortUrl(permalink, function(url){
				var message = author_fullname + "  @" + author_username + "\n" + tweet + "\n\n" + url;
				sendToMastodonFromTwitter(instanceUrl, message);
			});
		}
		else
		{
			var message = author_fullname + "  @" + author_username + "\n" + tweet + "\n\n" + permalink;
			instanceUrl = items.instanceUrl;
			sendToMastodonFromTwitter(instanceUrl, message);
		}

	});

}