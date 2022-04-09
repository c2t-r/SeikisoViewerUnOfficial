YOUTUBE = {
    timeShift: false,
    timeShiftData: null,
    videoId: null,
    videoFlag: false,
    commentNo: 0,
    its: null,
    sts: null,
    ltsd: null,
    playTm: null,
    hideTm: null,
    chart: null,
    chartId: null,
    styleDark: false,
    user: null,
    userId: null,

    init: function () {
        var prevEnabled = enabled;
        
        var request = { method: "getEnabled" };
        try{
	        chrome.runtime.sendMessage(request, function (response) {
	            if (prevEnabled != response.enabled) {
	                enabled = response.enabled;
	                prevEnabled = response.enabled;
	                chrome.storage.local.set({ enabled: response.enabled });
	                //$('#mystyle',doc).remove();
	                //$('#
	                location.reload();
	            }

	        });
	    }catch(e){}
        

        if (0 != $('[title$="として後で再生します"]').length) {
            var user = $('[title$="として後で再生します"]').prop('title').split('として後で再生します')[0].trim();
            if ((null == YOUTUBE.user || user != YOUTUBE.user) && (undefined != $('ytd-watch-flexy').attr('video-id'))) {
                var match = $("body").html().match(/"key":"creator_channel_id","value":"([^"]*)"/);
                if (null != match) {
                    var userId = match[1];
                }

                YOUTUBE.user = user.trim();
                YOUTUBE.userId = userId;
                var watchVideo = $('ytd-watch-flexy').attr('video-id');
                var watchTitle = $('.ytd-video-primary-info-renderer').text().split('視聴回数')[0].trim();

                if ("" != watchVideo) {
                    $.ajax({
                        type: 'post',
                        data: { "user": user, "userId": userId, "videoId": watchVideo, "videoTitle": watchTitle },
                        url: 'https://onspring3.sakura.ne.jp/kato-junichi/addon/user.php?user=' + user + '&userId=' + userId + '&videoId=' + watchVideo + '&videoTitle=' + watchTitle,
                        success: function (data) {
                        },
                        error: function (xhr, textStatus, error) {
                            log(xhr.statusText);
                            log(textStatus);
                            log(error);
                        }
                    });
                }
            }
        }

        if (!enabled) {
            return;
        }
        //console.log(enabled);
        // 動画視聴ページかポップアウトウィンドウ以外は処理なし
        if (0 > $(location).attr('href').indexOf('watch')
            && 0 > $(location).attr('href').indexOf('gaming')
            && 0 > $(location).attr('href').indexOf('is_popout=1')
            && 0 > $(location).attr('href').indexOf('live')) {
            //clearInterval(timer);
            return;
        }

        // ビデオIDを取得
        if ((0 < $(location).attr('href').indexOf('?v=') || 0 < $(location).attr('href').indexOf('&v='))) {
            videoId = $(location).attr('href').split('v=')[1];
            videoId = videoId.split('&is_popout=1')[0];
            log(videoId);
        } else {
            videoId = null;
        }

        if (null != document.querySelector('#watch7-content > meta[itemprop=videoId]')) {
            videoId = document.querySelector('#watch7-content > meta[itemprop=videoId]').getAttribute('content');
        }

        log("YOUTUBE.videoId:" + YOUTUBE.videoId);
        log("videoId:" + videoId);


        if (0 < $(location).attr('href').indexOf('is_popout=1')) {
            impopout = true;
        } else {
            impopout = false;
        }

        if (0 < $(location).attr('href').indexOf('gaming')) {
            gaming = true;
        } else {
            gaming = false;
        }

        if (null != document.getElementById('live-chat-iframe')
            && null != document.querySelector(".watch-view-count")
            && -1 < document.querySelector(".watch-view-count").innerHTML.indexOf("視聴回数")) {
            $('#live-chat-iframe').remove();
        }

		/*
		if(null != document.getElementById('chatframe')
			&& 0 != $(".view-count").length
			&& -1 < $(".view-count").html().indexOf("視聴回数")){
			$('#chatframe').remove();
		}

		if(null == document.getElementById('live-chat-iframe')
			&& 0 != $(".view-count").length
			&& -1 < $(".view-count").html().indexOf("視聴中")){
			$('#related').prepend(
				'<iframe id="live-chat-iframe" class="live-chat-iframe yt-uix-expander-body" ' +
				'src="https://www.youtube.com/live_chat?v=' + videoId + '" ' +
				'data-host-origin="https://www.youtube.com/" ' +
 				'style=" width: 400px; height: 550px;"></iframe>');
		}
		*/

        if (YOUTUBE.timeShift) {
            clearInterval(YOUTUBE.playTm);
        }

        if (null != options && null != options.videoSizeChangeType && '1' == options.videoSizeChangeType) {
            $(".ytp-size-button").hide();
            $(".ytp-fullscreen-button").hide();
        }
        if (YOUTUBE.videoId != videoId && !impopout) {
            clearInterval(YOUTUBE.playTm);

            if (null != options && null != options.videoSizeChangeType && '1' == options.videoSizeChangeType) {
				/*
				$(".player-api").resizable();
				try{
					var observer = new MutationObserver(function(mutations) {
						resize2();
					});
					observer.observe(document.querySelector('.player-api'), {childList: true, attributes: true});
					resize2();
				}catch(e){
					//log(e);
				}
				function resize2(){
					$("#player-api").css('height',$(".player-api").height() + 'px');
					$("#player-api").css('width',$(".player-api").width() + 'px');
					$("#movie_player").css('height',$(".player-api").height() + 'px');
					$("#movie_player").css('width',$(".player-api").width() + 'px');
					$("video").css('height',$(".player-api").height() + 'px');
					$("video").css('width',$(".player-api").width() + 'px');
				}
				*/

                var p1h = $("#player-api").height();
                var p1w = $("#player-api").width();
                var p2h = $(".player-api").height();
                var p2w = $(".player-api").width();
                var vh = $("video").height();
                var vw = $("video").width();
                $(".ytp-size-button").hide();
                $(".ytp-fullscreen-button").hide();
				/*
				$(".ytp-size-button").click(function(){
					$("#movie_player").css('height','100%');
					$("#movie_player").css('width','100%');
					
					if(0 != $("#player-container").length){
						$("#player").css('height','');
						$("#player").css('width','');
						$("#player-container").css('height','');
						$("#player-container").css('width','');
						$("#comments").css('width','');
						$("#meta").css('width','');
						$("#info").css('width','');
						$("#related").css('max-width','');
						$("#related").css('width','');
						$("#content-separator").css('margin-top','');
						$("video").css('height','');
						$("video").css('width','');
						$("#player").removeClass();
						$("#player").addClass('style-scope ytd-watch');
						$("#player-container").removeClass();
						$("#player-container").addClass('style-scope ytd-watch');
						$("#comments").removeClass();
						$("#comments").addClass('style-scope ytd-watch');
						$("#meta").removeClass();
						$("#meta").addClass('style-scope ytd-watch');
						$("#info").removeClass();
						$("#info").addClass('style-scope ytd-watch');
						$("#related").removeClass();
						$("#related").addClass('style-scope ytd-watch');
						$("#content-separator").removeClass();
						$("#content-separator").addClass('style-scope ytd-watch');
						$("video").removeClass();
						$("video").addClass('video-stream html5-main-video');
					}else{
						$("#placeholder-player>div").css('height','');
						$("#placeholder-player>div").css('width','');
						$("#movie_player").css('height','');
						$("#movie_player").css('width','');
						$("#player-api").css('height','');
						$("#player-api").css('width','');
						$(".player-api").css('height','');
						$(".player-api").css('width','');
						//$(".ytp-chrome-bottom").css('width','');
						$("#watch7-sidebar").css('margin-top','');
						$("#watch7-sidebar").css('margin-left','');
						//$("#watch7-content").css('height','');
						$("#watch7-content").css('width','');
						$("#placeholder-player>div").removeClass();
						$("#placeholder-player>div").addClass('player-api player-width player-height');
						$("#movie_player").removeClass();
						$("#movie_player").addClass('html5-video-player ad-created ytp-hide-info-bar iv-module-loaded ad-showing ytp-ad-overlay-open paused-mode ui-resizable');
						$("#player-api").removeClass();
						$("#player-api").addClass('player-width player-height off-screen-target player-api');
						//$(".ytp-chrome-bottom").removeClass();
						//$(".ytp-chrome-bottom").addClass('ytp-chrome-bottom');
						$("#watch7-sidebar").removeClass();
						$("#watch7-sidebar").addClass('watch-sidebar');
						$("#watch7-content").removeClass();
						$("#watch7-content").addClass('watch-main-col');
						//$("video").removeClass();
						//$("video").addClass('video-stream html5-main-video');
					}
				});
				$(".ytp-fullscreen-button").click(function(){
					$("#movie_player").css('height','100%');
					$("#movie_player").css('width','100%');
				});
				*/
                function changeVideoSize(height, width) {
                    if (0 != $("#player-container").length) {
                        $("#top>#player").css('height', '');
                        $("#top>#player").css('width', '');
                        $("#player").css('height', height + 'px');
                        $("#player").css('width', width + 'px');
                        $("#player-container").css('height', height + 'px');
                        $("#player-container").css('width', width + 'px');
                        //$("#comments").css('height',height + 'px');
                        $("#comments").css('width', width + 'px');
                        //$("#meta").css('height',height + 'px');
                        $("#meta").css('width', width + 'px');
                        //$("#info").css('height',height + 'px');
                        $("#info").css('width', width + 'px');
                        $("#related").css('max-width', '1000px');
                        $("#related").css('width', 'calc(100% - ' + width + 'px)');
                        $("#content-separator").css('margin-top', height + 0 + 'px');
                        $(".ytp-chrome-bottom").css('width', width - 18 + 'px');
                        $("video").css('height', height + 'px');
                        $("video").css('width', width + 'px');
                        $("#chat").css('margin-right', 'calc(100% - ' + (width + 400) + 'px)');
                        //$("#chat").css('margin-left',width + 'px');
                        $("#chat").css('height', height + 110 + 'px');
                        $("#chat").css('width', '400px');
                        //$("#chat").css('float','left');
                        //$("#chat").css('width','calc(100% - ' + width + 'px)');
                        //$("#top>#container").css('margin-top',height - 757 + 'px');
                        //$("#top>#container").css('margin-top',-height + 'px');
                        $(".ytp-progress-bar-container").css('width', width - 18 + 'px');
                    } else {
                        $("#player-api").css('height', height + 'px');
                        $("#player-api").css('width', width + 'px');
                        $(".player-api").css('height', height + 'px');
                        $(".player-api").css('width', width + 'px');
                        $(".ytp-chrome-bottom").css('width', width - 18 + 'px');
                        $("video").css('height', height + 'px');
                        $("video").css('width', width + 'px');
                        var top = '0px' == $("#watch7-sidebar").css('top') ? -120 : 0;
                        $("#watch7-sidebar").css('margin-top', -height + 110 + top + 'px');
                        $("#watch7-sidebar").css('margin-left', width + 10 + 'px');
                        $("#watch7-content").css('width', width + 'px');
                        $("#live-chat-iframe").css('height', height + 110 + 'px');
                        $(".ytp-progress-bar-container").css('width', width - 18 + 'px');

                        if (0 != $("#yt-live-chat-header-renderer-original").length) {
                            $("#primary-content").css('width', $("#yt-live-chat-header-renderer-original").width() - 100 + 'px');
                        }
                    }

                }


				/**********************************
				if(null != options && null != options.videoSizeHeight){
					changeVideoSize(options.videoSizeHeight,options.videoSizeWidth);
				}
				
				$("#movie_player").resizable(
					{
					resize : function (event, ui) {
						var size = ui.size;
						changeVideoSize(size.height,size.width);
						options.videoSizeHeight = size.height;
						options.videoSizeWidth = size.width;
						chrome.storage.local.set({options:JSON.stringify(options)});
					}
				});
				$(window).resize(function() {
					if(0 != $("#player-container").length){
						changeVideoSize($("#movie_player").height(),$("#movie_player").width());
						if($(window).width() < 1000){
							$("#top>#player").css('height',$("#movie_player").height() + 'px');
							$("#top>#player").css('width',$("#movie_player").width() + 'px');
							$("#chat").css('width',$("#movie_player").width() + 'px');
						}
					}else{
						changeVideoSize($("#movie_player").height(),$("#movie_player").width());
						var top = '0px' == $("#watch7-sidebar").css('top') ? -120 : 0;
						$("#watch7-sidebar").css('margin-top',-$("#movie_player").height() + 110 + top + 'px');
						$(".ytp-chrome-bottom").css('width',$("#movie_player").width() - 18 + 'px');
						
						if($(window).width() < 658){
							$("#watch7-sidebar").css('margin-top','');
							$("#watch7-sidebar").css('margin-left','');
							//$("#watch7-content").css('height','');
							$("#watch7-content").css('width','');
							$("#watch7-sidebar").removeClass();
							$("#watch7-sidebar").addClass('watch-sidebar');
							$("#watch7-content").removeClass();
							$("#watch7-content").addClass('watch-main-col');
						}
					}
				});
				
				$('.ytp-progress-bar').click(function(){
					$(this).attr('aria-valuenow','400');
				});
				***********************************************/
            }

            if ((null != document.getElementById('live-chat-iframe') || null != document.getElementById('chatframe'))) {
                var goLiveInterval = 600000;
                if (null != options && null != options.goLiveInterval) {
                    goLiveInterval = options.goLiveInterval * 60000;
                }

                log(goLiveInterval);

                if (0 != goLiveInterval && !YOUTUBE.timeShift && -1 != $(".view-count").html().indexOf("人が視聴中")) {
                    try {
                        YOUTUBE.playTm = setInterval(function () {
                            var goLiveRate = 1.5;
                            if (null != options && null != options.goLiveRate) {
                                goLiveRate = options.goLiveRate;
                            }
                            document.getElementsByTagName('video')[0].playbackRate = goLiveRate;
                            log(document.getElementsByTagName('video')[0].playbackRate);

                            //var src = $("iframe#live-chat-iframe").attr("src");
                            //$("iframe#live-chat-iframe").attr("src","");
                            //$("iframe#live-chat-iframe").attr("src",src);

                            if (-1 != window.navigator.userAgent.toLowerCase().indexOf('firefox')) {
                                setTimeout(function () {
                                    //clearInterval(playTm);
                                    document.getElementsByTagName('video')[0].playbackRate = 1.0;
                                }, 10000);
                            }
                        }, goLiveInterval);

                        $('video').on('waiting', function () {
                            log('waiting');
                            document.getElementsByTagName('video')[0].playbackRate = 1.0;
                        });
                    } catch (e) {
                        log('err:' + e);
                    }

					/*
					$('video').on('canplay',function(){
						log('canplay');
						$('video').playbackRate = 1.0;
					});
					$('video').on('playing',function(){
						log('playing');
						$('video').playbackRate = 1.25;
					});
					*/
                }
            }

            var mbTimer = setInterval(function () {
                if (0 != $('yt-live-chat-message-input-renderer', doc).length
                    && -1 == window.navigator.userAgent.toLowerCase().indexOf('firefox')
                    && !gaming) {
                    //log($('yt-live-chat-message-input-renderer',doc));

                    $('#panel-pages', doc).attr('draggable', 'true');
                    $('#panel-pages', doc).unbind('dragstart');
                    $('#panel-pages', doc).on('dragstart', function (event) { f_dragstart(event); });

                    $('#watch-header').attr('dropzone', 'move');
                    $('#watch-header', doc).unbind('dragover');
                    $('#watch-header', doc).unbind('drop');
                    $('#watch-header').on('dragover', function (event) { f_dragover(event) });
                    $('#watch-header').on('drop', function (event) { f_drop(event) });

                    $('#info-contents').attr('dropzone', 'move');
                    $('#info-contents', doc).unbind('dragover');
                    $('#info-contents', doc).unbind('drop');
                    $('#info-contents').on('dragover', function (event) { f_dragover(event) });
                    $('#info-contents').on('drop', function (event) { f_drop(event) });

                    $('#content-pages', doc).attr('dropzone', 'move');
                    $('#content-pages', doc).unbind('dragover');
                    $('#content-pages', doc).unbind('drop');
                    $('#content-pages', doc).on('dragover', function (event) { f_dragover(event) });
                    $('#content-pages', doc).on('drop', function (event) { f_drop(event) });

                    //$('#commentDiv').attr('dropzone','move');
                    $('.html5-video-container', doc).unbind('dragover');
                    $('.html5-video-container', doc).unbind('drop');
                    $('.html5-video-container').on('dragover', function (event) { f_dragover(event) });
                    $('.html5-video-container').on('drop', function (event) { f_drop(event) });
                    $('.html5-video-container').prop('id', 'html5-video-container');

                    // 初回時表示のためにイベントを直接呼び出し
                    f_drop();

                    clearInterval(mbTimer);
                }
            }, 1000);


            var channelId = $('meta[itemprop=channelId]').prop('content');
            if ((undefined == channelId || "" == channelId) && 0 != $('.ytd-video-owner-renderer>a,.owner-name>a,#title a:first,a[href^="/channel"]').length) {
                channelId = $('.ytd-video-owner-renderer>a,.owner-name>a,#title a:first,a[href^="/channel"]').attr('href').split('/channel/')[1];
            }
            if (undefined != channelId) {
                YOUTUBE.videoId = videoId;
                YOUTUBE.videoFlag = false;
            }

            if (!gaming) {
                $('#yt-live-chat-header-renderer-original').remove();
				/*
				if(1 < $('#chat').length){
					$('#chat').remove();
				}
				*/
                $('.activeDiv').empty();
            }

            YOUTUBE.timeShiftData = null;
            //var owner = $('#owner-name>a').prop('href');
            //var channelId = owner.split('/')[owner.split('/').length-1];//ytplayer.config.args.ucid;
            if ("UCx1nAvtVDIsaGmCMSe8ofsQ" == channelId && 0 == $("iframe#chatframe[src*=replay]").length) {
                log(channelId);
            }

        }
        if (!YOUTUBE.timeShift) {
            if (null != document.querySelector('#yt-live-chat-header-renderer-original')) {
                $('#yt-live-chat-header-renderer-original').remove();
                $('#chat').remove();
            }
        }

        if (
            (
                (
                    (
                        ((null === document.getElementById('live-chat-iframe')
                            && null === document.getElementById('chatframe'))
                            //|| null === fw
                            || 0 === document.getElementsByTagName('video').length
                            || (null != document.getElementById('live-chat-iframe') && null === document.getElementById('live-chat-iframe').contentWindow.document.getElementById('item-offset')
                                &&
                                null != document.getElementById('chatframe') && null === document.getElementById('chatframe').contentWindow.document.getElementById('item-offset'))
                        )
                        && !impopout
                        && !gaming
                    )
                    ||
                    (
                        null == document.querySelector('yt-live-chat-header-renderer #title')
                        && gaming
                    )
                )
            )
        ) {
        } else {
            var iframe = null;
            if (null != document.getElementById('live-chat-iframe')) {
                iframe = document.getElementById('live-chat-iframe');
            }
            if (null != document.getElementById('chatframe')) {
                iframe = document.getElementById('chatframe');
            }

            if (!impopout && !gaming
                &&
                (null != iframe)
            ) {
                fw = iframe.contentWindow;
                if (fw != null) doc = fw.document;
            }

            if (null != doc.querySelector('#commentOption')) {
                return;
            }

            if (null != document.querySelector('body').getAttribute('dark')) {
                YOUTUBE.styleDark = true;
            } else {
                YOUTUBE.styleDark = false;
            }

            /* add contents */
            var puzzleIcon = gaming || YOUTUBE.styleDark ? "puzzleg.png" : "puzzle.png";
            var settingIcon = gaming || YOUTUBE.styleDark ? "settingg.png" : "setting.png";
            var saveIcon = gaming || YOUTUBE.styleDark ? "saveg.png" : "save.png";
            var defaultIcon = gaming || YOUTUBE.styleDark ? "defaultg.png" : "default.png";
            var title = gaming ? $('yt-live-chat-header-renderer>#title') : $('#title', doc);
            var heading = $('#primary-content', doc);
            $(heading).after('<div id="commentOption" style="height:47px; font-size:10px;"></div>');
            $('#commentOption', doc).after('<div id="saveOption" style="min-width:100px; font-size:10px; margin-left:10px;"></div>');

            var left = gaming ? 120 : 150;
            var background = gaming ? "rgb(40, 40, 40)" : "#fcfcfc";
            var color = gaming ? "white" : "black";
            var width = gaming ? 281 : 286;
            var marginTop = window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1 ? 125 : 85;
            $('#commentOption', doc).after(
                '<div id="optionSetting" style="display:none; border: solid 1px; height:120px; width: ' + width + 'px; ' +
                '								top:0px; font-size:10px; position: absolute; margin-top: ' + marginTop + 'px;' +
                '								background: ' + background + '; z-index:1;">' +
                '<table style="padding: 5px;"><tr><td>' +
                '<input type="checkbox" id="displayIcon" name="displayIcon"/><label for="displayIcon">アイコン</label>' +
                '<input type="checkbox" id="displayName" name="displayName"/><label for="displayName">名前</label>' +
                '<input type="checkbox" id="displayCome" name="displayCome"/><label for="displayCome">コメントを流す</label>' +
                '<input type="checkbox" id="displayComeShita" name="displayComeShita"/><label for="displayComeShita">shita</label>' +
                '</td></tr>' +
                '<tr><td>' +
                '	<table>' +
                '		<tr>' +
                '			<td>' +
                '				コメント欄フォントサイズ&nbsp;' +
                '			</td>' +
                '			<td>' +
                '				<div id="chatTxtFontSizeBar" style="width:90px;">' +
                '					<input type="text" style="display:none;" id="chatTxtFontSize" value="13"/>' +
                '					</div>' +
                '			</td>' +
                '		</tr>' +
                '	</table>' +
                '</td></tr>' +
                '<tr><td>' +
                '	<table>' +
                '		<tr>' +
                '			<td>' +
                '				フォントサイズ&nbsp;' +
                '			</td>' +
                '			<td>' +
                '				<div id="txtFontSizeBar" style="width:90px;">' +
                '					<input type="text" style="display:none;" id="txtFontSize" value="24"/>' +
                '					</div>' +
                '			</td>' +
                '			<td>' +
                '				カラー' +
                '			</td>' +
                '			<td>' +
                '				<input type="color" id="txtFontColor" value="#FFFFFF" style="height:17px;width:25px;" maxLength="7" ime-mode="disabled" />' +
                '			</td>' +
                '		</tr>' +
                '	</table>' +
                //'フォントサイズ&nbsp;<input type="range" id="txtFontSize" value="24" min="1" style="height:5px; width:90px;" />&nbsp;' +
                //'&nbsp;&nbsp;カラー&nbsp;<input type="color" id="txtFontColor" value="#FFFFFF" style="height:17px;width:25px;" maxLength="7" ime-mode="disabled" />' +
                '</td></tr>' +
                '<tr><td>' +
                '<a id="openOptionPage" style="color:' + color + '; cursor:pointer;">拡張機能のオプションページを開く</a>' +
                '</td></tr>' +
                '</table>&nbsp;&nbsp;&nbsp;' +
                '</div>');
            $('#saveOption', doc).append(
                '<img id="setting" title="設定を開く" style="cursor: pointer; width:16px; height:16px;" src="' + chrome.extension.getURL("images/" + settingIcon) + '"/>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<img id="save" title="設定を保存" style="cursor: pointer; width:16px; height:16px;" src="' + chrome.extension.getURL("images/" + saveIcon) + '"/>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<img id="default" title="チャットをリロード" style="cursor: pointer; width:16px; height:16px;" src="' + chrome.extension.getURL("images/" + defaultIcon) + '"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');

            $('yt-live-chat-header-renderer', doc).css('z-index', '10');

            $('#openOptionPage', doc).click(function () {
                var request = { method: "open" };
                chrome.runtime.sendMessage(request, function (response) { });
            });

            if (gaming) {
                $('yt-sort-filter-sub-menu-renderer').css('width', '140px');
            }

            if (0 == $('.activeDiv').length) {
                var activeDivBase;
                if (!gaming) {
                    if (0 != $('#watch8-sentiment-actions').length) {
                        $('#watch8-sentiment-actions').append(
                            '<div id="watch7-views-info" class="activeDiv" style="bottom:70px;font-size:14px;"/>');
                    } else {
                        //$('.yt-view-count-renderer').after(
                        //	'<div id="watch7-views-info" class="activeDiv" style="bottom:70px;font-size:14px;"/>');
                    }
                } else {
                    $('.headline').append(
                        '<div id="watch7-views-info" class="activeDiv" style="font-size:12px;position:absolute;margin-top:-28px;right:25px;"/>');
                }
                $('.activeDiv').append(
                    '<p style="margin-left:30px; margin-top:10px;">アクティブ人数/10分' +
                    '<span id="estimateActive"></span>　<span id="active" style="font-weight: bold;">-</span></p>');
            }

            // 邪魔な文字を削除
            //$(title).remove();
            // 既存のボタンを右寄せ
            //var overflow = gaming ? $('yt-live-chat-header-renderer>#overflow') : $('#overflow', doc);
            //$(overflow).css('margin-left','auto');


            //log(document.querySelector('video'));
            $('#mystyle', doc).remove();
            $istyle = $('<style id="mystyle"></style>').attr('type', 'text/css');
            $('head', doc).append($istyle);

            /* styles */
            //コメント番号の色
            var fontsize = (null == options || null == options.fontsize) ? 12 : options.fontsize;
            var fontcolor = (null == options || null == options.fontcolor) ? "#000000" : options.fontcolor;
            if (null == options || null == options.commentStyle || "0" == options.commentStyle) {
                $istyle.html($istyle.html() +
                    //	'yt-live-chat-text-message-renderer' +
                    //	'{ display:none!important }' +
                    'yt-live-chat-author-chip.yt-live-chat-text-message-renderer' +
                    '{ margin-right:0px!important }' +
                    '.yt-live-chat-text-message-ng-transparent' +
                    '{ display:none!important }' +
                    'yt-live-chat-text-message-renderer' +
                    '{ font-size:' + fontsize + 'px!important; font-weight:bold; }' +
                    '#message.yt-live-chat-text-message-renderer' +
                    '{ color:#000000!important }' +
                    '#author-name.yt-live-chat-text-message-renderer' +
                    '{ color:#999999!important }' +
                    '#timestamp.yt-live-chat-text-message-renderer' +
                    '{ color:#999999!important }' +
                    /*
                        'yt-live-chat-text-message-renderer:nth-child(even)' +
                        '{ background-color: #eeeeee }' +
                        'yt-live-chat-text-message-renderer:nth-child(odd)' +
                        '{ background-color: #ffffff }' +
                    */
                    '#menu-button.paper-icon-button-1' +
                    '{ width:30px; height:22px; padding:0px; }');
            } else if ("1" == options.commentStyle) {
                $istyle.html($istyle.html() +
                    'yt-live-chat-author-chip.yt-live-chat-text-message-renderer' +
                    '{ margin-right:0px!important }' +
                    '.yt-live-chat-text-message-ng-transparent' +
                    '{ display:none!important }' +
                    'yt-live-chat-text-message-renderer' +
                    '{ font-size:' + fontsize + 'px!important; ' +
                    '  font-weight:bold; ' +
                    '  border: 1px white solid; ' +
                    '  padding: 0; ' +
                    '}' +
                    'yt-live-chat-text-message-renderer #content' +
                    '{ border-left: 1px white solid; ' +
                    '   ' +
                    '}' +
                    '#message.yt-live-chat-text-message-renderer' +
                    '{ color:#000000!important }' +
                    '#author-name.yt-live-chat-text-message-renderer' +
                    '{ color:#999999!important }' +
                    '#timestamp.yt-live-chat-text-message-renderer' +
                    '{ color:#999999!important }' +
                    /*
                        'yt-live-chat-text-message-renderer:nth-child(even)' +
                        '{ background-color: #eeeeee }' +
                        'yt-live-chat-text-message-renderer:nth-child(odd)' +
                        '{ background-color: #ffffff }' +
                    */
                    '#menu-button.paper-icon-button-1' +
                    '{ width:30px; height:22px; padding:0px; }');
            } else if ("9" == options.commentStyle) {
                $istyle.html($istyle.html() +
                    'yt-live-chat-author-chip.yt-live-chat-text-message-renderer' +
                    '{ margin-right:0px!important }' +
                    '.yt-live-chat-text-message-ng-transparent' +
                    '{ display:none!important }' +
                    'yt-live-chat-text-message-renderer' +
                    '{ font-size:' + fontsize + 'px!important; font-weight:bold; }' +
                    '#menu-button.paper-icon-button-1' +
                    '{ width:30px; height:22px; padding:0px; }');
            } else {
                $istyle.html($istyle.html() +
                    //	'yt-live-chat-text-message-renderer' +
                    //	'{ display:none!important }' +
                    'yt-live-chat-author-chip.yt-live-chat-text-message-renderer' +
                    '{ margin-right:0px!important }' +
                    '.yt-live-chat-text-message-ng-transparent' +
                    '{ display:none!important }' +
                    'yt-live-chat-text-message-renderer' +
                    '{ border-top: 1px solid!important; font-size:' + fontsize + 'px!important; font-weight:bold;  }' +
                    '#message.yt-live-chat-text-message-renderer' +
                    '{ color:#000000!important }' +
                    '#author-name.yt-live-chat-text-message-renderer' +
                    '{ color:#000000!important }' +
                    '#timestamp.yt-live-chat-text-message-renderer' +
                    '{ color:#000000!important }' +
                    'yt-live-chat-text-message-renderer:nth-child(even)' +
                    '{ background-color: #ffffff }' +
                    'yt-live-chat-text-message-renderer:nth-child(odd)' +
                    '{ background-color: #ffffff }' +
                    '#menu-button.paper-icon-button-1' +
                    '{ width:30px; height:22px; padding:0px; }');
            }

            if (null != options && null != options.commentNoWrap && options.commentNoWrap) {
                $istyle.html($istyle.html() +
                    'yt-live-chat-text-message-renderer' +
                    '{ white-space: nowrap; }');
            }

            //コメント欄の右端ボタンの色を反転
            $('yt-live-chat-text-message-renderer #menu').css('background', 'rgba(0, 0, 0, 0)');
            $('yt-live-chat-text-message-renderer g.iron-icon').css('color', 'rgba(0, 0, 0, 0.7)');

            //$('body').append('<audio id="btnsound" preload="auto" src="' + chrome.extension.getURL("sound/ididit.mp3") + '"/>');

            /* settings */
            $('#puzzle', doc).unbind();
            $('#puzzle', doc).click(function () {
                var height = document.querySelector('.html5-video-player').offsetHeight;
                var width = document.querySelector('.html5-video-player').offsetWidth;
                if ($('#puzzleCanvas').length == 0) {
                    $('.html5-video-player').parent().prepend('<canvas class="puzzleCanvas" id="puzzleCanvas" width=' + width + ' height=' + height + ' style="-webkit-font-smoothing: antialiased;position: absolute; z-index: 998; height:' + height + 'px; width:' + width + 'px; text-shadow: #999 0.1px 0.1px 1px;" ></canvas>');
                    $('#puzzleCanvas').show();

                    var url = "";
                    if ($('.ytp-offline-slate').is(':visible')) {
                        url = $(".ytp-offline-slate").css('background-image');
                        url = url.replace('url("', '').replace('")');
                    }

                    loadImage(url);
                    setTimeout(function () {
                        shuffle();
                    }, 1000);

                    var commentList = $('yt-live-chat-text-message-renderer', doc);
                    lastComId = getCommentId(commentList, commentList.length - 1);
                    $('#commentDiv3').insertBefore($('#puzzleCanvas').parent());
                    $(".nicocomment").remove();
                    $('.nicocommentDead').remove();
                } else {
                    $('#puzzleCanvas').remove();

                    var commentList = $('yt-live-chat-text-message-renderer', doc);
                    lastComId = getCommentId(commentList, commentList.length - 1);
                    $('#commentDiv3').insertBefore($('.video-stream'));
                    $(".nicocomment").remove();
                    $('.nicocommentDead').remove();
                }
            });
            
            /*
            $('.ytp-right-controls').prepend(
            	'<button id="memo2" class="ytp-button ytp-settings-button" aria-haspopup="true" ' +
            	'aria-owns="ytp-id-18" aria-label="設定" style="" title="設定">' +
            	'<img title="時間をメモ" style="top: 10px; margin-left: 17px; position: absolute; cursor: pointer; width:16px; height:16px;" src="' + chrome.extension.getURL("images/memog.png") + '"/>' +
            	'</button>');
            
            $('.ytp-right-controls').append(
                '<div id="memoDetail2" style="display:none; border: solid 1px; height:auto; width: ' + (width - 50) + 'px; ' +
                '								right:140px;  font-size:1rem;  position: absolute; top: 40px;' +
                '								background: ' + background + '; z-index:1;">' +
                '<table style="padding: 5px;">' +
                '</table>&nbsp;&nbsp;&nbsp;' +
                '</div>');
            */
            
            /*
            $('#memo2', doc).mouseover(function(){
	        	$('#memoDetail2', doc).show();
            });
            $('#memoDetail2', doc).mouseleave(function(){
	        	$('#memoDetail2', doc).hide();
            });
            */
            
            /*
            $('body').click(function(){
	        	$('#memoDetail', doc).hide();
            });
            */
            
            $('#setting', doc).unbind();
            $('#setting', doc).click(function () {
                $('#optionSetting', doc).toggle();
            });
            
            // 設定保存イベント
            $('#save', doc).unbind();
            $('#save', doc).click(function () {
                //log('checked : '+$('#autoReload').prop('checked'));
                localStorage.setItem('displayIcon', $('#displayIcon', doc).prop('checked'));
                localStorage.setItem('displayName', $('#displayName', doc).prop('checked'));
                localStorage.setItem('displayCome', $('#displayCome', doc).prop('checked'));
                localStorage.setItem('displayComeShita', $('#displayComeShita', doc).prop('checked'));
                localStorage.setItem('txtFontSize', $('#txtFontSize', doc).val());
                localStorage.setItem('chatTxtFontSize', $('#chatTxtFontSize', doc).val());
                localStorage.setItem('txtFontColor', $('#txtFontColor', doc).val());
                alert('設定を保存しました。');
            });
            $('#default', doc).unbind();
            $('#default', doc).click(function () {
                document.getElementById("chatframe").contentWindow.location.reload();
            });
            // 設定情報の読み込み
            if (null != localStorage.getItem('displayIcon')) {
                $('#displayIcon', doc).prop('checked', eval(localStorage.getItem('displayIcon')));
                $('#displayName', doc).prop('checked', eval(localStorage.getItem('displayName')));
                $('#displayCome', doc).prop('checked', eval(localStorage.getItem('displayCome')));
                $('#displayComeShita', doc).prop('checked', eval(localStorage.getItem('displayComeShita')));
                $('#txtFontSize', doc).val(localStorage.getItem('txtFontSize'));
                $('#txtFontSize', doc).change();
                $('#chatTxtFontSize', doc).val(localStorage.getItem('chatTxtFontSize'));
                $('#chatTxtFontSize', doc).change();
                $('#txtFontColor', doc).val(localStorage.getItem('txtFontColor'));
            }

            var funcDark = function (styleDark) {
                var puzzleIcon = gaming || styleDark ? "puzzleg.png" : "puzzle.png";
            	var settingIcon = gaming || styleDark ? "settingg.png" : "setting.png";
                var saveIcon = gaming || styleDark ? "saveg.png" : "save.png";
                var defaultIcon = gaming || styleDark ? "defaultg.png" : "default.png";

                $('#puzzle', doc).attr("src", chrome.extension.getURL("images/" + puzzleIcon));
                $('#setting', doc).attr("src", chrome.extension.getURL("images/" + settingIcon));
                $('#save', doc).attr("src", chrome.extension.getURL("images/" + saveIcon));
                $('#default', doc).attr("src", chrome.extension.getURL("images/" + defaultIcon));

                var fontsize = (null == options || null == options.fontsize) ? 12 : options.fontsize;
                var chatTxtFontSize = $('#chatTxtFontSize', doc).val();
                var fontcolor = (null == options || null == options.fontcolor) ? "#000000" : options.fontcolor;
                $('#mystyle', doc).remove();
                $istyle = $('<style id="mystyle"></style>').attr('type', 'text/css');
                $('head', doc).append($istyle);

                if (null == options || null == options.commentStyle || "0" == options.commentStyle) {
                    if (styleDark) {
                        $istyle.html($istyle.html() +
                            //	'yt-live-chat-text-message-renderer' +
                            //	'{ display:none!important }' +
                            'yt-live-chat-author-chip.yt-live-chat-text-message-renderer' +
                            '{ margin-right:0px!important }' +
                            '.yt-live-chat-text-message-ng-transparent' +
                            '{ display:none!important }' +
                            'yt-live-chat-text-message-renderer' +
                            '{ font-size:' + fontsize + 'px!important; font-weight:bold;background-color: #222222!important }' +
                            '#message.yt-live-chat-text-message-renderer' +
                            '{ font-size:' + chatTxtFontSize + 'px!important; color:#ffffff!important; line-height: 1em!important; }' +
                            '#author-name.yt-live-chat-text-message-renderer' +
                            '{ color:#999999!important }' +
                            '#timestamp.yt-live-chat-text-message-renderer' +
                            '{ color:#999999!important }' +
                            'yt-live-chat-text-message-renderer:nth-child(even)' +
                            '{ background-color: #222222!important }' +
                            'yt-live-chat-text-message-renderer:nth-child(odd)' +
                            '{ background-color: #000000!important }' +
                            '#optionSetting' +
                            '{ background: rgb(40, 40, 40)!important; color:#ffffff!important }' +
                            '#openOptionPage' +
                            '{ color:#ffffff!important }' +
                            '#menu-button.paper-icon-button-1' +
                            '{ width:30px; height:22px; padding:0px; }');
                    } else {
                        $istyle.html($istyle.html() +
                            //	'yt-live-chat-text-message-renderer' +
                            //	'{ display:none!important }' +
                            'yt-live-chat-author-chip.yt-live-chat-text-message-renderer' +
                            '{ margin-right:0px!important }' +
                            '.yt-live-chat-text-message-ng-transparent' +
                            '{ display:none!important }' +
                            'yt-live-chat-text-message-renderer' +
                            '{ font-size:' + fontsize + 'px!important; font-weight:bold; }' +
                            '#message.yt-live-chat-text-message-renderer' +
                            '{ font-size:' + chatTxtFontSize + 'px!important; color:#000000!important; line-height: 1em!important; }' +
                            '#author-name.yt-live-chat-text-message-renderer' +
                            '{ color:#999999!important }' +
                            '#timestamp.yt-live-chat-text-message-renderer' +
                            '{ color:#999999!important }' +
                            'yt-live-chat-text-message-renderer:nth-child(even)' +
                            '{ background-color: #eeeeee }' +
                            'yt-live-chat-text-message-renderer:nth-child(odd)' +
                            '{ background-color: #ffffff }' +
                            '#optionSetting' +
                            '{ background: hsl(0, 0%, 97%)!important; color:#000000!important }' +
                            '#openOptionPage' +
                            '{ color:#000000!important }' +
                            '#menu-button.paper-icon-button-1' +
                            '{ width:30px; height:22px; padding:0px; }');
                    }

                } else if ("1" == options.commentStyle) {
                    if (styleDark) {
                        $istyle.html($istyle.html() +
                            //	'yt-live-chat-text-message-renderer' +
                            //	'{ display:none!important }' +
                            'yt-live-chat-author-chip.yt-live-chat-text-message-renderer' +
                            '{ margin-right:0px!important }' +
                            '.yt-live-chat-text-message-ng-transparent' +
                            '{ display:none!important }' +
                            'yt-live-chat-text-message-renderer' +
                            '{ font-size:' + fontsize + 'px!important; font-weight:bold;background-color: #222222!important }' +
                            'yt-live-chat-text-message-renderer' +
                            '{ ' +
                            '  border: 1px #aaa solid; ' +
                            '  padding: 0; ' +
                            '  display: none; ' +
                            '}' +
                            'yt-live-chat-text-message-renderer #content' +
                            '{ ' +
                            '  border-left-width: 0; ' +
                            '  margin-left: 2rem; ' +
                            '  padding-left: 0; ' +
                            '  display: inline-block; ' +
                            '}' +
                            'yt-live-chat-author-chip.yt-live-chat-text-message-renderer' +
                            '{ ' +
                            '  padding: 0; ' +
                            '}' +
                            'yt-live-chat-text-message-renderer #author-photo' +
                            '{ ' +
                            '  border: 0!important; ' +
                            '  border-radius: 0!important; ' +
                            '  margin: 0!important; ' +
                            '  padding: 0; ' +
                            '  display: table!important; ' +
                            '  width: auto; ' +
                            '}' +
                            'yt-live-chat-text-message-renderer yt-img-shadow' +
                            '{ ' +
                            //'  padding: 3px; ' +
                            '  width: 8rem; ' +
                            '  word-break: break-all; ' +
                            '}' +
                            'yt-live-chat-text-message-renderer yt-img-shadow img' +
                            '{ ' +
                            '  display: none!important; ' +
                            '}' +
                            'yt-live-chat-text-message-renderer yt-live-chat-author-chip' +
                            '{ ' +
                            '  padding-left: 1rem; ' +
                            '  padding-right: 1rem; ' +
                            '}' +
                            'yt-live-chat-text-message-renderer #message' +
                            '{ ' +
                            '  border-right-width: 0; ' +
                            '  border-top-width: 0; ' +
                            //'  padding: 1rem; ' +
                            '}' +
                            '#show-more ' +
                            '{ ' +
                            '  display: none!important; ' +
                            '} ' +
                            '#message.yt-live-chat-text-message-renderer' +
                            '{ font-size:' + chatTxtFontSize + 'px!important; color:#ffffff!important; line-height: 1em!important; }' +
                            '#author-name.yt-live-chat-text-message-renderer' +
                            '{ color:#999999!important }' +
                            '#timestamp.yt-live-chat-text-message-renderer' +
                            '{ color:#999999!important }' +
                            /*
                                'yt-live-chat-text-message-renderer:nth-child(even)' +
                                '{ background-color: #222222!important }' +
                                'yt-live-chat-text-message-renderer:nth-child(odd)' +
                                '{ background-color: #000000!important }' +
                            */
                            '#optionSetting' +
                            '{ background: rgb(40, 40, 40)!important; color:#ffffff!important }' +
                            '#openOptionPage' +
                            '{ color:#ffffff!important }' +
                            '#menu-button.paper-icon-button-1' +
                            '{ width:30px; height:22px; padding:0px; }');
                    } else {
                        $istyle.html($istyle.html() +
                            //	'yt-live-chat-text-message-renderer' +
                            //	'{ display:none!important }' +
                            'yt-live-chat-author-chip.yt-live-chat-text-message-renderer' +
                            '{ margin-right:0px!important }' +
                            '.yt-live-chat-text-message-ng-transparent' +
                            '{ display:none!important }' +
                            'yt-live-chat-text-message-renderer' +
                            '{ font-size:' + fontsize + 'px!important; font-weight:bold; }' +
                            'yt-live-chat-text-message-renderer' +
                            '{ ' +
                            '  border: 1px #999 solid; ' +
                            '  padding: 0; ' +
                            '  display: none; ' +
                            '}' +
                            'yt-live-chat-text-message-renderer #content' +
                            '{ ' +
                            '  border-left-width: 0; ' +
                            '  margin-left: 2rem; ' +
                            '  padding-left: 0; ' +
                            '  display: inline-block; ' +
                            '}' +
                            'yt-live-chat-author-chip.yt-live-chat-text-message-renderer' +
                            '{ ' +
                            '  padding: 0; ' +
                            '}' +
                            'yt-live-chat-text-message-renderer #author-photo' +
                            '{ ' +
                            '  border: 0!important; ' +
                            '  border-radius: 0!important; ' +
                            '  margin: 0!important; ' +
                            '  padding: 0; ' +
                            '  display: table!important; ' +
                            '  width: auto; ' +
                            '}' +
                            'yt-live-chat-text-message-renderer yt-img-shadow' +
                            '{ ' +
                            //'  padding: 3px; ' +
                            '  width: 8rem; ' +
                            '  word-break: break-all; ' +
                            '}' +
                            'yt-live-chat-text-message-renderer yt-img-shadow img' +
                            '{ ' +
                            '  display: none!important; ' +
                            '}' +
                            'yt-live-chat-text-message-renderer yt-live-chat-author-chip' +
                            '{ ' +
                            '  padding-left: 1rem; ' +
                            '  padding-right: 1rem; ' +
                            '}' +
                            'yt-live-chat-text-message-renderer #message' +
                            '{ ' +
                            '  border-right-width: 0; ' +
                            '  border-top-width: 0; ' +
                            //'  padding: 1rem; ' +
                            '}' +
                            '#show-more ' +
                            '{ ' +
                            '  display: none!important; ' +
                            '} ' +
                            '#message.yt-live-chat-text-message-renderer' +
                            '{ font-size:' + chatTxtFontSize + 'px!important; color:#000000!important; line-height: 1em!important; }' +
                            '#author-name.yt-live-chat-text-message-renderer' +
                            '{ color:#999999!important }' +
                            '#timestamp.yt-live-chat-text-message-renderer' +
                            '{ color:#999999!important }' +
							/*
								'yt-live-chat-text-message-renderer:nth-child(even)' +
								'{ background-color: #eeeeee }' +
								'yt-live-chat-text-message-renderer:nth-child(odd)' +
								'{ background-color: #ffffff }' +
							*/
                            '#optionSetting' +
                            '{ background: hsl(0, 0%, 97%)!important; color:#000000!important }' +
                            '#openOptionPage' +
                            '{ color:#000000!important }' +
                            '#menu-button.paper-icon-button-1' +
                            '{ width:30px; height:22px; padding:0px; }');
                    }
                } else if ("9" == options.commentStyle) {
                    if (styleDark) {
                        $istyle.html($istyle.html() +
                            'yt-live-chat-author-chip.yt-live-chat-text-message-renderer' +
                            '{ margin-right:0px!important }' +
                            '.yt-live-chat-text-message-ng-transparent' +
                            '{ display:none!important }' +
                            'yt-live-chat-text-message-renderer' +
                            '{ font-size:' + fontsize + 'px!important; font-weight:bold; }' +
                            '#message.yt-live-chat-text-message-renderer' +
                            '{ font-size:' + chatTxtFontSize + 'px!important; color:#ffffff!important; line-height: 1em!important; }' +
                            '#menu-button.paper-icon-button-1' +
                            '{ width:30px; height:22px; padding:0px; }' +
                            '#optionSetting' +
                            '{ background: rgb(40, 40, 40)!important; color:#ffffff!important }' +
                            '#openOptionPage' +
                            '{ color:#ffffff!important }');
                    } else {
                        $istyle.html($istyle.html() +
                            'yt-live-chat-author-chip.yt-live-chat-text-message-renderer' +
                            '{ margin-right:0px!important }' +
                            '.yt-live-chat-text-message-ng-transparent' +
                            '{ display:none!important }' +
                            'yt-live-chat-text-message-renderer' +
                            '{ font-size:' + fontsize + 'px!important; font-weight:bold; }' +
                            '#message.yt-live-chat-text-message-renderer' +
                            '{ font-size:' + chatTxtFontSize + 'px!important; color:#000000!important; line-height: 1em!important; }' +
                            '#menu-button.paper-icon-button-1' +
                            '{ width:30px; height:22px; padding:0px; }' +
                            '{ background-color: #ffffff }' +
                            '#optionSetting' +
                            '{ background: hsl(0, 0%, 97%)!important; color:#000000!important }' +
                            '#openOptionPage' +
                            '{ color:#000000!important }');
                    }
                }
                //アイコン表示
                if ($('#displayIcon', doc).prop('checked')) { $istyle.html($istyle.html() + '#author-photo { display: inline-block!important;}'); } else { $istyle.html($istyle.html() + '#author-photo { display: none!important;}'); }
                //時間表示
                if ($('#displayPlayTime', doc).prop('checked')) { $istyle.html($istyle.html() + '#playtime { display: inline-block;}'); } else { $istyle.html($istyle.html() + '#playtime { display: none;}'); }
                //時間表示
                if ($('#displayTime', doc).prop('checked')) { $istyle.html($istyle.html() + '#timestamp { display: inline-block;}'); } else { $istyle.html($istyle.html() + '#timestamp { display: none;}'); }
                //名前表示
                if ($('#displayName', doc).prop('checked')) { $istyle.html($istyle.html() + '#author-name { display: initial;}'); } else { $istyle.html($istyle.html() + '#author-name { display: none;}'); }


            };
            var observer3 = new MutationObserver(function (mutations) {
                var dark = false;
                if (null != document.querySelector('html').getAttribute('dark') || gaming) {
                    dark = true;
                } else {
                    dark = false;
                }

                if (dark != YOUTUBE.styleDark) {
                    YOUTUBE.styleDark = dark;
                    funcDark(YOUTUBE.styleDark);
                }
            });
            observer3.observe(document.querySelector('html'), { attributes: true });
            var dark = false;
            if (null != document.querySelector('html').getAttribute('dark') || gaming) {
                dark = true;
            } else {
                dark = false;
            }
            YOUTUBE.styleDark = dark;
            funcDark(YOUTUBE.styleDark);


            //アイコン表示
            $('#displayIcon', doc).unbind('change');
            $('#displayIcon', doc).change(YOUTUBE.dispIcon);
            //最初は追加
            //if($('#displayIcon', doc).prop('checked')) { $istyle.html($istyle.html() + '#author-photo { display: inline-block!important;}'); } else { $istyle.html($istyle.html() + '#author-photo { display: none!important;}'); }
            //名前表示
            $('#displayName', doc).unbind('change');
            $('#displayName', doc).change(YOUTUBE.dispName);
            //if($('#displayName', doc).prop('checked')) { $istyle.html($istyle.html() + '#author-name { display: initial;}'); } else { $istyle.html($istyle.html() +'#author-name { display: none;}'); }
            //shita表示
            $('#displayComeShita', doc).unbind('change');
            $('#displayComeShita', doc).change(changeComeShita);
            //フォントサイズ
            $('#txtFontSize', doc).unbind();
            //$('#txtFontSize', doc).mouseup(function(){alert($(this)); document.getElementById('txtFontColor').focus();});
            //$('#txtFontSize', doc).on('input',changeFontSizetxt);
            $('#txtFontSize', doc).change(changeFontSizetxt);
            //フォントサイズ
            $('#chatTxtFontSize', doc).unbind();
            $('#chatTxtFontSize', doc).change(changeChatFontSizetxt);
            //フォントカラー
            $('#txtFontColor', doc).unbind('change');
            $('#txtFontColor', doc).change(changeFontColor);

            $("#txtFontSizeBar", doc).slider({
                range: "min",
                min: 1,
                max: 100,
                step: 1,
                value: $("#txtFontSize", doc).val(),
                slide: function (event, ui) {
                    //alert('slide');
                    $("#txtFontSize", doc).val(ui.value);
                    $('#txtFontSize', doc).change();
                }
            });

            $("#chatTxtFontSizeBar", doc).slider({
                range: "min",
                min: 1,
                max: 100,
                step: 1,
                value: $("#chatTxtFontSize", doc).val(),
                slide: function (event, ui) {
                    //alert('slide');
                    $("#chatTxtFontSize", doc).val(ui.value);
                    $('#chatTxtFontSize', doc).change();
                }
            });


            // メッセージを受け取る
            chrome.runtime.onMessage.addListener(
                function (request, sender, sendResponse) {
                    var domain = gaming ? "gaming.youtube.com" : "www.youtube.com";
                    // ポップアウト側からの設定情報送信要求に応答
                    if (request.type === "loadOpenerSetting") {
                        var request = {
                            type: "loadSetting"
                            , url: "https://" + domain + "/watch?v=" + videoId
                            , videoId: videoId
                            , displayIcon: $('#displayIcon', doc).prop('checked')
                            , displayName: $('#displayName', doc).prop('checked')
                            , displayCome: $('#displayCome', doc).prop('checked')
                            , displayComeShita: $('#displayComeShita', doc).prop('checked')
                            , txtFontSize: $('#txtFontSize', doc).val()
                            , chatTxtFontSize: $('#chatTxtFontSize', doc).val()
                            , txtFontColor: $('#txtFontColor', doc).val()
                        };
                        chrome.runtime.sendMessage(request, function (response) { });
                    }

                    // 設定情報反映要求に応答
                    if (request.type === "loadSetting") {
                        $('#displayIcon', doc).prop('checked', eval(request.displayIcon));
                        $('#displayName', doc).prop('checked', eval(request.displayName));
                        $('#displayCome', doc).prop('checked', eval(request.displayCome));
                        $('#displayComeShita', doc).prop('checked', eval(request.displayComeShita));
                        $('#txtFontSize', doc).val(request.txtFontSize);
                        $('#chatTxtFontSize', doc).val(request.chatTxtFontSize);
                        $('#txtFontColor', doc).val(request.txtFontColor);
                        YOUTUBE.dispIcon();
                        YOUTUBE.dispName();
                        dispCome();
                        changeFontSizetxt();
                        sendResponse({});
                    }

                    if (request.type === "reloadSetting") {
                        sendResponse({});
                    }

                    if (request.type === "getCommentArrayOpener") {
                        //console.log(commentArray);
                        var request = {
                            type: "getCommentArray"
                            , url: "https://" + domain + "/watch?v=" + videoId
                            , videoId: videoId
                            , commentArray: commentArray
                        };
                        chrome.runtime.sendMessage(request, function (response) { });
                    }
                    if (request.type === "getCommentArray") {
                        //console.log(request);
                        commentArray = request.commentArray;
                    }
                    if (request.type === "moveComment") {
                        $('#live-chat-iframe').remove();
                        console.log($(request.commentList));
                        setTimeout(function () {
                            moveComment($(request.commentList), false, true);
                            chrome.runtime.sendMessage(request, function (response) { });
                        }, 0);
                    }
                }
            );

            YOUTUBE.overrideFunction();

            /*
            var commentList = doc.getElementsByTagName('yt-live-chat-text-message-renderer');
            $('yt-live-chat-text-message-renderer', doc).each(function (index) {
                $(this).attr('commentNo', YOUTUBE.commentNo);
                YOUTUBE.commentNo++;

                if (null != options && null != options.commentNoWrap && options.commentNoWrap) {
                    var comment = getComment(commentList, index);
                    var title = convert2Title(comment);
                    $(this).attr('title', title);
                }
            });
            */

            var func = function () {
                st = (new Date()).getTime(); //★

                if (null == ngInfo) {
                    ngInfo = {};
                }

				var lc;
                var commentList = doc.getElementsByTagName('yt-live-chat-text-message-renderer');
                var cl = [];
                if (lc == "") {
                    lc = getCommentId(commentList, 0, ngInfo);
                }
                
                var i = 0;
                var height = 0;
                for (var i = commentList.length - 1; i >= 0; i--) {
                    try {
                        var id = getCommentId(commentList, i);
                        if (lc == "" || lc == id) {
                            break;
                        }
                        $(commentList[i]).removeClass('yt-live-chat-text-message-ng-transparent');
                        //height += $(commentList[i]).height();
                        var name = id.split('_@_')[0];
                        var comment = getComment(commentList, i);

                        if (null != options && null != options.commentNoWrap && options.commentNoWrap) {
                            var title = convert2Title(comment);
                            $(commentList[i]).attr('title', title);
                        }

                        var isNotTransparentNg = true;
                        if (validNg) {
                            var ni = (null != ngInfo && null != ngInfo[name]) ? ngInfo[name] : ngInfoShare[name];
                            if (null != ni) {
                                if (ni.transparent) {
                                    log('12★' + id + '★' + i);
                                    isNotTransparentNg = false;
                                }
                                applyNgLine(name, commentList[i], ngInfo, false);
                            }
                        }


                        if (validNg) {
                            for (var r in ngInfo["__regex__"]) {
                                var regex = ngInfo["__regex__"][r];
                                if (null != comment.trim().match(regex.regexObject)) {
                                    applyNgLine(name, commentList[i], ngInfo, false);
                                    if (regex.transparent) {
                                        isNotTransparentNg = false;
                                        break;
                                    }
                                }
                            }
                        }

                        if (isNotTransparentNg) {
                            cl.push(commentList[i]);
                        } else {
                            commentList[i].removeAttr('commentNo');
                        }
                    } catch (e) {
                        log(e);
                    }
                }

                try {
                    if (0 < commentList.length) {
                        lc = getCommentId(commentList, commentList.length - 1, ngInfo);
                    }
                } catch (e) {
                }

                for (var i = cl.length - 1; i >= 0; i--) {
                    if (!$(cl[i]).hasClass("yt-live-chat-text-message-ng-transparent")) {
                        $(cl[i]).attr('commentNo', YOUTUBE.commentNo);
                        YOUTUBE.commentNo++;
                    }
                }

                var cl = [];
                var commentList = doc.getElementsByTagName('yt-live-chat-text-message-renderer');
                for (var i = commentList.length - 1; i >= 0; i--) {
                    cl.push(commentList[i]);
                }

                if (null == options || null == options.commentStyle || "0" == options.commentStyle) {
                	/*
                    $('yt-live-chat-text-message-renderer:not(yt-live-chat-text-message-ng-transparent)', doc).each(function (index) {
                        var no = Number($(this).attr('commentNo'));
                    });
                    */
					//$($('yt-live-chat-text-message-renderer',doc).get().reverse()).each(function(index){
					$('yt-live-chat-text-message-renderer',doc).each(function(index){
						var no = Number($(this).attr('commentNo'));
						
						if(!$(this).hasClass('background-color-0')
						&& !$(this).hasClass('background-color-f')
						&& !$(this).hasClass('background-color-1')
						&& !$(this).hasClass('background-color-2')
						&& !$(this).hasClass('background-color-e')){
							var color = (0 == no % 2) ? (YOUTUBE.styleDark) ? 'background-color-0' : 'background-color-f' : (YOUTUBE.styleDark) ? 'background-color-2' : 'background-color-e';
							$(this).removeClass('background-color-0');
							$(this).removeClass('background-color-f');
							$(this).removeClass('background-color-1');
							$(this).removeClass('background-color-2');
							$(this).removeClass('background-color-e');
							$(this).addClass(color);
							
							$(this).css('background-color',color);
							$(this).css({'cssText':'background-color:' + color + '!important'});
							$(this).find('#content').css('background-color','transparent!important');
							$(this).find('#message').css('background-color','transparent!important');
						}
					});
                } else if ("1" == options.commentStyle) {

                    $($('yt-live-chat-text-message-renderer', doc).get().reverse()).each(function (index) {
                        var t = $(this);

                        if ("content" == $(this).find('#message').parent().prop("id")) {
                            $(this).find('#message').wrap('<div style="padding: 0.7rem; display: inline-block;">');

                            var name = $(this).find('#author-name').text().trim();
                            name = '';
                            var color = getRandomColor();
                            $(this).find('yt-img-shadow').html(
                                '<div class="iconDiv" ' +
                                '	style="display: table-cell!important; vertical-align: middle; color:white; ' +
                                '		   position:absolute; height:100%; width:2rem; padding:0; left:0; ' +	// width:auto
                                '		   background-color:' + color + '!important;">' + name + '</div>');
                            $(this).find('yt-img-shadow').css('background-color', color);
                        }

                        setTimeout(function () {
                            t.css({ 'cssText': 'display:flex!important' });
                            $('#item-scroller', doc).scrollTop(999999);
                        }, 50);
                    });
                }

                $('#show-more', doc).hide();
                //if(prevScrollPosition <= $('#item-scroller',doc).scrollTop() + 500){
                setTimeout(function () {
                    $('#item-scroller', doc).scrollTop(999999);
                }, 50);
                setTimeout(function () {
                    $('#show-more', doc).show();
                }, 1000);
                //}
                prevScrollPosition = $('#item-scroller', doc).scrollTop();

                //console.log('9★'+((new Date()).getTime() - st)+'★');
            };

			/*
            var itemsTm = setInterval(function () {
                if (null == doc.querySelector('#item-offset>#items')) {
                    return;
                }

                clearInterval(itemsTm);

                var observer2 = new MutationObserver(function (mutations) {
                    st = (new Date()).getTime(); //★
                    //setTimeout(func, 0);
                    setTimeout(moveComment, 200, $('yt-live-chat-text-message-renderer', doc), false, false);
                });
                //observer2.observe(doc.querySelector('#item-offset>#items'), { childList: true });
            }, 200);
			*/

            setInterval(function () {
                //setTimeout(func, 0);
                setTimeout(moveComment, 0, $('yt-live-chat-text-message-renderer', doc), false, false);
            }, 500);

			/*
			// Workerを作成する
			const worker = new Worker(URL.createObjectURL(new Blob(["("+worker_function.toString()+")()"], {type: 'text/javascript'})));
			 
			// メッセージを受信してコンソールに表示する
			worker.addEventListener('message', (message) => {
			   console.log(message.data);
			});
			 
			// メッセージを送信する
			const data2 = {sync:sync,gaming:gaming,twitcasting:twitcasting,openrec:openrec,mixer:mixer
							,shita:$('#displayComeShita', doc.body).prop('checked')
							,fontSize:Number(doc.getElementById('txtFontSize').value)
							,chatTxtFontSize:Number(doc.getElementById('chatTxtFontSize').value)
							,fontColor:doc.getElementById('txtFontColor').value
							,commentDivDisplay:document.getElementById('commentDiv').style.display
							};
			worker.postMessage(data2);
			
			*/

            /*
            setInterval(function () {
                setTimeout(function () {
                    st = (new Date()).getTime(); //★
                    var commentList = $('yt-live-chat-text-message-renderer', doc);
                    moveComment(commentList, false, true);
                    //		log('11★'+((new Date()).getTime() - st)+'★');
                }, 0);
            }, 500);

            setInterval(function () {
                setTimeout(function () {
                    $($('yt-live-chat-text-message-renderer:not(.yt-live-chat-text-message-ng-transparent)', doc).get().reverse()).each(function (index) {
                        //console.log(index);
                        if (50 < index) {
                            $(this).remove()
                        }
                    });
                    $($('.yt-live-chat-text-message-ng-transparent', doc).get().reverse()).each(function (index) {
                        //console.log(index);
                        if (50 < index) {
                            $(this).remove()
                        }
                    });
                }, 0);
            }, 10000);
            */
            /*
        setInterval(function(){
            $('#commentDiv').remove();
            resize();
            $('#commentDiv').show();
            console.log(document.getElementsByName('nicocomment').length);
        },100000);
            */

            /*
            setTimeout(function(){
                for(var i=0;i<100;i++){
                        var div = document.getElementById('commentDiv');
                        //var p = document.getElementById('commentTemplate').cloneNode(false);
                        var p = document.createElement('p');
                        p.innerHTML = "ああああああああああああああああああ";
                        p.style = 'left: 0px; top:' + Math.random() * 200 + 'px; position:absolute; z-index: 9999;' +
                                                '-webkit-animation-duration:5s!important;' +
                                                '-moz-animation-duration:5s!important;' +
                                                '-ms-animation-duration:5s!important;' +
                                                '-o-animation-duration:5s!important;' +
                                                'animation-duration:5s!important;';
                        p.setAttribute('name','nicocomment');
                        p.setAttribute('class','nicocomment');
                        p.setAttribute('id','nicocomment'+i);
                        p.setAttribute('line',i);
                        p.setAttribute('useLine','nicocomment');
                        p.setAttribute('adjTop','nicocomment');
                        p.setAttribute('activeTime','nicocomment');
                        div.appendChild(p);
                }
            },500);
	
            // 大量コメントテスト
            var ii = 0;
            var mt = setInterval(function(){
                var commentList = [];
                var rand = 1;//( Math.random() * ( ( 3 + 1 ) - 5 ) ) + 5;
                for(var i=0;i<rand;i++){
                        var p = document.getElementById('nicocomment'+ii);
                        p.innerHTML = "ああああああああああああああああああ";
                        p.style = 'left: 0px; top:' + Math.random() * 200 + 'px; position:absolute; z-index: 9999;' +
                                                '-webkit-animation-duration:5s!important;' +
                                                '-moz-animation-duration:5s!important;' +
                                                '-ms-animation-duration:5s!important;' +
                                                '-o-animation-duration:5s!important;' +
                                                'animation-duration:5s!important;';
                        $(p).removeClass("comment").addClass("comment");
                        ii++;
                        if(ii > 99) ii = 0;
                }
            },500);
            */
            
            if (gaming) {
                //$('#saveOption', doc).css('height','27px');
                //$('#saveOption', doc).css('min-width','20px');
                //$('#saveOption', doc).css('width','20px');
                $('yt-live-chat-header-renderer').css('padding-top', '0px');

                // 一時保存設定があれば読み込む
                if (null != setting) {
                    $('#displayIcon', doc).prop('checked', (setting.displayIcon));
                    $('#displayName', doc).prop('checked', (setting.displayName));
                    $('#displayCome', doc).prop('checked', (setting.displayCome));
                    $('#displayComeShita', doc).prop('checked', (setting.displayComeShita));
                    $('#txtFontSize', doc).val((setting.txtFontSize));
                    $('#txtFontSize', doc).change();
                    $('#chatTxtFontSize', doc).val((setting.chatTxtFontSize));
                    $('#chatTxtFontSize', doc).change();
                    $('#txtFontColor', doc).val((setting.txtFontColor));
                } else {
                    setting = {
                        displayIcon: $('#displayIcon', doc).prop('checked')
                        , displayName: $('#displayName', doc).prop('checked')
                        , displayCome: $('#displayCome', doc).prop('checked')
                        , displayComeShita: $('#displayComeShita', doc).prop('checked')
                        , txtFontSize: $('#txtFontSize', doc).val()
                        , chatTxtFontSize: $('#chatTxtFontSize', doc).val()
                        , txtFontColor: $('#txtFontColor', doc).val()
                    }
                }

                $('#item-scroller', doc).scrollTop(999999);
            }



			/*
			$('yt-live-chat-text-input-field-renderer>#input',doc).on('click',function(e){
				//clipboardData.setData('text',"aaa");
			});
			$('yt-live-chat-text-input-field-renderer>#input',doc).on('keydown',function(e){
				//clipboardData.setData('text',"aaa");
		 		//e.preventDefault();
		 		//e.stopImmediatePropagation();
				//e.clipboardData.setData('text/plain', 'foo');
				var data = $(this).html();
				var url = data.match(/^(http?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/);
				if(null != url){
					//alert(url[0].replace(/\//g,'$'));
					$(this).html(url[0].replace(/\//g,'$'));
				}
			});
			
			$('#masthead-search-term').on('beforepaste',function(e){
				alert();
			});
			$('yt-live-chat-text-input-field-renderer>#input',doc).on('paste',function(e){
		 		e.preventDefault();
		 		e.stopImmediatePropagation();
				//e.clipboardData.setData('text/plain', 'foo');
				var data = e.originalEvent.clipboardData.getData('Text');
				var url = data.match(/^(http?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/);
				if(null != url){
					//alert(url[0].replace(/\//g,'$'));
					$(this).html(url[0].replace(/\//g,'$'));
					$(this).change();
					$(this).input();
					$(this).keypress();
				}
			});
			*/
			/*
			var events = $._data($('yt-live-chat-text-input-field-renderer>#input',doc).get(0)).events;
			  console.log(events);
			$.each(events.click,function(){
			  console.log(this.handler);
			});
			
			$('yt-live-chat-text-input-field-renderer>#input',doc).attr('tabindex','1');
			$('yt-live-chat-text-input-field-renderer>#input',doc).on('focus',function(e){
		$('#copyText').val("https:$$www.youtube.com$watch?v=zul7JhPr240");
		$('#copyButton').click();
		$(this).focus();
			});
			*/
            //console.log($._data($('yt-live-chat-text-input-field-renderer>#input',doc).get(0), "events"));
            
            
            /*
            $('yt-live-chat-text-input-field-renderer>#input', doc).on('paste', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                var data = e.originalEvent.clipboardData.getData('Text');
                var url = data.match(/^(http|https)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/);
                if (null != url) {
                    //alert(url[0].replace(/\//g,'$'));
                    //$(this).html("" + url[0].replace(/\//g,'$'));
                    $(this).change();
                    //$(this).input();
                    $(this).keypress();
                    $(this).keyup();
                    $(this).keydown();
                    var e = new Event("keydown");
                    e.key = "a";    // just enter the char you want to send 
                    e.keyCode = e.key.charCodeAt(0);
                    e.which = e.keyCode;
                    e.altKey = false;
                    e.ctrlKey = false;
                    e.shiftKey = false;
                    e.metaKey = false;
                    e.bubbles = true;
                    document.dispatchEvent(e);
                    setTimeout(function () {
                        var evt = $.Event('keypress');
                        evt.which = 65;
                        evt.keyCode = 65;    // エンターキー入力時のテスト
                        $('input').trigger(evt);
                        $('input').trigger("keydown", { which: 65 });
                        //$('yt-live-chat-text-input-field-renderer>#input',doc).html($('yt-live-chat-text-input-field-renderer>#input',doc).html() + "aaaaaaaaaa");
                    }, 1000);
                    $('#copyText').val(url[0].replace(/https/g, '(ps)').replace(/http/g, '(p)').replace(/\//g, '(s)').replace(/\./g, '(d)'));
                    $('#copyButton').click();
                    $(this).focus();
                    $(this).html("");
                    alert("URLを検知したため、送信可能な文字列に変換しました。\n再度ペーストしてコメントを送信してください。");
                    return false;
                }
                //e.clipboardData.setData('text/plain', 'foo');
            });
            */

            var addNgKind = "0";
            if (null != options && null != options.addNgKind) {
                addNgKind = options.addNgKind;
            }
            
            /*
            if (!gaming && !impopout) {
                $.contextMenu({
                    context: doc,
                    selector: 'yt-live-chat-text-message-renderer:not(.yt-live-chat-text-message-ng)',
                    trigger: 'right',
                    className: 'contextmenu',
                    zIndex: 1000,
                    position: function (opt, x, y) {
                        opt.$menu.css({ top: $(iframe).offset().top + y, left: $(iframe).offset().left + x });
                    },

                    build: function ($trigger, e) {
                        return {
                            callback: contextMenuCallback,
                            items: "0" == addNgKind ?
                                {
                                    "ngName": {
                                        name: "\"" + $trigger.find('#author-name').text() + "\" をNGユーザに追加",
                                        items: {
                                            "ngNormal": { name: "通常NG", className: "context-menu-ng" },
                                            "ngTransparent": { name: "透明NG", className: "context-menu-ng" }
                                        }, className: "context-menu-separator-bottom"
                                    },
                                    "extract": { name: "\"" + $trigger.find('#author-name').text() + "\"のコメントを抽出する", className: "context-menu-separator-top" },
                                    "copy": { name: '"' + omitStr($trigger.find('#message').html()) + '"をコピーする' }
                                }
                                : "1" == addNgKind ?
                                    {
                                        "ngNormal": { name: "\"" + $trigger.find('#author-name').text() + "\" をNGユーザに追加", className: "context-menu-separator-bottom" },
                                        "extract": { name: "\"" + $trigger.find('#author-name').text() + "\"のコメントを抽出する", className: "context-menu-separator-top" },
                                        "copy": { name: '"' + omitStr($trigger.find('#message').html()) + '"をコピーする' }
                                    }
                                    :
                                    {
                                        "ngTransparent": { name: "\"" + $trigger.find('#author-name').text() + "\" をNGユーザに追加", className: "context-menu-separator-bottom" },
                                        "extract": { name: "\"" + $trigger.find('#author-name').text() + "\"のコメントを抽出する", className: "context-menu-separator-top" },
                                        "copy": { name: '"' + omitStr($trigger.find('#message').html()) + '"をコピーする' }
                                    }
                        };
                    }
                });

                $.contextMenu({
                    context: doc,
                    selector: '.yt-live-chat-text-message-ng',
                    trigger: 'right',
                    className: 'contextmenu',
                    zIndex: 1000,
                    position: function (opt, x, y) {
                        opt.$menu.css({ top: $(iframe).offset().top + y, left: $(iframe).offset().left + x });
                    },
                    build: function ($trigger, e) {
                        return {
                            callback: contextMenuCallback,
                            items: {
                                "unng": { name: "\"" + $trigger.find('#author-name').text() + "\" のNGを解除", className: "context-menu-separator-bottom" },
                                "extract": { name: "\"" + $trigger.find('#author-name').text() + "\"のコメントを抽出する", className: "context-menu-separator-top" },
                                "copy": { name: '"' + omitStr($trigger.find('#message').html()) + '"をコピーする' }
                            }
                        };
                    }
                });
            } else {
                var left = 0;
                var top = 0;
                if (gaming) {
                    if (impopout) {
                        left = 100;
                        top = 40;
                    } else {
                        left = 150;
                        top = 50;
                    }
                } else {
                    left = 50;
                    top = 40;
                }

                $.contextMenu({
                    selector: 'yt-live-chat-text-message-renderer:not(.yt-live-chat-text-message-ng)',
                    trigger: 'right',
                    className: 'contextmenu',
                    zIndex: 1000,
                    position: function (opt, x, y) {
                        opt.$menu.css({ top: y - top, left: x - left });
                    },

                    build: function ($trigger, e) {
                        return {
                            callback: contextMenuCallback,
                            items: "0" == addNgKind ?
                                {
                                    "ngName": {
                                        name: "\"" + $trigger.find('#author-name').text() + "\" をNGユーザに追加",
                                        items: {
                                            "ngNormal": { name: "通常NG", className: "context-menu-ng" },
                                            "ngTransparent": { name: "透明NG", className: "context-menu-ng" }
                                        }, className: "context-menu-separator-bottom"
                                    },
                                    "extract": { name: "\"" + $trigger.find('#author-name').text() + "\"のコメントを抽出する", className: "context-menu-separator-top" },
                                    "copy": { name: '"' + omitStr($trigger.find('#message').html()) + '"をコピーする' }
                                }
                                : "1" == addNgKind ?
                                    {
                                        "ngNormal": { name: "\"" + $trigger.find('#author-name').text() + "\" をNGユーザに追加", className: "context-menu-separator-bottom" },
                                        "extract": { name: "\"" + $trigger.find('#author-name').text() + "\"のコメントを抽出する", className: "context-menu-separator-top" },
                                        "copy": { name: '"' + omitStr($trigger.find('#message').html()) + '"をコピーする' }
                                    }
                                    :
                                    {
                                        "ngTransparent": { name: "\"" + $trigger.find('#author-name').text() + "\" をNGユーザに追加", className: "context-menu-separator-bottom" },
                                        "extract": { name: "\"" + $trigger.find('#author-name').text() + "\"のコメントを抽出する", className: "context-menu-separator-top" },
                                        "copy": { name: '"' + omitStr($trigger.find('#message').html()) + '"をコピーする' }
                                    }
                        };
                    }
                });

                $.contextMenu({
                    selector: '.yt-live-chat-text-message-ng',
                    trigger: 'right',
                    className: 'contextmenu',
                    zIndex: 1000,
                    position: function (opt, x, y) {
                        opt.$menu.css({ top: y - top, left: x - left });
                    },
                    build: function ($trigger, e) {
                        return {
                            callback: contextMenuCallback,
                            items: {
                                "unng": { name: "\"" + $trigger.find('#author-name').text() + "\" のNGを解除", className: "context-menu-separator-bottom" },
                                "extract": { name: "\"" + $trigger.find('#author-name').text() + "\"のコメントを抽出する", className: "context-menu-separator-top" },
                                "copy": { name: '"' + omitStr($trigger.find('#message').html()) + '"をコピーする' }
                            }
                        };
                    }
                });
            }
            */

            if (!impopout) {
                /* resize */
                try {
                    var observer = new MutationObserver(function (mutations) {
                        resize();
                    });
                    observer.observe(document.querySelector('video'), { childList: true, attributes: true });
                    resize();
                } catch (e) {
                    //log(e);
                }

                var offlineTm = setInterval(function () {
                    if (null == document.querySelector('.ytp-offline-slate')) {
                        return;
                    }

                    clearInterval(offlineTm);

                    var observer3 = new MutationObserver(function (mutations) {
                        if ($('.ytp-offline-slate').is(':visible')) {
                            if (0 != $('.html5-video-container>#commentDiv3').length) {
                                var commentList = $('yt-live-chat-text-message-renderer', doc);
                                lastComId = getCommentId(commentList, commentList.length - 1);
                                $('#commentDiv3').insertBefore($('.video-stream').parent());
                                $(".nicocomment").remove();
                                $('.nicocommentDead').remove();
                            }
                        } else {
                            if (0 == $('.html5-video-container>#commentDiv3').length) {
                                var commentList = $('yt-live-chat-text-message-renderer', doc);
                                lastComId = getCommentId(commentList, commentList.length - 1);
                                $('#commentDiv3').insertBefore($('.video-stream'));
                                $(".nicocomment").remove();
                                $('.nicocommentDead').remove();
                            }
                        }
                    });
                    observer3.observe(document.querySelector('.ytp-offline-slate'), { attributes: true });
                }, 500);

                function resize() {
                    var height = document.querySelector('.html5-video-player').offsetHeight;
                    var width = document.querySelector('.html5-video-player').offsetWidth;
                    comDivWidth = width;

                    $('#puzzleCanvas').remove();

                    var commentDiv = document.getElementById('commentDiv');
                    if (null != commentDiv) {
                        document.querySelector('#commentDiv').style.height = (height) + "px";
                        document.querySelector('#commentDiv').style.width = (width) + "px";
                        $('#commentDiv3').remove();
                        $('.video-stream').before('<canvas class="commentDiv3" id="commentDiv3" width=' + width * 2 + ' height=' + height * 2 + ' style="-webkit-font-smoothing: antialiased;position: absolute; z-index: 999; height:' + height + 'px; width:' + width + 'px; text-shadow: #999 0.1px 0.1px 1px; border:0;" ></canvas>');
                    } else {
                        $('.video-stream').before('<div class="commentDiv" id="commentDiv" style="position: absolute; z-index: 999; height:' + height + 'px; width:' + width + 'px;" ></div>');
                        document.getElementById('commentDiv').style.display = 'none';
                        $('.video-stream').before('<canvas class="commentDiv3" id="commentDiv3" width=' + width * 2 + ' height=' + height * 2 + ' style="font-family:-apple-system,BlinkMacSystemFont,Helvetica Neue,Hiragino Kaku Gothic ProN,Meiryo,\\30E1\30A4\30EA\30AA,sans-serif; -webkit-font-smoothing: subpixel-antialiased; position: absolute; z-index: 999; height:' + height + 'px; width:' + width + 'px; text-shadow: #999 0.1px 0.1px 1px; border:0;" ></canvas>');
                        //$('#player-api').prepend('<canvas class="puzzleCanvas" id="puzzleCanvas" style="-webkit-font-smoothing: antialiased;position: absolute; z-index: 999; height:' + height + 'px; width:' + width + 'px; text-shadow: #999 0.1px 0.1px 1px;" ></canvas>');
                        //loadImage('https://i.ytimg.com/vi/uy6T4zBhrbk/hqdefault_live.jpg?sqp=CKj0hdEF-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCJ2l4yaLesaNRpqA7YlNaqobHj_A');
                        //shuffle();

                        $('#commentDiv').append('<span id="ruler" style="visibility:hidden;position:absolute;white-space:nowrap;"></span>');
                        //$('#commentDiv').appendTo($('#commentDiv4'));
                        //$('#commentDiv4').contents().find('body').append($('#commentDiv'));
                    }
                    if ($('.ytp-offline-slate').is(':visible')) {
                        if (0 != $('.html5-video-container>#commentDiv3').length) {
                            var commentList = $('yt-live-chat-text-message-renderer', doc);
                            lastComId = getCommentId(commentList, commentList.length - 1);
                            $('#commentDiv3').insertBefore($('.video-stream').parent());
                            $(".nicocomment").remove();
                            $('.nicocommentDead').remove();
                        }
                    } else {
                        if (0 == $('.html5-video-container>#commentDiv3').length) {
                            var commentList = $('yt-live-chat-text-message-renderer', doc);
                            lastComId = getCommentId(commentList, commentList.length - 1);
                            $('#commentDiv3').insertBefore($('.video-stream'));
                            $(".nicocomment").remove();
                            $('.nicocommentDead').remove();
                        }
                    }

                    if (gaming) {
                        // 表示レイアウトが変更されてコメント欄が再読込になった場合
                        if (0 == $('#commentOption', doc).length) {
                            sync = false;
                            lastComId = "";
                            timer = setInterval(YOUTUBE.init, 1000);
                        } else {
                            if ("horizontal" == $('yt-live-chat-header-renderer').attr("collapse-direction")
                                && undefined != $('yt-live-chat-header-renderer').attr("collapsed")) {
                                $('#commentOption', doc).hide();
                                $('#saveOption', doc).hide();
                            } else {
                                $('#commentOption', doc).show();
                                $('#saveOption', doc).show();
                            }
                        }
                    }
                    
                    initCanvas();
                }

                //コメント表示
                $('#displayCome', doc).unbind('change');
                $('#displayCome', doc).change(dispCome);
                dispCome();

                if (validNg) {
                    chrome.storage.local.get(function (items) {
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
                        //for(var i in ngInfo){
                        applyNg(ngInfo);
                        //}
                    });
                }

            } else {
                // ポップアウト側での処理
                // 設定変更時に随時親ウィンドウに反映させる
                $('#displayIcon', doc).change(YOUTUBE.sendToOpener);
                $('#displayName', doc).change(YOUTUBE.sendToOpener);
                $('#displayCome', doc).change(YOUTUBE.sendToOpener);
                $('#displayComeShita', doc).change(YOUTUBE.sendToOpener);
                $('#txtFontSize', doc).change(YOUTUBE.sendToOpener);
                $('#chatTxtFontSize', doc).change(YOUTUBE.sendToOpener);
                $('#txtFontColor', doc).change(YOUTUBE.sendToOpener);
                $('#default', doc).click(function () {
                    YOUTUBE.sendToOpener();
                });

                // 親ウィンドウに対する設定情報送信要求
                var domain = gaming ? "gaming.youtube.com" : "www.youtube.com";
                var request = {
                    type: "loadOpenerSetting"
                    , url: "https://" + domain + "/watch?v=" + videoId
                    , videoId: videoId
                };
                chrome.runtime.sendMessage(request, function (response) { });
                var request = {
                    type: "getCommentArrayOpener"
                    , videoId: videoId
                    , url: "https://" + domain + "/watch?v=" + videoId
                };
                chrome.runtime.sendMessage(request, function (response) { });

				/*
				setInterval(function(){
					setTimeout(function(){
						var commentList = $('yt-live-chat-text-message-renderer',doc).parent();
						var request = {
									  type: "moveComment"
									, videoId: videoId
									, url: "https://" + domain + "/watch?v=" + videoId
									, commentList: (commentList).html()};
						chrome.runtime.sendMessage(request, function(response) {});
						//moveComment(commentList,false,true);
					},0);
				//		log('11★'+((new Date()).getTime() - st)+'★');
				},1500);
				*/
            }

            //clearInterval(timer);
        }
    },

    dispPlayTime: function () {
        //既存のものを置換
        if ($('#displayPlayTime', doc).prop('checked')) {
            $istyle.html($istyle.html().replace('#playtime { display: none;}', '#playtime { display: inline-block;}'));
        } else {
            $istyle.html($istyle.html().replace('#playtime { display: inline-block;}', '#playtime { display: none;}'));
        }
    },

    dispTime: function () {
        //既存のものを置換
        if ($('#displayTime', doc).prop('checked')) {
            $istyle.html($istyle.html().replace('#timestamp { display: none;}', '#timestamp { display: inline-block;}'));
        } else {
            $istyle.html($istyle.html().replace('#timestamp { display: inline-block;}', '#timestamp { display: none;}'));
        }
    },

    dispIcon: function () {
        //既存のものを置換
        if ($('#displayIcon', doc).prop('checked')) {
            $istyle.html($istyle.html().replace('#author-photo { display: none!important;}', '#author-photo { display: inline-block!important;}'));
            $('yt-live-chat-text-message-renderer yt-img-shadow#author-photo', doc).css('display', 'inline-block!important');
            $istyle.html($istyle.html() +
                'yt-live-chat-text-message-renderer #author-photo' +
                '{ ' +
                '  display: inline-block!important; ' +
                '}' +
                'yt-live-chat-text-message-renderer #content' +
                '{ ' +
                '  margin-left: 2rem; ' +
                '} ');
        } else {
            $istyle.html($istyle.html().replace('#author-photo { display: inline-block!important;}', '#author-photo { display: none!important;}'));
            $('yt-live-chat-text-message-renderer yt-img-shadow#author-photo', doc).css('display', 'hidden!important');
            $istyle.html($istyle.html() +
                'yt-live-chat-text-message-renderer #author-photo' +
                '{ ' +
                '  display: none!important; ' +
                '}' +
                'yt-live-chat-text-message-renderer #content' +
                '{ ' +
                '  margin-left: 0rem; ' +
                '} ');
        }

        if (null != setting) {
            setting.displayIcon = $('#displayIcon', doc).prop('checked');
        }
    },

    dispName: function () {
        if ($('#displayName', doc).prop('checked')) {
            $istyle.html($istyle.html().replace('#author-name { display: none;}', '#author-name { display: initial;}'));
        } else {
            $istyle.html($istyle.html().replace('#author-name { display: initial;}', '#author-name { display: none;}'));
        }

        if (null != setting) {
            setting.displayName = $('#displayName', doc).prop('checked');
        }
    },

    // 親ウィンドウに設定情報を送る
    // ※ポップアウト側が呼ぶfunction
    sendToOpener: function () {
        var domain = gaming ? "gaming.youtube.com" : "www.youtube.com";
        var request = {
            type: "loadSetting"
            , url: "https://" + domain + "/watch?v=" + videoId
            , videoId: videoId
            , displayIcon: $('#displayIcon', doc).prop('checked')
            , displayName: $('#displayName', doc).prop('checked')
            , displayCome: $('#displayCome', doc).prop('checked')
            , displayComeShita: $('#displayComeShita', doc).prop('checked')
            , txtFontSize: $('#txtFontSize', doc).val()
            , chatTxtFontSize: $('#chatTxtFontSize', doc).val()
            , txtFontColor: $('#txtFontColor', doc).val()
        };
        chrome.runtime.sendMessage(request, function (response) { });
    },

    getCommentArray: function () {
        var request = {
            type: "getCommentArray"
            , commentArray: commentArray
        };
        chrome.runtime.sendMessage(request, function (response) { });
    },

    initFlag: false,
    initTimeShift: function () {
        //if(YOUTUBE.initFlag) return;

        if (0 != $('#yt-live-chat-header-renderer-original').length) return;

        if (!YOUTUBE.timeShift) return;

        if (0 != $('#item-scroller').length) return;

        var json = YOUTUBE.timeShiftData;
        if (YOUTUBE.videoFlag && (null == json || 0 == json.length)) return;

        YOUTUBE.chart = null;
        $('#graphContainer').remove();

        if (null != $('body').attr('dark')) {
            YOUTUBE.styleDark = true;
        }

        $('#chat').remove();

        var settingIcon = gaming || YOUTUBE.styleDark ? "settingg.png" : "setting.png";
        var saveIcon = gaming || YOUTUBE.styleDark ? "saveg.png" : "save.png";
        var defaultIcon = gaming || YOUTUBE.styleDark ? "defaultg.png" : "default.png";
        var html = '<yt-live-chat-header-renderer id="yt-live-chat-header-renderer-original" role="heading" style="display: flex; background-color: #fbfbfb; height: 48px;" class="style-scope yt-live-chat-renderer x-scope yt-live-chat-header-renderer-0" collapse-direction="horizontal">' +
            '<div id="collapser" class="style-scope yt-live-chat-header-renderer" hidden="">' +
            '<ytd-button-renderer button-renderer="" class="style-scope yt-live-chat-header-renderer style-default x-scope ytd-button-renderer-2" is-icon-button="">' +
            '<a is="yt-endpoint" tabindex="-1" class="style-scope ytd-button-renderer x-scope yt-endpoint-2">' +
            '<paper-icon-button role="button" tabindex="0" aria-disabled="false" id="button" class="style-scope ytd-button-renderer style-default x-scope paper-icon-button-0" aria-label="チャットの展開 / 折りたたみ">' +
            '<iron-icon id="icon" class="style-scope paper-icon-button x-scope iron-icon-0" alt="チャットの展開 / 折りたたみ">' +
            '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">' +
            '<g mirror-in-rtl="" class="style-scope iron-icon">' +
            '    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" class="style-scope iron-icon"></path>' +
            '  </g></svg>' +

            '</iron-icon></paper-icon-button></a></ytd-button-renderer></div>' +
            //'<div id="commentOption" style="height:47px; min-width:300px; width:300px; font-size:10px;">' +
            '<div id="primary-content" class="style-scope yt-live-chat-header-renderer" style="padding-top: 13px; padding-left:20px; width: 290px;">' +
            '<span id="title" class="style-scope yt-live-chat-header-renderer" style=" font-size:18px;">チャット</span>' +
            '<span id="view-selector" class="style-scope yt-live-chat-header-renderer"></span>' +
            //'</div>' +
            '</div>' +
            '<div id="commentOption" style="height:47px; font-size:10px;">' +
            '</div>' +
            '<div id="optionSetting" style="display:none; border: solid 1px; height:100px; width: 305px; right:0; z-index:1; font-size:10px; position: absolute; margin-top: 45px; background: hsl(0, 0%, 97%); padding-left:15px;">' +
            '<table style="margin-top: 5px;"><tbody>' +
            '<tr><td>' +
            'コメントタイミング補正&nbsp;&nbsp;<input type="number" id="adjustComment" value="0" style="width:50px;" title="大きいほどコメントを早く表示します">&nbsp;&nbsp;秒' +
            '&nbsp;&nbsp;<input type="checkbox" id="autoScroll" name="autoScroll" checked="checked"><label for="autoScroll">追従</label>' +
            '</td></tr>' +
            '<tr><td>' +
            '<input type="checkbox" id="displayPlayTime" name="displayPlayTime"><label for="displayPlayTime">再生時間</label>' +
            '<input type="checkbox" id="displayTime" name="displayTime"><label for="displayTime">投稿時間</label>' +
            '<input type="checkbox" id="displayName" name="displayName"><label for="displayName">名前</label>' +
            '<input type="checkbox" id="displayCome" name="displayCome"><label for="displayCome">コメントを流す</label>' +
            '<input type="checkbox" id="displayComeShita" name="displayComeShita"><label for="displayComeShita">shita</label>' +
            '</td></tr><tr><td>	<table>' +
            '<tbody><tr>			<td>				フォントサイズ&nbsp;			</td>			<td style="width: 110px;">				<div id="txtFontSizeBar" style="width:90px;" class="ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content">					<input type="text" style="display:none;" id="txtFontSize" value="24">					<div class="ui-slider-range ui-corner-all ui-widget-header ui-slider-range-min" style="width: 23.2323%;"></div><span tabindex="0" class="ui-slider-handle ui-corner-all ui-state-default" style="left: 23.2323%;"></span></div>			</td>			<td>				カラー			</td>			<td>				<input type="color" id="txtFontColor" value="#FFFFFF" style="height:17px;width:25px;" maxlength="7" ime-mode="disabled">			</td>		</tr>' +
            '<tr><td colspan=2>' +
            '<a id="openOptionPage" style="color:black; cursor:pointer;">拡張機能のオプションページを開く</a>' +
            '</td></tr>' +
            '</tbody></table></td></tr></tbody></table>' +
            '&nbsp;&nbsp;&nbsp;</div>' +
            '<div id="saveOption" style="height:20px; min-width:50px; font-size:10px; margin-left:10px; margin-top:15px;">' +
            '<img id="setting" title="設定を開く" style="cursor: pointer; width:16px; height:16px;" src="' + chrome.extension.getURL("images/" + settingIcon) + '"/>&nbsp;&nbsp;&nbsp;&nbsp;' +
            '<img id="save" title="設定を保存" style="cursor: pointer; width:16px; height:16px;" src="' + chrome.extension.getURL("images/" + saveIcon) + '">&nbsp;&nbsp;&nbsp;&nbsp;' +
            '<img id="default" title="デフォルト設定に戻す" style="cursor: pointer; width:16px; height:16px;" src="' + chrome.extension.getURL("images/" + defaultIcon) + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>' +
            '<div id="action-buttons" class="style-scope yt-live-chat-header-renderer"></div>' +
            '</yt-live-chat-header-renderer>' +
            '</yt-live-chat-app>' +


            '<div id="chat" style="" class="style-scope yt-live-chat-renderer">' +
            '          <yt-live-chat-pinned-message-renderer id="pinned-message" class="style-scope yt-live-chat-renderer x-scope yt-live-chat-pinned-message-renderer-1" hidden="">' +
            '  <div id="fade" class="style-scope yt-live-chat-pinned-message-renderer"></div>' +
            '  <div id="message" class="style-scope yt-live-chat-pinned-message-renderer"></div>' +
            '</yt-live-chat-pinned-message-renderer>' +
            '          <div id="item-list" class="style-scope yt-live-chat-renderer">' +
            '<yt-live-chat-item-list-renderer allow-scroll="" class="style-scope yt-live-chat-renderer x-scope yt-live-chat-item-list-renderer-1">' +
            '  <div id="contents" class="style-scope yt-live-chat-item-list-renderer">' +
            '    <template is="dom-if" class="style-scope yt-live-chat-item-list-renderer"></template>' +
            '    <div id="item-scroller" style="height:320px; overflow-y: scroll;" class="style-scope yt-live-chat-item-list-renderer animated">' +
            '      <div id="item-offset" class="style-scope yt-live-chat-item-list-renderer" style="">' +
            '        <div id="items" class="style-scope yt-live-chat-item-list-renderer" style="transform: translateY(0px);">';

        if (!YOUTUBE.videoFlag) {
            html += '        <yt-live-chat-text-message-renderer class="yt-live-chat-text-message-renderer-response-data x-scope yt-live-chat-text-message-renderer-0 style-scope yt-live-chat-item-list-renderer" author-type="">' +
                '        <div id="content" style="padding:3px; " class="yt-live-chat-text-message-renderer">' +
                '        <span id="playtime" class="style-scope yt-live-chat-text-message-renderer"></span>' +
                '        <span id="timestamp" class="style-scope yt-live-chat-text-message-renderer"></span>' +
                '        <span id="author-name" dir="auto" class="style-scope yt-live-chat-text-message-renderer" type=""></span>' +
                '        <span id="message" dir="auto" class="style-scope yt-live-chat-text-message-renderer"><span>[コメントデータ受信中]</span></span>' +
                '        </div></yt-live-chat-text-message-renderer>';
        }

        if (YOUTUBE.videoFlag && null != json) {
            for (var i in json) {
                var data = json[i];
                var color = (0 == i % 2) ? (YOUTUBE.styleDark) ? '#000000' : '#ffffff' : (YOUTUBE.styleDark) ? '#222222' : '#eeeeee';
                html += '        <yt-live-chat-text-message-renderer class="x-scope yt-live-chat-text-message-renderer-0 style-scope yt-live-chat-item-list-renderer" author-type="">' +
                    '        <div id="content" style="padding:3px; background-color:' + color + '" class="yt-live-chat-text-message-renderer">' +
                    '        <span id="playtime" class="style-scope yt-live-chat-text-message-renderer">' + data.dispPlayTime + '</span>' +
                    '        <span id="timestamp" class="style-scope yt-live-chat-text-message-renderer">' + data.dispTime + '</span>' +
                    '        <span id="author-name" dir="auto" class="style-scope yt-live-chat-text-message-renderer" type="">' + data.name + '</span>' +
                    '        <span id="message" dir="auto" class="style-scope yt-live-chat-text-message-renderer">' + data.comment + '</span>' +
                    '        </div></yt-live-chat-text-message-renderer>';
            }
        }

        html += '    </div></div></div></div>' +
            '</yt-live-chat-item-list-renderer>' +
            '</div>' +
            '        </div>';

        if (0 != $('#watch7-sidebar').length) {
            $('#watch7-sidebar').prepend(html);
        } else {
            $('#related').prepend(html);
        }

        $("#primary-content").css('width', $("#yt-live-chat-header-renderer-original").width() - 100 + 'px');

        $('#openOptionPage', doc).click(function () {
            var request = { method: "open" };
            chrome.runtime.sendMessage(request, function (response) { });
        });

        if (0 == $('.commentCountDiv').length) {
            if (!gaming) {
                $('#watch8-sentiment-actions').append(
                    '<div id="watch7-views-info" class="commentCountDiv" style="bottom:70px;font-size:14px;"/>');
            } else {
                $('.headline').append(
                    '<div id="watch7-views-info" class="commentCountDiv" style="font-size:12px;position:absolute;margin-top:-28px;right:25px;"/>');
            }
            $('.commentCountDiv').append(
                '<p style="margin-left:30px;">総コメント数' +
                '　<span id="commentCount" style="font-weight: bold;">-</span></p>');

            /*
            var countTm = setInterval(function(){
                if(null != YOUTUBE.timeShiftData){
                    clearInterval(countTm);
                    $('#commentCount').html(YOUTUBE.timeShiftData.length);
                }
            },500);
            */

            if ("-" == $('#commentCount').html()) {
                $.get("https://onspring3.sakura.ne.jp/kato-junichi/scraping/getComment3.php?videoId=" + videoId + "&getCount=true", function (data) {
                    log(data);
                    if (null != data) {
                        $('#commentCount').html(data);
                    }
                });
            }
        }

        log($('head#mystyle'));
        $('head#mystyle').remove();
        $istyle = $('<style id="mystyle"></style>').attr('type', 'text/css');
        $('head').append($istyle);

        /* styles */
        //コメント番号の色
        $istyle.html($istyle.html() +
            'img.yt-live-chat-text-message-renderer' +
            '{ width: 24px;' +
            '	height: 24px;' +
            '	margin-top: -2px;' +
            '	vertical-align: middle; }' +
            'yt-live-chat-author-chip.yt-live-chat-text-message-renderer' +
            '{ margin-right:0px!important }' +
            '.yt-live-chat-text-message-ng-transparent' +
            '{ display:none!important }' +
            '#message.yt-live-chat-text-message-renderer' +
            '{ color:#000000!important }' +
            '#author-name.yt-live-chat-text-message-renderer' +
            '{ color:#999999!important }' +
            '#playtime.yt-live-chat-text-message-renderer' +
            '{ color:#999999!important }' +
            '#timestamp.yt-live-chat-text-message-renderer' +
            '{ color:#999999!important }' +
            'yt-live-chat-text-message-renderer:nth-child(even)' +
            '{ background-color: #eeeeee }' +
            'yt-live-chat-text-message-renderer:nth-child(odd)' +
            '{ background-color: #ffffff }' +
            //	'#content.yt-live-chat-text-message-renderer:nth-child(even)' +
            //	'{ background-color: #eeeeee }' +
            //	'#content.yt-live-chat-text-message-renderer:nth-child(odd)' +
            //	'{ background-color: #ffffff }' +
            '#menu-button.paper-icon-button-1' +
            '{ width:30px; height:22px; padding:0px; }');


        if (null != options && null != options.commentNoWrap && options.commentNoWrap) {
            $istyle.html($istyle.html() +
                'yt-live-chat-text-message-renderer' +
                '{ white-space: nowrap; }');
        }

        /* settings */
        $('#setting', doc).unbind();
        $('#setting', doc).click(function () {
            $('#optionSetting', doc).toggle();
        });
        // 設定保存イベント
        $('#save').unbind();
        $('#save').click(function () {
            //log('checked : '+$('#autoReload').prop('checked'));
            localStorage.setItem('autoScroll', $('#autoScroll').prop('checked'));
            localStorage.setItem('displayPlayTime', $('#displayPlayTime').prop('checked'));
            localStorage.setItem('displayTime', $('#displayTime').prop('checked'));
            localStorage.setItem('displayName', $('#displayName').prop('checked'));
            localStorage.setItem('displayCome', $('#displayCome').prop('checked'));
            localStorage.setItem('displayComeShita', $('#displayComeShita').prop('checked'));
            localStorage.setItem('txtFontSize', $('#txtFontSize').val());
            localStorage.setItem('txtFontColor', $('#txtFontColor').val());
            alert('設定を保存しました。');
        });
        $('#default').unbind();
        $('#default').click(function () {
            document.getElementById("chatframe").contentWindow.location.reload();
        });
        // 設定情報の読み込み
        if (null != localStorage.getItem('displayCome')) {
            $('#autoScroll').prop('checked', eval(localStorage.getItem('autoScroll')));
            $('#displayPlayTime').prop('checked', eval(localStorage.getItem('displayPlayTime')));
            $('#displayTime').prop('checked', eval(localStorage.getItem('displayTime')));
            $('#displayIcon').prop('checked', eval(localStorage.getItem('displayIcon')));
            $('#displayName').prop('checked', eval(localStorage.getItem('displayName')));
            $('#displayCome').prop('checked', eval(localStorage.getItem('displayCome')));
            $('#displayComeShita').prop('checked', eval(localStorage.getItem('displayComeShita')));
            $('#txtFontSize').val(localStorage.getItem('txtFontSize'));
            $('#txtFontSize').change();
            $('#txtFontColor').val(localStorage.getItem('txtFontColor'));
        }

        var funcDark = function (styleDark) {
            var settingIcon = gaming || styleDark ? "settingg.png" : "setting.png";
            var saveIcon = gaming || styleDark ? "saveg.png" : "save.png";
            var defaultIcon = gaming || styleDark ? "defaultg.png" : "default.png";

            $('#setting', doc).attr("src", chrome.extension.getURL("images/" + settingIcon));
            $('#save', doc).attr("src", chrome.extension.getURL("images/" + saveIcon));
            $('#default', doc).attr("src", chrome.extension.getURL("images/" + defaultIcon));

            var fontsize = (null == options || null == options.fontsize) ? 12 : options.fontsize;
            var fontcolor = (null == options || null == options.fontcolor) ? "#000000" : options.fontcolor;
            //if(null == options || null == options.commentStyle || "0" == options.commentStyle){
            $('#mystyle', doc).remove();
            $istyle = $('<style id="mystyle"></style>').attr('type', 'text/css');
            $('head', doc).append($istyle);

            if (styleDark) {
                $istyle.html($istyle.html() +
                    //	'yt-live-chat-text-message-renderer' +
                    //	'{ display:none!important }' +
                    '.yt-live-chat-text-message-ng-transparent' +
                    '{ display:none!important }' +
                    'yt-live-chat-text-message-renderer' +
                    '{ font-size:' + fontsize + 'px!important; }' +
                    '#message.yt-live-chat-text-message-renderer' +
                    '{ color:#ffffff!important }' +
                    '#author-name.yt-live-chat-text-message-renderer' +
                    '{ color:#999999!important }' +
                    '#playtime.yt-live-chat-text-message-renderer' +
                    '{ color:#999999!important }' +
                    '#timestamp.yt-live-chat-text-message-renderer' +
                    '{ color:#999999!important }' +
                    'yt-live-chat-text-message-renderer:nth-child(even)' +
                    '{ background-color: #222222!important }' +
                    'yt-live-chat-text-message-renderer:nth-child(odd)' +
                    '{ background-color: #000000!important }' +
                    '#yt-live-chat-header-renderer-original' +
                    '{ background-color: #282828!important; color:#ffffff!important }' +
                    '#optionSetting' +
                    '{ background: rgb(40, 40, 40)!important; color:#ffffff!important }' +
                    '#openOptionPage' +
                    '{ color:#ffffff!important }' +
                    '#menu-button.paper-icon-button-1' +
                    '{ width:30px; height:22px; padding:0px; }');
            } else {
                $istyle.html($istyle.html() +
                    //	'yt-live-chat-text-message-renderer' +
                    //	'{ display:none!important }' +
                    '.yt-live-chat-text-message-ng-transparent' +
                    '{ display:none!important }' +
                    'yt-live-chat-text-message-renderer' +
                    '{ font-size:' + fontsize + 'px!important; }' +
                    '#message.yt-live-chat-text-message-renderer' +
                    '{ color:#000000!important }' +
                    '#author-name.yt-live-chat-text-message-renderer' +
                    '{ color:#999999!important }' +
                    '#playtime.yt-live-chat-text-message-renderer' +
                    '{ color:#999999!important }' +
                    '#timestamp.yt-live-chat-text-message-renderer' +
                    '{ color:#999999!important }' +
                    'yt-live-chat-text-message-renderer:nth-child(even)' +
                    '{ background-color: #eeeeee }' +
                    'yt-live-chat-text-message-renderer:nth-child(odd)' +
                    '{ background-color: #ffffff }' +
                    '#yt-live-chat-header-renderer-original' +
                    '{ background-color: #fbfbfb!important; color:#000000!important }' +
                    '#optionSetting' +
                    '{ background: hsl(0, 0%, 97%)!important; color:#000000!important }' +
                    '#openOptionPage' +
                    '{ color:#000000!important }' +
                    '#menu-button.paper-icon-button-1' +
                    '{ width:30px; height:22px; padding:0px; }');
            }

            //}
            //時間表示
            if ($('#displayPlayTime').prop('checked')) { $istyle.html($istyle.html() + '#playtime { display: inline-block;}'); } else { $istyle.html($istyle.html() + '#playtime { display: none;}'); }
            //時間表示
            if ($('#displayTime').prop('checked')) { $istyle.html($istyle.html() + '#timestamp { display: inline-block;}'); } else { $istyle.html($istyle.html() + '#timestamp { display: none;}'); }
            //名前表示
            if ($('#displayName').prop('checked')) { $istyle.html($istyle.html() + '#author-name { display: initial;}'); } else { $istyle.html($istyle.html() + '#author-name { display: none;}'); }


        };
        var observer3 = new MutationObserver(function (mutations) {
            if (null != $('html').attr('dark')) {
                YOUTUBE.styleDark = true;
            } else {
                YOUTUBE.styleDark = false;
            }

            funcDark(YOUTUBE.styleDark);
        });
        observer3.observe(document.querySelector('html'), { attributes: true });
        var dark = false;
        if (null != document.querySelector('html').getAttribute('dark')) {
            dark = true;
        } else {
            dark = false;
        }
        YOUTUBE.styleDark = dark;
        funcDark(YOUTUBE.styleDark);


        //時間表示
        $('#displayPlayTime').unbind('change');
        $('#displayPlayTime').change(YOUTUBE.dispPlayTime);
        //最初は追加
        //if($('#displayPlayTime').prop('checked')) { $istyle.html($istyle.html() + '#playtime { display: inline-block;}'); } else { $istyle.html($istyle.html() + '#playtime { display: none;}'); }
        //時間表示
        $('#displayTime').unbind('change');
        $('#displayTime').change(YOUTUBE.dispTime);
        //最初は追加
        //if($('#displayTime').prop('checked')) { $istyle.html($istyle.html() + '#timestamp { display: inline-block;}'); } else { $istyle.html($istyle.html() + '#timestamp { display: none;}'); }
        //名前表示
        $('#displayName').unbind('change');
        $('#displayName').change(YOUTUBE.dispName);
        //if($('#displayName').prop('checked')) { $istyle.html($istyle.html() + '#author-name { display: initial;}'); } else { $istyle.html($istyle.html() +'#author-name { display: none;}'); }
        //shita表示
        $('#displayComeShita').unbind('change');
        $('#displayComeShita').change(changeComeShita);
        //フォントサイズ
        $('#txtFontSize').unbind();
        //$('#txtFontSize').mouseup(function(){alert($(this)); document.getElementById('txtFontColor').focus();});
        //$('#txtFontSize').on('input',changeFontSizetxt);
        $('#txtFontSize').change(changeFontSizetxt);
        //フォントカラー
        $('#txtFontColor').unbind('change');
        $('#txtFontColor').change(changeFontColor);

        $("#txtFontSizeBar").slider({
            range: "min",
            min: 1,
            max: 100,
            step: 1,
            value: $("#txtFontSize").val(),
            slide: function (event, ui) {
                //alert('slide');
                $("#txtFontSize").val(ui.value);
                $('#txtFontSize').change();
            }
        });

        var addNgKind = "0";
        if (null != options && null != options.addNgKind) {
            addNgKind = options.addNgKind;
        }

        /*
        $.contextMenu({
            selector: 'yt-live-chat-text-message-renderer:not(.yt-live-chat-text-message-ng)',
            trigger: 'right',
            className: 'contextmenu',
            zIndex: 1000,
            build: function ($trigger, e) {
                return {
                    callback: contextMenuCallback,
                    items: "0" == addNgKind ?
                        {
                            "ngName": {
                                name: "\"" + $trigger.find('#author-name').text() + "\" をNGユーザに追加",
                                items: {
                                    "ngNormal": { name: "通常NG", className: "context-menu-ng" },
                                    "ngTransparent": { name: "透明NG", className: "context-menu-ng" }
                                }, className: "context-menu-separator-bottom"
                            },
                            "extract": { name: "\"" + $trigger.find('#author-name').text() + "\"のコメントを抽出する", className: "context-menu-separator-top" },
                            "copy": { name: "このコメントをコピーする" }
                        }
                        : "1" == addNgKind ?
                            {
                                "ngNormal": { name: "\"" + $trigger.find('#author-name').text() + "\" をNGユーザに追加", className: "context-menu-separator-bottom" },
                                "extract": { name: "\"" + $trigger.find('#author-name').text() + "\"のコメントを抽出する", className: "context-menu-separator-top" },
                                "copy": { name: "このコメントをコピーする" }
                            }
                            :
                            {
                                "ngTransparent": { name: "\"" + $trigger.find('#author-name').text() + "\" をNGユーザに追加", className: "context-menu-separator-bottom" },
                                "extract": { name: "\"" + $trigger.find('#author-name').text() + "\"のコメントを抽出する", className: "context-menu-separator-top" },
                                "copy": { name: "このコメントをコピーする" }
                            }
                };
            }
        });

        $.contextMenu({
            selector: '.yt-live-chat-text-message-ng',
            trigger: 'right',
            className: 'contextmenu',
            zIndex: 1000,
            build: function ($trigger, e) {
                return {
                    callback: contextMenuCallback,
                    items: {
                        "unng": { name: "\"" + $trigger.find('#author-name').text() + "\" のNGを解除", className: "context-menu-separator-bottom" },
                        "extract": { name: "\"" + $trigger.find('#author-name').text() + "\"のコメントを抽出する", className: "context-menu-separator-top" },
                        "copy": { name: "このコメントをコピーする" }
                    }
                };
            }
        });
        */

        /*
        try{
            var observer = new MutationObserver(function(mutations) {
                resize3();
            });
            observer.observe(document.querySelector('#movie_player'), {attributes: true});
            resize3();
        }catch(e){
            //log(e);
        }
        function resize3(){
            $("#player-api").css('height',$("#movie_player").height() + 'px');
            $("#player-api").css('width',$("#movie_player").width() + 'px');
            $(".player-api").css('height',$("#movie_player").height() + 'px');
            $(".player-api").css('width',$("#movie_player").width() + 'px');
            $("video").css('height',$("#movie_player").height() + 'px');
            $("video").css('width',$("#movie_player").width() + 'px');
        }
        */

        try {
            var observer = new MutationObserver(function (mutations) {
                resize();
            });
            observer.observe(document.querySelector('video'), { childList: true, attributes: true });
            resize();
        } catch (e) {
            //log(e);
        }

        function resize() {
            var height = $('.html5-video-player').height();
            var width = $('.html5-video-player').width();
            comDivWidth = width;

            var commentDiv = document.getElementById('commentDiv');
            if (null != commentDiv) {
                $('#commentDiv').height(height);
                $('#commentDiv').width(width);
                $('#commentDiv2').height(height);
                $('#commentDiv2').width(width);
            } else {
                $('.video-stream').before('<div class="commentDiv" id="commentDiv" style="position: absolute; z-index: 999; height:' + height + 'px; width:' + width + 'px;" ></div>');
                document.getElementById('commentDiv').style.display = 'none';
                $('.video-stream').before('<div class="" id="commentDiv2" style="position: absolute; z-index: 999; height:' + height + 'px; width:' + width + 'px;" ></div>');
                //document.getElementById('commentDiv2').style.display = 'none';

                document.getElementById('commentDiv').style.display = 'none';
                $('#commentDiv').append('<span id="ruler" style="visibility:hidden;position:absolute;white-space:nowrap;"></span>');
            }

            $('#item-scroller').height(height - 40);

            //log('bottom '+$('.ytp-chrome-bottom')[0].offsetHeight);
            if (null != YOUTUBE.chart) {
                var marginTop = getChartMarginTop();
                var bottom = $('.ytp-chrome-bottom')[0].offsetHeight;
                $('#graphContainer').css('bottom', bottom + 'px');
                YOUTUBE.chart.setSize($('.html5-video-player').width(), 200, false);

                /*
                if(null != document.webkitFullscreenElement){
                    var marginTop = getChartMarginTop() - 8;
                    $('#graphContainer').css('margin-top',marginTop+'px');
                }
                */
            }

        }

        //コメント表示
        $('#displayCome').unbind('change');
        $('#displayCome').change(dispCome);
        dispCome();

        YOUTUBE.overrideFunction();

        getCommentId = function (commentList, idx) {
            try {
                var comment = (commentList[idx].childNodes[1].childNodes[7].innerHTML.trim());
                /*
                var url = comment.match(/(\(p\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)|(\(ps\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)/);
                if (null != url) {
                    urlStr = url[0].replace(/\(p\)/g, 'http').replace(/\(ps\)/g, 'https').replace(/\(s\)/g, '/').replace(/\(d\)/g, '.');
                    urlStr = '<a href="' + urlStr + '" target="_blank">' + urlStr + '</a>';
                    comment = comment.replace(/(\(p\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)|(\(ps\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)/, urlStr);
                    comment = comment.replace(/　/g, " ");
                }
                */
                commentList[idx].childNodes[1].childNodes[7].innerHTML = comment;
                return commentList[idx].childNodes[1].childNodes[5].innerText.trim() + '_@_' + comment;
            } catch (e) {
                return '_@_';
            }
        };
        getComment = function (commentList, idx) {
            try {
                var comment = (commentList[idx].childNodes[1].childNodes[7].innerHTML.trim());
                /*
                var url = comment.match(/(\(p\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)|(\(ps\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)/);
                if (null != url) {
                    urlStr = url[0].replace(/\(p\)/g, 'http').replace(/\(ps\)/g, 'https').replace(/\(s\)/g, '/').replace(/\(d\)/g, '.');
                    urlStr = '<a href="' + urlStr + '" target="_blank">' + urlStr + '</a>';
                    comment = comment.replace(/(\(p\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)|(\(ps\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)/, urlStr);
                    comment = comment.replace(/　/g, " ");
                }
                */
                commentList[idx].childNodes[1].childNodes[7].innerHTML = comment;
                return comment;
            } catch (e) {
                return "";
            }
        };

        if (YOUTUBE.videoFlag && null != json && 0 != json.length) {
            applyNg(ngInfo);


            var commentList = $('yt-live-chat-text-message-renderer');
            for (var i = 0; i < commentList.length; i++) {
                if (!$(commentList[i]).hasClass("yt-live-chat-text-message-ng-transparent")) {
                    //log(commentList+' '+i);
                    $(commentList[i]).attr('commentNo', YOUTUBE.commentNo);
                    YOUTUBE.commentNo++;
                } else {
                    //YOUTUBE.criteriaIndex++;
                    $(commentList[i]).removeAttr('commentNo');
                    //	log(commentList[i]);
                }

                if (null != options && null != options.commentNoWrap && options.commentNoWrap) {
                    var comment = getComment(commentList, i);
                    var title = convert2Title(comment);
                    $(commentList[i]).attr('title', title);
                }

            }

            if (null == options || null == options.commentStyle || "0" == options.commentStyle) {
                $('yt-live-chat-text-message-renderer:not(.yt-live-chat-text-message-ng-transparent)').each(function (index) {
                    var no = Number($(this).attr('commentNo'));
                    var color = (0 == no % 2) ? (YOUTUBE.styleDark) ? 'background-color-0' : 'background-color-f' : (YOUTUBE.styleDark) ? 'background-color-1' : 'background-color-e';
                    $(this).removeClass('background-color-0');
                    $(this).removeClass('background-color-f');
                    $(this).removeClass('background-color-1');
                    $(this).removeClass('background-color-e');
                    $(this).addClass(color);
                    $(this).find('#content').removeClass('background-color-0');
                    $(this).find('#content').removeClass('background-color-f');
                    $(this).find('#content').removeClass('background-color-1');
                    $(this).find('#content').removeClass('background-color-e');
                    $(this).find('#content').addClass(color);
                    //$(this).find('#content').css({'cssText':'background-color:' + color + '!important'});
                });
            }
        }

        YOUTUBE.initFlag = true;
    },


    overrideFunction: function () {
        getCommentId = function (commentList, idx, ngInfo) {
            try {
                //if(-1 == commentList[idx].childNodes[1].childNodes[1].childNodes[1].innerText.trim().indexOf("<span")){
                //	var name = commentList[idx].childNodes[1].childNodes[1].childNodes[1].innerText.trim();
                var name = $(commentList[idx]).find('span').html().trim();
                if (null != ngInfo || null != ngInfoShare) {
                    applyNgLine(name, commentList[idx], ngInfo);
                }
                //}
                //var comment = (commentList[idx].childNodes[1].childNodes[3].innerHTML.trim());
                var comment = $(commentList[idx]).find('span#message').text().trim();
                /*
                var url = comment.match(/(\(p\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)|(\(ps\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)/);
                if (null != url) {
                    urlStr = url[0].replace(/\(p\)/g, 'http').replace(/\(ps\)/g, 'https').replace(/\(s\)/g, '/').replace(/\(d\)/g, '.');
                    urlStr = '<a href="' + urlStr + '" target="_blank">' + urlStr + '</a>';
                    comment = comment.replace(/(\(p\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)|(\(ps\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)/, urlStr);
                    comment = comment.replace(/　/g, " ");
                }
                */
                //if(commentList[idx].childNodes[1].childNodes[3].innerHTML != comment){
                //	commentList[idx].childNodes[1].childNodes[3].innerHTML = comment;
                //}
                //return commentList[idx].childNodes[1].childNodes[1].childNodes[1].innerText.trim() + '_@_' + 
                //		commentList[idx].childNodes[1].childNodes[3].innerHTML.trim();

                $(commentList[idx]).find('span#message').html(comment);
                return name + '_@_' + comment;
            } catch (e) {
                return '_@_';
            }
        };
        getComment = function (commentList, idx) {
            try {
                //var comment = (commentList[idx].childNodes[1].childNodes[3].innerHTML.trim());
                var comment = $(commentList[idx]).find('span#message').text().trim();
                /*
                var url = comment.match(/(\(p\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)|(\(ps\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)/);
                if (null != url) {
                    urlStr = url[0].replace(/\(p\)/g, 'http').replace(/\(ps\)/g, 'https').replace(/\(s\)/g, '/').replace(/\(d\)/g, '.');
                    urlStr = '<a href="' + urlStr + '" target="_blank">' + urlStr + '</a>';
                    comment = comment.replace(/(\(p\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)|(\(ps\):[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]*)/, urlStr);
                    comment = comment.replace(/　/g, " ");
                }
                */
                //if(commentList[idx].childNodes[1].childNodes[3].innerHTML != comment){
                //	commentList[idx].childNodes[1].childNodes[3].innerHTML = comment;
                //}

                return comment;
            } catch (e) {
                return '';
            }
        };
        getName = function (options) {
            return options.$trigger.find('#author-name').text()
        };
        getCommentOpt = function (options) {
            return options.$trigger.find('#message').html()
        };


        applyNg = function (ngInfo) {
            YOUTUBE.commentNo = 0;

            $('yt-live-chat-text-message-renderer', doc).each(function (index) {
                var isNg = false;
                var isNotTransparentNg = true;
                var name = $(this).find('#author-name').text();
                var ni = (null != ngInfo && null != ngInfo[name]) ? ngInfo[name] : ngInfoShare[name];

                if (null != ni) {
                    isNg = true;
                    if (!ni.transparent) {
                        applyNgNormal($(this), name, ni, false);
                    } else {
                        applyNgTransparent($(this), YOUTUBE.timeShift);
                        isNotTransparentNg = false;
                    }
                    log('12★' + $(this).find('#author-name').text() + '★' + index);
                }

                if (isNotTransparentNg) {
                    var message = $(this).find('#message').html();
                    for (var i in ngInfo["__regex__"]) {
                        var regex = ngInfo["__regex__"][i];
                        if (null != message.trim().match(regex.regexObject)) {
                            log(message);
                            log(regex.regexObject);
                            if (!regex.transparent) {
                                applyNgNormal($(this), name, regex, true);
                            } else {
                                applyNgTransparent($(this), YOUTUBE.timeShift);
                                isNotTransparentNg = false;
                            }
                            break;
                        }
                    }
                }

                if (isNotTransparentNg) {
                    $(this).attr('commentNo', YOUTUBE.commentNo);
                    YOUTUBE.commentNo++;
                } else {
                    $(this).removeAttr('commentNo');
                }
            });
            reloadLastComId($('yt-live-chat-text-message-renderer', doc), false);
        };

        applyNgLine = function (name, line, ngInfo, init) {
            if (null != ngInfo || null != ngInfoShare) {
                var ni = (null != ngInfo && null != ngInfo[name]) ? ngInfo[name] : ngInfoShare[name];

                if (null != ni) {
                    if (name == $(line).find('#author-name').text()) {
                        if (ni.share) {
                            log(name);
                        }

                        if (!ni.transparent) {
                            applyNgNormal($(line), name, ni, false);
                        } else {
                            applyNgTransparent($(line), YOUTUBE.timeShift);
                            reloadLastComId($('yt-live-chat-text-message-renderer', doc), false);
                        }
                        setTimeout(function () {
                            $('#item-scroller', doc).scrollTop(999999);
                        }, 100);
                    }
                }
            }

            if (null != ngInfo) {
                var message = $(line).find('#message').html();
                for (var i in ngInfo["__regex__"]) {
                    var regex = ngInfo["__regex__"][i];
                    if (null != message.trim().trim().match(regex.regexObject)) {
                        if (!regex.transparent) {
                            applyNgNormal($(line), name, regex, true);
                        } else {
                            applyNgTransparent($(line), YOUTUBE.timeShift);
                        }
                        log(message);
                        setTimeout(function () {
                            $('#item-scroller', doc).scrollTop(999999);
                        }, 100);
                        break;
                    }
                }

            }
        };


        applyNgNormal = function (e, name, ni, isRegex) {
            if (!$(e).hasClass('yt-live-chat-text-message-ng') && !$(e).hasClass('yt-live-chat-text-message-ng-regex')) {
                var text = isRegex ? ni.text : ni.reason;
                var clazz = isRegex ? "-regex" : "";
                clazz = null == ni.share ? clazz : "share";

                //		log("applyNgNormal");
                $(e).addClass('yt-live-chat-text-message-ng' + clazz);
                $(e).find('#message').html('<span style="display:none;">' + $(e).find('#message').html() + '</span>' +
                    '<span class="ngLabel" style="color:#3921D3; cursor: pointer;">[NGコメント]</span>' +
                    '&nbsp;&nbsp;<div contenteditable id="ngReason" ' +
                    'style="color:#3921D3;width:100px; display: inline-block;" ' +
                    'placeholder="NG理由を追加">' + text + '</div>'
                );
                $(e).find('.ngLabel').click(function () {
                    $(this).next().focus();
                });

                $(e).find('#message>#ngReason').on('blur', function () {
                    var $that = $(this);
                    chrome.storage.local.get(function (items) {
                        var ngInfo = items.ngInfo;
                        if (null == ngInfo) {
                            ngInfo = {};
                        } else {
                            ngInfo = JSON.parse(ngInfo);
                        }

                        if (isRegex) {
                            ni.text = $that.text();
                            ngInfo["__regex__"][ni.expression] = ni;
                        } else {
                            ni.reason = $that.text();
                            ngInfo[name] = ni;
                        }
                        chrome.storage.local.set({ ngInfo: JSON.stringify(ngInfo) });
                    });
                    $('.yt-live-chat-text-message-ng', doc).each(function (index) {
                        if (name == $(this).find('#author-name').text()) {
                            //log($(this).find('#ngReason'));
                            $(this).find('#ngReason').text($that.text());
                        }
                    });
                    $('.yt-live-chat-text-message-ng-regex', doc).each(function (index) {
                        if (null != $(this).find('#message').html().trim().match(ni.regexObject)) {
                            $(this).find('#ngReason').text($that.text());
                        }
                    });
                });
            }
        };

        applyNgTransparent = function (e, remove) {
            $(e).find('#message').html('<span style="display:none;">' + $(e).find('#message').html() + '</span>' +
                '<span class="ngLabel" style="color:#3921D3; cursor: pointer;">[NGコメント]</span>'
            );
            log("addClass");
            $(e).addClass('yt-live-chat-text-message-ng-transparent');
        };

        unng = function (e, name) {
            $('.yt-live-chat-text-message-ng', doc).each(function (index) {
                if (name == $(this).find('#author-name').text()) {
                    $(this).removeClass('yt-live-chat-text-message-ng');
                    $(this).find('#message').html($(this).find('#message>span:first').html());
                }
            });
            reloadPrevLastComId($('yt-live-chat-text-message-renderer', doc), false);
        };

        adjTopUnderLine = function (comDivHeight, lineHeight, maxLine) {
            return (Math.floor((comDivHeight) / (lineHeight)) - 1 - maxLine) * lineHeight;
        };
    }

}
