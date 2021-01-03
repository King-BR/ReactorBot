const Discord = require("discord.js");
const format = require("date-fns/format");
const { Users } = require("../../database.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {
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
          embed.addField('avisados', 'lista de quem levou warn');
          embed.addField('sugestões', 'lista de sugestões anotadas por adms');
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
              if (!bans.size) embed.setDescription('Ninguem esta banido')
              bans.each(b => {
                embed.addField(b.user.tag, b.reason, true)
                message.channel.send(embed)
              })
            })
            .catch(err => console.log(`=> ${newError(err, 'lista', IDs)}`))
          break;
        } case 'avisados': {
          embed.setTitle('Avisados');
          Users.find({ "warn.quant": { $gt: 0 } }).sort({ "warn.quant": -1 }).exec((err, doc) => {
            if (err) {
              console.log(err);
              return;
            }

            doc.forEach(user => {
              const member = client.users.cache.get(user._id);
              embed.addField(member ? member.tag : user._id, user.warn.quant + " Warns", true);
            });
            message.channel.send(embed);

          });
          break;
        } case 'sugestões': {
          sug = botUtils.jsonPull('dataBank/sugestao.json').stored
          let pos = args.shift()
          if (pos) {
            if (isNaN(pos)) return message.reply("O argumento informado precisa ser um numero")
            pos = parseInt(pos)
            if (pos < 0 || pos >= sug.length) return message.reply(`O número precisa estar entre 0 e ${sug.length - 1}`)
            let embed = new Discord.MessageEmbed()
              .setTitle(`Sugestão`)
              .setColor("RANDOM")
              .setDescription(sug[pos].content);
            let author = client.guilds.cache.get("699823229354639471").members.cache.get(sug[pos].author)
            if (author) embed.setAuthor(author.displayName, author.user.avatarURL());
            return message.channel.send(embed)
          }

          botUtils.createPage(message.channel, Math.ceil(sug.length / 10), (page) => {
            let embed = new Discord.MessageEmbed()
              .setTitle(`${page}/${Math.ceil(sug.length / 10)} páginas de sugestões`)
              .setColor("RANDOM")
              .setTimestamp()
              .setDescription(sug.map((s, i) => {
                let author = client.guilds.cache.get("699823229354639471").members.cache.get(s.author)
                return `${i}. **${author ? author.displayName : s.author}**: ${botUtils.formatDate(new Date(s.data), true)}`
              }));

            return embed
          })
          break;
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