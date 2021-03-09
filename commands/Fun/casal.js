const Discord = require("discord.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando

  /**
   * @param {Discord.Client} client
   * @param {Discord.Message} message
   * @param {String[]} args
   */
  run: (client, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      const mask = 0xffffffff;


      const memberlist = args.map(v => botUtils.stringToUser(message.guild,v))
        .map(v => v && v.tag || v)
        
        
        //.map(v => (parseInt(v.slice(5)) % 0xffff) / 0xffff)
      
      console.log(memberlist)
      return;

      let result = 1;
      let m_w = 123456789;
      let m_z = 987654321;

      function seed(i) {
        m_w = (123456789 + i) & mask;
        m_z = (987654321 - i) & mask;
      }

      function random() {
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
        var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
        result /= 4294967296;
        return result;
      }
      memberlist.forEach(v => {
        seed(0xffff * (result * v) ** 3);
        random(), random(), random();
        result = random();
      })

      result = ~~(result * 1000) / 10

      message.channel.send(`O nivel de amor deu ${result}%`)

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
      console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
    }
  },

  // Configuração do comando
  config: {
    name: "casal",
    aliases: ["amor"],
    description: "Ver o nivel de paixão de um casal",
    usage: "!casal <@membro1> <!membro2>",
    accessableby: "acessibilidade"
  }
}