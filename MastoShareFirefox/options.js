
function save_options() {

  var instanceUrl = document.getElementById('instanceUrl').value;

  browser.storage.sync.set({
    instanceUrl: instanceUrl
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Instance sauvegardee.';
    status.className = 'alert alert-success';
    setTimeout(function() {
      status.textContent = '';
      status.className = '';
    }, 1000);
  });
}

function restore_options() {

  browser.storage.sync.get({
    instanceUrl: 'https://'
  }, function(items) {
    document.getElementById('instanceUrl').value = items.instanceUrl;
  });

}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);