const Discord = require("discord.js");

module.exports = (client, botUtils, message, args) => {
  newError = botUtils.newError;
  try {
    let messageArray = message.content.split(/ +/);
		let cmd = messageArray[0].toLowerCase();
		let args = messageArray.slice(1);
    
    //Caso o autor da mensagem seja um bot, ele ignora
    if(message.author.bot) return;
    if(cmd != "!correio")return;
    console.log(message.content)

		//if (!message.content.startsWith(prefix)) return;

    //sla
    message.channel.send(`"${cmd}"\n\n-disse a putinha`);

  } catch (err) {
    let IDs = {
      user: message.author.id,
      msg: message.id
    };
    console.log(`=> ${newError(err, "ClientCorreio", IDs)}`);
  }
}