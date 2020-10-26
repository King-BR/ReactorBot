const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
  run: async (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {

      let str = '';
      const user = message.mentions.users.first() || message.author;

      botUtils.jsonChange('./dataBank/balance.json', balance => {
        let ord = [];
        let itstop = false;

        // Cria a array ord com as pessoas
        for (var userid in balance) {
          ord.push([
            userid,
            balance[userid]
          ]);
        }

        // ordena "ord" 
        ord.sort((a, b) => { return b[1] - a[1]; });

        let last = [1, ord[0][1]]

        //aparece o top 10
        for (let i = 0; i < Math.min(ord.length, 10); i++) {
          let userm = client.users.cache.get(ord[i][0]);
          let name = userm ? userm.username : "Usuario desconhecido";
          let position = i + 1

          if (ord[i][0] == "693473241322225715") name = "biiely";

          if (ord[i][0] == user.id) {
            itstop = true;
            name = `**${name}**`;
          };

          if (ord[i][1] == last[1]) position = last[0];

          last = [position, ord[i][1]]

          str += `**${position}.** ${name}: \`${ord[i][1]}\$\`\n`;
        }

        if (!itstop) {
          let pos = ord.findIndex(id => { return id[0] == user.id; });
          let zero = ord.findIndex(id => { return id[1] == 0; });
          if (pos == -1) { pos = zero == -1 ? ord.length : zero }

          if (pos > 10) str += '...\n';
          str += `**${pos + 1}. ${user.username}**: \`${balance[user.id] || 0}\$\`\n`;

        }
      });

      let emb = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor("RANDOM")
        .setTitle("Top")
        .setDescription(str)
      message.channel.send(emb);

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
    name: "top",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Ve quem tem mais dinheiro",
    usage: "top",
    accessableby: "Membros"
  }
}