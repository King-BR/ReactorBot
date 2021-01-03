const config = require('../../config.json');
const Discord = require('discord.js');
const botUtils = require("../../utils.js");
prefix = config.prefix;

module.exports = async (client, message) => {
	newError = botUtils.newError;

	try {
		let messageArray = message.content.split(/ +/);
		let cmd = messageArray[0].toLowerCase();
		let args = messageArray.slice(1);

		// Ignora mensagens na dm, mas retorna um evento
		if (message.channel.type === 'dm') return require('./Utils/correio.js')(client, message, args);

		// Ignora mensagens de bot
		if (message.author.bot) return;

    // 5% de chance de reagir com emoji caso mencionado
    if(message.mentions.members.get(client.user.id) && Math.random() < 0.05) message.react('755627522330329238');

		// Detecta se foi mencionado
		let mentioned = cmd.includes(client.user) || cmd.includes(client.user.id);

		if (mentioned && !args.length) {
			message.channel.send(
				`Opa tudo bem ? | Meu prefixo atual é: \`${prefix}\`. Use \`${prefix}ajuda\` para mais informações!`
			);
			return;
		} else if (mentioned && args.length > 0) {
			message.reply(Math.random() < 0.5 ? 'Sim' : 'Não');
			return;
		}

		// Utils
		if (message.channel.id == '768238015830556693') {
			// #mini-events
			return require('./Utils/minieventos.js')(client, message);
		} else if (message.channel.id == '756587320140103690') {
			// #mudae-comécio
			return require('./Utils/mudae.js')(client, message);
		} else if (['700147119465431050','737292005465391194'].includes(message.channel.id)) {
			// #sugestão
			return require('./Utils/sugestao.js')(client, message);
		}

		// Anti trava discord
		require('./Utils/antitrava.js')(client, message);
		// Spam detector
		//require('./Utils/spamdetect.js')(client, message);

		// tudo oq n possui prefixo é ignorado
		if (!message.content.startsWith(prefix)) return;

		// gambiarra do king
		let commandfile =
			client.commands.get(cmd.slice(prefix.length)) ||
			client.commands.get(client.aliases.get(cmd.slice(prefix.length)));

		if (commandfile) commandfile.run(client, message, args);
	} catch (err) {
	  let IDs = {
			server: message.guild.id,
			user: message.author.id,
			msg: message.id
		};
		console.log(`=> ${newError(err, 'ClientMessage', IDs)}`);
	}
};
