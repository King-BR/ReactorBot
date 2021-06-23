const Discord = require("discord.js");
const botUtils = require("../../../utils.js");
const grammar = require("../../../dataBank/grammar/Sugestion");
const nearley = require("nearley");

module.exports = async (client, message) => {
  newError = botUtils.newError;
  try {
    if (message.content.includes("--react-ignore")) return;

    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    /**
     * Rejeita uma proposta
     * @param {String} Envia uma reposta customisada, por padrão é o pedido de fazer o modelo padrão.
     */
    const reject = (txt) => {
      message.delete();
      let canal = message.guild.channels.cache.get("775504927920357426");
      let suggestion = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true, size: 512 }))
        .setTitle("Sua sugestão foi")
        .setDescription(`\`\`\`${message.content}\`\`\``)
        .setFooter(`ID: ${message.author.id}`)
        .setTimestamp()
        .setColor("RANDOM");

      if (message.attachments.first()) suggestion.setThumbnail(message.attachments.first().url);

      canal.send(txt || `${message.author} por favor siga o modelo de sugestão\n\`\`\`\n**Sugestão**: <descreva sua sugestão>\n\n**Motivo**: <motivos do por que sua sugestão deve ser aceita>\`\`\`\`\`\`\n**Emoji**: <nome do emoji> <imagem em anexo>\n\`\`\``, suggestion);
    }

    /**
     * @type {Object.<string,string>}
     */
    let result;
    try {
      result = parser.feed(message.content).results.sort((a,b) => Object.keys(b).length - Object.keys(a).length);
    	console.log(result)
      if (!result.length) return reject();
    } catch (e) { return reject(); }


    result = result[0];

    let titles = Object.keys(result).map(v => v.toLowerCase());


    if (titles.includes("sugestão")) {
      
      console.log(result)

      if (titles.includes("motivo1")) {

        return reject(`${message.author} se você deseja adicionar mais de um motivo, é recomendado se utilziar \`-\` ao invez de \`:\`.\`\`\`**sugestão**: <sua sugestão>\n**motivo**: \n1 - <motivo numero 1>\n\n2 - <motivo numero 2>\`\`\``);
      
      } else if (!titles.includes("motivo")) {

        return reject(`${message.author} sua sugestão precisa de um motivo, a staff precisa saber o seu motivo para adicionar a sugestão\`\`\`**sugestão**: <sua sugestão>\n**motivo**: <seu motivo>\`\`\``);
      
      }

    } else if (titles.includes("emoji")) {
      
      if(!message.attachments.size) return reject(`${message.author} é preciso via anexo uma imagem quando enviar uma sugestão de emoji.`);

      if(!/^[\w_]{2,}$/i.test(result.emoji)) return reject(`${message.author} o nome do seu emoji precisa ter pelo menos 2 letras e ser formado por caracteres alfanuméricos (letras e numeros) sem acento ou por \`_\` (underline)\`\`\`emoji: bom_dia\`\`\`.`);

    }

    await message.react('❌');
    await message.react('✅');

  } catch (err) {
    let IDs = {
      server: message.guild.id,
      user: message.author.id,
      msg: message.id
    }
    console.log(`=> ${ newError(err, "ClientMessage_ReactSugestao", IDs) }`);
  }
}