var stream = document.querySelector('#stream-items-id');

stream.addEventListener('click', addMenu);

function addMenu(event){

	if(event.target.className.match('Icon'))
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
		button.innerText = 'Partager via Mastodon';

		menu.appendChild(button);

		var that = event.target;
		var menu_action = that.parentNode.parentNode.nextElementSibling.querySelector('ul');

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

	var message = author_fullname + "  @" + author_username + "\n" + tweet + "\n\n" + permalink;
	window.open('popup.html','mastodon-share');

}