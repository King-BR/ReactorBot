const Discord = require("discord.js");
const isImageUrl = require("is-image-url");
const sharp = require('sharp');
const request = require('request');

module.exports = async ({ client, botUtils }, messageReaction, user) => {
  newError = botUtils.newError;

  try {

    //se é partial, ent carrega
    if (messageReaction.message.partial) await messageReaction.message.fetch();

    //se foi o bot q mando
    if (user.id == client.user.id) return;
    const guild = messageReaction.message.guild
    const rolesW = {
      "699823332484317194": 4, //dono
      "700182152481996881": 3, //adm
      "755603968180093089": 2  //mod
    }

    if (messageReaction.emoji.toString() == '🚊') {
      messageReaction.remove()
      messageReaction.message.react(guild.emojis.cache.get('767832115701874728'))
        .then((r) => {
          messageReaction.users.remove('699824957118611569')
          messageReaction.message.awaitReactions((r, u) => u.id == user.id, { max: 1, time: 60000 })
            .then(() => {
              r.users.remove('699824957118611569')
            }).catch(() => {
              r.users.remove('699824957118611569')
            });
        })
        .catch(err => console.log(`=> ${newError(err, "messageReaction")}`));
    }

    if (messageReaction.message.channel.id == '775957550038384670') {
      const msg = messageReaction.message
      if (!msg.embeds.length) return console.log('Foi reagido uma mensagem que n possui embed,');
      const emb = msg.embeds[0]
      const line = (/\d+/i).exec(emb.title)[0]
      const authorId = (/\d+/i).exec(emb.author.iconURL)[0]


      botUtils.jsonChange('./dataBank/MindustryTraductions/creating.json', props => {

        if (!props[line]) {
          console.log('reagiram uma proposta onde n tem linha');
          return;
        };

        const i = props[line].findIndex(p => p.author == authorId);

        if (messageReaction.emoji.toString() == '✅') {
          if (user.id == authorId) return;
          if (props[line][i].mDown.includes(user.id)) {
            props[line][i].likes++;
            props[line][i].mDown = props[line][i].mDown.filter(u => u != user.id)
          }
          if (!props[line][i].mUp.includes(user.id)) {
            props[line][i].likes++;
            props[line][i].mUp.push(user.id)
          }
        } else if (messageReaction.emoji.toString() == '❌') {
          if (user.id == authorId) return;
          if (props[line][i].mUp.includes(user.id)) {
            props[line][i].likes--;
            props[line][i].mUp = props[line][i].mUp.filter(u => u != user.id);
          }
          if (!props[line][i].mDown.includes(user.id)) {
            props[line][i].likes--;
            props[line][i].mDown.push(user.id);
          }
        } else if (messageReaction.emoji.toString() == '🗑️' && botUtils.isDev(user.id)) {
          msg.delete()
          if (props[line].length == 2) {
            delete props[line];
          } else {
            props[line].splice(i, 1)
          }
        }

        return props;

      }, true)

      return;
    } else if (messageReaction.message.channel.id == '700147119465431050') {
      if (messageReaction.emoji.toString() != '👍' || messageReaction.me) return;

      let txt = messageReaction.message.content.split(/\s+/)
      if (txt[0] == 'emoji:' && txt.length == 2 && messageReaction.message.attachments.size) {
        let url = messageReaction.message.attachments.first().url;
        request({ url, encoding: null }, (err, resp, buffer) => {
          if(err) return console.log(`=> ${newError(err, "messageReaction_emojisugestao")}`);
          sharp(buffer)
            .rotate()
            .resize(100)
            .toBuffer()
            .then(data => {
              guild.emojis.create(data, txt[1], { reason: `Em pedido por ${messageReaction.message.author.tag} e aceito por ${user.tag}` })
                .then(messageReaction.message.react('👍'))
                .catch(err => console.log(`=> ${newError(err, "messageReaction_emojisugestao")}`))
            })
            .catch(err => console.log(`=> ${newError(err, "messageReaction_emojisugestao")}`));
        });
      }
    }


    if (messageReaction.emoji.toString() == '⭐' && !messageReaction.me) {

      let number = 0;
      messageReaction.users.cache.each(user => {
        const memb = guild.members.cache.get(user.id);
        if (memb && !memb.roles.cache.get("756585458263392376")) {
          number += Math.max.apply(null, Object.entries(rolesW).map(v => {
            return memb.roles.cache.get(v[0]) ? v[1] : 1
          }));
        }
      })

      if (number >= 5) {
        const m = messageReaction.message;
        m.react('⭐');
        let embed = new Discord.MessageEmbed()
          .setTitle("Mensagem Foda")
          .setAuthor(m.author.tag, m.author.displayAvatarURL())
          .setColor("RANDOM")
          .setDescription(m.content);

        if (m.attachments.first() && isImageUrl(m.attachments.first().url)) {
          embed.setImage(m.attachments.first().url);
        }

        client.channels.cache.get("738471925004632104").send(embed);
      }
    }

  } catch (err) {
    console.log(`=> ${newError(err, "messageReaction")}`);
  }
}