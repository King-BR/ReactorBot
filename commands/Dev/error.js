const Discord = require("discord.js");

module.exports = {
  run: async (client, botUtils, message, args) => {
    if (!botUtils.isDev(message.author.id)) return message.channel.send("Voce não tem permissão para executar esse comando")

    newError = botUtils.newError;
    isDir = botUtils.isDir;

    try {
      if (!args[0]) {
        let embed = new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setTimestamp()
          .setDescription(`${client.config.prefix}error [opção]`)
          .addField("clear", "Limpa todos os erros")
          .addField("delete [ID]", "Apaga um erro especifico")
          .addField("list", "Lista todos os erros")
          .addField("last", "Mostra o ultimo erro")
          .addField("search <ID>", "Procura um erro contendo o id fornecido")
        message.channel.send(embed);
        return;
      }

      switch (args[0]) {
        case "clear": {
          botUtils.clearAllErrors();
          message.reply(" todos os erros foram limpos");
          break;
        }
        case "delete": {
          let errors = botUtils.listErrors();
          let errorsString = "";
          let i = 0;

          if (args[1]) {
            let deleted = false;
            errors.forEach(error => {
              let pull = require(`../../errors/${error}`);
              if (pull.errorID == args[1]) {
                botUtils.deleteError(error);
                message.channel.send("Erro deletado");
                deleted = true;
              }
            });

            if (!deleted) {
              message.channel.send("Nenhum erro encontrado com esse ID");
            }
            return;
          }


          if (errors.length > 0) {
            errors.forEach(error => {
              let pull = require(`../../errors/${error}`);
              errorsString += `${++i} - ${pull.thisfile}\n`;
            });
          } else {
            let embednerrors = new Discord.MessageEmbed()
              .setTitle("Não existe erros no momento")
              .setDescription("Que milagre")
              .setTimestamp()
              .setColor("RANDOM")
            message.channel.send(embednerrors);
            return;
          }

          let embederrors = new Discord.MessageEmbed()
            .setTitle("Escolha o erro a ser deletado")
            .setDescription(errorsString)
            .setTimestamp()
            .setColor("RANDOM")
          message.channel.send(embederrors)
            .then(m => {
              let filter = (msg) => (((!isNaN(msg.content) && parseInt(msg.content)) || (msg.content == "exit" || msg.content == "finish")) && msg.author.id == message.author.id);
              var collectorDelete = m.channel.createMessageCollector(filter);

              collectorDelete.on("collect", msg => {
                if ((msg.content == "exit" || msg.content == "finish") && msg.author.id == message.author.id) {
                  collectorDelete.stop();
                  m.react("❌");
                  return;
                }

                if (typeof parseInt(msg.content) != "number") return;

                botUtils.deleteError(errors[parseInt(msg.content) - 1]);
                message.channel.send(`\`${errors[parseInt(msg.content) - 1]}\` deletado`);
                return;
              })
            });
          break;
        }
        case "list": {
          let errors = botUtils.listErrors();
          let errorsArray = [];
          let i = 1;

          if (errors.length > 0) {
            errors.forEach(error => {
              let pull = require(`../../errors/${error}`);
              errorsArray.push(pull);
            });
          } else {
            let embednerrors = new Discord.MessageEmbed()
              .setTitle("Não existe erros no momento")
              .setDescription("Que milagre")
              .setTimestamp()
              .setColor("RANDOM")
            message.channel.send(embednerrors);
            return;
          }

          let embedListErrors = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setTitle("Lista de erros");

          errorsArray.forEach(er => { embedListErrors.addField(`${i++} - ${er.thisfile}`, `${er.msg}\n\nData: ${er.date}\nID: ${er.errorID}`); });

          message.channel.send(embedListErrors);
          break;
        }
        case "last": {
          let errors = botUtils.listErrors();
          let er = {
            file: "",
            ms: 0
          }

          if (errors.length == 0) {
            let embednerrors = new Discord.MessageEmbed()
              .setTitle("Não existe erros no momento")
              .setDescription("Que milagre")
              .setTimestamp()
              .setColor("RANDOM")
            message.channel.send(embednerrors);
            return;
          }

          errors.forEach(error => {
            let pull = require(`../../errors/${error}`);

            if (pull.msdate > er.ms) {
              er.ms = pull.msdate;
              er.file = pull.thisfile;
            }
          });

          let pull = require(`../../errors/${er.file}`);

          let embedLastError = new Discord.MessageEmbed()
            .setTitle(pull.thisfile)
            .setDescription(`ID: ${pull.errorID}`)
            .addField(pull.msg, pull.stack.split("\n").slice(1, 3).join("\n"))
            .setColor("RED")
            .setTimestamp(pull.msdate)
            .setFooter(`Data: ${pull.date}`);
          message.channel.send(embedLastError);
          break;
        }
        case "search": {
          if (args[1]) {
            let error = botUtils.searchErrorByID(args[1]);

            if (error) {
              let pull = require(`../../errors/${error}`);

              let embedError = new Discord.MessageEmbed()
                .setTitle(pull.thisfile)
                .setDescription(`ID: ${pull.errorID}`)
                .addField(pull.msg, pull.stack.split("\n").slice(1, 3).join("\n"))
                .setColor("RED")
                .setTimestamp(pull.msdate)
                .setFooter(`Data: ${pull.date}`);
              message.channel.send(embedError);
              return;
            }
          } else {
            message.channel.send("Nenhum erro encontrado com esse ID");
          }
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
      console.log(`=> ${newError(err, "error", IDs)}`);
    }
  },

  config: {
    name: "error",
    aliases: ["err", "e"],
    description: "Cheque os erros salvos pelo handler de erros",
    usage: "error",
    accessableby: "Desenvolvedores"
  }
}