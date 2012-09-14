  var hashtagRegex = new RegExp("\\B[#＃]([\\w-\u2013\u2014:~^*+=\&]+)", "gi");
  var notInTags = ['code', 'head', 'noscript', 'option', 'script', 'style', 'title', 'textarea'];
  var expression = ".//text()[not(ancestor::" + notInTags.join(') and not(ancestor::') + ")]";

  function hashtagifyContextNode(contextNode)
  {
    if (contextNode.className && contextNode.className.match(/\btb_hashtag\b/))
      return;

    var xpathResult = document.evaluate(expression, contextNode, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    var i = 0;
    function continuation()
    {
      var node = null, counter = 0;
      while (node = xpathResult.snapshotItem(i++))
      {
        var parent = node.parentNode;

        if (!parent)
          continue;

        if ('PRE' == parent.tagName && parent.className)
          continue;

        hashtagifyTextNode(node);

        if (++counter > 100)
          return setTimeout(continuation, 0);
      }
    }
    setTimeout(continuation, 0);
  }

  function hashtagifyTextNode(node)
  {
    var result;
    var txt = node.textContent;
    var newSpan = null;
    var insertionPoint = 0;
    while (result = hashtagRegex.exec(txt))
    {
      if (!newSpan)
      {
        newSpan = document.createElement('span');
        newSpan.className = 'tb_hashtag';
      }

      newSpan.appendChild(document.createTextNode(txt.substring(insertionPoint, result.index)));

      link = document.createElement('a');
      link.appendChild(document.createTextNode(result[0]));
      link.setAttribute('href', 'http://search.tagboard.com/' + result[1]);
      link.className = 'tb_hashtag';
      newSpan.appendChild(link);

      insertionPoint = result.index + result[0].length;
    }

    if (newSpan)    // Copy remaining text to span
    {
      newSpan.appendChild(document.createTextNode(txt.substring(insertionPoint, txt.length)));
      node.parentNode.replaceChild(newSpan, node);
    }
  }

if (window.top === window) {
  function getMessage(msgEvent) {
    if (msgEvent.name == "settingValue") {
      var blacklist = msgEvent.message;
      var url = window.location.href;
      var domains = "tagboard.com"
      var regex;

      if (blacklist && blacklist.length > 0) {
        domains = blacklist.replace(/[,\s]+/g, "|");                  // Replace , and whitespace with |
        domains = "tagboard.com|" + domains.replace(/^\||\|$/g, "");  // Remove leading/trailing |, add tagboard.com
      }

      regex = new RegExp(domains, "i");
      if (!regex.exec(url)) {
        hashtagifyContextNode(document.body);
        document.body.addEventListener('DOMNodeInserted', function(event){ hashtagifyContextNode(event.target); }, false);
      }
    }
  }

  safari.self.addEventListener("message", getMessage, false);
  safari.self.tab.dispatchMessage("getSettings", "tb_blacklist");
}