const Discord = require('discord.js');
const fs = require('fs');
const GithubContent = require('github-content');
const botUtils = require("../../../utils.js");

module.exports = {
  run: (client, message, args, helpers) => {

    try {
      // Execução do comando
      if (!botUtils.isDev(message.author.id)) return message.channel.send("Voce não tem permissão para executar esse comando");

      const start = new Date().getTime();
      let Mindustry = new GithubContent({ owner: 'Anuken', repo: 'Mindustry', })

      //Atualizando os arquivos BR

      Mindustry.file('core/assets/bundles/bundle_pt_BR.properties', function(err, file) {
        if (err) return console.log(err);

        message.channel.send({
          files: [
            { attachment: Buffer.from(file.contents.toString()), name: 'Github.txt' }
          ]
        })

        const diff = botUtils.arrDiference(helpers.textBR, file.contents.toString().split('\n'))
        console.log(diff)

        if (diff.length) {
          let quests = Object.entries(botUtils.jsonPull(helpers.filePath + "creating.json")).map(v => [parseInt(v[0]), v[1]]);
          const changes = diff.map(v => [v[0].slice(0, -1), v[0].slice(-1) == "+", v[1]]);
          const total = changes.length;

          changes.forEach(v => {
            if (v[1]) {
              quests = quests.map(c => {
                if (c[0] >= v[0]) c[0]++;
                return c
              })
            } else {
              quests = quests.map(c => {
                if (c[0] > v[0]) c[0]--;
                if (c[0] == v[0]) return null;
                return c
              }).filter(c => c)
            }
          })

          const atual = quests.length;
          let res = {}
          quests.forEach(v => res[v[0]] = v[1])

          const att = new Discord.MessageAttachment(Buffer.from(JSON.stringify(diff, null, 2)), "Mudanças")
          const embed = new Discord.MessageEmbed()
            .setTitle("A tradução foi atualizada!")
            .setDescription(`O arquivo da github foi atualizado, com isso ${Math.round(100 - atual / total * 100)}% (${total} -> ${atual}) propostas foram apagadas`)
            .setColor("RANDOM")
            .attachFiles(att)
            .setTimestamp();
          //botUtils.jsonPush("dataBank/MindustryTraductions/creating.json",res)
          //fs.writeFileSync("dataBank/MindustryTraductions/last.txt",file.contents.toString())
          console.log("eeee")
          //client.channels.cache.get("775957550038384670").send(embed)
        }

        fs.writeFileSync(helpers.filePath + 'mostRecent.json', JSON.stringify({ difs: diff }, null, 2));
      });

      //Atualizando os arquivos EN

      Mindustry.file('core/assets/bundles/bundle.properties', function(err, file) {
        if (err) return console.log(err);

        fs.writeFileSync(helpers.filePath + 'english.txt', file.contents.toString());
        message.channel.send((new Date().getTime() - start) / 1000 + 's')
      });

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
      console.log(`=> ${newError(err, 'traduct_' + (/\s+([^\s]+)/i.exec(message.content)[1] || '???'), IDs)}`);
    }
  }
}