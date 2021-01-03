const Discord = require("discord.js");
const botUtils = require("../../utils.js");

module.exports = async (client, member) => {
  newError = botUtils.newError;

  try {

    const timeProp = [1, 1000, 60000, 3600000, 86400000, 31536000000, Number.POSITIVE_INFINITY];
    const timename = ["ms", "segundo", "minuto", "hora", "dia", "ano", "???Eternidade"];

    let emoji = client.emojis.cache.find(e => e.name == "PaimonPat" && e.animated);
    let time = ((new Date().getTime()) - member.joinedTimestamp);
    let description = "";

    timeProp.some((t, i) => {

      const times = (i) => timeProp[i];

      if (times(i + 1) > time) {

        const getTxt = (time, i) => {
          let res = Math.floor(time / times(i));
          return `${res} ${timename[i]}${res == 1 ? "" : "s"}`;
        }

        if (time < timeProp[2]){
          description = "\nFicou no server por apenas ";
        } else if (time < timeProp[4]*7) {
          description = "\nAguentou o server por ";
        } else if (time < timeProp[4]*30) {
          description = "\nEsse era guerreiro. Ficou no server por "
        } else if (time < timeProp[4]*30*6){
          description = "\nAposto que esse era bastante importante no servidor. Ficou por "
        } else {
          description = "\nObrigado por fazer parte servidor por tanto tempo assim, até. Ficou no server por "
        }

        let t1 = Math.floor(time / times(i));
        let t2 = Math.floor( time % times(i) / times(i-1));
        
        description += `${t1} ${timename[i]}${t1 == 1 ? "" : "s"} e ${t2} ${timename[i-1]}${i == 1 || t2 == 1 ? "" : "s"}`;

        return true;
      }
      return false;
    });

    let welcome = new Discord.MessageEmbed()
      .setTitle(`${emoji} Até Logo!`)
      .setDescription(`${member} (${member.user.tag}), saiu do nosso servidor!` + description)
      .setColor("RANDOM")
      .setTimestamp()
      .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true, size: 512 }))
    //.setImage("https://thumbs.gfycat.com/BrownFavoriteCock-small.gif");
    client.channels.cache.get("699823229354639474").send(welcome);

  } catch (err) {
    console.log(`=> ${newError(err, "guildMemberRemove")}`);
  }
}