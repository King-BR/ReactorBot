const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      let allCat = fs.readdirSync('commands');
      let cat;
      
      if (args[0]){
        allCat.some(f => {
          cat = f.toLowerCase() == args[0].toLowerCase() && f
          return cat;
        })
      }

      let str = ''
      let title = "Comandos de " + cat

      if (typeof cat != 'string') {

        if (args[0]) message.reply("Não conheço essa categoria, tenta ler dnv :P");
        const folder = fs.readdirSync('commands');

        title = "Lista de Categorias"

        folder.forEach(category => {
          if (category == 'Dev' && !botUtils.isDev(message.author.id)) return;
          str += category + '\n'
        });

      } else {

        if (cat == "Dev" && !botUtils.isDev(message.author.id)) return message.reply("Oi ?");

        const folder = fs.readdirSync('commands/' + cat);
        folder.forEach(command => {
          if (!botUtils.isDir(`commands/${cat}/${command}` && command.endsWith('.js'))){
            let pull = require(`../../commands/${cat}/${command}`);
            str += `**${pull.config.name}:** ${pull.config.description}\n`
          }
        });
      }

      let embedHelp = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor("RANDOM")
        .setTitle(title)
        .setFooter(`Requisitado por: ${message.author.tag}`, message.author.displayAvatarURL)
        .setDescription(str);

      message.channel.send(embedHelp)
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
    name: "commands",
    aliases: ['comandos','cmds'],
    description: "Fala sobre uma categoria com mais detalhes",
    usage: "uso",
    accessableby: "Comandos"
  }
}