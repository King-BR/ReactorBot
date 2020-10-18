const Discord = require("discord.js");


module.exports = {
    // Execução do comando
    run: async (client, botUtils, message, args) => {
        newError = botUtils.newError;
        try {

            // Codigo do comando
			if(!message.member.hasPermission("KICK_MEMBERS", "ADMINISTRATOR")) return message.reply("Você não tem permissão para isso");
			if(!args[1]) return message.reply("A duração do mute precisa ser definida");
			
            const user = message.mentions.members.first();
			const channel = message.guild.channels.cache.find(ch => ch.name === 'punição');
            const reason =  args[2] ? args.slice(2).join(" ") : "[Nenhum motivo foi dado]"
            const d = new Date()
            const stotime = {m: 60*1000,h: 60*60*1000,d: 24*60*60*1000,y: 365*24*60*60*1000,s: 100*365*24*60*60*1000};
            const stostr = {m: "Minutos",h: "Horas",d: "Dias",y: "Anos",s: "Séculos"};

            if(!stotime[args[1].slice(-1)] || !parseInt(args[1].slice(0,-1))) return message.reply("Não foi possivel indentificar a duração, use `!ajuda mute` para mais informações");

            let tempo = d.getTime() + stotime[args[1].slice(-1)] * parseInt(args[1].slice(0,-1))

            user.roles.add(message.guild.roles.cache.get("755665930159390721"),reason)
                .then( async () => {
                    let muted = botUtils.jsonPull('./dataBank/mutedlist.json');
                    muted[user.id] = tempo;
                    botUtils.jsonPush('./dataBank/mutedlist.json', muted);

					let embed = new Discord.MessageEmbed()
						.setColor('#888888')
						.setAuthor(message.author.tag,message.author.displayAvatarURL())
						.setTitle('Mutado!')
						.setDescription(`${user} levou mute por ${parseInt(args[1].slice(0,-1))} ${stostr[args[1].slice(-1)]}.\n\nMotivo: ${ reason }`)
						.setThumbnail(user.user.displayAvatarURL({dynamic: true, format: "png", size: 1024}))
                        .setTimestamp();
					await channel.send(embed);
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
            console.log(`=> ${newError(err, "mute", IDs)}`);
        }
    },

    // Configuração do comando
    config: {
        name: "mute",
        noalias: "Sem sinonimos",
        aliases: [],
        description: "De um warn para um membro do server",
        usage: "mute <@member> <tempo><m/h/d/y/s> [motivo]",
        accessableby: "STAFF"
    }
}