const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    if (!message.member.roles.cache.has('755604380295757824')) return message.reply("Você n é membro da STAFF");
    
    newError = botUtils.newError;
    try {
      // Codigo do comando
      if(!message.member.hasPermission("MANAGE_MESSAGES", "ADMINISTRATOR")) return message.channel.send("Você não tem permissão para isso");
      if(typeof parseInt(args[0]) != "number") return message.channel.send("Quantidade invalida");
      if(parseInt(args[0]) < 1) return message.channel.send("O numero precisa ser maior que 0");

		  message.channel.bulkDelete(parseInt(args[0]) + 1)
        .then(messages => message.channel.send(`Foram deletadas ${messages.size - 1} mensagens.`))
        .then(message => client.setTimeout(function(){message.delete();},3 * 1000),message);

    } catch(err) {
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
    name: "purge",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Apage mensagens do canal",
    usage: "purge <quantidade>",
    accessableby: "STAFF"
  }
}