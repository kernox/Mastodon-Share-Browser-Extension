function init()
{
  getJSON('assets/locales/locales.json', function(list){

    for(id in list)
    {
      var option = document.createElement('option');
      option.value=id;
      option.innerText = list[id];

      document.querySelector('#language').appendChild(option);
    }

  });

  if(document.location.hash == '#start')
    document.querySelector('#startInfo').classList.remove('hide');

  loadOptions();
}

function loadOptions(){
    chrome.storage.sync.get({
    instanceUrl: 'https://',
    shortner: false,
    language: 'fr'
  }, function(items) {

    document.querySelector('#instanceUrl').value = items.instanceUrl;
    document.querySelector('#shortner').checked = items.shortner;

    var lang = items.language;

    loadLocale(lang);
    document.querySelector('#language').value = lang;
  });
}

function saveOptions(e){
  e.preventDefault();

  var status = document.querySelector('#status');

  chrome.storage.sync.set({
    instanceUrl: document.querySelector('#instanceUrl').value,
    shortner: document.querySelector('#shortner').checked,
    language: document.querySelector('#language').value
  }, function() {

    status.classList.remove('hide');
    document.querySelector('#startInfo').classList.add('hide');

    setTimeout(function() {
      status.classList.add('hide');
    }, 1000);

    var lang = document.querySelector('#language').value;
    loadLocale(lang);

  });
}

document.addEventListener('DOMContentLoaded', init);
document.querySelector('#options').addEventListener('submit', saveOptions);
