/**
 * This is the IRC layer. This parses out raw lines
 * into associated data structures.
 * 
 */
module.exports = {
	self: this,

	isCtcp: function(rest) {
		// This checks if this is a strict CTCP (\001 at beginning and end)
		if (rest.charAt(0) == "\001" && rest.charAt(rest.length-1) == "\001")
			return true;

		return false;
	},
	/**
	 * This just parses out a CTCP removing the wrapping
	 * \001s and separating out the first word.
	 */
	parseCtcp: function(rest) {
		var ret = {
			ctcp: rest.split(' ')[0].substring(1)
		};

		if (rest.split(' ').length == 1)
		{
			// cut off trailing \001
			ret.ctcp = ret.ctcp.substring(0, ret.ctcp.length-1);
			ret.rest = null;
		}
		else
		{
			var rest_str = rest.split(' ').slice(1).join(' ');
		
			ret.rest = rest_str.substring(0,rest_str.length-1);
		}

		return ret;
	},
	parseLine: function(line) {
		var ret = { };

		var words = line.split(" ");

		// Prefix parsing
		if (line.charAt(0) == ':')
		{
			var prefix = { };

			// If there's no '!' in it, it's a server name, not a uhost
			if (words[0].indexOf("!") == -1)
			{
				prefix.server = words[0].substring(1);
			}
			else
			{
				// It's a uhost in nick!user@host format
				prefix.nickname = words[0].substring(1).split("!")[0];
				prefix.username = words[0].split("!")[1].split("@")[0];
				prefix.hostname = words[0].split("@")[1];
			}

			ret.prefix = prefix;
		}

		// Command, the command is the first word after the prefix
		// it has optional parameters
		ret.command = words[1];

		ret.command_parameters = [];

		var index;
		for (index = 2; index < words.length; index++)
		{
			if (words[index].charAt(0) != ':')
			{
				// This word is a command parameter
				ret.command_parameters.push(words[index]);
			}
			else
				break; // we use index later
		}

		// Ok I'm just going to do something ugly but it feels ok
		// I count the length of all words up until this point, and add
		// 1 to pass the ':' and the rest is what's important
		var cnt = 0;
		for (var i = 0; i < index; i++)
		{
			cnt += words[i].length + 1;
		}
	
		ret.rest = line.substring(cnt+1);
		ret.rest_words = ret.rest.split(" ");

		return ret;
	}
}
