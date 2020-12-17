const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {},

  // Configuração do comando
  config: {
    name: "schematic",
    aliases: ['esquema', 'schm', 'schem'],
    description: "Transforma base64 em esquemas do mindustry",
    usage: "schem <codigo>",
    accessableby: "Membros"
  }
}