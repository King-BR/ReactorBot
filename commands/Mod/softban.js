const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: async (client, botUtils, message, args) => {
    if (!message.member.roles.cache.has('755604380295757824')) return message.reply("Você não é um membro STAFF.");
    
    newError = botUtils.newError;
    try {
      // Codigo do comando
      if (!message.member.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.reply("Você não tem permissão para executar este comando.");

      const user = message.mentions.members.first();
			const channel = message.guild.channels.cache.get('764634049163427840');
      const reason = args[1] ? args.slice(1).join(" ") : "[Nenhum motivo foi dado]"

      let rankUser = user.roles.highest.position;
      let rankAuthor = message.member.roles.highest.position;
      let rankBot = message.guild.member(client.user).roles.highest.position;

      if (rankUser >= rankAuthor) return message.reply(`Você é incapaz de expulsar o ${user.user.username}`);
      if (rankUser >= rankBot) return message.reply(`Eu sou incapaz de expulsar o ${user.user.username}`);

      user.ban({ days: 7, reason: reason })
        .then(async () => {
          let embed = new Discord.MessageEmbed()
            .setColor('#5100FF')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle('Softban!')
            .setDescription(`${user} levou softban.\n\nMotivo: ${reason}`)
            .setThumbnail(user.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
            .setTimestamp();
          await channel.send(embed);
        })
      then(() => {
        client.guildBanRemove(message.guild, user.user)
      });


    } catch (err) {
      let embed = new Discord.MessageEmbed()
        .setTitle("Erro inesperado")
        .setDescription("Um erro inesperado aconteceu. por favor contate os Desenvolvedores do ReactorBot.\n\nUm log foi criado com mais informações do erro.");
      message.channel.send(embed);

      let IDs = {
        server: message.guild.id,
        user: [message.author.id, user.id],
        msg: message.id
      }
      console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
    }
  },

  // Configuração do comando
  config: {
    name: "softban",
    noalias: "Sem sinônimos",
    aliases: [],
    description: "Expulsa um membro do servidor, apagando suas mensagens dos últimos 7 dias.",
    usage: "softban <@membro> [motivo]",
    accessableby: "STAFF"
  }
}
