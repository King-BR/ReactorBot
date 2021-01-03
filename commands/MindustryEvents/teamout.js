const Discord = require("discord.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: async (client, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      const mevent = botUtils.jsonPull('./dataBank/mindustryEvent.json')
      const i = mevent.teams.findIndex(t => t.members.includes(message.author.id))

      if (i == -1) return message.reply('Mas tu já não participa de nenhum time');

      let embed = new Discord.MessageEmbed()
        .setTitle("Deseja mesmo sair do time ?")
        .setColor("RANDOM");
      let msg = await message.channel.send(embed);

      await msg.react('✅')
      await msg.react('❌')

      var filter = (reaction, user) => {
        return (['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id);
      }


      var collector = msg.createReactionCollector(filter, { time: 15000 });

      collector.on("collect", (r, u) => {
        switch (r.emoji.name) {
          case '✅': {



            mevent.teams[i].members = mevent.teams[i].members.filter(m => !(m == message.author.id));

            if (!mevent.teams[i].members.length) mevent.teams.splice(i, 1);

            botUtils.jsonPush('./dataBank/mindustryEvent.json', mevent)



            message.reply("saiu do time com sucesso");
            msg.reactions.removeAll();
            collector.stop();
            break;
          }
          case '❌': {
            message.reply("cancelado");
            msg.reactions.removeAll();
            collector.stop();
            break;
          }
        }
      })

      collector.on("end", collected => {
        if (collected.size > 0) return;
        changeRemove()
        msg.reactions.removeAll();
        message.reply("acabou o tempo");

      });

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
    name: "teamout",
    aliases: ['teamexit', 'timesair', 'timefora'],
    description: "Coloca o nome do time",
    usage: "teamname <nome>",
    accessableby: "Membros"
  }
}