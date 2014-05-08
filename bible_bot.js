var cfg  = require('./bootstrap-cli.js').config;

var irc = require('./lib/irc.js');
var tbc  = require('trollbot-v2-client');
var tclient = new tbc(cfg.listener_host, cfg.listener_port, cfg.shared_secret);

var bible     = require('net-bible-api');

tclient.getTSock(function(err, client) {
	client.on('irc-line', function(data) {
		var dat = irc.parseLine(data);

		if (dat.command == 'PRIVMSG')
		{
			if (dat.rest_words[0].toLowerCase() == '@bible')
			{
				var str = dat.rest.substring(dat.rest_words[0].length+1);

				bible.get(str)
					.then(function(data) {
						client.emit('client-write', "PRIVMSG " + dat.command_parameters[0] + " :[\002" + data[0].bookname + "\002 " + data[0].chapter + ":" + data[0].verse + "] " + data[0].text + "\n");
					});
			}
		}
	});
});
