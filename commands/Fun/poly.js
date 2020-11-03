const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
  run: async (client, botUtils, message, args) => {

    if(message.author.id == "318399612060696576") message.channel.send("se crashar tu leva ban");
    
    newError = botUtils.newError;
    isDir = botUtils.isDir;

    try {

      const val = [];

      const pstr = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
      if (args.some((numb) => { return isNaN(numb) })) return message.reply("todos precisam ser numeros");
      args.forEach(v => {val.push(-parseInt(v));});
      if (val.length > 16) return message.reply('Quer crashar o bot krl?');
      let trys = 0;
      const f = function(t, arr, p = 1, m = 1) {
        if (t == 0) return [1];
        let ar = []
        for (let i = m; i <= arr.length-t+1; i++) {
          trys++;
          if (t == 1) {
            ar.push(arr[i - 1])
          } else {
            let a = f(t-1, arr, p + 1, m + 1);
            a.forEach((ele) => {ar.push(arr[i - 1] * ele)});
            m++;
          }
        }
        return ar
      }
      let res = '';
      for (let t = 0; t <= val.length; t++) {
        let a = f(t, val);
        let numb = 0;
        a.forEach((element) => {
          numb += element
        });
        if (numb !== 0) {
          let pot = val.length - t;
          let strpot = '';
          power = pot.toString().split('').forEach((element)=>{strpot += pstr[parseInt(element)];});
          res += numb > 0 ? ' + ' : ' - ';
          res += (Math.abs(numb) == 1 && pot > 0) ? '' : Math.abs(numb);
          res += pot > 0 ? 'x' : '';
          res += pot > 1 ? strpot : '';
        }
      }
      res = res.slice(2)

      message.channel.send(trys)
      message.channel.send(res)

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
    name: "poly",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Pega um polinomio",
    usage: "poly [n1] [n2] [n3] ...",
    accessableby: "Membro"
  }
}