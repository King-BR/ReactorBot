module.exports = {
  // Execução do comando
  run: async (client, message, args) => {
		const m = await message.channel.send('Ping?');
		m.edit(
			`Pong! A latência é ${m.createdTimestamp - message.createdTimestamp}ms.`
		);
	},
	config: {
		name: 'ping',
		noalias: 'Sem sinonimos',
		aliases: [],
		description: 'ping do bot',
		usage: 'ping',
		accessableby: 'Membros'
	}
};
