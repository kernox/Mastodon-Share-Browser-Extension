chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){

        console.log(request);
        if (request.mastoshare != undefined){

            chrome.storage.sync.set({
                clipboard: request.mastoshare
            }, function(){
                chrome.browserAction.setBadgeText({
                    text: 'T'
                });
            });
        }

    }
)