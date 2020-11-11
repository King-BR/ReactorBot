const Discord = require('discord.js');

module.exports = {
  run: (client, botUtils, message, args, helpers) => {

    try {
      // Execução do comando

      const line = parseInt(args.shift())

      if (isNaN(line)) return message.reply('preciso saber a linha.');
      if (botUtils.isDev(message.author.id) && !args[0]) return message.reply('Como é dev, preciso saber o nome da pessoa a se deletar');

      botUtils.jsonChange(helpers.filePath + 'creating.json', lines => {
        
        //Verifica se existe tal linha
        if (lines[line]) {
          
          //se for dev
          if (botUtils.isDev(message.author.id)) {
            
            const propl = lines[line].findIndex(prop => {
              let pAuthor = client.users.cache.get(prop.author)
              pAuthor = pAuthor ? pAuthor.tag : 'original'
              return pAuthor.toLowerCase().startsWith(args[0].toLowerCase())
            })
            if (propl >= 0) {
              
              if (lines[line].length == 2) {
                delete lines[line];
              } else {
                lines[line].splice(propl, 1)
              }
              message.reply('apagado com sucesso')
              return lines
            } else {message.reply("Não foi achado ninguem com esse nome")}

          //se não for dev
          } else if (lines[line].some(prop => prop.author == message.author.id)) {

            const propl = lines[line].findIndex(prop => prop.author == message.author.id)

            if (lines[line].length == 2) {
              delete lines[line];
            } else {
              lines[line].splice(propl, 1)
            }

            message.channel.send('Sua proposta foi deletada')
            return lines;
          } else {message.reply('Você não possui nenhuma proposta nesse local')}

        } else {message.reply('Não foi encontrada essa linha')}
      }, true)

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