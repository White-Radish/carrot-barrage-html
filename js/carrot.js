$(function() {
	var $window = $(window);
	var $username = $('#username'); // 全局记录昵称
	var $messages = $('.messages');
	var inputMessage = $('.inputMessage');
	var username;
	var connected = false; // 连接状态
	var roomid;
	var falg = true;

	$('#send').click(function() {

		sendMessage();
	});

	$('#test').click(function() {
		console.log("关闭弹幕");
		closedBullet();
	});
	$window.keydown(function(event) {
		// 回车后依旧获取焦点
		if (!(event.ctrlKey || event.metaKey || event.altKey)) {
			// $currentInput.focus();
		}
		// 监听回车键
		if (event.which === 13) {
			if (!username) {
				setUsername();
			}
		}
	});


	function closedBullet() {
		falg = !falg;
		if (falg) {
			$(".danmu").removeClass("closedBullet");
			$("#test").text("关闭弹幕");
		} else {
			$(".danmu").addClass("closedBullet");
			$("#test").text("开启弹幕");
		}

	}


	if (window.WebSocket) {

		function setUsername() {
			username = cleanInput($('#username').val().trim());
			// roomid = ('#selectroom').val();
			console.log(roomid);
			if (username) {
				$('.page').fadeOut();
				$('#msg').show();
				var msg = {};
				msg.msgType = 2;
				msg.userName = username;
				msg.roomId = roomid;
				ws.send(JSON.stringify(msg));
			}
		}



		var ws = new WebSocket("ws://localhost:9999/carrot?uid=666&gid=777");



		ws.onopen = function(e) {
		
			console.log('Connection to server opened');
			// var roominfo = JSON.parse(e.data);
			// $('#roomId').val("12345");
			connected = true;
	
		}

		// 处理服务器发送过来的消息
		ws.onmessage = function(e) {
			var msg = JSON.parse(e.data);

			switch (msg.msgType) {
				case 0:
					// 建立连接的响应
					break;
				case 1002:
					// 收到进入房间的响应 包含房间信息
					addDanmu("欢迎 " + msg.userName + " 进入聊天室");
					break;
				case 2002:
					// 收到其他人进入房间的消息
					addDanmu(msg.userName + " 进入了聊天室");
					break;
				case 1003:
					// 收到其他人发过来的消息
					addDanmu(msg.msgBody);
					break;

				case 1001:
					// 收到其他人离开房间的信息
					addDanmu("用户 " + msg.userName + " 离开了聊天室")
					break;

			}
		}




		ws.onclose = function(e) {
			$('.page').show();
			$('#msg').fadeOut();
			console.log('Connection to server close');
			connected = false;
		}

		ws.onerror = function(e) {
			console.log('Connection to server error');
			connected = false;
		}

		// 发送消息
		function sendMessage() {
			if (connected) {
				var msg = {};
				msg.msgType = 3;
				msg.userName = username;
				msg.roomId = roomid;
				msg.msgBody = cleanInput($('.inputMessage').val());
				ws.send(JSON.stringify(msg));
				$('.inputMessage').val("");
			} else {
				console.log("与服务器断开连接了，刷新重新连接~");
			}

		}



		function addDanmu(str, flag) {

			if (!falg) {
				console.log("关闭弹幕了");
				return;
			}
			$(".container").append("<div class=\"danmu\"><img src='img/1.ico' >" + str + "</div>");
			var _dm = $(".container").children(".danmu").last();
			var _width = _dm.width();
			var container_height = $(".container").height();
			var randtop = Math.floor(Math.random() * 5.3 * 100);
			var randsize = Math.floor(Math.random() * 5.3 * 10);
			var _top = randtop > container_height ? "0" : randtop;
			var _fontsize = randsize > 50 ? 50 : randsize
			_dm.css({
				"right": -(_width),
				"font-size": _fontsize + "px",
				"top": _top,
				"color": "#" + (~~(Math.random() * (1 << 24))).toString(16) //随机颜色
			});
			_dm.animate({
				left: -(_width)
			}, 16000, "linear", function() {
				$(this).remove();
			}); //弹幕滑行时间可自行调整or随机

		}


	} else {
		alert("不支持websocket");
	}


	// 清除输入框中注入的信息
	function cleanInput(input) {
		return $('<div/>').text(input).html();
	}


	$('.select').on('click', '.placeholder', function(e) {
	    var parent = $(this).closest('.select');
	    if (!parent.hasClass('is-open')) {
	        parent.addClass('is-open');
	        $('.select.is-open').not(parent).removeClass('is-open');
	    } else {
	        parent.removeClass('is-open');
	    }
	    e.stopPropagation();
	}).on('click', 'ul>li', function() {
	    var parent = $(this).closest('.select');
	    parent.removeClass('is-open').find('.placeholder').text($(this).text());
		roomid=($(this).val());
		
	});


});
