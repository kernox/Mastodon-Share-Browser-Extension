chrome.storage.sync.get(null, function(items){

	if(items)
	{
		var instanceUrl = items.instanceUrl;
		var message = items.message;

		if(document.location.href.match('^'+instanceUrl))
		{
			var field = document.querySelector('textarea.autosuggest-textarea__textarea');
			var keeper = null;

			if(field != undefined)
			{
				field.value = message;

				field.addEventListener('click', function(){
					field.value = message;
				});

				field.addEventListener('change', function(){
					message = field.value;
				});

				field.addEventListener('blur', function(){

					var count = 0;
					keeper = setInterval(function(){

						if(field.value == message){
							clearInterval(keeper);
						}

						field.value = message;
						console.log('TextKeeper ON !');

						count++;

					},100);
				});

				field.addEventListener('focus', function(){
					clearInterval(keeper);
					console.log('TextKeeper OFF !');
				});

				chrome.storage.sync.set({message: ''});

			}
		}
	}
});