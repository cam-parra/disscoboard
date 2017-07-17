var express = require( 'express' );
var app = express(  );
var server = require('http').Server(app);
var io = require( 'socket.io' )(server);

var path = require( 'path' );
var bodyParser = require('body-parser');
var pg = require( 'pg' );
var passwordHash = require('password-hash');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var query = require('pg-query');
pg.defaults.ssl = true;
var port = process.env.PORT || 3000;
var dbstring = 'postgres://zwncfqnkcoxipy:64b135f38fc3fa705fcd64f3bbf55589fd1a53eece372d50247cb6add3dd9b70@ec2-23-21-220-152.compute-1.amazonaws.com:5432/d8tbpmstlnqkkq'; //"postgres://postgres:mystuff@localhost:5432/student";
var client = new pg.Client( dbstring );
client.connect(  );

app.set('views', __dirname + '/views/pages');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieSession({
  name: 'session',
  keys: ['0']
}));



app.get( '/', function (req, res) {

  res.render('login');

} );




app.post('/login', function(req, res) {

  var usera = req.body.username;
  var pass = req.body.password;
  var hashedPassword = [];
  //console.log();
  var queryPass= client.query('SELECT password FROM public.studentinfo WHERE username = $1', [ usera ]);
  queryPass.on("row", function (row, result) {
      result.addRow(row);
  });
  queryPass.on("end", function (result) {
    var passtring= JSON.stringify(result.rows[0], null, "    ");
    var parsedstring = JSON.parse(passtring);
    //console.log(parsedstring);

    //client.end();
    console.log(passwordHash.verify(pass, parsedstring.password));
    if (passwordHash.verify(pass, parsedstring.password)) {

      res.render('main');

    }
    //hashedPassword.push(parsedstring.password);
  });


  req.session.username =  usera;
  req.session.pass =  pass;
  //console.log(passwordHash.verify(pass, hashedPassword));

  //console.log(usera);

  io.on('connection', function(socket) {

    socket.on('message', function (message) {
      //client.connect(  );
      var queryid= client.query('SELECT id FROM public.studentinfo WHERE username = $1', [ usera ]);
      //console.log(queryid);
      queryid.on("row", function (row, result) {
          result.addRow(row);
      });
      queryid.on("end", function (result) {
        //console.log(result.rows);
        var passtring= JSON.stringify(result.rows[0], null, "    ");
        var parsedstring = JSON.parse(passtring);
        //console.log(parsedstring);
        var insequery = client.query("INSERT INTO public.messages(userID, message) values($1, $2)", [parsedstring.id, message]);
        insequery .on("row", function (row, result) {
            result.addRow(row);
        });
        insequery.on("end", function (result) {
          //console.log(result.rows);
          var passtring= JSON.stringify(result.rows, null, "    ");
          var parsedstring = JSON.parse(passtring);
        });
      });
      console.log('message:' + message);
      socket.broadcast.emit("message", {'message': message, 'username': usera});
    });
    var oldquerymessid= client.query('SELECT message FROM public.messages');
    console.log(oldquerymessid);
    oldquerymessid.on("row", function (row, result) {
        result.addRow(row);
    });
    oldquerymessid.on("end", function (result) {
      console.log(result.rows);
      var passtring= JSON.stringify(result.rows, null, "    ");
      var parsedstring = JSON.parse(passtring);
      console.log(parsedstring);
      socket.emit("chatHistory", parsedstring);
    });


  });
});

server.listen(port , function () {
console.log('connected to port: ' + port);});