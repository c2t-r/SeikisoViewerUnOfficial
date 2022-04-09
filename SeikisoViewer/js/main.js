var debug = false;
var fw, $istyle;
var doc = document;
var videoId;
var impopout = false;
var gaming = false;
var twitcasting = false;
var openrec = false;
var mixer = false;
var panda = false;
var bilibili = false;
var abema = false;
var timer;
var setting;
var options;
var ngInfo;
var ngInfoShare = {};
var auth;
var validNg = true;
var usable = true;
var userId = "";
var commentArray = null;
var enabled = true;

$(document).ready(function () {
    
    var checkTm = setInterval(function () {
        clearInterval(checkTm);

        if (-1 < $(location).attr('href').indexOf('youtube.com')) {
            timer = setInterval(function(){
            	YOUTUBE.init();
            }, 1000);
        }
        
    }, 1000);

    try {
        chrome.storage.local.get(function (items) {
            //log(items.options);
            if (null != items.options) {
                options = JSON.parse(items.options);
            }
            if (null != items.ngInfo) {
                ngInfo = JSON.parse(items.ngInfo);

                for (var i in ngInfo["__regex__"]) {
                    var info = ngInfo["__regex__"][i];
                    info["regexObject"] = new RegExp(info.expression);

                }
            } else {
                ngInfo = {};
            }
            if (null != items.userId) {
                userId = items.userId;
            }

            //getNgInfoShare();

            $('head').append((null != options && null != options.cssLink) ? options.cssLink : "");

            if (null != items.enabled) {
                enabled = items.enabled;
            }
            var request = { method: "setEnabled", enabled: enabled };
            chrome.runtime.sendMessage(request, function (response) { });
        });
        
        /*
        setInterval(function () {
            chrome.storage.local.get(function (items) {
                //log(items.options);
                if (null != items.options) {
                    options = JSON.parse(items.options);
                }
                if (null != items.ngInfo) {
                    ngInfo = JSON.parse(items.ngInfo);

                    for (var i in ngInfo["__regex__"]) {
                        var info = ngInfo["__regex__"][i];
                        info["regexObject"] = new RegExp(info.expression);
                    }
                } else {
                    ngInfo = {};
                }
                if (null != items.userId) {
                    userId = items.userId;
                }
            });
        }, 5000);
        
		setInterval(function(){
			//getNgInfoShare();
		},60000);
		*/
    } catch (e) {
        log(e);
    }

	/*
    setInterval(function () {
        setTimeout(removeComments, 0, false);
    }, 1000);

    setInterval(function () {
        setTimeout(function () {
            $('.nicocommentDead').remove();
        }, 0);
    }, 30000);
	*/

    $('body').prepend('<input type="text" id="copyText" value="" style="opacity:0; position:absolute; top:0px; left:0px;">');
    $('body').prepend('<button id="copyButton" data-clipboard-target="#copyText" style="position:absolute; top:0px; left:0px;">');
    var clipboard = new Clipboard('#copyButton');

    setTimeout(function () {
        /*
            $('#commentDiv2').append('<div id="ipop" style="z-index:99999;">' +
                                    '<div id="ipop_title">タイトル</div>' +
                                    '<div id="ipop_close">閉じるボタン</div>' +
                                    '' +
                                    '</div>');
                                    // ポップアップウインドウを表示する。
        	
            var wx, wy;    // ウインドウの左上座標
    
        // ウインドウの座標を画面中央にする。
        wx = $(document).scrollLeft() + ($(window).width() - $('#ipop').outerWidth()) / 2;
         if (wx < 0) wx = 0;
         wy = $(document).scrollTop() + ($(window).height() - $('#ipop').outerHeight()) / 2;
         if (wy < 0) wy = 0;
            $('#ipop').css({top: wx, left: wx}).fadeIn(100);
    
             // 閉じるボタンを押したとき
            $('#ipop_close').click(function() {$('#ipop').fadeOut(100);});
    
             // タイトルバーをドラッグしたとき
            $('#ipop_title').mousedown(function(e) {
               var mx = e.pageX;
               var my = e.pageY;
               $(document).on('mousemove.ipop', function(e) {
                 wx += e.pageX - mx;
                 wy += e.pageY - my;
                 $('#ipop').css({top: wy, left: wx});
                 mx = e.pageX;
                 my = e.pageY;
                 return false;
               }).one('mouseup', function(e) {
                 $(document).off('mousemove.ipop');
               });
               return false;
             });
             */
    }, 500);

    setInterval(function(){
    	setTimeout(function(){
	        var p = 0;
	        var canvasWidth = $('canvas').width();
			var commentParallelCount = (null != options && null != options.commentParallelCount) ? options.commentParallelCount : 30;
	        
	        for (var i in commentsArray) {
	            var commentInfo = commentsArray[i];

	            if (commentInfo.left > canvasWidth * 2 + commentInfo.commentWidth
	       //      ||  ((null == options || null == options.limitOver || "0" == options.limitOver) && i >= commentParallelCount)
	             ) {
	                commentsArray.splice(p, 1);
	            } else {
	                p += 1;
	            }
	        }
	        //console.log(commentsArray);
	   },0);
    },1000);

    /*
    setInterval(function(){
    	render(canvasInfo);
    }, 5);
    */
    
    initCanvas();
    
	function animationLoop(){
		render(canvasInfo);
		requestAnimationFrame(animationLoop);
		// 比較係数を更新
		updateTimeRatio();
	}
	animationLoop();
	//offscreen = $('<canvas></canvas>')[0].transferControlToOffscreen();
});

function initCanvas(){
		changeCanvasInfo();
    
	var ct = setInterval(function(){
		if(0 == $('#commentDiv3').length){
			return;
		}
		
		clearInterval(ct);
		
		var canvas = $('#commentDiv3')[0].getContext( '2d' );
		canvas.setTransform(1, 0, 0, 1, 0, 0);
		try{
			canvasInfo.canvas.clearRect(0, 0, 10000, 10000);
		}catch(e){}
        if($('.html5-video-player').hasClass('ytp-fullscreen')){
			canvas.scale(4,4);
        }else{
			canvas.scale(2,2);
		}
    }, 200);
}

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
/*
*/

var canvasInfo;
function changeCanvasInfo(){
	clearCanvas();
	
	var cci = setInterval(function(){
		if(0 == $('#txtFontSize',doc).length){
			return;
		}
		
		clearInterval(cci);
		
	    var fontSize = Number(doc.getElementById('txtFontSize').value);
	    var fontColor = doc.getElementById('txtFontColor').value;
	    var divWidth = $('#commentDiv3').width();
	    var canvas = $('#commentDiv3')[0].getContext('2d');
	    var canvasWidth = $('#commentDiv3').width();
	    var canvasHeight = $('#commentDiv3').height();
	    canvas.clearRect(0, 0, canvasWidth, $('#commentDiv3').height());
	    canvas.lineWidth = 1;
	    canvas.font = 'bold ' + fontSize + 'px "メイリオ", "Hiragino Kaku Gothic ProN","ＭＳ Ｐゴシック", Arial, Simsun, Gulim, sans-serif ';
	    //canvas.font = 'bold ' + fontSize + 'px -apple-system,BlinkMacSystemFont,Helvetica Neue,Hiragino Kaku Gothic ProN,Meiryo,\\30E1\30A4\30EA\30AA,sans-serif';
	    canvas.fillStyle = fontColor;
	    canvas.strokeStyle = "#000000bf";//"#0000003b";//"#000000a1";//"black";
	    canvas.imageSmoothingEnabled = true;
	    
	    canvasInfo = {fontSize: fontSize, fontColor : fontColor, divWidth:divWidth, canvas:canvas, canvasWidth:canvasWidth, canvasHeight:canvasHeight};
		/*
			offscreen = document.createElement('canvas');
			offscreen.width = canvasWidth * 2;
			offscreen.height = canvasHeight * 2;
			offscreen.lineWidth = canvas.lineWidth;
			offscreen.font = canvas.font;
			offscreen.fillStyle = "white";//canvas.fillStyle;
			offscreen.strokeStyle = canvas.strokeStyle;
			offscreenCtx = offscreen.getContext('2d');
			offscreen.scale(2,2);
		*/
	},200);
}

let time = 0;
let timeRatio = 1;

function updateTimeRatio() {
    const lastTime = time;
    if (lastTime > 0) {
        // 1フレーム当たりの時間(ミリ秒)
        const FPS_60_SEC = 1000 / 60;
        // 差分時間をセット
        const dTime = new Date().getTime() - lastTime;
        // FPS60との比較係数をセット
        timeRatio = dTime / FPS_60_SEC;
    }
    // 現在時間をセット
    time = new Date().getTime();
    
    /*
    if(3 < timeRatio){
    	lock = true;
	}else{
		setTimeout(function(){
			lock = false;
		},500);
	}
	*/
}

function clearCanvas(){
	try{
		if($('.html5-video-player').hasClass('ytp-fullscreen')){
		    canvasInfo.canvas.clearRect(0, 0, 1920, 1080);
		    canvasInfo.canvasc.clearRect(0, 0, 1920, 1080);
		}else{
		    canvasInfo.canvas.clearRect(0, 0, canvasInfo.canvasWidth, canvasInfo.canvasHeight);
		    canvasInfo.canvasc.clearRect(0, 0, canvasInfo.canvasWidth, canvasInfo.canvasHeight);
		}
	}catch(e){
	}
}

var lock = false;
var commentsArray = [];
        var imgs = [];
function render(canvasInfo) {
    var st = (new Date()).getTime(); //★
    if (0 != $('#commentDiv3').length && null != canvasInfo) {
    	try{
	        clearCanvas();
	        
	        var p = 0;
	        
	        for (var i in commentsArray) {
	            var commentInfo = commentsArray[i];
	            canvasInfo.canvas.strokeText(commentInfo.comment, canvasInfo.canvasWidth - commentInfo.left, commentInfo.top);
	            canvasInfo.canvas.fillText(commentInfo.comment, canvasInfo.canvasWidth - commentInfo.left, commentInfo.top);

	            var m = commentInfo.moveWidth * timeRatio;
	            commentInfo.left += m;
	        }
	        
	        /*
	        if(5 < timeRatio){
	        	console.log(timeRatio);
	        	commentsArray.splice(commentsArray.length - 1, 1);
			}
			*/
		}catch(e){
			console.log(e);
		}
	}
}

function handlePaste(e) {
    var clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

    // Do whatever with pasteddata
    //alert(pastedData);
    clipboardData.setData('Text', 'aaa');
    var area = doc.getElementById('input').childNodes[3];
    var url = pastedData.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/);
    //if(null != url){
    //	alert(url[0].replaceAll('\/','@'));
    //	alert($(area).html());
    //}
}

function dispCome() {
    var $commentDiv = $('#commentDiv');
    if ($('#displayCome', doc).prop('checked')) {
        $commentDiv.css('display', '');
    } else {
        $commentDiv.css('display', 'none');
        //removeComments(true);
        //canvasInfo.canvas.clearRect(0, 0, canvasInfo.canvasWidth, canvasInfo.canvasHeight);
    }

    if (null != setting) {
        setting.displayCome = $('#displayCome', doc).prop('checked');
    }
}

function changeComeShita() {
    if (null != setting) {
        setting.displayComeShita = $('#displayComeShita', doc).prop('checked');
    }
    //removeComments(true);
	changeCanvasInfo();
}

function changeFontSizetxt() {
    $("#txtFontSizeBar", doc).slider("value", $("#txtFontSize", doc).val());
	changeCanvasInfo();

}

function changeChatFontSizetxt() {
    $("#chatTxtFontSizeBar", doc).slider("value", $("#chatTxtFontSize", doc).val());

    try {
        var fontSize = Number(doc.getElementById('chatTxtFontSize').value);
        //$('#mystyle').html(
        $('#mystyle', doc).append('#message.yt-live-chat-text-message-renderer, yt-live-chat-text-message-renderer yt-img-shadow { font-size:' + fontSize + 'px!important; line-height: 1em!important;}');
        //$('#mystyle',doc).append('yt-live-chat-text-message-renderer yt-img-shadow { width:' + fontSize * 5 + 'px!important;}');
        //$('#mystyle',doc).append('#message.yt-live-chat-text-message-renderer #message { line-height: 1em!important;}');
        //);
    } catch (e) {
    }

    if (null != setting) {
        setting.chatTxtFontSize = $('#chatTxtFontSize', doc).val();
    }
}

function changeFontSize() {
    try {
        // 下から流すフラグ
        var shita = $('#displayComeShita', doc.body).prop('checked');

        // フォントの変更適用
        var commentDiv = document.getElementById('commentDiv');
        var fontSize = Number(doc.getElementById('txtFontSize').value);
        commentDiv.style.fontSize = fontSize + "px";

        lineHeight = fontSize + 8;
        //lineHeight = fontSize * 1.2;
        var comDivHeight = commentDiv.offsetHeight;
        maxLine = Math.floor((comDivHeight) / (lineHeight));
        maxLine = maxLine - 1;
        rushCriteria = (null != options && null != options.rushCriteria) ? maxLine * options.rushCriteria : maxLine * 1.5;

        var comments = document.getElementsByName('comment');
        for (var i in comments) {
            var p = comments[i];
            var div = document.createElement('div');
            div.style.display = 'none';
            div.innerHTML = p.innerHTML;
            //log($(div).find("img"));
            var imgSize = 5 > fontSize ? 5 : fontSize;
            $(div).find("img").each(function () {
                $(this).css("width", imgSize);
                $(this).css("height", imgSize);
                //log($(this));
            });
            //log(div.innerHTML);
            p.innerHTML = (div.innerHTML);
        }
    } catch (e) {
    }

    if (null != setting) {
        setting.txtFontSize = $('#txtFontSize', doc).val();
    }
}

function changeChatFontSize() {
    try {
        var fontSize = Number(doc.getElementById('chatTxtFontSize').value);
        //$('#mystyle').html(
        $('#mystyle', doc).append('#message.yt-live-chat-text-message-renderer { font-size:' + fontSize + 'px!important;}');
        //);
    } catch (e) {
    }

    if (null != setting) {
        setting.chatTxtFontSize = $('#chatTxtFontSize', doc).val();
    }
}

function changeFontColor() {
    try {
        var commentDiv = document.getElementById('commentDiv');
        var fontColor = doc.getElementById('txtFontColor').value;
        commentDiv.style.color = fontColor;
    } catch (e) {
    }

    if (null != setting) {
        setting.txtFontColor = $('#txtFontColor', doc).val();
    }
	changeCanvasInfo();
}

var maxLine = 7;
var lastComId = "";
var atRatio = 250;
var lineHeight = 35;
var rushCriteria = maxLine * 1.5;
var sync = false;
var ratio = 5;


function getCommentId(commentList, idx) {
}

function getComment(commentList, idx) {
}

function reloadLastComId(commentList, asc) {
    if (asc) {
        lastComId = getCommentId(commentList, 0);
    } else {
        lastComId = getCommentId(commentList, commentList.length - 1);
    }
}

function reloadPrevLastComId(commentList, asc) {
    if (asc) {
        lastComId = getCommentId(commentList, 1);
    } else {
        lastComId = getCommentId(commentList, commentList.length - 2);
    }
}

var comDivWidth = 0;
var nowWriting = false;
var mtime = 0;
var currentCommentWidthArray = [];
var pactiveTimeArray = [];
var plifeTimeArray = [];
var doLeftTouchTimeArray = [];
var activeLeftTouchTimeArray = [];
var activeRightTouchTime1Array = [];
var activeRightTouchTime2Array = [];

setInterval(function(){
	currentCommentWidthArray = [];
	pactiveTimeArray = [];
	plifeTimeArray = [];
	doLeftTouchTimeArray = [];
	activeLeftTouchTimeArray = [];
	activeRightTouchTime1Array = [];
	activeRightTouchTime2Array = [];
},30000);

function moveComment(commentList, asc, notAsync) {
	if(lock){
		console.log('lock');
		return;
	}
	
    mtime = (new Date()).getTime();

    //if(nowWriting) return;

    //log('sync:'+sync);
    if (sync) {
        log('sync:' + sync);
        return;
    }
    //log('moveComment:' + document.getElementsByTagName('video')[0].currentTime);
    sync = true;

    try {
        if (null == fw && !gaming) fw = document.getElementById('live-chat-iframe').contentWindow;
    } catch (e) {
        sync = false;
    }

    sta = (new Date()).getTime(); //★
    if ((null != fw || gaming || twitcasting || openrec || mixer || abema) && null != doc) {
        var cai = asc ? commentList.length - 1 : 0;

        if (commentArray == null) {
            commentArray = {};
            while (true) {
                st1 = (new Date()).getTime(); //★
                if (asc) {
                    if (!(cai >= 0)) break;
                } else {
                    if (!(cai < commentList.length)) break;
                }

                var currentComId = getCommentId(commentList, cai);
                var currentcomment = getComment(commentList, cai);

                var name = currentComId.split("_@_")[0];
                var array = commentArray[name];
                if (null == array) {
                    array = new Array();
                }
                array.push(currentcomment);
                commentArray[name] = array;


                if (asc) {
                    cai--;
                } else {
                    cai++;
                }

            }
        }

        var commentDiv = document.getElementById('commentDiv');
        if (commentDiv == null) {
            sync = false;
            log('commentDiv == null');
            return;
        }
        if (commentDiv.style.display == 'none') {
            sync = false;
            log('commentDiv.style.display == none');

            // コメント非表示時でも最終コメントは更新する
            //var commentList = doc.getElementsByTagName('yt-live-chat-text-message-renderer');
            if (commentList.length > 1) {
                if (asc) {
                    lastComId = getCommentId(commentList, 1);
                    // NG用のコメント取得
                    getCommentId(commentList, 0);
                } else {
                    lastComId = getCommentId(commentList, commentList.length - 2);
                    // NG用のコメント取得
                    getCommentId(commentList, commentList.length - 1);
                }
                //lastComId = removeAlink(lastComId);
            }

            return;
        }

        // フォントの変更適用
        try {
            var commentLifeTime = (null != options && null != options.commentLifeTime) ? options.commentLifeTime : 5000;
            // 下から流すフラグ
            var shita = $('#displayComeShita', doc.body).prop('checked');

            var commentDiv = document.getElementById('commentDiv');
            var fontSize = Number(doc.getElementById('txtFontSize').value);
            var fontColor = doc.getElementById('txtFontColor').value;
            commentDiv.style.fontSize = fontSize + "px";
            commentDiv.style.color = fontColor;
            var fontBase = '"Hiragino Kaku Gothic ProN","メイリオ", "ＭＳ Ｐゴシック", Arial, Simsun, Gulim, sans-serif';
            var fontFamily =
                ((null != options && null != options.commentFont) ? options.commentFont.replace(/'/g, '"') + ',' + fontBase : fontBase);
            commentDiv.style.fontFamily = fontFamily;

            lineHeight = fontSize + 8;
            //lineHeight = fontSize * 1.2;
            var comDivHeight = commentDiv.offsetHeight;
            //maxLine = Math.floor((comDivHeight) / (lineHeight));
            //maxLine = maxLine-1;
            maxLine = (null != options && null != options.maxLine && 0 < options.maxLine) ? options.maxLine : Math.floor((comDivHeight) / (lineHeight)) - 1;
            rushCriteria = (null != options && null != options.rushCriteria) ? maxLine * options.rushCriteria : maxLine * 1.5;

            //var commentList = doc.getElementsByTagName('yt-live-chat-text-message-renderer');

            // 初回時初期化
            if (commentList.length > 1 && "" == lastComId) {
                if (asc) {
                    lastComId = getCommentId(commentList, 1, ngInfo);
                } else {
                    lastComId = getCommentId(commentList, commentList.length - 2, ngInfo);
                }
            }

            if (0 == commentList.length) {
                sync = false;
                return;
            }

            var currentLastComId;
            if (asc) {
                currentLastComId = getCommentId(commentList, 0, ngInfo);
            } else {
                currentLastComId = getCommentId(commentList, commentList.length - 1, ngInfo);
            }

            //log('00★'+((new Date()).getTime() - st)+'★');
            var cnt = 0;
            var ci = asc ? 0 : commentList.length - 1;
            while (true) {
                st1 = (new Date()).getTime(); //★
                if (asc) {
                    if (!(ci < commentList.length)) break;
                } else {
                    if (!(ci >= 0)) break;
                }
                //for(var ci=0;ci < commentList.length;ci++){
                var currentcomment;
                var currentComId = getCommentId(commentList, ci);
                currentcomment = getComment(commentList, ci);

                var div = document.createElement('div');
                div.style.display = 'none';
                div.innerHTML = currentcomment;
                //log($(div).find("img"));
                var imgSize = 5 > fontSize ? 5 : fontSize - 5;
                if (-1 < div.innerHTML.indexOf('img')) {
                    $(div).find("img").each(function () {
                        $(this).css("width", imgSize);
                        $(this).css("height", imgSize);
                        //log($(this));
                    });
                }
                currentcomment = div.innerHTML;

                //log('currentComId:' + currentComId);
                //log('currentcomment:' + currentcomment);
                //log('lastComId:' + lastComId);
                if (currentComId == lastComId) {
                    break;
                } else {
                    var name = currentComId.split("_@_")[0];
                    var array = commentArray[name];
                    if (null == array) {
                        array = new Array();
                    }
                    array.push(currentcomment);
                    commentArray[name] = array;

                    if (-1 < currentcomment.indexOf("<span")) {
                        if (asc) {
                            ci++;
                        } else {
                            ci--;
                        }
                        continue;
                    }

                    if (5 < cnt) {
                        console.log("break");
                        break;
                    }

                    var st = (new Date()).getTime();

                    var dat = new Date();
                    var timestamp = dat.getTime();
                    var comments = commentsArray;

					/*
                    var commentParallelCount = (null != options && null != options.commentParallelCount) ? options.commentParallelCount : 30;
                    if ((null != options && null != options.limitOver && "1" == options.limitOver) && comments.length >= commentParallelCount) {
                        log('★limit over★');
                        if (asc) {
                            ci++;
                        } else {
                            ci--;
                        }
                        continue;
                    }
                    */

                    var line = shita ? maxLine - 1 : 0;
                    //if(shita) line = maxLine-1;

                    var i = shita ? maxLine - 1 : 0;
                    //var i=0;
                    //if(shita) i=maxLine-1;

                    var pline = null;

                    // 表示中コメントの整理
                    var newestLineArray = [];

                    //for(var j=0;j<comments.length;j++){
                    //i=0;
                    //if(shita) i=comments.length-1;
                    i = shita ? comments.length - 1 : 0;

                    while (true) {
                        if (!shita) {
                            if (!(i < comments.length)) break;
                        } else {
                            if (!(i >= 0)) break;
                        }

                        p = comments[i];
                        var pUseLine = p.useLine;

						if(!plifeTimeArray[p.id]){
	                        var pactiveTime = Math.round(Number(p.id) + p.commentWidth * ratio);
	                        p.lifeTime = pactiveTime;
	                        plifeTimeArray[p.id] = pactiveTime;
	                    }
						pactiveTime = plifeTimeArray[p.id];

                        var pnl = newestLineArray["pu" + pUseLine];
                        if (null == pnl) {
                            //log("null == pnl");
                            newestLineArray["pu" + pUseLine] = p;
                        } else {
							if(!pactiveTimeArray[pnl.id]){
	                            var activeTime = Number(pnl.id) + pnl.commentWidth * ratio;
		                        pactiveTimeArray[pnl.id] = activeTime;
		                        //console.log('a');
		                    }else{
		                        //console.log('b');
		                    }

                            if (pactiveTime > pactiveTimeArray[pnl.id]) {
                                newestLineArray["pu" + pUseLine] = p;
                            }
		                    
                        	/*　★★★
                            var activeTime = Number(pnl.id) + pnl.commentWidth * ratio;
	                        pactiveTimeArray[pnl.id] = activeTime;

                            if (pactiveTime > activeTime) {
                                newestLineArray["pu" + pUseLine] = p;
                            }
		                    */

                        }

                        if (!shita) { i++; } else { i--; }
                    }

                    var lineFull = true;
                    //i=0;
                    //if(shita) i=maxLine-1;
                    i = shita ? maxLine - 1 : 0;

                    var nlaMax = 0;
                    while (true) {
                        if (!shita) {
                            if (!(i < maxLine)) break;
                        } else {
                            if (!(i >= 0)) break;
                        }

                        if (null == newestLineArray["pu" + i]) {
                            lineFull = false;
                        } else {
                            nlaMax++;
                        }

                        if (!shita) { i++; } else { i--; }
                    }

                    line = nlaMax;
                    if (shita) line = maxLine - nlaMax - 1;

                    log('nlaMax:' + nlaMax);

                    var find = false;
                    //i=0;
                    //if(shita) i=maxLine-1;
                    i = shita ? maxLine - 1 : 0;
                    while (true) {
                        if (!shita) {
                            if (!(i < nlaMax)) break;
                        } else {
                            if (!(i >= maxLine - nlaMax)) break;
                        }

                        if (null == newestLineArray["pu" + i]) {
                            find = true;
                            line = i;
                            break;
                        }

                        if (Number(newestLineArray["pu" + i].id) + commentLifeTime < (new Date()).getTime()) {
                            log('流れてるコメントが消される寸前の場合:');
                            find = true;
                            pline = newestLineArray["pu" + i];
                            line = i;
                            break;
                        }

                        if (!shita) { i++; } else { i--; }
                    }

                    var commentOverlap = false;
                    var delay = false;
                    log('find linefull:' + find + ',' + lineFull);
                    
                    if(!currentCommentWidthArray[currentcomment]){
	                    var currentCommentWidth = strWidth(currentcomment);
	                    currentCommentWidthArray[currentcomment] = currentCommentWidth;
	                }
                    var currentCommentWidth = currentCommentWidthArray[currentcomment];
                    
                    /*★★★
	                var currentCommentWidth = strWidth(currentcomment);
                    */
	                
	                
                    //currentCommentWidth = currentcomment.length * fontSize + 10;
                    if (!find || lineFull) {
                        //i=0;
                        //if(shita) i=maxLine-1;
                        i = shita ? maxLine - 1 : 0;

                        while (true) {
                            if (!shita) {
                                if (!(i < maxLine)) break;
                            } else {
                                if (!(i >= 0)) break;
                            }
                            //log('newestLineArray j:' + j);

                            var nl = newestLineArray["pu" + i];

                            if (null == nl) break;
                            //log('null != nl');
                            // 流すコメントの左端が領域左端に到達する予測時刻
                            if(!doLeftTouchTimeArray[nl.id]){
	                            var doLeftTouchTime = (new Date()).getTime() + (commentLifeTime - currentCommentWidth * ratio) - 800;
								doLeftTouchTimeArray[nl.id] = doLeftTouchTime;
							}
							doLeftTouchTime = doLeftTouchTimeArray[nl.id];
							
                            var ttime = Number(nl.id);

                            // 流れてるコメントの右端が領域左端に到達する予測時刻
                            if(!activeLeftTouchTimeArray[nl.id]){
                            	activeLeftTouchTimeArray[nl.id] = ttime + commentLifeTime + 0;
                            }
                            var activeLeftTouchTime = activeLeftTouchTimeArray[nl.id];
                            
                            // 流れてるコメントの右端が領域右端に到達する予測時刻
                            if(!activeRightTouchTime1Array[nl.id]){
                            	activeRightTouchTime1Array[nl.id] = ttime + nl.commentWidth * ratio;
                            }
                            var activeRightTouchTime1 = activeRightTouchTime1Array[nl.id];
                            //var activeRightTouchTime1 = ttime + nl.commentWidth * ratio;
                            
                            if(!activeRightTouchTime2Array[nl.id]){
                            	activeRightTouchTime2Array[nl.id] = ttime + nl.commentWidth * ratio + 300;
                            }
                            var activeRightTouchTime2 = activeRightTouchTime2Array[nl.id];
                            //var activeRightTouchTime2 = ttime + nl.commentWidth * ratio + 300;
                            if (
                                (
                                    activeRightTouchTime1 < (new Date()).getTime()
                                    &&
                                    //3 > Math.abs($(nl).html().length - currentcomment.length)
                                    //50 > Math.abs($(nl).width() - currentCommentWidth)
                                    //&&
                                    doLeftTouchTime > activeLeftTouchTime
                                    &&
                                    nl.commentWidth < currentCommentWidth
                                )) {
                                log('find1');
                                pline = nl;
                                line = nl.useLine;
                                find = true;
                                break;
                            }
                            if (
                                activeRightTouchTime2 < (new Date()).getTime()
                                &&
                                nl.commentWidth >= currentCommentWidth
                            ) {
                                log('find2');
                                pline = nl;
                                line = nl.useLine;
                                find = true;
                                break;
                            }
                            if (
                                (
                                    Number(nl.id) + (commentLifeTime - 1000) < (new Date()).getTime()
                                )

                            ) {
                                //currentcomment += '(find lineFull:'+lineFull+')';
                                log('find4');
                                pline = nl;
                                line = nl.useLine;
                                find = true;
                                break;
                            }
                            if (
                                lineFull
                            ) {
                                log('find3');
                                var lt = Number.MAX_SAFE_INTEGER;
                                var minWidth = 9999;
                                for (var j in newestLineArray) {
                                    var p = newestLineArray[j];
                                    var tlt = Number($(p).prop('lifeTime'));
                                    log('delay:' + (tlt));
                                    if (lt > tlt) {
                                        lt = tlt;
                                        //var tminWidth = $(p).width();
                                        //if(minWidth > tminWidth){
                                        //	minWidth = tminWidth;
                                        pline = p;
                                        line = p.useLine;
                                    }
                                }

                                if (9000 > (timestamp - lt)) {
                                    log('delay:' + (timestamp - lt));
                                    //delay = true;
                                }
                                find = true;
                                commentOverlap = true;
                                break;
                            }

                            if (!shita) { i++; } else { i--; }
                        }
                    }

                    //log('4★'+((new Date()).getTime() - st)+'★');
                    var useLine = line % maxLine;

                    var useNum = 1;
                    var tlh = 25;

                    st = (new Date()).getTime(); //★
                    // 表示中のコメントを再取得
                    //comments = document.getElementsByName('comment');
                    var adjTop = false;
                    log('maxLine:' + maxLine);
                    if (commentOverlap && ((!shita && useLine != maxLine - 1) || (shita && useLine != 0))) {
                        //log('commentOverlap:' + commentOverlap);
                        for (var j in newestLineArray) {
                            var p = newestLineArray[j];
                            var tuseLine = Number(p.useLine);
                            adjTop = p.adjTop;

                            if (useLine == tuseLine) {
                                break;
                            }
                        }
                        //log('adjTop:' + adjTop);
                        if (eval(adjTop)) {
                            if (!shita) {
                                tlh = tlh + (lineHeight / 2);
                            } else {
                                tlh = tlh - (lineHeight / 2);
                            }
                            adjTop = false;
                        } else {
                            adjTop = true;
                        }
                    }
                    //log('aaa');
                    //log('5★'+((new Date()).getTime() - st)+'★');

                    var top = (useLine + 1) * lineHeight;// + tlh;

                    //log(line);
                    if (shita) {
                        top += adjTopUnderLine(comDivHeight, lineHeight, maxLine);
                    }
                    //log(line);

                    st = (new Date()).getTime(); //★
                    var lcActiveTime = currentcomment.length * atRatio;
                    //if(lcActiveTime > commentLifeTime) lcActiveTime = commentLifeTime;
                    lcActiveTime = commentLifeTime;
                    var activeTime = timestamp + lcActiveTime + (delay ? 2000 : 0);
                    var duration = commentLifeTime / 1000;

                    //setTimeout(function(){
                    /*
                    $('#commentDiv').append('<p name="nicocomment" id="' + timestamp + 
                                            '" class="nicocomment" line="' + line + '" useLine="' + useLine + 
                                            '" adjTop="' + adjTop + '"' +
                                            ' activeTime="' + activeTime + '" style="left: 0px; top:' + top + 
                                            'px; position:absolute; z-index: 9999;' +
                                            '-webkit-animation-duration:' + duration + 's!important;' +
                                            '-moz-animation-duration:' + duration + 's!important;' +
                                            '-ms-animation-duration:' + duration + 's!important;' +
                                            '-o-animation-duration:' + duration + 's!important;' +
                                            'animation-duration:' + duration + 's!important;' +
                                            //'font-size:' + fontSize + 'px; color:' + fontColor +
                                            '">' + 
                                            currentcomment + 
                                            '</p>');
                    */

                    rushCriteria = (null != options && null != options.rushCriteria) ? maxLine * options.rushCriteria : maxLine * 1.5;
                    //comments = document.getElementsByName('comment');

                    /*
                    if(rushCriteria <= comments.length){
                        var opacity = (null != options && null != options.rushOpacity) ? options.rushOpacity : '0.75';
                        $(eval('"#'+timestamp+'"')).css({opacity: opacity});
                    }
                    */

                    if (commentDiv != null && commentDiv.style.display != 'none') {
                        hoge2(adjTop, top, rushCriteria, comments, currentcomment, duration, timestamp, line, useLine, activeTime, currentCommentWidth);
                        
                    }
                    //},delay ? 2000 : 0);
                    //log('6★'+((new Date()).getTime() - st)+'★');

                }

                if (asc) {
                    ci++;
                } else {
                    ci--;
                }

                cnt++;
                //console.log('9★'+((new Date()).getTime() - sta)+'★');
            }
        } catch (e) {
            log(e);
            sync = false;
        }

        //log('setLastComId:'+currentLastComId);
        lastComId = currentLastComId;

    }
    sync = false;
}

var cArray = {};

function getCanvas(){
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	
    var fontSize = Number(doc.getElementById('txtFontSize').value);
    var fontColor = doc.getElementById('txtFontColor').value;
    var divWidth = $('#commentDiv3').width();
    var canvasWidth = $('canvas').width();
    var canvasHeight = $('canvas').height();
	ctx.scale(2,2);
    ctx.clearRect(0, 0, canvasWidth, $('canvas').height());
    ctx.lineWidth = 1;
    ctx.font = 'bold ' + fontSize + 'px "Hiragino Kaku Gothic ProN","メイリオ", "ＭＳ Ｐゴシック", Arial, Simsun, Gulim, sans-serif ';
    ctx.fillStyle = fontColor;
    ctx.strokeStyle = "black";
    
    return canvas;
}

var hoge2 = function (adjTop, top, rushCriteria, comments, currentcomment, duration, timestamp, line, useLine, activeTime, currentCommentWidth) {
    nowWriting = true;
    if (-1 < currentcomment.indexOf("<span")) {
        return;
    }

    var canvas = $('#commentDiv3')[0].getContext('2d');
    var canvasWidth = $('canvas').width();
    var moveWidth = (canvasWidth * 2 + currentCommentWidth) * 8 / (duration * 1000);
	
	/*
	var canvas2 = getCanvas();
	var ctx = canvas2.getContext('2d');
	
	ctx.strokeText(omitStr(currentcomment,true), currentCommentWidth, top);
	ctx.fillText(omitStr(currentcomment,true), currentCommentWidth, top);
	var imagedata = ctx.getImageData(0, 0, canvasWidth * 59, $('canvas').height());
    */
    
    commentsArray.push({
        comment: omitStr(currentcomment, true),
        left: 0,
        top: top,
        id: timestamp,
        line: line,
        useLine: useLine,
        adjTop: adjTop,
        activeTime: activeTime,
        commentWidth: currentCommentWidth,
        moveWidth: moveWidth
    });

    if (rushCriteria <= comments.length) {
        var opacity = (null != options && null != options.rushOpacity) ? options.rushOpacity : '0.75';
        //$(eval('"#' + timestamp + '"')).css({ opacity: opacity });
        $('#commentDiv3').css({ opacity: opacity });
    }
    nowWriting = false;
};

function strWidth(str) {
    var e = document.querySelector("#ruler");
    e.innerHTML = omitStr(str, true);
    var width = e.offsetWidth;
    //e.empty();
    return width;

}

function strHeight(str) {
    var e = document.querySelector("#ruler");
    e.innerHTML = omitStr(str, true);
    var height = e.offsetHeight;
    //e.empty();
    return height;

}

function removeAlink(str) {
    var alink = str.match(/([\s\S]*)(<a[\s\S]*>)([\s\S]*)(<\/a>)/i);
    if (null != alink && alink.length == 5) {
        return alink[1] + alink[3];
    }
    return str;
}

function removeSpan(str) {
    try {
        if (null != doc.querySelector(str)) {
            return $($(str)[0]).html();
        } else {
            return str;
        }
    } catch (e) {
        return str;
    }
}

function contextMenuCallback(key, opts) {
    //log(options);
    if ("ngNormal" == key) {
        var name = getName(opts);
        if (null == options || options.showNgReasonDialog) {
            createNgDialog(name, false);
        } else {
            addNgName(name, false, "");
        }
    }
    if ("ngTransparent" == key) {
        var name = getName(opts);
        if (null == options || options.showNgReasonDialog) {
            createNgDialog(name, true);
        } else {
            addNgName(name, true, "");
        }
    }
    if ("unng" == key) {
        var name = getName(opts);
        removeNgName(name);
        unng(opts.$trigger, name);
    }
    if ("extract" == key) {
        var name = getName(opts);
        extractComment(name);
    }
    if ("copy" == key) {
        var comment = getCommentOpt(opts);

        comment = comment.replace(/(<img[^>]*)alt="([^"]*)[^>]*>/g, function (all, group1, group2) {
            return group2;
        });

        comment = removeSpan(comment);

        $('#copyText').val(comment);
        $('#copyButton').click();
    }
}

function omitStr(str, notSlice) {
    var str = str.replace(/(<img[^>]*)alt="([^"]*)[^>]*>/g, function (all, group1, group2) {
        return group2;
    });

    //str = removeAlink(str);
    str = removeSpan(str);

    if (!notSlice) {
        if (10 < str.length) {
            var ostr = str.slice(0, 9);
            return ostr + "...";
        }
    }

    return str;
}

var addCommentTm;
function extractComment(name) {
    if (impopout) {
        var domain = gaming ? "gaming.youtube.com" : "www.youtube.com";
        var request = {
            type: "getCommentArrayOpener"
            , url: "https://" + domain + "/watch?v=" + videoId
            , videoId: videoId
        };
        chrome.runtime.sendMessage(request, function (response) { extractCommentEx(name) });
    } else {
        extractCommentEx(name);
    }
}

function extractCommentEx(name) {
    //console.log(commentArray[name]);
    var html = "";
    var cnt = 0;

    var color1 = '#ffffff';
    var color2 = '#eeeeee';

    for (var i in commentArray[name]) {
        var comment = commentArray[name][i];
        var color = 0 == cnt % 2 ? color1 : color2;
        html += "<tr cnt='" + cnt + "' class='ecTr'><td style='background-color:" + color + "; height:25px;'><yt-live-chat-text-message-renderer-ex>" +
            "<span id='message'>" +
            comment +
            "</span>" +
            "</yt-live-chat-text-message-renderer-ex></td></tr>";
        cnt++;
    }
    gcnt = cnt;

    clearInterval(addCommentTm);
    addCommentTm = setInterval(function () {
        if (impopout) {
            var domain = gaming ? "gaming.youtube.com" : "www.youtube.com";
            var request = {
                type: "getCommentArrayOpener"
                , url: "https://" + domain + "/watch?v=" + videoId
                , videoId: videoId
            };
            chrome.runtime.sendMessage(request, function (response) { });
        }

        cnt = 0;
        var html = "";
        for (var i in commentArray[name]) {
            var comment = commentArray[name][i];
            var color = 0 == cnt % 2 ? color1 : color2;
            cnt++;
            if (gcnt < cnt) {
                html += "<tr cnt='" + cnt + "' class='ecTr'><td style='background-color:" + color + "; height:25px;'><yt-live-chat-text-message-renderer-ex>" +
                    "<span id='message'>" +
                    comment +
                    "</span>" +
                    "</yt-live-chat-text-message-renderer-ex></td></tr>";
            }
        }
        gcnt = cnt;

        if ("" != html) {
            $('#dialog2>table').append(html);
        }
    }, 1000);

    $('#dialog2').remove();
    $('body').append('<div id="dialog2" title="' + name + '" class="yt-live-chat-text-message-renderer">' +
        '<table style="width:100%">' +
        html +
        '</table>' +
        '<br><button id="ngButton" style="outline:1px solid #000;padding-left:5px;padding-right:5px;background:#eee;">' +
        '通常NGに追加</button>&nbsp;&nbsp;&nbsp;' +
        '<button id="ngTrButton" style="outline:1px solid #000;padding-left:5px;padding-right:5px;background:#eee;">透明NGに追加</button>' +
        '</div>');
    $('#ngButton').click(function () {
        if (null == options || options.showNgReasonDialog) {
            createNgDialog(name, false);
        } else {
            addNgName(name, false, "");
        }
    });
    $('#ngTrButton').click(function () {
        if (null == options || options.showNgReasonDialog) {
            createNgDialog(name, true);
        } else {
            addNgName(name, true, "");
        }
    });

    $.contextMenu({
        context: document,
        selector: '.ecTr:not(.yt-live-chat-text-message-ng)',
        trigger: 'right',
        className: 'contextmenu',
        zIndex: 1000,

        build: function ($trigger, e) {
            return {
                callback: contextMenuCallback,
                items:
                {
                    "copy": { name: '"' + omitStr($trigger.find('#message').html()) + '"をコピーする' }
                }
            };
        }
    });
    $("#dialog2").dialog({
        modal: false,
        //autoOpen: false,
        width: 400,
        height: 400,
        close: function () {
            $(this).remove();
            clearInterval(addCommentTm);
        }
    });
    $('.ui-icon-closethick').css('background-image', 'url(' + chrome.extension.getURL("images/ui-icons_777777_256x240.png") + ')');
    $('div.ui-dialog').css('z-index', '10000');
}

function addNgName(name, transparent, reason) {
    chrome.storage.local.get(function (items) {
        //log(items.ngInfo);
        var ngInfo = items.ngInfo;
        if (null == ngInfo) {
            ngInfo = {};
        } else {
            ngInfo = JSON.parse(ngInfo);
            for (var i in ngInfo["__regex__"]) {
                var info = ngInfo["__regex__"][i];
                info["regexObject"] = new RegExp(info.expression);

            }
        }

        ngInfo[name] = { transparent: transparent, reason: reason };

        applyNg(ngInfo);

        chrome.storage.local.set({ ngInfo: JSON.stringify(ngInfo) }, function () { });
    });

    if ("" != userId) {
        $.ajax({
            url: "https://onspring3.sakura.ne.jp/kato-junichi/addon/ngInfo.php?addNgInfo=" + name + "&userId=" + userId,
            type: "get",
            success: function (res) {
            },
            error: function (xhr, textStatus, error) {
                showWarning(xhr.status);
                log(xhr.statusText);
                log(textStatus);
                log(error);
            }
        });
    }
}

function removeNgName(name) {
    chrome.storage.local.get(function (items) {
        //log(items.ngInfo);
        var ngInfo = items.ngInfo;
        if (null == ngInfo) {
            ngInfo = {};
        } else {
            ngInfo = JSON.parse(ngInfo);
        }
        delete ngInfo[name];
        chrome.storage.local.set({ ngInfo: JSON.stringify(ngInfo) });
    });

    if ("" != userId) {
        $.ajax({
            url: "https://onspring3.sakura.ne.jp/kato-junichi/addon/ngInfo.php?removeNgInfo=" + name + "&userId=" + userId,
            type: "get",
            success: function (res) {
            },
            error: function (xhr, textStatus, error) {
                showWarning(xhr.status);
                log(xhr.statusText);
                log(textStatus);
                log(error);
            }
        });
    }
}

var reason = "";
function createNgDialog(name, transparent) {
    var reasons = [];
    chrome.storage.local.get(function (items) {
        var ngInfo = items.ngInfo;
        if (null == ngInfo) {
            ngInfo = {};
        } else {
            ngInfo = JSON.parse(ngInfo);
        }

        for (var i in ngInfo) {
            if ("__regex__" == i) {
                continue;
            }
            reasons[ngInfo[i].reason] = "dummy";
        }

        var options = "";
        for (var i in reasons) {
            options += "<option value='" + i + "'>";
        }

        $("#dialog").remove();
        $('body').append('<div id="dialog" title="NG理由">' +
            '<input type="text" id="ngInfoReasonText" style="width:140px; margin-top:12px; margin-left:12px;" value="" autocomplete="on" list="r">' +
            '<datalist id="r">' +
            options +
            '</datalist></div>');
        $("#dialog").dialog({
            modal: true,
            //autoOpen: false,
            width: 200,
            height: 150,
            buttons: {
                "OK": function (options) {
                    reason = $('#ngInfoReasonText').val();
                    addNgName(name, transparent, reason);
                    $(this).dialog('close');
                    $(this).remove();
                }
            }
        });
        $('.ui-icon-closethick').css('background-image', 'url(' + chrome.extension.getURL("images/ui-icons_777777_256x240.png") + ')');
        $('div.ui-widget-overlay').css('z-index', '10001');
        $('div.ui-dialog').css('z-index', '10003');

    });
}

var timeMemo = "";
function createMemoTimeDialog(time) {

	var prevTimeMemo = localStorage.getItem('prevTimeMemo');
	if(!prevTimeMemo) prevTimeMemo = "ここにメモ";
	$("#dialog").remove();
	$('body').append('<div id="dialog" title="時間メモ">' +
	    '<input type="text" id="timeMemo" style="width:140px; margin-top:12px; margin-left:12px;" value="' + prevTimeMemo + '" autocomplete="on" list="r">' +
		/*
	    '<datalist id="r">' +
	    options +
	    '</datalist></div>' +
	    */
	    '');
	$('#timeMemo').select();
	$("#dialog").dialog({
	    modal: true,
	    //autoOpen: false,
	    width: 200,
	    height: 150,
	    buttons: {
	        "OK": function (options) {
	            timeMemo = $('#timeMemo').val().trim();
	            
            	var timeMemoJson = localStorage.getItem('timeMemo');
            	if(!timeMemoJson){
            		timeMemoJson = '{}';
            	}
            	timeMemoJson = JSON.parse(timeMemoJson);
            	if(!timeMemoJson[YOUTUBE.videoId]){
            		timeMemoJson[YOUTUBE.videoId] = [];
            	}
            	timeMemoJson[YOUTUBE.videoId].push({time: Math.round($('video').get(0).currentTime) - 10, memo: timeMemo});
                localStorage.setItem('timeMemo', JSON.stringify(timeMemoJson));
                
				localStorage.setItem('prevTimeMemo', timeMemo);
                
                loadTimeMemo();
                
	            $(this).dialog('close');
	            $(this).remove();
	        }
	    }
	});
	$('.ui-icon-closethick').css('background-image', 'url(' + chrome.extension.getURL("images/ui-icons_777777_256x240.png") + ')');
	$('div.ui-widget-overlay').css('z-index', '10001');
	$('div.ui-dialog').css('z-index', '10003');

}

function loadTimeMemo(){
	var timeMemoJson = localStorage.getItem('timeMemo');
	var linkIcon = gaming || YOUTUBE.styleDark ? "linkg.png" : "link.png";
	var fontColor = gaming || YOUTUBE.styleDark ? "white" : "black";
	if(timeMemoJson){
		timeMemoJson = JSON.parse(timeMemoJson);
		if(timeMemoJson[YOUTUBE.videoId]){
			var timeArray = timeMemoJson[YOUTUBE.videoId];
			
			$('#memoDetail table', doc).empty();
			
			for(var i in timeArray){
				var time = timeArray[i].time;
				var memo = timeArray[i].memo;
				
				//$('.ytp-ad-progress-list').append('<div class="ytp-ad-progress" style="left: 38.4179px; width: 6px; background: white;"></div>')
				$('#memoDetail table', doc).append(
					'<tr>' +
					'<td style="padding-right:3px;">' +
					'<img time=' + time + ' title="時間指定URLをクリップボードにコピー" style="cursor: pointer; width:12px; height:12px;" src="' + chrome.extension.getURL("images/" + linkIcon) + '"/>' +
					'</td>' + 
					'<td>' +
					'<span id="' + time + '" style="cursor:pointer; color: #3ea6ff; font-size:1.2rem;">' +
					sec2hour(time) + 
					'</span>' +
					'</td>' + 
					'<td style="color:' + fontColor + ';">' +
					memo +
					'</td></tr>');
			}
			
			$('#memoDetail span', doc).each(function(){
				$(this).click(function(){
					document.getElementsByTagName('video')[0].currentTime = Number($(this).prop('id'));
				});
			});
			
			$('#memoDetail img', doc).each(function(){
				$(this).click(function(){
					var time = Number($(this).attr('time'));
					
					$('#copyText').val("https://www.youtube.com/watch?v=" + YOUTUBE.videoId + "&t=" + time);
					$('#copyButton').click();
					
					return false;
				});
			});
		}else{
			$('#memoDetail table', doc).append(
				'<tr><td>' + 
				'<span style="color:' + fontColor + '; font-size:1.2rem;">' +
				'時間メモはありません' +
				'</span>' +
				'</td></tr>');
			
		}
	}
}

function loadTimeMemo2(){
	var timeMemoJson = localStorage.getItem('timeMemo');
	if(timeMemoJson){
		timeMemoJson = JSON.parse(timeMemoJson);
		if(timeMemoJson[YOUTUBE.videoId]){
			var timeArray = timeMemoJson[YOUTUBE.videoId];
			
			$('#memoDetail2 table', doc).empty();
			
			for(var i in timeArray){
				var time = timeArray[i].time;
				var memo = timeArray[i].memo;
				
				//$('.ytp-ad-progress-list').append('<div class="ytp-ad-progress" style="left: 38.4179px; width: 6px; background: white;"></div>')
				$('#memoDetail2 table', doc).append(
					'<tr>' +
					'<td style="padding-right:3px;">' +
					'<img time=' + time + ' title="時間指定URLをクリップボードにコピー" style="cursor: pointer; width:12px; height:12px;" src="' + chrome.extension.getURL("images/link.png") + '"/>' +
					'</td>' + 
					'<td>' +
					'<span id="' + time + '" style="cursor:pointer; color: #3ea6ff; font-size:1.2rem;">' +
					sec2hour(time) + 
					'</span>' +
					'</td>' + 
					'<td>' +
					memo +
					'</td></tr>');
			}
			
			$('#memoDetail2 span', doc).each(function(){
				$(this).click(function(){
					document.getElementsByTagName('video')[0].currentTime = Number($(this).prop('id'));
				});
			});
			
			$('#memoDetail2 img', doc).each(function(){
				$(this).click(function(){
					var time = Number($(this).attr('time'));
					
					$('#copyText').val("https://www.youtube.com/watch?v=" + YOUTUBE.videoId + "&t=" + time);
					$('#copyButton').click();
					
					return false;
				});
			});
		}else{
			$('#memoDetail2 table', doc).append(
				'<tr><td>' + 
				'<span style="color: white; font-size:1.2rem;">' +
				'時間メモはありません' +
				'</span>' +
				'</td></tr>');
			
		}
	}
}

function convert2Title(comment) {
    var title = comment.replace(/<img[!-~ ]+ alt="(\S+)"[!-~ ]+/g, function (s) {
        return s.slice(s.indexOf('alt="') + 5, s.indexOf('" class="'));
    });

    return title;
}


/***** ドラッグ開始時の処理 *****/
function f_dragstart(event) {
    //ドラッグするデータのid名をDataTransferオブジェクトにセット
    event.originalEvent.dataTransfer.setData("text", event.target.id);
}

/***** ドラッグ要素がドロップ要素に重なっている間の処理 *****/
function f_dragover(event) {
    //dragoverイベントをキャンセルして、ドロップ先の要素がドロップを受け付けるようにする
    event.preventDefault();
}

/***** ドロップ時の処理 *****/
function f_drop(event) {
    if (null == event) {
        var commentInputPosition = '0';
        if (null != options && null != options.commentInputPosition) {
            commentInputPosition = options.commentInputPosition;
        }
        changeCommentPosition(commentInputPosition);
    } else {
        log(event.currentTarget.id);
        var commentInputPosition = '0';
		/*
		if(0 != $('#panel-pages:visible',doc).length){
			commentInputPosition = '1';
		}
		*/
        if ("watch-header" == event.currentTarget.id || "info-contents" == event.currentTarget.id) {
            commentInputPosition = '1';
        }
        if ("html5-video-container" == event.currentTarget.id) {
            commentInputPosition = '2';
        }

        changeCommentPosition(commentInputPosition);
    }

    //エラー回避のため、ドロップ処理の最後にdropイベントをキャンセルしておく
    if (null != event) {
        event.preventDefault();
    }
}

function saveCommentInputPosition(commentInputPosition) {
    chrome.storage.local.set({ commentPositionStatus: commentInputPosition }, function () { });

    chrome.storage.local.get(function (items) {
        var json = {};
        if (null != items.options) {
            json = JSON.parse(items.options);
            json.commentInputPosition = commentInputPosition;
            chrome.storage.local.set({ options: JSON.stringify(json) });
        }
    });
}

var prevHeight;
var prevWidth;
var prevTop;
var prevLeft;
function changeCommentPosition(pos) {
    if ('0' == pos) {
        $('#dialog2').remove();
        if (0 != $('#live-chat-iframe2').length) $('#live-chat-iframe2').remove();
        $('#panel-pages', doc).show();
    } else if ('1' == pos) {
        $('#dialog2').remove();
        if (null == document.getElementById('live-chat-iframe2')) {
            $('#panel-pages', doc).hide();
            var lci = null;

            if (null != document.getElementById('live-chat-iframe')) {
                lci = $('#live-chat-iframe').clone();
            }
            if (null != document.getElementById('chatframe')) {
                lci = $('#chatframe').clone();
            }

            lci.hide();
            lci.attr('id', 'live-chat-iframe2');
            lci.css('width', '600');

            if (0 != $('#watch-header').length) {
                $('#watch-header').prepend(lci);
            } else {
                $('#info-contents').prepend(lci);
            }

            lci.on('load', function () {
                var doc2 = document.getElementById('live-chat-iframe2').contentWindow.document;
                $('#action-panel', doc2).css('width', '600');
                $('#panel-pages', doc2).attr('draggable', 'true');
                $('#panel-pages', doc2).on('dragstart', function (event) { f_dragstart(event); });
                $('yt-live-chat-header-renderer', doc2).remove();
                $('#chat', doc2).remove();
                $('#ticker', doc2).remove();
                lci.show();
            });
        }
    } else {
        $('#live-chat-iframe2').remove();
        $('#panel-pages', doc).show();

        // コメント入力ダイアログ生成
        $('body').append('<div id="dialog2">' + '</div>');
        $('#panel-pages', doc).hide();
        var lci = null;

        if (null != document.getElementById('live-chat-iframe')) {
            lci = $('#live-chat-iframe').clone();
        }
        if (null != document.getElementById('chatframe')) {
            lci = $('#chatframe').clone();
        }
        lci.hide();
        lci.attr('id', 'live-chat-iframe2');
        lci.css('width', '500');

        $('#dialog2').append(lci);

        lci.on('load', function () {
            var doc2 = document.getElementById('live-chat-iframe2').contentWindow.document;
            $('#action-panel', doc2).css('width', '500');
            $('#panel-pages', doc2).attr('draggable', 'true');
            $('#panel-pages', doc2).on('dragstart', function (event) { f_dragstart(event); });
            $('yt-live-chat-header-renderer', doc2).remove();
            $('#chat', doc2).remove();
            $('#ticker', doc2).remove();
            lci.show();
        });
        $("#dialog2").dialog({
            modal: false,
            //autoOpen: false,
            width: 600,
            height: 240,
            close: function (e) {
                changeCommentPosition('0');
                //setTimeout(function(){
                //	document.getElementsByTagName('video')[0].play();
                //},500);

                e.stopImmediatePropagation();
            }
        });
        $('.ui-icon-closethick').css('background-image', 'url(' + chrome.extension.getURL("images/ui-icons_777777_256x240.png") + ')');
        $('div.ui-dialog').css('z-index', '10000');

        $("#dialog2").prev().css('padding', '0px');
        $("#dialog2").prev().css('height', '25px');
        $("#dialog2").parent().css('top', '50px');
        $("#dialog2").parent().css('left', '50px');

        // 最小化ボタン生成
        if (0 == $('#minusButton').length) {
            var closeButton = $("#dialog2").prev().find('button');
            var button = closeButton.clone();
            button.attr('id', 'minusButton');
            button.attr('title', '最小化');
            button.css('margin-right', '25px');
            button.find('span').removeClass('ui-icon-closethick');
            button.find('span').addClass('ui-icon-minusthick');
            button.click(function (e) {
                prevHeight = $("#dialog2").parent()[0].offsetHeight;
                prevWidth = $("#dialog2").parent()[0].offsetWidth;
                prevTop = $("#dialog2").parent()[0].style.top;
                prevLeft = $("#dialog2").parent()[0].style.left;
                closeButton.hide();
                $('#minusButton').hide();
                $('#plusButton').show();
                $("#dialog2").hide();
                var height = $('#commentDiv')[0].offsetHeight;
                //$("#dialog2").parent().animate({height:'35px', width:'35px', left:'5px', top:height-(height/3) + 'px'});
                //$("#dialog2").parent().animate({height:'35px', width:'35px', left:'5px', top:'5px'});
                $("#dialog2").parent().animate({ height: '28px', width: '28px', left: '5px' });

                //setTimeout(function(){
                //	document.getElementsByTagName('video')[0].play();
                //},500);

                e.stopImmediatePropagation();
            });
            $("#dialog2").prev().append(button);
        }

        // 元に戻すボタン生成
        if (0 == $('#plusButton').length) {
            var button2 = $("#dialog2").prev().find('button').clone();
            //button.css('margin-right','25px');
            button2.attr('id', 'plusButton');
            button2.attr('title', '元に戻す');
            button2.hide();
            button2.find('span').removeClass('ui-icon-closethick');
            button2.find('span').addClass('ui-icon-plusthick');
            button2.click(function (e) {
                closeButton.show();
                $('#minusButton').show();
                $('#plusButton').hide();
                $("#dialog2").show();
                $("#dialog2").prev().show();

                $("#dialog2").parent().animate({ height: prevHeight + 'px', width: prevWidth + 'px', top: prevTop, left: prevLeft });
                //setTimeout(function(){
                //	document.getElementsByTagName('video')[0].play();
                //},500);

                e.stopImmediatePropagation();
            });
            $("#dialog2").prev().append(button2);
        }

        var commentInputOpacity = (null != options && null != options.commentInputOpacity) ? options.commentInputOpacity : 0.5;
        $("#dialog2").parent().css('opacity', commentInputOpacity);

        //$('#commentDiv2').prepend($("#dialog2").parent());
        $('.html5-video-container').before($("#dialog2").parent());
    }

    saveCommentInputPosition(pos);
}

function showWarning(status) {
    if (0 != $('#warning').length) return;

    var w = $(window).width();
    var cw = $("body").outerWidth();

    var height = 0;
    if (0 != $('#masthead-positioner').length) {
        height = $('#masthead-positioner').height();
    }
    if (0 != $('ytd-masthead>#container').length) {
        height = $('ytd-masthead>#container').height();
    }

    $('body').append('<div id="warning" style="color:red; position: fixed; left: ' + (((cw) / 2) - 290) + 'px; top: ' + height + 'px;' +
        ' background-color: white; border: 1px solid red; padding: 4px; height: 20px;' +
        ' font-size: 14px; width: 580px; text-align: center; cursor: default; z-index:999999;"></div>');
    if ('503' == status) {
        $('#warning').html('ｾｲｷｿﾋﾞｭﾜｰ：サーバが混雑しているため一部の機能が正常に動作しない可能性があります。');
        //alert('ｾｲｷｿﾋﾞｭﾜｰ：サーバが混雑しているため一部の機能が正常に動作しない可能性があります。');
    }

	/*
	setTimeout(function(){
		$('#warning').animate({
	        height: '60px'
	    });
	},2000);
	*/

    $('body').click(function () {
        $('#warning').hide();
    });
    $('#warning').click(function () {
        $(this).hide();
    });


    setTimeout(function () {
		/*
		$('#warning').animate({
	        height: '0px'
	    });
		*/
        $('#warning').hide();
    }, 15000);
}

function sec2hour(time) {
	var sec = (time % 60) % 60;
	var min = Math.floor(time / 60) % 60;
	var hour = Math.floor(time / 3600);
	
	sec = ('0' + sec).slice(-2);
	min = ('0' + min).slice(-2);
	//hour = ('0' + hour).slice(-2);

	return hour + ':' + min + ':' + sec;
}

function log(str) {
    if (debug) console.log(str);
}