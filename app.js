const app 		= require('express')();
const server  	= require('http').Server(app);
const io 		= require('socket.io')(server);

// set the template engine ejs
// app.set('view engine','ejs')

// vars
var _app_token = '1c2VyX2lkIjoxLCJpYXQiOjE1MzQxNDg4OD';
var bodyParser = require('body-parser');

// fungsi nge cek token nya
var cekTokenHeader = function (req, res, next) {
    var _token = req.headers['x-token'];
    if (!_token) {
      console.log('token tidak ada');
      return res.status(401).send({ status: 401, message: 'kesalahan token tidak ada', type: 'internal' });
    }
    if (_token != _app_token) {
        console.log('kesalahan token tidak sesuai');
        return res.status(401).send({status: 401, message: 'kesalahan token tidak sesuai', type: 'internal'});
    } 
    return next()
}

// body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// listen on port 3000
// server = app.listen(3000)

// routes
app.get('/', (req, res) => {
	res.send('Berhasil Terkoneksi')
})

app.post('/tes-socket', cekTokenHeader, (req, res, next) => {
	var _channel = req.body['kasir'];
	var _data    = req.body;

	io.sockets.emit(_channel, _data)
	res.status(200).send({sukse: true, tujuan: _channel, data: _data})
})

io.on('connection', (socket) => {
	console.log('New user connected')

	// default username
	socket.username = "Anonymous"

	// listen on change username
	socket.on('change_username', (data) => {
		socket.username = data.username
	})

	// listen on new_message
	socket.on('new_message', (data) => {
		// broadcast new message
		io.sockets.emit('new_message', {message: data.message, username: socket.username})
	})

	// listen on typing
	socket.on('typing', (data) => {
		socket.broadcast.emit('typing', {username: socket.username})
	})

})