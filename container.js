/**
 * Child container wrapping a node file, with optional setup and teardown
 */

try {
	if (process.env.setup) {
		require(process.env.setup);	
	}
	require(process.env.file);	
}
catch (ex) {
	console.log('Process terminated:', process.env.file, 'with exception', ex);
}
finally {
	if (process.env.teardown) {
		require(process.env.teardown);	
	}
}
