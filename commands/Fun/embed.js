const Discord = require("discord.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {

    try {
      
      if (args[0] == 'help') return message.channel.send({embed:{description:'"description":"<texto>"'}});

      let msg = /`{3,}(.+)`{3,}/i.exec(message.content)

      let jotafilho;
      if (msg) {
        try {
          jotafilho = JSON.parse(msg[1])
        } catch (err1) {
          message.reply("Não foi possivel entender sua mensagem")
        }
      } else {
        
        return message.reply("o precisa de um texto nesse formato \`\`\` <texto>  \`\`\`")

      }

      if (jotafilho) message.channel.send({ embed: jotafilho })
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
      console.log(`=> ${newError(err, "fifteen", IDs)}`);
    }
  },

  config: {
    name: "embed",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Envia uma mensagem embed",
    usage: "embed <mensagem>",
    accessableby: "Membro"
  }

}