/**
 * The purpose of this file is to get rid of boilerplate
 */


// All CLI apps use node app.js <network>
var argv = require('minimist')(process.argv.slice(2));

if (process.argv[1] == 'bootstrap-cli.js')
{
	console.log("1d-10-t error");
	console.log("You don't run this file directly.");
	process.exit(1);
}

if (argv._.length != 1)
{
	console.log("Syntax Error");
	console.log("Proper Syntax: " + process.argv[0] + " " + process.argv[1] + " <network>");
	process.exit(1);
}


module.exports = {
	network: argv._[0],
	config: require('./config/' + argv._[0] + '.js')
}
