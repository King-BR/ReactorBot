const Discord = require("discord.js");

module.exports = {
    // Execução do comando
    run: async (client, botUtils, message, args) => {
        newError = botUtils.newError;
        try {
            // Codigo do comando
			if(!message.member.hasPermission("KICK_MEMBERS", "ADMINISTRATOR")) return message.channel.send("Você não tem permissão para isso");
			
			console.log("constantes");

            const user = message.mentions.users.first();
			const channel = message.guild.channels.cache.find(ch => ch.name === 'punição');
			const reason =  args[1] ? args.slice(1).join(" ") : "[Nenhum motivo foi dado]"
			
			console.log("testando rank");

			let rankUser = user.highestRole.calculatedPosition;
			let rankAuthor = message.member.highestRole.calculatedPosition;
			let rankBot = client.user.highestRole.calculatedPosition;

			console.log(`rank do User: ${rankUser}`);
			console.log(`rank do Author: ${rankAuthor}`);
			console.log(`rank do Bot: ${rankBot}`);

			if(rankUser >= rankAuthor) return message.channel.send(`Você é incapaz de expulsar o ${user.username}`);
			if(rankUser >= rankBot)    return message.channel.send(`O bot é incapaz de expulsar o ${user.username}`);	


			user.kick(reason)
				.then(() => {
					let embed = new Discord.MessageEmbed()
						.setColor('#FFFF00')
						.setAuthor(message.author.tag,message.author.displayAvatarURL())
						.setTitle('Kick!')
						.setDescription(`${user} levou kick.\n\nMotivo: ${ reason }`)
						.setThumbnail(user.displayAvatarURL({dynamic: true, format: "png", size: 1024}));
					channel.send(embed);
				})
				

        } catch(err) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Erro inesperado")
                .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
            message.channel.send(embed)
            console.log(`=> ${newError(err, "kick", message.guild.id)}`);
        }
    },

    // Configuração do comando
    config: {
        name: "kick",
        noalias: "Sem sinonimos",
        aliases: [],
        description: "De um kick para um membro do server",
        usage: "kick <@member> [motivo]",
        accessableby: "STAFF"
    }
}