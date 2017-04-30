function save_options()
{
  var instanceUrl = document.getElementById('instanceUrl').value;
  var shortner = $('#shortner').prop('checked');

  chrome.storage.sync.set({
    instanceUrl: instanceUrl,
    shortner: shortner
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options sauvegardées.';
    status.className = 'alert alert-success';

    setTimeout(function() {
      status.textContent = '';
      status.className = '';
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