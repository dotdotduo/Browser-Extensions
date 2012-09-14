// Saves options to localStorage.
function save_options() {
  var blacklist = document.getElementById("options");
  localStorage["tb_blacklist"] = blacklist.value;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 800);
}

document.addEventListener('DOMContentLoaded', function () {
  var value = localStorage["tb_blacklist"];
  if (value) {
    var blacklist = document.getElementById("options");
    blacklist.value = value;
  }
  document.querySelector('button').addEventListener('click', save_options);
});
