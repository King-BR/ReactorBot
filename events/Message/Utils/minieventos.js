const { Users } = require('../../../database.js');
const botUtils = require("../../../utils.js");
const Discord = require("discord.js");

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 */
module.exports = (client, message) => {
	newError = botUtils.newError;

	try {
		// detecta os mini eventos
		if (message.author.bot) return;

		const obj = botUtils.jsonPull('./dataBank/serverState.json');
		if (obj.eventWin === null || [6].includes(obj.eventType)) {
			message.delete();
			return;
		}

		let correct;

		if (Array.isArray(obj.eventWin)) {
			const values = message.content.match(/\-?\d+/g);

			if (values && values.length == obj.eventWin.length) {
				values.sort();
				correct = !values.some((element, index) => {
					return element != obj.eventWin[index];
				});
			}
		} else {
			correct = message.content.toLowerCase() == obj.eventWin;
		}

		if (correct) {

			botUtils.closeMiniquiz(client,message.author.id,obj.eventType,message);

		} else {

			const emojis = [
				'<:burro:825090955954225152>',
				['😡', '❌'],
				'❌'
			];
			const weigths = [
				1,
				1,
				28
			];

			let number = Math.floor(Math.random() * weigths.reduce((a, b) => a + b));
			emojis.some((emoji, i) => {
				number -= weigths[i];
				if (number < 0) {
					if (Array.isArray(emoji))
						return emoji.reduce((_, str) => _.then(message.react(str)), Promise.resolve());
					else
						return message.react(emoji);
				}
			})
		}

	} catch (err) {
		let IDs = {
			server: message.guild.id,
			user: message.author.id,
			msg: message.id
		};
		console.log(`=> ${newError(err, 'ClientMessage_Minieventos', IDs)}`);
	}
};
