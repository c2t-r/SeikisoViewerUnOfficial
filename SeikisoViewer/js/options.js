$(function(){

	$("#save").click(function () {
		var json = {
				  fontsize: $("#fontsize").val()
				, fontcolor: $("#fontcolor").val()
				, commentStyle: $('input[name=commentStyle]:checked').val()
				, commentNoWrap: $('#commentNoWrap').prop('checked')
				, commentInputPosition: $('input[name=commentInputPosition]:checked').val()
				, commentInputOpacity: $("#commentInputOpacity").val()
				, maxLine: $("#maxLine").val()
				, rushCriteria: $("#rushCriteria").val()
				, rushOpacity: $("#rushOpacity").val()
				, commentLifeTime: $("#commentLifeTime").val()
				, commentParallelCount: $("#commentParallelCount").val()
				, limitOver: $('input[name=limitOver]:checked').val()
				, showNgReasonDialog: $('#showNgReasonDialog').prop('checked')
				, addNgKind: $('input[name=addNgKind]:checked').val()
				, ngShareLevel: $("#ngShareLevel").val()
				, goLiveInterval: $("#goLiveInterval").val()
				, goLiveRate: $('input[name=goLiveRate]:checked').val()
				, cssLink: $("#cssLink").val()
				, commentFont: $("#commentFont").val()
				, videoSizeChangeType: $('input[name=videoSizeChangeType]:checked').val()
				};
		chrome.storage.local.set({options:JSON.stringify(json)});
		
		chrome.storage.local.get('userId', function(items) {
			var userId = items.userId;
			if (null == userId) {
				userId = getRandomToken();
				chrome.storage.local.set({userId: userId}, function() {});
			}
		
			//$.getJSON("https://onspring3.sakura.ne.jp/kato-junichi/addon/ngInfo.php?trancate=true&userId=" + userId, function (data) {});
			var json = {};
			$($('.ngInfoTr').get().reverse()).each(function(){
				var name = $(this).find('#ngInfoName').html().trim();
				var transparent = $(this).find('#ngInfoTransparentCheck').prop('checked');
				var reason = $(this).find('#ngInfoReasonText').val();
				
				if("" != name){
					json[name] = {transparent: transparent, reason: reason};
					
					//$.getJSON("https://onspring3.sakura.ne.jp/kato-junichi/addon/ngInfo.php?addNgInfo=" + name + "&userId=" + userId, function (data) {});
				}
			});
			
			$.ajax({
				type: 'post',
				data: {"json": JSON.stringify(json) ,"userId": userId}, 
				url: 'https://onspring3.sakura.ne.jp/kato-junichi/addon/ngInfo.php',
				success: function(data){
				},
				error: function(xhr, textStatus, error){
					log(xhr.statusText);
					log(textStatus);
					log(error);
				}
			});
		
			json["__regex__"] = {};
			$($('.ngInfoTr2').get().reverse()).each(function(){
				var expression = $(this).find('#ngInfoRegexText').val();
				var transparent = $(this).find('#ngInfoTransparentCheck').prop('checked');
				var text = $(this).find('#ngInfoTextText').val();
				
				if("" != expression){
					json["__regex__"][expression] = {expression: expression, transparent: transparent, text: text};
				}
			});
			
			chrome.storage.local.set({ngInfo:JSON.stringify(json)});
			
			$("#saved").show();
			setTimeout(function(){
				$("#saved").hide();
			},5000);
			
		});
	});

	$("#reset").click(function () {
		var json = {fontsize: 12, fontcolor:"#000000", commentStyle:0, commentNoWrap:false, commentInputPosition:'0', commentInputOpacity: 0.5,
						maxLine: 0, rushCriteria: 1.5, rushOpacity: 0.75,
						commentLifeTime: 5000, commentParallelCount: 30, limitOver:1, showNgReasonDialog:true, 
						addNgKind:0, limitOver:0, 
						ngShareLevel:0, goLiveInterval: 0, goLiveRate: 1.5, cssLink:"", commentFont: "",
						videoSizeChangeType:0 };
		//chrome.storage.local.set({options:JSON.stringify(json)});
		$("#fontsize").val(json.fontsize);
		$("#fontcolor").val(json.fontcolor);
		$('input[name=commentStyle]').val([json.commentStyle]);
		$('#commentNoWrap').prop('checked',false);
		$('input[name=commentInputPosition]').val([json.commentInputPosition]);
		$("#commentInputOpacity").val(json.commentInputOpacity);
		$("#maxLine").val(json.maxLine);
		$("#rushCriteria").val(json.rushCriteria);
		$("#rushOpacity").val(json.rushOpacity);
		$("#commentLifeTime").val(json.commentLifeTime);
		$("#commentParallelCount").val(json.commentParallelCount);
		$('input[name=limitOver]').val([json.limitOver]);
		$('#showNgReasonDialog').prop('checked',true);
		$('input[name=addNgKind]').val([json.addNgKind]);
		$("#ngShareLevel").val(json.ngShareLevel);
		$("#goLiveInterval").val(json.goLiveInterval);
		$('input[name=goLiveRate]').val([json.goLiveRate]);
		$("#cssLink").val(json.cssLink);
		$("#commentFont").val(json.commentFont);
		$('input[name=videoSizeChangeType]').val([json.videoSizeChangeType]);
	});
	
	$("#resetNg").click(function () {
		$('.ngInfoTr').each(function(){
			var name = $(this).find('#ngInfoName').html().trim();
			var transparent = $(this).find('#ngInfoTransparentCheck').prop('checked');
			var reason = $(this).find('#ngInfoReasonText').val();
			
			if("" != name){
				$(this).remove();
			}
		});
		
		$('.ngInfoTr2').each(function(){
			var expression = $(this).find('#ngInfoRegexText').val();
			var transparent = $(this).find('#ngInfoTransparentCheck').prop('checked');
			var reason = $(this).find('#ngInfoReasonText').val();
			
			if("" != expression){
				$(this).remove();
			}
		});
		
		//chrome.storage.local.set({ngInfo:null}, function() {});
	});
	
	chrome.storage.local.get(function(items) {
        console.log(items.options);
        var json = {};
        if(null != items.options){
        	json = JSON.parse(items.options);
        }else{
			json = {fontsize: 12, fontcolor:"#000000", commentStyle:0, commentNoWrap:false, commentInputPosition:'0', commentInputOpacity: 0.5,
						maxLine: 0, rushCriteria: 1.5, rushOpacity: 0.75,
						commentLifeTime: 5000, commentParallelCount: 30, limitOver:1, showNgReasonDialog:true, addNgKind:0, 
						ngShareLevel:0, goLiveInterval: 0, goLiveRate: "1.5", cssLink:"", commentFont: "",
						videoSizeChangeType:0 };
		}

		$("#fontsize").val(json.fontsize);
		$("#fontcolor").val(json.fontcolor);
		$('input[name=commentStyle]').val(null == [json.commentStyle] ? "0" : [json.commentStyle]);
		$('#commentNoWrap').prop('checked',json.commentNoWrap);
		$('input[name=commentInputPosition]').val(null == [json.commentInputPosition] ? "0" : [json.commentInputPosition]);
		$("#commentInputOpacity").val(json.commentInputOpacity);
		$("#maxLine").val(json.maxLine);
		$("#rushCriteria").val(json.rushCriteria);
		$("#rushOpacity").val(json.rushOpacity);
		$("#commentLifeTime").val(json.commentLifeTime);
		$("#commentParallelCount").val(json.commentParallelCount);
		$('input[name=limitOver]').val([json.limitOver]);
		$('#showNgReasonDialog').prop('checked',json.showNgReasonDialog);
		$('input[name=addNgKind]').val([json.addNgKind]);
		$("#ngShareLevel").val(json.ngShareLevel);
		$("#goLiveInterval").val(null == json.goLiveInterval ? 10 : json.goLiveInterval);
		$('input[name=goLiveRate]').val(null == [json.goLiveRate] ? "1.5" : [json.goLiveRate]);
		$("#cssLink").val(json.cssLink);
		$("#commentFont").val(json.commentFont);
		$('input[name=videoSizeChangeType]').val(null == [json.videoSizeChangeType] ? "0" : [json.videoSizeChangeType]);
    });
	
	//getNgInfo();
	
	//authorize();
});

function getNgInfo(){
	var ngInfo = null;
	chrome.storage.local.get(function(items) {
        console.log(items.ngInfo);
        ngInfo = items.ngInfo;
		if(null == ngInfo){
			ngInfo = {};
		}else{
			ngInfo = JSON.parse(ngInfo);
		}
		
		for(var i in ngInfo){
			if("__regex__" == i){
				continue;
			}
			console.log(i);
			var info = ngInfo[i];
			
			var tr = $('#ngInfoTr').clone();
			$(tr).find('#ngInfoName').html(i);
			$(tr).find('#ngInfoTransparentCheck').prop('checked',info.transparent);
			$(tr).find('#ngInfoReasonText').val(info.reason);
			$(tr).show();
			
			$('#ngInfoTr').before(tr);
		}
		
		for(var i in ngInfo["__regex__"]){
			console.log(i);
			var info = ngInfo["__regex__"][i];
			
			var tr = $('#ngInfoTr2').clone();
			$(tr).find('#ngInfoRegexText').val(info.expression);
			$(tr).find('#ngInfoTransparentCheck').prop('checked',info.transparent);
			$(tr).find('#ngInfoTextText').val(info.text);
			$(tr).show();
			
			$('#ngInfoTr2').before(tr);
		}
		
		$(".remove").click(function(){
			$(this).parent().parent().remove();
			var name = ($(this).parent().next().html());
			delete ngInfo[name];
			chrome.storage.local.set({ngInfo:JSON.stringify(ngInfo)});

		});

		$(".append").click(function(){
			var tr = $('#ngInfoTr2').clone();
			$(tr).find('#ngInfoRegexText').val("");
			$(tr).find('#ngInfoTransparentCheck').prop('checked',"");
			$(tr).find('#ngInfoTextText').val("");
			$('#ngInfoTr3').before(tr);
			$(tr).show();

			$(".remove2").click(function(){
				$(this).parent().parent().remove();
				var regex = ($(this).parent().next().html());
				for(var i in ngInfo["__regex__"]){
					if(regex == ngInfo["__regex__"][i].regex){
						delete ngInfo["__regex__"][i];
					}
				}
				
				chrome.storage.local.set({ngInfo:JSON.stringify(ngInfo)});
			});
		});

		$(".remove2").click(function(){
			$(this).parent().parent().remove();
			var regex = ($(this).parent().next().html());
			for(var i in ngInfo["__regex__"]){
				if(regex == ngInfo["__regex__"][i].regex){
					delete ngInfo["__regex__"][i];
				}
			}
			
			chrome.storage.local.set({ngInfo:JSON.stringify(ngInfo)});
		});

		$("#ngInfoDiv .list").click(function(){
			var optionList = [];
			// localstorageから理由を収集
			//for(var i in ngInfo){
			//	var info = ngInfo[i];
			//	if("" != info.reason.trim()){
					//optionList[info.reason] = "dummy";
			//	}
			//}
			
			// 入力欄から理由を収集
			$('.ngInfoTr').each(function(){
				var reason = $(this).find('#ngInfoReasonText').val();
				if("" != reason){
					optionList[reason] = "dummy";
				}
			});
			
			var optionHtml = "<option></option>";
			for(var i in optionList){
				optionHtml += "<option>" + i + "</option>";
			}
				
			if(0 == $(this).parent().find('#select').length){
				$(this).parent().append('<select id="select">' +
										optionHtml +
										'</select>');
			}else{
				$(this).parent().find('#select').remove();
			}
			$(this).parent().find('#select').focus();
			//$(this).parent().find('#select').on('blur',function(){
			//	$(this).remove();
			//});
			$(this).parent().find('#select').on('change',function(){
				$(this).parent().find('#ngInfoReasonText').val($(this).val());
				$(this).parent().find('#select').remove();
			});
		});
	
		$("#fontTd .list").click(function(){
			var optionList = [
								 '"游ゴシック","Yu Gothic"'
								,'Yu Gothic UI'
								,'"游明朝","Yu Mincho"'
								,'"MS UI Gothic"'
								,'"ＭＳ ゴシック","MS Gothic"'
								,'"ＭＳ Ｐ明朝","MS PMincho"'
								,'"ＭＳ 明朝","MS Mincho"'
							];
			
			var optionHtml = "<option></option>";
			for(var i in optionList){
				optionHtml += "<option>" + optionList[i] + "</option>";
			}
				
			if(0 == $(this).parent().find('#select').length){
				$(this).parent().append('<select id="select">' +
										optionHtml +
										'</select>');
			}else{
				$(this).parent().find('#select').remove();
			}
			$(this).parent().find('#select').focus();
			//$(this).parent().find('#select').on('blur',function(){
			//	$(this).remove();
			//});
			$(this).parent().find('#select').on('change',function(){
				$(this).parent().find('#commentFont').val($(this).val());
				$(this).parent().find('#select').remove();
			});
		});
	
    });
	
	return ngInfo;
}

function authorize(){
	$('#auth').click(function(){
		$.ajax({
			type: 'post',
			data: {"postKey": $('#key').val()}, 
			url: 'https://onspring.sakura.ne.jp/kato-junichi/addon/isJoinNemousuChannel.php',
			success: function(data){
				if("true" == data.result){
					$('#authorized').prop('src','../images/check.png');
					chrome.storage.local.set({authorize:$('#key').val()});
				}
				$('#authStatus').html("認証結果：" + data.result);
			},
			error: function(xhr, textStatus, error){
				$('#authStatus').html("認証結果：" + xhr.statusText);
			}
		});
	});
	
	chrome.storage.local.get(function(items) {
        var isAuth = false;
        var authorize = items.authorize;
		if(null != authorize){
			$('#key').val(authorize);
			$.ajax({
				type: 'post',
				data: {"postKey": authorize}, 
				url: 'https://onspring.sakura.ne.jp/kato-junichi/addon/isJoinNemousuChannel.php',
				success: function(data){
					if("true" == data.result){
						$('#authorized').prop('src','../images/check.png');
					}
					$('#authStatus').html("認証結果：" + data.result);
				},
				error: function(xhr, textStatus, error){
					$('#authStatus').html("認証結果：" + xhr.statusText);
				}
			});
			
		}
	
    });
	
	return ngInfo;
}

function getRandomToken() {
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
    return hex;
}
