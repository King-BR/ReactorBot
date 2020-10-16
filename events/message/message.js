const config = require("../../config.json");
prefix = config.prefix

module.exports = async ({ client, botUtils }, message) => {
  newError = botUtils.newError;
  try {
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (message.channel.type === "dm") return;

    if (cmd.includes(client.user) || cmd.includes(client.user.id)) {
      message.channel.send(`${emoji("ois")} | Meu prefixo atual é: \`${prefix}\`. Use \`${prefix}ajuda\` para mais informações!`);
      return;
    }

    if (!message.content.startsWith(prefix)) return;

    let commandfile =
      client.commands.get(cmd.slice(prefix.length)) ||
      client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
    try {
      if (commandfile) commandfile.run(client, botUtils, message, args);
    } catch (err) {
      console.log(`=> ${newError(err, cmd.slice(prefix.length))}`)
    }
  }catch(err) {
    console.log(`=> ${newError(err, "ClientMessage")}`);
  }
}