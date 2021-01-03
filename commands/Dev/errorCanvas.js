const Discord = require("discord.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {
    /**
     * Placeholder para o modulo canvas
     * 
     * NÂO APAGAR
     */
    return;
  },

  config: {
    name: "errorcanvas",
    aliases: ["errc", "ec"],
    description: "Cheque os erros salvos pelo handler de erros",
    usage: "error",
    accessableby: "Desenvolvedores"
  }
}