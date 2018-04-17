
var history_log = [];
var unreadDataCount = 0;
var testwindow=null;

chrome.browserAction.onClicked.addListener(function() {
  testwindow = window.open('partsList.html', 'testwindow', 'width=700,height=600');
});

function setBadgeText(){  
  if(unreadDataCount==0)
    chrome.browserAction.setBadgeText({text: ''});
  else
    chrome.browserAction.setBadgeText({text: unreadDataCount.toString()});
}

function sendToPartsServer(data){
    $.ajax({
        type: "POST", //or GET
        url: "http://localhost:1337/api/parts",
        data: data,
        crossDomain:true,
        cache:false,
        async:false,
        success: function(msg){
            debugger;
        },
        error: function(jxhr){
            //alert(jxhr.responseText);
            console.error('Chrome extension - Error sending data to PartsServer. ' + jxhr.responseText ); 
        }
    });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.sender=="tab"){

      if(request.msg == "data_captured"){
        
        unreadDataCount ++;
        setBadgeText();

        //store the captured incoming part data
        history_log.push(request.data);        

        //notify the UI to grab it.
        testwindow && testwindow.postMessage({msg : "load_captured_data", sender : "background", data: request.data },"*");
        
        sendToPartsServer(request.data);
          
        //alert("Data from Tab " + JSON.stringify(history_log));
      }
    }
    else if(request.sender=="ui"){
      if(request.msg == "give_all_data"){         
         testwindow && testwindow.postMessage({msg : "load_all_data", sender : "background", data: history_log },"*");
         //testwindow && testwindow.postMessage({msg : "load_all_data"},"*");
         //alert("forward it to window" + testwindow);
         sendResponse();
      }
      else if(request.msg == "clear_all_data"){
         history_log = {};
         unreadDataCount=0;
         setBadgeText();
      }
      else if(request.msg == "read_data"){
         unreadDataCount=0;
         setBadgeText();
      }
    }
  }
);



chrome.tabs.onAttached.addListener(function(tabId, props) {});
chrome.tabs.onMoved.addListener(function(tabId, props) {});

chrome.tabs.onCreated.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, {msg : "Start capture", tabId: tab.id});
});
chrome.tabs.onUpdated.addListener(function(tabId, props) {
  chrome.tabs.sendMessage(tabId, {msg : "Start capture", tabId: tabId});
});
chrome.tabs.onDetached.addListener(function(tabId, props) {
  chrome.tabs.sendMessage(tabId, {msg : "Stop capture", tabId: tabId});
});
chrome.tabs.onSelectionChanged.addListener(function(tabId, props) {
  chrome.tabs.sendMessage(tabId, {msg : "Start capture", tabId: tabId});
});
chrome.tabs.onRemoved.addListener(function(tabId) {
  chrome.tabs.sendMessage(tabId, {msg : "Stop capture", tabId: tabId});
});
