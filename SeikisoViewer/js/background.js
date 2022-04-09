//chrome.browserAction.setBadgeText({ text: "ON" });

var bgenabled;
var setEnabled = function(en){
	if(en){
		chrome.browserAction.setBadgeText({ text: "ON" });
		chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 255, 100] });
	}else{
		chrome.browserAction.setBadgeText({ text: "OFF" });
		chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 100] });
	}
	bgenabled = en;
	//chrome.management.setEnabled("lnlkdjlehdbpchboiaoimjkkjfajanha",en);
}

var toggleEnabled = function(){
	setEnabled(!bgenabled);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getEnabled"){
      sendResponse({enabled: bgenabled});
    }
    if (request.method == "setEnabled"){
		setEnabled(request.enabled);
		bgenabled = request.enabled;
    }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      chrome.windows.getAll({"populate" : true}, function(windows){
	    for (var i=0; i<windows.length; i++) {
	       winId = windows[i].id;

			  var queryInfo = {
			    windowId: winId
			  };

			  // ƒ^ƒu‚Ìî•ñ‚ðŽæ“¾‚·‚é
			  chrome.tabs.query(queryInfo, function (tabs) {
			  for(var j in tabs){
	        	if(
	        		(0 < tabs[j].url.indexOf('is_popout=1') && 0 < tabs[j].url.indexOf(request.videoId))
	        		||
	        		(0 < tabs[j].url.indexOf('watch') && 0 < tabs[j].url.indexOf(request.videoId))
	        		){
	        		
		        		if("loadSetting" == request.type){
				        	chrome.tabs.sendMessage(tabs[j].id,
					        	{
					        	  type: "loadSetting"
					        	, url: request.url
					        	, videoId: request.videoId
					        	, displayIcon: request.displayIcon
					        	, displayName: request.displayName
					        	, displayCome: request.displayCome
					        	, displayComeShita: request.displayComeShita
					        	, txtFontSize: request.txtFontSize
					        	, txtFontColor: request.txtFontColor}, function(){}
					        	);
					        	break;
				        }
				        
		        		if("getCommentArray" == request.type){
				        	chrome.tabs.sendMessage(tabs[j].id,
					        	{
					        	  type: "getCommentArray"
					        	, commentArray: request.commentArray}, function(){}
					        	);
					        	break;
				        }
				        
		        		if("moveComment" == request.type){
				        	chrome.tabs.sendMessage(tabs[j].id,
					        	{
					        	  type: "moveComment"
					        	, commentList: request.commentList}, function(){}
					        	);
					        	break;
					    }
			        }
			        
	        	if((0 < tabs[j].url.indexOf('watch') && 0 < tabs[j].url.indexOf(request.videoId))){
		        		if("loadOpenerSetting" == request.type){
				        	chrome.tabs.sendMessage(tabs[j].id,
					        	{
					        	  type: "loadOpenerSetting"
					        	, url: request.url
					        	, videoId: request.videoId
					        	, displayIcon: request.displayIcon
					        	, displayName: request.displayName
					        	, displayCome: request.displayCome
					        	, displayComeShita: request.displayComeShita
					        	, txtFontSize: request.txtFontSize
					        	, txtFontColor: request.txtFontColor}, function(){}
					        	);
					        	break;
				        }
		        		if("getCommentArrayOpener" == request.type){
				        	chrome.tabs.sendMessage(tabs[j].id,
					        	{
					        	  type: "getCommentArrayOpener"
					        	, commentArray: request.commentArray}, function(){}
					        	);
					        	break;
				        }
		        		if("moveComment" == request.type){
				        	chrome.tabs.sendMessage(tabs[j].id,
					        	{
					        	  type: "moveComment"
					        	, commentList: request.commentList}, function(){}
					        	);
					        	break;
					    }
			        }
				}
			  });

	    }

	  });
	return true;

  }
);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage"){
      sendResponse({data: localStorage[request.key]});
    }else
    if (request.method == "moveComment"){
      sendResponse({});
    }else
    if (request.method == "open"){
		chrome.tabs.create({    "url": chrome.extension.getURL("html/options.html"),});
	}
    else{
      sendResponse({}); // snub them.
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage")
	chrome.browserAction.setBadgeText({text:"~"});
});