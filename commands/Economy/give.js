const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	run: async (client, botUtils, message, args) => {
		newError = botUtils.newError;

		try {
      message.channel.send("não implementado");
		} catch (err) {
			let embed = new Discord.MessageEmbed()
				.setTitle('Erro inesperado')
				.setDescription(
					'Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro'
				);
			message.channel.send(embed);

			let IDs = {
				server: message.guild.id,
				user: message.author.id,
				msg: message.id
			};
			console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
		}
	},

	config: {
		name: 'give',
		noalias: 'sem sinonimos',
		aliases: [],
		description: 'Da seu dinheiro para outro jogador',
		usage: 'give <Membro> <Quantia>',
		accessableby: 'Membros'
	}
};
