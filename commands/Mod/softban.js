const Discord = require("discord.js");

module.exports = {
    // Execução do comando
    run: async (client, botUtils, message, args) => {
        newError = botUtils.newError;
        try {
            // Codigo do comando
			if(!message.member.hasPermission("BAN_MEMBERS", "ADMINISTRATOR")) return message.reply("Você não tem permissão para isso");
			
            const user = message.mentions.members.first();
			const channel = message.guild.channels.cache.find(ch => ch.name === 'punição');
			const reason =  args[1] ? args.slice(1).join(" ") : "[Nenhum motivo foi dado]"

			let rankUser = user.roles.highest.position;
			let rankAuthor = message.member.roles.highest.position;
			let rankBot = message.guild.member(client.user).roles.highest.position;

			if(rankUser >= rankAuthor) return message.reply(`Você é incapaz de expulsar o ${user.user.username}`);
			if(rankUser >= rankBot)    return message.reply(`Eu sou incapaz de expulsar o ${user.user.username}`);	

			user.ban({ days: 7, reason: reason})
				.then( async () => {
					let embed = new Discord.MessageEmbed()
						.setColor('#5100FF')
						.setAuthor(message.author.tag,message.author.displayAvatarURL())
						.setTitle('Softban!')
						.setDescription(`${user} levou softban.\n\nMotivo: ${ reason }`)
						.setThumbnail(user.user.displayAvatarURL({dynamic: true, format: "png", size: 1024}))
                        .setTimestamp();
					await channel.send(embed);
                })
                then( () => {
                    client.guildBanRemove(message.guild,user.user)
                });
				

        } catch(err) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Erro inesperado")
                .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
            message.channel.send(embed);
            
            let IDs = {
                server: message.guild.id,
                user: [message.author.id, user.id],
                msg: message.id
            }
            console.log(`=> ${newError(err, "softban", IDs)}`);
        }
    },

    // Configuração do comando
    config: {
        name: "softban",
        noalias: "Sem sinonimos",
        aliases: [],
        description: "da um kick em um membro do server, apagando suas mensagens nos ultimos 7 dias",
        usage: "softban <@member> [motivo]",
        accessableby: "STAFF"
    }
}