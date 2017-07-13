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
				html += '<div class="card card-outline-primary mb-3 text-center"><div class="card-block"><blockquote class="card-blockquote"><b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
				html += messages[i].message + '</blockquote></div></div><br />';
			}
			content.innerHTML = html;
		} else {
			console.log("There is a problem:", data);
		}
	});

	sendButton.onclick = sendMessage = function() {
		if(name.value == "") {
			alert("Please type your name!");
		} else {
			var text = field.value;
			socket.emit('send', { message: text, username: name.value });
			field.value = "";
		}
	};

}
$(document).ready(function() {
	$("#field").keyup(function(e) {
		if(e.keyCode == 13) {
			sendMessage();
		}
	});
});
