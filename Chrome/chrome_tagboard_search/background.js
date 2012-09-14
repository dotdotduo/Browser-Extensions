chrome.webNavigation.onBeforeNavigate.addListener(function(details)
{
  if (details.frameId == 0) {
    var r, regex, url = details.url;

    regex = new RegExp("^https?://(.*)(google|bing|yahoo)(.*)\\B%23(\\w+)(.*)", "i");
    r = regex.exec(url);

    if(r) {
      url = url.replace(regex, "http://search.tagboard.com/$4");
      chrome.tabs.update(details.tabId, { url: url });
    }
  }
});

chrome.webNavigation.onDOMContentLoaded.addListener(function(details)
{
	if (details.frameId == 0) {
    var domains = "tagboard.com"
    var regex;

    if (localStorage["tb_blacklist"]) {
      domains = localStorage["tb_blacklist"].replace(/[,\s]+/g, "|"); // Replace , and whitespace with |
      domains = "tagboard.com|" + domains.replace(/^\||\|$/g, "");    // Remove leading/trailing |, add tagboard.com
    }

    regex = new RegExp(domains, "i");

    if (!regex.exec(details.url)) {
      chrome.tabs.executeScript(details.tabId, {runAt: 'document_end', file:'hashtagify.js'});
    }
	}
});
