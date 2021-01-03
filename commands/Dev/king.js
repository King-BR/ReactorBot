const Discord = require("discord.js");
const fs = require("fs");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {
    newError = botUtils.newError;

    if (message.author.id != "375462796697010176") return message.channel.send("Só o king pode usar");

    try {
      let data = require("../../dataBank/MindustryRP/index.js");
      let dataJson = {};
      let dataTypes = Object.keys(data);
      //console.log(dataTypes);

      let embedKing = new Discord.MessageEmbed()
        .setTitle("MindustryRP json data")
        .setTimestamp()
        .setColor("RANDOM");

      for (let dataType in dataTypes) {
        let dataKeys = Object.keys(data[dataTypes[dataType]]);
        embedKing.addField(dataTypes[dataType], dataKeys.join(", ") || "no data");

        dataJson[dataTypes[dataType]] = {};
        dataKeys.forEach(dataKey => {
          dataJson[dataTypes[dataType]][dataKey] = {};

          let dataSubKeys = Object.keys(data[dataTypes[dataType]][dataKey]);

          dataSubKeys.forEach(dataSubKey => {
            dataJson[dataTypes[dataType]][dataKey][dataSubKey] = {
              type: "Number",
              default: 0
            }
          });
        });

        /*
        console.log(`\n=> ${dataTypes[dataType]}`);
        if(data[dataTypes[dataType]] != null) {
          console.log(Object.keys(data[dataTypes[dataType]]));
        }
        */

      };

      message.channel.send(embedKing);

      dataJson = JSON.stringify(dataJson, null, 2);
      fs.writeFileSync("dataBank/MindustryRP/data.json", dataJson);

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
    name: "king",
    aliases: [],
    description: "Comando que o King usa para testar coisas",
    usage: "king",
    accessableby: "@KingBR#3793"
  }
}