
var history_log = [];
var testwindow=null;

chrome.browserAction.onClicked.addListener(function() {
  testwindow = window.open('partsList.html', 'testwindow', 'width=700,height=600');
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.sender=="tab"){

      if(request.msg == "data_captured"){
        //store the captured incoming part data
        history_log.push(request.data);        

        //notify the UI to grab it.
        testwindow && testwindow.postMessage({msg : "load_captured_data", sender : "background", data: request.data },"*");

        alert("Data from Tab " + JSON.stringify(history_log));
      }
    }
    else if(request.sender=="ui"){
      if(request.msg == "give_all_data"){         
         testwindow && testwindow.postMessage({msg : "load_all_data", sender : "background", data: history_log },"*");
         //testwindow && testwindow.postMessage({msg : "load_all_data"},"*");
         //alert("forward it to window" + testwindow);
      }
      else if(request.msg == "clear_all_data"){
         history_log = {};
      }

      //alert(request.msg);
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
