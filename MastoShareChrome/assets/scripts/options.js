$(document).ready(function(){

  $.get('assets/locales/locales.json', function(data){
    var list = JSON.parse(data);
    $.each(list, function(i, val) {
      $('#language').append('<option value="'+ i +'">'+ val +'</option>');
    });
  });

  if(document.location.hash == '#start')
    $('#startInfo').removeClass('hide');

  loadOptions();
});

function loadOptions(){
    chrome.storage.sync.get({
    instanceUrl: 'https://',
    shortner: false,
    language: 'fr-fr'
  }, function(items) {

    $('#instanceUrl').val(items.instanceUrl);
    $('#shortner').prop("checked", items.shortner);

    var lang = items.language;

    loadLocale(lang);
    $('#language').val(lang);
  });
}

function saveOptions(e){
  e.preventDefault();

  chrome.storage.sync.set({
    instanceUrl: $('#instanceUrl').val(),
    shortner: $('#shortner').prop('checked'),
    language: $('#language').val()
  }, function() {

    $('#status').removeClass('hide');
    $('#startInfo').addClass('hide');

    setTimeout(function() {
      $('#status').addClass('hide');
    }, 1000);

    loadLocale($('#language').val());

    setTimeout(function(){
      chrome.runtime.reload();
    },1000);
  });
}

$('#options').on('submit', saveOptions);