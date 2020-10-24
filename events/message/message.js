const config = require("../../config.json");
const Discord = require("discord.js");
prefix = config.prefix

module.exports = async ({ client, botUtils }, message) => {
  newError = botUtils.newError;

  try {
    let messageArray = message.content.split(/ +/);
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    // n detecta mensagens na dm
    if (message.channel.type === "dm") return;

    // detecta se foi mencionado
    let mentioned = cmd.includes(client.user) || cmd.includes(client.user.id)

    if (mentioned && !args.length) {
      message.channel.send(`Opa tudo bem ? | Meu prefixo atual é: \`${prefix}\`. Use \`${prefix}ajuda\` para mais informações!`);
      return;
    } else if (mentioned && args.length > 0) {
      message.reply(Math.random() < 0.5 ? 'Sim' : 'Não');
      return;
    }

    // Utils
    //if (message.channel.id == "767982805908324411" && !message.author.bot) return message.delete();
    if (message.channel.id == "768238015830556693") { // #mini-events
      return require("./utils/minieventos.js")(client, botUtils, message);
    }
    if (message.channel.id == "756587320140103690") { // #mudae-comécio
      return require("./utils/mudae.js")(client, botUtils, message);
    }
    
    // tudo oq n possui prefixo é cancelado
    if (!message.content.startsWith(prefix)) return;

    // gambiarra do king
    let commandfile =
      client.commands.get(cmd.slice(prefix.length)) ||
      client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
    try {
      if (commandfile) commandfile.run(client, botUtils, message, args);
    } catch (err) {
      console.log(`=> ${newError(err, cmd.slice(prefix.length))}`)
    }
  } catch (err) {
    let IDs = {
      server: message.guild.id,
      user: message.author.id,
      msg: message.id
    }
    console.log(`=> ${newError(err, "ClientMessage", IDs)}`);
  }
}