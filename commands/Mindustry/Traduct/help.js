const Discord = require('discord.js');
const fs = require('fs');
const botUtils = require("../../../utils.js");

module.exports = {
  run: (client, message, args, helpers) => {

    try {
      // Execução do comandosfa
      const details = {
        help: "Faz aparecer isso aqui",
        line: "Mostra o conteudo que aparece em tal linha",
        proposal: "Envia uma proposta para o banco de dados do bot, para posteriormente ser enviado para o mindustry",
        proposals: "Vê todas as propostas atuais, se enviado a linha e o nome do membro é possivel votar",
        get: "Pega os arquivo de tradução armazenados no ReactorBot",
        delete: "Apaga uma proposta feita pelo author do comando",
        diff: "Envia um arquivo com as diferenças entre o bundleBR e o bundleEN",
        find: "Acha uma certa palavra no bundleBR",
        import: "APENAS DEV, importa as atuais mudanças do github, LAGA MUITO",
        info: "Envia uma informação mais detalhada de como ajudar a traduzir mindustry na dm",
        see: "Procura determinada tradução se enviado um caminho, caso enviado o comando `!traduct see *` envia o arquivos com as traduções atuais do github"
      }
      
      let embed = new Discord.MessageEmbed()
        .setTitle("Ajuda")
        .setColor("RANDOM");
      let folder = fs.readdirSync(`./commands/Mindustry/Traduct`).filter(t => t.endsWith('.js'));
      folder.forEach(t => {
        embed.addField('traduct '+t.slice(0,-3),details[t.slice(0,-3)] || "<Não especificado>")
      })
      message.channel.send(embed);

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
      console.log(`=> ${newError(err, 'traduct_help', IDs)}`);
    }
  }
}