module.exports = {
  // Execução do comando
  run: (client, message, args) => {},

  // Configuração do comando
  config: {
    name: "logicimage",
    aliases: ['li'],
    description: "Transforma base64 em esquemas do mindustry",
    usage: "li [nome] [qualidade] <imagem ou link da imagem>",
    accessableby: "Membros"
  }
}