alert("What's up!");

var r, regex;
var url = window.location.href;

alert(url);

regex = new RegExp("^http://(.*)\\B%23(\\w\\w+)(.*)", "i");
r = regex.exec(url);

if(r) {
  url = url.replace(regex, "http://search.tagboard.com/$2");
  window.location = url;
}
