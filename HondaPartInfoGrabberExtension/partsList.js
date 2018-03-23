// If you want to sendMessage from any popup or content script,
// use `chrome.runtime.sendMessage()`.

// Send message to background:
/*chrome.runtime.sendMessage({ cmd : "any command", data: "WINDOW"}, function(response) {
  alert("message from background2: " + JSON.stringify(response));
});
*/

// If you want to sendMessage from tab of browser,
// use `chrome.tabs.sendMessage()`.

// Send message from active tab to background: 
/*chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, { cmd : "any command", data: tabs[0].id}, function(response) {
    	alert("message from background1: " + JSON.stringify(response));
  	});
});*/
/*
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {  
  chrome.tabs.sendMessage(tabs[0].id, {message: 'Hello Background! How are you?'}, function(response) {  
    alert("message from background1: " + response);  
  });  
});


function write(msg){
	var x= document.getElementById('response');

alert(x);

	x.innerHTML += msg;
}

var port = chrome.runtime.connect({name: "history"});
port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {
  if (msg.question == "Who's there?"){
  	write(msg.question);
  	 console.log(msg.question,"www");
    port.postMessage({answer: "Madame"});
}
  else if (msg.question == "Madame who?"){
  	write(msg.question);
  	console.log(msg.question,"www");
    port.postMessage({answer: "Madame... Bovary"});
}
});
*/

/*
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {   



      alert("Reload data call from Background " + JSON.stringify(request));

      //chrome.extension.getBackgroundPage();

      chrome.runtime.sendMessage({
			sender : "ui", 
			msg: "clear_data"
		});

      return true;
  }
);*/

//var bkg = chrome.extension.getBackgroundPage();
function give_all_data (){
	chrome.runtime.sendMessage({
			sender : "ui", 
			msg: "give_all_data"
		},function(){
			notify_read_data();
		});
	/*chrome.runtime.sendMessage({
			sender : "ui", 
			msg: "read_data"
		});*/
};
function clear_all_data (){
	chrome.runtime.sendMessage({
			sender : "ui", 
			msg: "clear_all_data"
		}, function(){

		});	
};
function notify_read_data (){
	chrome.runtime.sendMessage({
			sender : "ui", 
			msg: "read_data"
		});	
};

//window.addEventListener("message", receiveMessage, false);
function receiveMessage(evt)
{	
	//alert("UI " + JSON.stringify(evt));
	if(evt.data.sender == "background"){

		if(evt.data.msg == "load_all_data"){
			//alert("sender: " + evt.data.sender + " data: " + evt.data.data);	
			buildTable(evt.data.data, true);
		}
		else if(evt.data.msg == "load_captured_data"){
			//alert("sender: " + evt.data.sender + " data: " + evt.data.data);	
			notify_read_data();
			buildTable(evt.data.data, false);
		}
	}

	//alert(event.data.msg +":"+ JSON.stringify(msg));
  //if (event.origin !== "http://example.org:8080")
  //  return;
};
if (window.addEventListener) {
    window.addEventListener("message", receiveMessage, false);
} else {
    window.attachEvent("onmessage", receiveMessage);
}


document.addEventListener('DOMContentLoaded', function() {
	//load all data
	give_all_data();
});

function createRecord(data, keys){
	var tr=$('<tr>');
	$(keys).each(function(index){
	 	tr.append($('<td>').text(data[this]));
	});
	tr.appendTo('#records_table');	
}

function buildTable(data, clear){

	if(data == null) return;
	var isArray = $.isArray(data);
	if(isArray && data.length==0) {
		return;		
	}

	if(clear)
	{}

	var firstRecord = isArray ? data[0] : data;
	var keys = $.map( firstRecord, function( value, key ) {
	  return key;
	});
	var tableHasHeader= $('#records_table').attr("hasheader");
	if(!tableHasHeader)
	{		
		var headertr=$('<tr>');
		$(keys).each(function(index){
		 	headertr.append($('<td>').text(this));
		});
		headertr.appendTo('#records_table');
		$('#records_table').attr("hasheader", true);
	}

	if(isArray){
		$.each(data, function(i, item) {
			createRecord(item,keys);
		});
	}else{		
		createRecord(data,keys);
	}
}