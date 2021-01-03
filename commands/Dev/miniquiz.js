const Discord = require("discord.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      if (message.channel.id != "729230699416125440") return message.reply("não estrague minha surpresa :P\nuse no teste-bot");


      const funcs = [
        function() {
          const resp = [Math.floor(Math.random() * 20 - 10), Math.floor(Math.random() * 20 - 10)]
          let str = `Qual é o valor de \`x\` e \`y\` do sistema\n\`\`\`\nxy = ${resp[0]*resp[1]}\nx+y = ${resp[0]+resp[1]}\`\`\``
          return [str,resp];
        }
      ]

      let times = parseInt(args[0])
      times = (!isNaN(times) && times > 0) ? times : 1

      for (let i = 0; i < times; i++) {
        const quest = funcs[0]()

        message.channel.send('> ' + quest[0])
        message.channel.send("||" + quest[1] + "||")
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
    name: "miniquiz",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "descrição",
    usage: "miniquiz",
    accessableby: "Desenvolvedores"
  }
}