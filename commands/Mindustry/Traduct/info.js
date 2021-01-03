const Discord = require('discord.js');
const botUtils = require("../../../utils.js");

module.exports = {
  run: (client, message, args, helpers) => {

    try {
      // Execução do comando
      const bot = client.user
      const oGostosao = client.users.cache.get("291693225411084289").tag

      const msg = `Bom, se você tem vontade de ajudar na tradução do Mindustry, então o comando \`!tradução\` foi feito para você.
Esse comando serve para enviar suas ideias de tradução para o ${bot} (\`!tradução proposta\`), e assim sua proposta de tradução fica salva dentro dele, podendo ser votada como uma boa tradução ou má pelos outros membros do servidor. Para enviar uma proposta de tradução, você terá que fazer os seguintes passos:

> Primeiramente, será necessário procurar qual parte do Mindustry você vai editar, para isso escreva o comando \`!tradução see *\`, assim o ${bot}  ira te enviar o arquivo com as traduções do Mindustry atual, caso no você encontre no arquivo uma tradução mal feita, você anote a linha dessa tradução já que iremos utilizar no próximo passo.

> Depois de estar com o numero da linha que ira mudar, você usara o comando \`!tradução propor <linha> <tradução>\`, onde \`<linha>\` você vai ter que colocar o numero da linha na qual você ira mudar e no \`<tradução>\` sera o lugar onde vc vai colocar sua tradução, depois de usar esse comando sua proposta de tradução sera enviada para o bot.

> Agora que sua tradução foi entregue, hora de avaliar a tradução dos outros, digite o comando \`!tradução propostas\` para ver as linhas nas quais tem propostas de tradução, depois digite \`!tradução propostas <linha>\` para ver as propostas de tradução na atual linha, se você gostar de uma ou não quiser que ela seja colocada, escreva \`!tradução propostas <linha> <nome da pessoa>\`, em seguia o ${bot} irá mandar uma mensagem para você, e basta você reagir com :thumbsup:  ou :thumbsdown:

Caso tenha mais duvidas, pergunte ao adm mais bonito e inteligente do servidor (E um dos programadores do bot) ${oGostosao}`

      message.reply('mensagem enviada na dm')
      message.author.send(msg)

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