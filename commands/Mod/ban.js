const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: async (client, botUtils, message, args) => {
    newError = botUtils.newError;
    try {
      // Codigo do comando
      if (!message.member.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.reply("Você não tem permissão para executar este comando.");
      if (!message.mentions.members.first()) return message.reply("Mencione a pessoa que deseja banir.");

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
            .setTitle('Ban!')
            .setImage('https://media1.tenor.com/images/a218955491d07f811b5fb219e8a10e6c/tenor.gif?itemid=18035543')
            .setDescription(`${user} levou ban.\n\nMotivo: ${reason}`)
            .setThumbnail(user.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
            .setTimestamp();
          await channel.send(embed);
        });


    } catch (err) {
      let embed = new Discord.MessageEmbed()
        .setTitle("Erro inesperado")
        .setDescription("Um erro inesperado aconteceu. por favor contate os desenvolvedores do ReactorBot.\n\nUm log foi criado com mais informações do erro.");
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
    name: "ban",
    noalias: "Sem sinônimos",
    aliases: [],
    description: "use para banir um membro do servidor.",
    usage: "ban <@member> [motivo]",
    accessableby: "STAFF"
  }
}
