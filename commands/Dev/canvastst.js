const Discord = require("discord.js");
const botUtils = require("../../utils.js");

module.exports = {
  run: async (client, message, args) => {
    //if (!botUtils.isDev(message.author.id)) return message.channel.send("Voce não tem permissão para executar esse comando");

    try {
      let txt = (/```(?:json)?\s(.*)```|(.*)/is).exec(args.join(" ").trim())
      txt = txt[1] || txt[2]
      let json;
      let buf;

      try {
        json = JSON.parse(txt)
      } catch {return message.reply("Não foi possivel entender seu JSON")}
      try{
        buf = botUtils.mndJsonToScheme(JSON.parse(txt));
      } catch {return message.reply("Não foi possivel transformar sua schematica")}

      message.channel.send(`\`\`\`${buf}\`\`\``)

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
    name: "canvastest",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "testando canvas",
    usage: "canvastest",
    accessableby: "Desenvolvedores"
  }
}