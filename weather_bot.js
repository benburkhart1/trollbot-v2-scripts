var cfg  = require('./bootstrap-cli.js').config;

var irc = require('./lib/irc.js');
var tbc  = require('trollbot-v2-client');
var tclient = new tbc(cfg.listener_host, cfg.listener_port, cfg.shared_secret);

var apikey    = require('./config/weather.js').key;
var wunderbar = require('wunderbar');
var weather   = new wunderbar(apikey);

tclient.getTSock(function(err, client) {
	client.on('irc-line', function(data) {
		var dat = irc.parseLine(data);

		if (dat.command == 'PRIVMSG')
		{
			if (dat.rest_words[0].toLowerCase() == '.w')
			{
				weather.conditions(dat.rest_words[1], function(err, res) {
						if (typeof res.response.error != 'undefined')
						{
							client.emit('client-write', "PRIVMSG " + dat.command_parameters[0] + " :\002ERROR:\002 " + res.response.error.description + "\n");
							return;
						}

						if (!err)
						{
							var loc = res.current_observation.display_location.full;
						
							var latitude  = res.current_observation.display_location.latitude;
							var longitude = res.current_observation.display_location.longitude;
							
							var temp = res.current_observation.temperature_string;
			
							var conditions = res.current_observation.weather;
							var uv         = res.current_observation.UV;
							
							var wind       = res.current_observation.wind_string;
							var humidity   = res.current_observation.relative_humidity;
							var updated    = res.current_observation.observation_time;

							client.emit('client-write', "PRIVMSG " + dat.command_parameters[0] + " :\002" + loc + "\002 (" + latitude + "/" + longitude + ") | \002Temperature:\002 " + temp + " | \002Conditions:\002 " + conditions + " | \002UV:\002 " + uv + "/16 | \002Humidity:\002 " + humidity + " | \002Wind:\002 " + wind + " | \002Updated:\002 " + updated + "\n");
						}
						else
						{
							client.emit('client-write', "PRIVMSG " + dat.command_parameters[0] + " :\002ERROR:\002 " + err + "\n");
						}
				});
			}
		}
	});
});
