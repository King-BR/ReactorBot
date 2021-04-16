const Discord = require("discord.js");
const botUtils = require("../../../utils.js");

module.exports = async (client, message) => {
  newError = botUtils.newError;
  try {
    if(message.content.includes("--react-ignore")) return;

    const regex1 = /[*_~]*sugest(?:ã|a)o[*_~]*\s*:[*_~]*.+\n*[*_~]*motivo[*_~]*\s*:[*_~]*.+/i;
    const regex2 = /[*_~]*emoji[*_~]*\s*:[*_~]*\s([^\s]\w{3,})/i

    if(!regex1.test(message.content) && (!regex2.test(message.content) || !message.attachments.first())) {
      message.delete();
      let canal = message.guild.channels.cache.get("775504927920357426");
      let suggestion = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true, size: 512 }))
        .setTitle("Sua sugestão foi")
        .setDescription(`\`\`\`${message.content}\`\`\``)
        .setFooter(`ID: ${message.author.id}`)
        .setTimestamp()
        .setColor("RANDOM");
      
      if(message.attachments.first()) suggestion.setThumbnail(message.attachments.first().url);

      canal.send(`${message.author} por favor siga o modelo de sugestão\n\`\`\`\n**Sugestão:** <descreva sua sugestão>\n\n**Motivo:** <motivos do por que sua sugestão deve ser aceita>\`\`\`\`\`\`\n**Emoji:** <nome do emoji> <imagem em anexo>\n\`\`\``, suggestion);
      return;
    }

    await message.react('❌');
    await message.react('✅');

  } catch (err) {
    let IDs = {
      server: message.guild.id,
      user: message.author.id,
      msg: message.id
    }
    console.log(`=> ${newError(err, "ClientMessage_ReactSugestao", IDs)}`);
  }
}