var http = require('http'),
    https = require('https'),
    express = require('express'),
    fs = require('fs');

var session = require('express-session');

var cookie = require('cookie');
var cookieParser = require('cookie-parser');

var options = {
    key: fs.readFileSync('./keys/private.pem'),
    cert: fs.readFileSync('./keys/public.pem')
};


var port1 = 80;
var port2 = 8443;

var app = express();
app.use(express.urlencoded());
app.use(session({
    secret: '!!##@@asdf@@##!!',
    resave: false,
    saveUninitialized: true
}));

//http.createServer(app).listen(port1, function () {
//    console.log("Http server listening on port " + port1);
//});

var httpsServer = https.createServer(options, app);

httpsServer.listen(port2, function () {
    console.log("Https server listening on port " + port2);
});

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    server: httpsServer
});

wss.on('connection', function connection(ws) {

    var sessions = ws.upgradeReq.session;
    var headers = ws.upgradeReq.headers;
    var id = ws.upgradeReq.headers['sec-websocket-key'];
    //var cookies = cookie.parse(ws.upgradeReq.headers.cookie);
    //var sid = cookieParser.signedCookie(cookies["connect.sid"], secret);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        ws.send('reply from server : ' + message)
    });

    ws.send('something');
});

app.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h3>Welcome</h3>');
    res.write('<a href="/login">Please login</a>');
    res.end();
});

app.get('/login', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h3>Login</h3>');
    res.write('<form method="POST" action="/login">');
    res.write('<label name="userId">UserId : </label>')
    res.write('<input type="text" name="userId"><br/>');
    res.write('<label name="password">Password : </label>')
    res.write('<input type="password" name="password"><br/>');
    res.write('<input type="submit" name="login" value="Login">');
    res.write('</form>');
    res.end();
})

app.post('/login', function (req, res) {
    var userId = req.param("userId");
    var password = req.param("password")

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Thank you, ' + userId + ', you are now logged in.');
    res.write('<p><a href="/"> back home</a>');
    res.end();
});