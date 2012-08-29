function RewriteURL(url) {
  var r, regex;

  regex = new RegExp("^http://(.*)\\B%23(\\w\\w+)(.*)", "i");
  r = regex.exec(url);

  if(r) {
    return url.replace(regex, "http://search.tagboard.com/$2");
  }

  return false;
}

function onTabUpdated(tabId, changeInfo, tab) {
  var url = changeInfo.url;

  if(url && changeInfo.status=='loading') {

    if(url = RewriteURL(url)) {

      chrome.tabs.update(tabId, { url: url },
        function(tab){
          chrome.tabs.executeScript(tabId, { file: "inline.js", allFrames: true }, function(){});
        });
      return false;
    }
  } 
};

chrome.tabs.onUpdated.addListener(onTabUpdated);