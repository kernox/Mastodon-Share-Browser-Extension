function save_options() {

  var instanceUrl = document.getElementById('instanceUrl').value;
  var shortner = document.getElementById('shortner').checked;

  browser.storage.sync.set({
    instanceUrl: instanceUrl,
    shortner: shortner
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options sauvegardee.';
    status.className = 'alert alert-success';

    setTimeout(function() {
      status.textContent = '';
      status.className = '';
    }, 1000);

  });
}

function restore_options() {
  browser.storage.sync.get({
    instanceUrl: 'https://',
    shortner: false
  }, function(items) {
    document.getElementById('instanceUrl').value = items.instanceUrl;
    document.getElementById('shortner').checked = items.shortner;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);