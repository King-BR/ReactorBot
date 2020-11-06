const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
  run: async (client, botUtils, message, args) => {

    if(message.author.id == "318399612060696576") message.channel.send("se crashar tu leva ban");
    
    newError = botUtils.newError;
    isDir = botUtils.isDir;

    try {
      
      let t1 = (args[0] || 'cama').split('');
      let t2 = (args[1] || 'caixa').split('');
      let start = new Date().getTime()

      t1 = t1.map(t => t.toString().trim())
      t2 = t2.map(t => t.toString().trim())

      let matriz = []
      
      //criando a matriz
      for (let x = 0;x<=t1.length;x++){
        matriz[x] = []
        for (let y = 0;y<=t2.length;y++){
          matriz[x][y] = '??'
        }
      }

      //colocando os numeros
      matriz[0][0] = '0m' 
      t1.forEach((t,i) => {matriz[i+1][0] = i+1+'m'})
      t2.forEach((t,i) => {matriz[0][i+1] = i+1+'m'})

      let equal = true;

      //calculando
      for (let x = 1;x<=t1.length;x++){
        for (let y = 1;y<=t2.length;y++){
          let score = t1[x-1] == t2[y-1] ? 0 : 1

          let numbers = [
            parseInt(matriz[x-1][y])+1,
            parseInt(matriz[x][y-1])+1,
            parseInt(matriz[x-1][y-1])+score
          ]
          let min = Math.min.apply(null,numbers)

          matriz[x][y] = min + (['d','i',t1[x-1]==t2[y-1] ? 'm' : 's'])[numbers.findIndex(n => n==min)]

        }
      }
      
      //message.channel.send("```\n"+matriz.join('\n')+"```")
      //calculando resultado
      let changes = []
      let x = t1.length-1
      let y = t2.length-1
      let cont;
      do {
        
        cont = x+y > 0

        switch(matriz[x+1][y+1].slice(-1)){
          case 'd':
            changes.push([y+1+'-',t1[x]]);
            x--;
            break;
          case 'i':
            changes.push([y+1+'+',t2[y]]);
            y--;
            break;
          case 's':
            changes.push([y+1+'+',t2[y]]);
            changes.push([y+1+'-',t1[x]]);
          case 'm':
            x--;
            y--;
            break;
        }
      } while (cont)

      message.channel.send(changes.reverse().join('\n'))
      message.channel.send(start-start.getTime())
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
      console.log(`=> ${newError(err, "poly", IDs)}`);
    }
  },

  config: {
    name: "diff",
    aliases: [],
    description: "Pega a diferença entre 2 arrays",
    usage: "diff <arr1> / <arr2>",
    accessableby: "Membro"
  }

}