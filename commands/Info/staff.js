const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      if (message.mentions.members.size || message.mentions.roles.size) return message.reply('Qual foi, marca os outros n, só manda o id.');
      const guild = client.guilds.cache.get("699823229354639471")
      let title = 'Staff'
      let rolesid = [
        "699823332484317194",
        "770430903117545473",
        "700182152481996881",
        "755603968180093089",
        "699977451010261172",
        "758839581512302611"
      ]


      nroles = args.map(telled => {
        let id = guild.roles.cache.get(args[0]) && telled
        let role = guild.roles.cache.find(role => role.name.toLowerCase().replace(/[ @]+/g, '') == telled.toLowerCase())
        id = id || role && role.id

        return id
      }).filter(r => r)
      if (nroles.length) {
        rolesid = nroles;
        title = 'Roles'
      }

      let embed = new Discord.MessageEmbed()
        .setTitle("Staff")
        .setColor(guild.roles.cache.get(rolesid[0]).hexColor);

      rolesid.forEach(id => {

        let str = []
        let size = 0
        let more = false
        const role = guild.roles.cache.get(id)

        role.members.each(member => {
          size += member.user.tag.length + 1
          if (size < 1022) {
            str.push(member.user.tag);
          } else { more = true }
        });

        if (!str.length) str.push('­')
        if (more) str.push('...­')

        embed.addField(role.name, '```' + str.join('\n') + '```', true)

      });

      message.channel.send(embed)

    } catch (err) {
      let embed = new Discord.MessageEmbed()
        .setTitle("Erro inesperado")
        .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
      message.channel.send(embed);

      let IDs = {
        server: message.guild.id,
        user: message.author.id,
        msg: message.id
      }
      console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
    }
  },

  // Configuração do comando
  config: {
    name: "staff",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Ver quem os membros da staff",
    usage: "staff",
    accessableby: "Membros"
  }
}