const Discord = require("discord.js");
const config = require("../../config.json");
const fs = require("fs");

prefix = config.prefix;

module.exports = {
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;
    isDir = botUtils.isDir;

    try {
      if(args) {}
      if (args[0] === module.exports.config.name || module.exports.config.aliases.includes(args[0])) return message.channel.send(`burro da porra`);
      if (args[0]) {
        let command = args[0];
        if (client.commands.has(command) || client.commands.get(client.aliases.get(command))) {
          command = client.commands.get(command) || client.commands.get(client.aliases.get(command));
                    
          let aliases = command.config.noalias;
          if(command.config.aliases.length > 0) aliases = command.config.aliases.join(", ");

          let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`O meu prefixo é: ${prefix}`)
            .addField(`Comando:`,`${command.config.name}`)
            .addField(`Descrição:`,`${command.config.description || "Sem descrição"}`)
            .addField(`Uso:`,`${prefix}${command.config.usage || "Sem uso definido"}\n\nparametros entre <> são obrigatorios\nparametros entre [] são opcionais`)
            .addField(`Acessivel para:`,`${command.config.accessableby || "Membros"}`)
            .addField(`Sinônimos:`,`${aliases}`)
            .setFooter(`Requisitado por: ${message.author.tag}`);
          message.channel.send(embed);
        }
        return;
      }

      if (!args[0]) {
        let embedHelp = new Discord.MessageEmbed()
          .setTimestamp()
          .setColor("RANDOM")
          .setTitle("Lista de comandos")
          .setDescription("Use " + prefix + "ajuda [nome do comando] para ver mais informações do comando")
          .setFooter(`Requisitado por: ${message.author.tag}`, message.author.displayAvatarURL);

        let commandsFolder = fs.readdirSync("commands");
        commandsFolder.forEach(folder => {
          if (folder === 'Dev' && (!botUtils.isDev(message.author.id))) return;
          var all = fs.readdirSync(`commands/${folder}`);
          var files = all.filter(f => {
            let dirCheck = isDir(`commands/${folder}/${f}`);
            return f.split(".").slice(-1)[0] === "js" && !dirCheck;
          });
          let string = files.map(f => {
            let pull = require(`../../commands/${folder}/${f}`);
            return pull.config.name;
          }).join(", ");
          embedHelp.addField(`**${folder}**`, `\`${string}\``);
        });
        message.channel.send(embedHelp);
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
  config: {
    name: "ajuda",
    noalias: "Sem sinonimos",
    aliases: ['help'],
    description: "Lista de comandos",
    usage: "ajuda [nome do comando]",
    accessableby: "Membros"
  }
}
