const Discord = require('discord.js');

module.exports = {
	// Execução do comando
	run: (client, botUtils, message, args) => {
		if (!botUtils.isDev(message.author.id)) return message.channel.send('Voce não tem permissão para executar esse comando');

		newError = botUtils.newError;

		try {
			let id = message.author.id;
			botUtils.jsonChange(`./dataBank/${args[0]}.json`, json => {
				let conteudo = JSON.stringify(json);
				message.channel.send('```' + conteudo + '```')
			});
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

	// Configuração do comando
	config: {
		name: 'pietro',
		noalias: 'Sem sinonimos',
		aliases: ['pp'],
		description:
			'Comando secreto do pietrinhos, geralmente usado para testes de futuros comandos ou de coisas que eu tô tentando aprender',
		usage: 'pietro',
		accessableby: 'Desenvolvedores'
	}
};
