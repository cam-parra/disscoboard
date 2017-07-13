const express = require('express');
var app = express();
const socketIO = require('socket.io');
const path = require('path');
//var port = 3700;
const PORT = process.env.PORT || 3000;
app.set('views', __dirname + '/views/pages');
///const INDEX = path.join(__dirname, 'main');

//var port = 3700;



app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
const server = app
  .use((req, res) => res.render("main") )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
        io.emit('message', data);
    });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
