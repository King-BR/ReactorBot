const Discord = require("discord.js");


module.exports = {
    // Execução do comando
    run: async (client, botUtils, message, args) => {
        newError = botUtils.newError;
        try {

            // Codigo do comando
			if(!message.member.hasPermission("KICK_MEMBERS", "ADMINISTRATOR")) return message.reply("Você não tem permissão para isso");
			
            const user = message.mentions.members.first();
			const channel = message.guild.channels.cache.find(ch => ch.name === 'punição');
            const reason =  args[2] ? args.slice(2).join(" ") : "[Nenhum motivo foi dado]"
            
			user.roles.add(message.guild.roles.cache.get("755665930159390721"),reason)
				.then( async () => {
					let embed = new Discord.MessageEmbed()
						.setColor('#888888')
						.setAuthor(message.author.tag,message.author.displayAvatarURL())
						.setTitle('Mutado!')
						.setDescription(`${user} levou mute.\n\nMotivo: ${ reason }`)
						.setThumbnail(user.user.displayAvatarURL({dynamic: true, format: "png", size: 1024}))
                        .setTimestamp();
					await channel.send(embed);
                })

        } catch(err) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Erro inesperado")
                .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
            message.channel.send(embed)
            console.log(`=> ${newError(err, "mute", message.guild.id)}`);
        }
    },

    // Configuração do comando
    config: {
        name: "mute",
        noalias: "Sem sinonimos",
        aliases: [],
        description: "De um warn para um membro do server",
        usage: "mute <@member> <tempo><m/h/d/y> [motivo]",
        accessableby: "STAFF"
    }
}