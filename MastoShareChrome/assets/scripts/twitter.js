var stream = document.querySelector('#stream-items-id');

stream.addEventListener('click', addMenu);

/*var action = document.querySelector('.ProfileTweet-action');
action.style.border = '2px solid red';
//console.log(action);

//action.addEventListener('click', "addMenu");
*/

function addMenu(event){

	if(event.target.className.match('Icon'))
	{
		alert('test');
	}
	

	return false;
}

/*function addMenu()
{
	this.style.border = '2px solid red';
	var existMenu = document.querySelector('.share-via-mastodon');

	if(existMenu)
		existMenu.remove();

	var menu = document.createElement('li');
	menu.className='share-via-mastodon';
	menu.dataset.nav = 'share_tweet_dm';
	menu.setAttribute('role', 'presentation');

	var button = document.createElement('button');
	button.type = 'button';
	button.className ='dropdown-link';
	button.setAttribute('role', 'menuitem');
	button.innerHTML = 'Partager via Mastodon';

	var target = document.querySelector('li.share-via-dm');
	//target.parentNode.insertBefore(menu, target);
	console.log(target.parentNode);
	//console.log(target);
}*/

/*$('#stream-items-id').delegate('.ProfileTweet-action', 'click', function(){
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
});*/