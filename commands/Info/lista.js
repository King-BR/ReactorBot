const Discord = require("discord.js");
const format = require("date-fns/format");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {

      const opt = args.shift()
      let embed = new Discord.MessageEmbed()

      switch ((opt || '').toLowerCase()) {
        default: {
        } case '': {
        } case 'help': {
          embed.setTitle('Ajuda');
          embed.addField('mutados', 'lista de quem foi mutado, envie `!lista mutados <nome>` para mais informações de tal pessoa');
          embed.addField('banidos', 'lista de quem foi banido, envie `!lista banidos <nome>` para mais informações de tal pessoa');
          embed.addField('gays', 'lista de quem é mais gay');
          message.channel.send(embed)
          break;
        } case 'mutados': {
          embed.setTitle('Mutados');
          Object.entries(botUtils.jsonPull('./dataBank/mutedlist.json'))
            .forEach((m, i) => {
              let name = client.users.cache.get(m[0])
              name = name ? name.tag : `Não encontrado (${m[0]})`;
              embed.addField(name, botUtils.formatDate(new Date(m[1][0])), true)
            })
          message.channel.send(embed)
        } case 'banidos': {
          embed.setTitle('Banidos');
          client.guilds.cache.get('699823229354639471').fetchBans()
            .then(bans => {
              if(!bans.size) embed.setDescription('Ninguem esta banido')
              bans.each(b => {
                embed.addField(b.user.tag, b.reason, true)
              message.channel.send(embed)
            })})
            .catch(err => console.log(`=> ${newError(err, 'lista', IDs)}`))
        }
      }

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
    name: "lista",
    aliases: [],
    description: "Mostra a lista de varias coisas, escreva `!lista help` para mais informações",
    usage: "!lista <opção>",
    accessableby: "Membros"
  }
}