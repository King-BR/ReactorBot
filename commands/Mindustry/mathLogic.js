const nearley = require("nearley");
const grammar = require("../../dataBank/grammar/ETLParser");
const botUtils = require("../../utils.js");
const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: (client, message, args, text) => {
    
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    try{
      
      /** @type {String} */
      text = text.trim();
      text = /^```.+```$/s.test(text) ? text.slice(3,-3).trim(): text;

      let a = parser.feed(text);

      console.log(a.results)
      if(!a.results.length) {
        return message.reply("acho q ocorreu um erro");
      }

      console.log(/​/g.test(a.results))

      let embed = new Discord.MessageEmbed()
        .setDescription(`\`\`\`${Array.isArray(a.results)?a.results[0] || ":P":a.results.replace(/​/g,"")}\`\`\``)

      message.channel.send(embed)

    } catch (err) {
        
        message.reply(err.toString().replace(/\n.+/s,"") || "nome desconhecido");
    }

  },

  // Configuração do comando
  config: {
    name: "mathlogic",
    aliases: ['ml',"etl","expressionToLogic"],
    description: "Transforma base64 em esquemas do mindustry",
    usage: "li [nome] [qualidade] <imagem ou link da imagem>",
    accessableby: "Membros"
  }
}