const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
  run: async (client, botUtils, message, args) => {

    newError = botUtils.newError;

    try {

      if (isNaN(parseInt(args[1] || args[0]))) return message.reply('Não foi possivel indentificar a quantia de dinheiro a se informar');
      if (!message.member.roles.cache.has('755604380295757824')) return message.reply("Você n é membro da STAFF");

      const user = message.mentions.users.first() || message.author
      let log;


      botUtils.jsonChange('./dataBank/balance.json', balance => {
        const quant = parseInt(args[1] || args[0]);
        balance[user.id] = (balance[user.id] || 0) + quant;
        message.channel.send(`Foi adicionado: ${quant}\$, totalizando: ${balance[user.id]}\$.`);
        log = `O Membro ${user ? user.tag : message.author.tag} recebeu ${quant}\$ totalizando ${balance[user.id]}\$`;
        return balance
      });

      let emb = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle('Adicionou dinheiro!')
        .setDescription(log)
        .setThumbnail(user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
        .setTimestamp();
      client.channels.cache.get("767982805908324411").send(emb);

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

  config: {
    name: "moneyadd",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "adiciona adinheiro na conta de um jogador",
    usage: "moneyadd [Membro] <Quantia>",
    accessableby: "Desenvolvedores"
  }
}