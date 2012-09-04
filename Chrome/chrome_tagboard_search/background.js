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
