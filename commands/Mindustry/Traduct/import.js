const Discord = require('discord.js');
const fs = require('fs');
const GithubContent = require('github-content');

module.exports = {
  run: (client, botUtils, message, args, helpers) => {

    try {
      // Execução do comando
      if (!botUtils.isDev(message.author.id)) return message.channel.send("Voce não tem permissão para executar esse comando");

      const start = new Date().getTime();
      let Mindustry = new GithubContent({ owner: 'Anuken', repo: 'Mindustry', })

      Mindustry.file('core/assets/bundles/bundle_pt_BR.properties', function(err, file) {
        if (err) return console.log(err);

        message.channel.send({
          files: [
            {attachment: Buffer.from(file.contents.toString()) , name: 'Github.txt'},
            {attachment: Buffer.from(helpers.textBR.join('\n')), name: "Saved.txt"}
          ]
        })

        const diff = botUtils.arrDiference(helpers.textBR, file.contents.toString().split('\n'))

        fs.writeFileSync(helpers.filePath + 'mostRecent.json', JSON.stringify({ difs: diff }, null, 2));
      });

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