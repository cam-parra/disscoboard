/*
 * Modules
 *  Express: Basic stuff
 *  pg: psql request
 *  socketio: for live updates
 *  path: used to ease finding path
 *
 */
var express = require( 'express' );
var pg = require( 'pg' );



var path = require( 'path' );
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var app = express(  );
var server = require('http').createServer(app);
var io = require( 'socket.io' )(server);

// DATABASE
var dbstring = "postgres://postgres:mystuff@localhost:5432/student";
const PORT = process.env.PORT || 3000;
var client = new pg.Client( dbstring );
client.connect(  );
//

// Set up
app.set('views', __dirname + '/views/pages');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
app.set('trust proxy', 1);
app.use(cookieSession({
  name: 'session',
  keys: ['0']
}));
//

// GET and POST request
app.get( '/', function (req, res) {

  res.render('login');

} );

var usera = ''
app.post('/login', function(req, res) {
  usera = req.body.username;
  var pass = req.body.password;
  req.session.username =  usera;
  req.session.pass =  pass;
  if (req.session.username && req.session.username ) {

    res.render('main');

  }
  console.log(usera);

});
server.listen(3000);

// const io = socketIO(server);
var mw = 'Welcome BYU-I students the following are posts from students and these will update as more are entered. Enjoy!';

io.on('connection', function (socket) {
    //socket.emit('message', { message:'', username: usera });
    socket.on('send', function (data) {
        io.emit('message', data);
    });
});
console.log(usera);
setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
