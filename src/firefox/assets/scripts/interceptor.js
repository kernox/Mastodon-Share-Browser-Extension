chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){

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