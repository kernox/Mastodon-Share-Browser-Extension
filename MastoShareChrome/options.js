if(document.location.hash == '#start')
{
    $('#startInfo').removeClass('hide');
}

function save_options()
{
  var instanceUrl = document.getElementById('instanceUrl').value;
  var shortner = $('#shortner').prop('checked');

  chrome.storage.sync.set({
    instanceUrl: instanceUrl,
    shortner: shortner
  }, function() {

    $('#status').removeClass('hide');
    $('#startInfo').addClass('hide');

    setTimeout(function() {
      $('#status').addClass('hide');
    }, 1000);

  });
}

function restore_options()
{
  chrome.storage.sync.get({
    instanceUrl: 'https://',
    shortner: false
  }, function(items) {
    $('#instanceUrl').val(items.instanceUrl);
    $('#shortner').prop("checked", items.shortner);
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);