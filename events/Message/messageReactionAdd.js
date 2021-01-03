const Discord = require("discord.js");
const download = require('download');
const botUtils = require("../../utils.js");

module.exports = async (client, messageReaction, user) => {
  newError = botUtils.newError;

  try {

    //se é partial, ent carrega
    try {
      if (messageReaction.message.partial) await messageReaction.message.fetch();
    } catch (e) {
      return;
    }

    let attach = messageReaction.message.attachments.find(a => a.name.endsWith(".msch"));
    if (messageReaction.emoji.toString() == '📪' && !user.bot && attach) {
      let base = (await download(attach.attachment)).toString("base64");

      let embed = new Discord.MessageEmbed()
        .setTitle("Seu esquema")
        .setColor("#9c43d9")
        .setDescription(base)
        .setTimestamp();
      user.send(embed)
        .catch(() => {
          user.send("O esquema que você pediu é muito grande para eu enviar em formato de texto, sry :C")
            .catch(() => console.log("n pode enviar mensagens para o " + user.tag))

        });
    }

  } catch (err) {
    console.log(`=> ${newError(err, "messageReaction")}`);
  }
}