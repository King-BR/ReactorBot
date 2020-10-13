const Discord = require("discord.js");

module.exports = {
    // Execução do comando
    run: async (client, botUtils, message, args) => {
        newError = botUtils.newError;
        try {
            // Codigo do comando
            if(!message.member.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR")) return message.reply("Você não tem permissão para isso");
            const user = message.mentions.users.first();
		    const channel = message.guild.channels.cache.find(ch => ch.name === 'punição');
		    let embed = new Discord.MessageEmbed()
			    .setColor('#FFFF00')
			    .setAuthor(message.author.tag,message.author.displayAvatarURL())
			    .setTitle('Aviso!')
			    .setDescription(`${user} levou warn.\n\nMotivo: ${ args[1] ? args.slice(1).join(" ") : "[Nenhum motivo foi dado]" }`)
			    .setThumbnail(user.displayAvatarURL({dynamic: true, format: "png", size: 1024}))
                .setTimestamp();
            await channel.send(embed);

        } catch(err) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Erro inesperado")
                .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
            message.channel.send(embed)
            console.log(`=> ${newError(err, "warn", message.guild.id)}`);
        }
    },

    // Configuração do comando
    config: {
        name: "warn",
        noalias: "Sem sinonimos",
        aliases: [],
        description: "De um warn para um membro do server",
        usage: "warn <@member> [motivo]",
        accessableby: "STAFF"
    }
}