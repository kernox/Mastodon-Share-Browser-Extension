var stream = document.querySelector('#stream-items-id');

if(stream != null){
    stream.addEventListener('click', addMenu);
}

function addMenu(event){
	var that = event.target;

    if(	that.className.match('ProfileTweet-actionButton') || that.parentElement.parentElement.className.match('ProfileTweet-actionButton'))	{

		var menu = document.createElement('li');
		menu.className='share-via-mastodon';
		menu.dataset.nav = 'share_tweet_dm';
		menu.setAttribute('role', 'presentation');
		menu.addEventListener('click', shareViaMastodon);

		var button = document.createElement('button');
		button.type = 'button';
		button.className ='dropdown-link';
		button.setAttribute('role', 'menuitem');
		button.innerText = chrome.i18n.getMessage('share_twitter');

		menu.appendChild(button);

		var menu_action = that.parentNode.parentNode.parentNode.querySelector('ul');
		var firstElementOfMenu = menu_action.firstElementChild;

		if(firstElementOfMenu.className != menu.className)
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

	chrome.runtime.sendMessage({
		mastoshare: {
            title: author_fullname + "  @" + author_username,
            url: permalink,
            textSelection: tweet
        }
	});
}