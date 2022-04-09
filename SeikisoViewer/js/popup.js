$(function(){
	/*
			var BG = chrome.extension.getBackgroundPage();
		BG.setEnabled(BG.enabled);
		if(BG.enabled){
		    $('#disable').hide();
		    $('#enable').show();
		}else{
		    $('#enable').hide();
		    $('#disable').show();
		}
	$('#disable').click(function(){
			var BG = chrome.extension.getBackgroundPage();
		    BG.setEnabled(false);
		    $(this).hide();
		    $('#enable').show();
	});
	*/
	$('#disable').click(function(){
		    $('#en').val(!flag);
			var BG = chrome.extension.getBackgroundPage();
			var flag = true;
			if("false" == $('#en').val()){
				flag = false;
			}
		    BG.toggleEnabled(flag);
	});
});