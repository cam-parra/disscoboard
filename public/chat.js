$(document).ready(function() {

  var socket = io(),
  chatForm = $('.chat-form'),
  messageField = chatForm.find("#message-field"),
  messageList = $('.message-list'),
  sendButton = $('#send');
  var part1 = '<div class="panel panel-default"><div class="panel-body"><b>Student:',
      part2= '</b></div><div class="panel-footer">' ,
      part3 = '</div></div></div>';

  sendButton.on("click" , function(e){

    e.preventDefault();
    var message = messageField.val();
    if ( message != ""){
      messageList.append(part1 + "me" + part2 + message + part3);
      socket.emit("message", message);
    }
    else {

      alert("please enter a complete post");
    }
  });

  socket.on("message", function (message) {
    console.log(message);
    messageList.append(part1+ message.username +part2 + message.message + part3);
  });
  socket.on("chatHistory", function (data) {
    messageList.find("div").remove();
    $.each( data, function(){
      messageList.append(part1+ part2 +this.message + part3);
    });
  });



});
