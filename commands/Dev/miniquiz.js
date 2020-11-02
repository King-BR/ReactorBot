const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      if (message.channel.id != "729230699416125440") return message.reply("não estrague minha surpresa :P\nuse no teste-bot");
      

      const funcs = [
        function() {
          const palavras = botUtils.jsonPull('./dataBank/textSaves.json').quizWords;
          const resp = palavras[Math.floor(Math.random() * palavras.length)];
          const quant = Math.floor((1-Math.log10(1 - Math.random()))*resp.length/4);

          const mutate = (str) => {

            let op = Math.floor(Math.random() * 3)
            let letter = Math.floor(Math.random() * 26 + 10).toString(36)
            let arr = quest.split("");

            if (op == 0) {
              arr.splice(Math.random() * arr.length, 1, letter);
            } else if (op == 1) {
              arr.splice(Math.random() * arr.length, 0, letter);
            } else if (op == 2) {
              arr.splice(Math.random() * arr.length, 1);
            }

            return arr.join("");
          }

          let quest = resp

          for (let i = 0; i < quant; i++) {quest = mutate(quest)}

          quest = `Deu um erro no arquivo(${quant}x), descubra a palavra:\`${quest}\``

          return [quest, resp.toLowerCase()];
        }
      ]

      let times = parseInt(args[0])
      times = (!isNaN(times) && times > 0)? times : 1
      
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