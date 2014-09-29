#!/usr/bin/env node
/**
 * Runs multiple node files in separate containers which restart automatically
 *
 * Usage: npm bin 
 */

var cluster = require('cluster');
var args = require('minimist')(process.argv.slice(2));
var config = {};

console.log(process.cwd());

try {
	config = require(makePath(args.config || '../config.json'));
}
catch (ex) {
	console.error('Error: no config file loaded.');
	process.exit(1);
}


// Initialize cluster
cluster.setupMaster({
	exec: (config.container || '../lib/container.js')
});

// Pack each file
config.files.forEach(compose(fork, watch));


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function compose(a, b) {
	var first = Array.prototype.slice.call(arguments, 2);
	return function() {
		var rest = Array.prototype.slice.call(arguments);
		return b(a.apply(this, first.concat(rest)));
	}
}

function fork(file) {
	return {
		file: file,
		worker: cluster.fork({
			setup: makePath(config.setup),
			teardown: makePath(config.teardown),
			file: makePath(file)
		})
	};
}

function watch(pack) {
	var worker = pack.worker;
	var file = pack.file;

	worker.on('exit', compose(fork, watch, file));
	worker.on('online', function () {
		console.log(file, 'online.');
	});
}

function makePath(path) {
	return (!path || path.match('/')) ? path : ('./' + path);
}
