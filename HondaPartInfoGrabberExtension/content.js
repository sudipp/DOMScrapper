//this is the Cioontent for every TAB


//var port = chrome.runtime.connect({name: "tab"});

//port.postMessage({"status": "Communication successful!"});
var ehandler  = function mouseSelectionEventHandler(e)
{
	if(e.ctrlKey) //if crtl is pressed
	{
		//get all headers for part table
		
		var partHeaders=[];
		//$(e.target).closest('div#pnlMain').find('tr.AP_FreeSize_ColumnHeader').find('th').each(function(){
		$(e.target).closest('div#pnlMain').find('th').each(function(){
			partHeaders.push($(this).text());
		});
		//alert(e.target.nodeName + " : " + $(e.target).closest('div#pnlMain').find('tr.AP_FreeSize_ColumnHeader').length + ":"+ partHeaders);

		var partData={};
		if(partHeaders.length > 0){

			//alert($(e.target).closest('.PN_grdItemsRow, .AP_Row_Requested, .PN_grdItemsAlternateRow, .AP_Row_MouseOver').length);

			//$(e.target).closest('tr.PN_grdItemsRow').children('td').each(function(index) {
			$(e.target).closest('.PN_grdItemsRow, .AP_Row_Requested, .PN_grdItemsAlternateRow, .AP_Row_MouseOver').children('td').each(function(index) {

				if(index==0) //grab part numbder from TR -- one time read only 
					partData["partid"] = $(this).parent().attr("partid");

				if($(this).find('a').length>0)
				{
					var colHead= partHeaders[index].toString();
					var colVal=$(this).find('a').text();
					partData[colHead] = colVal;
	  			}
			});
		}
		//alert("Final " + JSON.stringify(partData) + ":" +  JSON.stringify(partHeaders));
		if(jQuery.isEmptyObject(partData))
			return true;

		//alert($(e.target).closest('tr').find('td').length);
		//alert($(e.target).closest('td').closest('tr').find('.PN_grdItemsRow').length);
		try 
		{
	      chrome.runtime.sendMessage({
				sender : "tab", 
				msg : "data_captured",
				//data: { "clientX":e.clientX, "clientY":e.clientY }
				data: partData
			});
	    } 
	    catch(e) 
	    {
	      if ( e.message.match(/Invocation of form runtime\.connect/) && e.message.match(/doesn't match definition runtime\.connect/)) 
	      {
	      	$(document.body).off("mousedown", ehandler);
	      	$("iframe").each(function() { 
				$($(this).contents().find("body")[0]).off("mousedown", ehandler);
			});
	        console.error('Chrome extension, Honda1 has been reloaded. Please refresh the page'); 
	      } 
	      else 
	      {
	        throw(e);
	      }
	    }
	}
 	return true; 
};


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	//alert("Received from background " + JSON.stringify(request));

  	if (request.msg == "Stop capture"){
  		$("iframe").each(function() { 
			$($(this).contents().find("body")[0]).off("mousedown", ehandler);
		});
  		$(document.body).off("click", ehandler);
	}
	else if (request.msg == "Start capture"){

		$("iframe").each(function() { 
			$($(this).contents().find("body")[0]).off("mousedown", ehandler).on("mousedown",ehandler);
		});
		$(document.body).off("mousedown", ehandler).on("mousedown",ehandler);
	}

  }
);