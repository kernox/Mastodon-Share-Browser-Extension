var app = new Vue({
    el: '#app',
    mounted: function() {
        this.loadTabUrl();
    },
    data: {
        labels: {
            successMessage: chrome.i18n.getMessage('success'),
            btnClear: chrome.i18n.getMessage('clear'),
            btnToot: chrome.i18n.getMessage('toot'),
            public: chrome.i18n.getMessage('public'),
            direct: chrome.i18n.getMessage('direct'),
            private: chrome.i18n.getMessage('private'),
            unlisted: chrome.i18n.getMessage('unlisted'),
        },
        message: "",
        showTootSpinner: false,
        showPictureSpinner: false,
        canToot: false,
        error: false,
        alert:  "",
        showAlert: false
    },
    methods: {
        loadOptions: function() {
            chrome.storage.sync.get({
                defaultDisclaimer: '',
                tootMaxSize: 500
            }, function(items){
                this.disclaimer = items.defaultDisclaimer;
                this.tootMaxLength = items.tootMaxSize;
            });
        },
        toot: function() {
            
            chrome.storage.sync.get(null, function(items) {
                
                loaderIcon.classList.remove('hidden');
                btnToot.disabled = true;
                
                if (items.accessKey !== '') {
                    
                    var api = new MastodonAPI({
                        instance: items.instanceUrl,
                        api_user_token: items.accessKey
                    });
                    var finalMessage = message.value;
                    var visibility = tootType.value;
                    var spoilerText = disclaimer.value;
                    
                    var request = api.post("statuses", {
                        status: finalMessage,
                        visibility: visibility,
                        spoiler_text: spoilerText
                        
                    }, function(data){
                        
                        showAlert(successMessage, 'success');
                        loaderIcon.classList.add('hidden');
                        btnToot.disabled = false;
                        
                        message.value = '';
                    });
                    
                    request.fail(function(data){
                        showAlert('Can\'t connect to the instance !', 'danger');
                        btnToot.disabled = false;
                        loaderIcon.classList.add('hidden');
                        
                        setTimeout(function(){
                            hideAlert();
                        },2000);
                    });
                }
            });
        },
        loadTabUrl: function() {
            
            var that = this;
            
            chrome.storage.sync.get(null, function(items){
                
                if(items.clipboard != undefined){
                    
                    var clipboard = items.clipboard;
                    
                    var draft = clipboard.title +
                    "\n\n" + clipboard.textSelection +
                    "\n\n"+clipboard.url;
                    
                    this.message = draft;
                } else {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                        that.message = tabs[0].title + "\n\n" + tabs[0].url;
                        
                        // extract page keywords to use as hashtags
                        chrome.tabs.executeScript( {
                            code: "var kw = document.querySelector('meta[name=keywords]'); var keywords = kw.getAttribute('content'); keywords;"
                        }, function(keywords) {
                            if (!keywords[0])
                            return;
                            // TODO: sanitize better
                            that.message += "\n\n" + keywords[0].split(',').map(function (e) {return e ? '#' + e.trim().replace(' ', '_').replace("'", '') : '';}).join(' ');
                        });
                    });
                }
            });
            
        },
        clearToot: function() {
            this.message = '';
            
            chrome.storage.sync.remove('clipboard', function(){
                chrome.browserAction.setBadgeText({
                    text: ''
                });
            });
        },
        isEmpty: function(){
            return this.message.length == 0;
        }
    }
})

//Ctrl + Enter feature
// $(window).keydown(function(event) {
//   if(event.ctrlKey && event.keyCode == 13) { 
//     toot();
//     event.preventDefault(); 
//   }
// });

// function uploadPictures(){

//     btnPicture.querySelector('.icon').style.display = 'none';
//     btnPicture.querySelector('.loader').classList.remove('hidden');

//     var files = uploader.files;

//     for(var i=0; i< files.length; i++){

//         var data = new FormData();
//         data.append('file', files[i]);

//         chrome.storage.sync.get(null, function(items) {
//             var api = new MastodonAPI({
//                 instance: items.instanceUrl,
//                 api_user_token: items.accessKey
//             });

//             api.postMedia("media", data, function(response){
//                 btnPicture.querySelector('.icon').style.display = '';
//                 btnPicture.querySelector('.loader').classList.add('hidden');

//                 var image = document.createElement('img');
//                 image.src = response.preview_url;

//                 var item = document.createElement('li');
//                 item.appendChild(image);

//                 pictures.append(item);
//             });
//         });
//     }
// }