var http = require('http');
var cluster = require('cluster');


http.createServer(function (req, res) {
	res.end('beep boop.');
	
	setTimeout(function () {
		cluster.worker.kill();
	}, 2000);
}).listen(4000);