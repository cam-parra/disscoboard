window.onload = function() {
  // this will hold our messages //
	var messages = [];
  // make the connection //
	var socket = io();
  // for convinience
	var field = document.getElementById("field");
	var sendButton = document.getElementById("send");
	var content = document.getElementById("content");
	var name = document.getElementById("name");
  // use socket stuff
	socket.on('message', function (data) {
		if(data.message) {
			messages.push(data);
			var html = '';
			for(var i=0; i<messages.length; i++) {
				name = messages[i].username ;
				html += '<div class="panel panel-default"><div class="panel-body"><div class="panel-body"><b>' + (messages[i].username ? messages[i].username : 'Class Name')
				 + ': </b></div><div class="panel-footer">';
				html += messages[i].message + '</div></div></div>';
			}
			content.innerHTML = html;
		} else {
			console.log("There is a problem:", data);
		}
	});

	sendButton.onclick = sendMessage = function() {
		var text = field.value;
		socket.emit('send', { message: text, username: name.value });
		field.value = "";

	};
}

$(document).ready(function() {
	$("#field").keyup(function(e) {
		if(e.keyCode == 13) {
			sendMessage();
		}
	});
});
