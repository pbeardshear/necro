var http = require('http');


http.createServer(function (req, res) {
	res.end('got response.');
}).listen(3000);