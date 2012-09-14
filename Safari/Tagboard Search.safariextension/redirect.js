if (window.top === window) {
	var r, regex;
	var url = window.location.href;

	regex = new RegExp("^https?://(.*)(google|bing|yahoo)(.*)\\B%23(\\w+)(.*)", "i");
	r = regex.exec(url);

	if(r) {
	  url = url.replace(regex, "http://search.tagboard.com/$4");
	  window.location = url;
	}
}
