const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: async (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      if(!args[0]) return message.reply("é necessario enviar um codigo de esquema")
      let schema = botUtils.mndGetScheme(args[0]);
      if (!isNaN(schema)) {
        if (schema == 1) return message.reply("Isso não é um codigo de esquema");
        if (schema == 2) return message.reply("Esse codigo é muito antigo");
        if (schema >= 3) return message.reply("O codigo esta corrompido, teste no jogo para ver funciona, caso funcione no jogo fale com algum adm (" + schema + ")");
      }
      botUtils.mndSendMessageEmbed(args[0], schema, message)

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
    name: "schematic",
    aliases: ['esquema', 'schm', 'schem'],
    description: "Transforma base64 em esquemas do mindustry",
    usage: "schem <codigo>",
    accessableby: "Membros"
  }
}