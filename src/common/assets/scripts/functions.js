function saveData(key, value) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

		const currentTab = tabs[0];
		const tabId = currentTab.id;

		const currentMessageKey = key + '_' + tabId;

		const obj = {};
		obj[currentMessageKey] = value;
		chrome.storage.local.set(obj);
	})
}

async function getData(key) {
	
	const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
	
	const currentTab = tabs[0];
	const tabId = currentTab.id;	
	const currentTabKey = key + '_' + tabId;	
	
	const res = await chrome.storage.local.get(currentTabKey);

	if(Object.keys(res).length == 1){
		return res[currentTabKey];
	} else {
		return null;
	}
	
	
}

function removeData(key){
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        
        const currentTab = tabs[0];
        const tabId = currentTab.id;

        const currentMessageKey = key + '_' + tabId;

        chrome.storage.local.get(currentMessageKey).then(res => {

            if (res[currentMessageKey]) {
                chrome.storage.local.remove(currentMessageKey);
            }
        })
    })
}

function getShortUrl(url, callback) {
	post('https://frama.link/a', { format: 'json', lsturl: url }, 'json', function (data) {

		if (data.success)
			return callback(data.short);
	});
}

function getJSON(url, callback) {
	return ajax('GET', url, null, 'json', callback);
}

function post(url, data, type, callback) {
	return ajax('POST', url, data, type, callback);
}

function ajax(method, url, data, type, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.overrideMimeType('application/json');

	xhr.onload = function () {
		if (xhr.status >= 200 && xhr.status < 400) {
			if (type == 'json')
				var response = JSON.parse(xhr.responseText);
			else
				var response = xhr.responseText;

			return callback(response);
		}
		else {
			console.log('erf');
		}
	}

	if (data != null) {
		var formData = new FormData();

		for (var key in data) {
			formData.append(key, data[key]);
		}

		xhr.send(formData);
	}
	else {
		xhr.send();
	}

}