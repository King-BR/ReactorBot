const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    run: async (client, botUtils, message, args) => {

        try {

            let str = ''

            botUtils.jsonChange('./dataBank/balance.json', balance => {
                let ord = [];
                let itstop = false;

                // Cria a array ord com as pessoas
                for (var userid in balance) {
                    ord.push([
                      userid,
                      balance[userid]
                    ]);
                }
                
                // ordena "ord" 
                ord.sort((a,b) => {return b[1]-a[1];});

                let last = [1,ord[0][1]]

                //aparece o top 10
                for(let i = 0; i<Math.min(ord.length,10);i++){
                    let name = (client.users.cache.get(ord[i][0]).username || "Usuario desconhecido")

                    if (ord[i][0] == message.author.id) {
                      itstop = true
                      name = `*${name}*`;
                    };

                    str += `**${i+1}. ${name}**: ${ord[i][1]}\$\n`;
                }

                if (!itstop){
                  let pos = ord.findIndex( id => {return id[0] == message.author.id;});
                  let zero = ord.findIndex( id => {return id[1] == 0;});

                  if(zero == -1){};

                }
            });
            
            let emb = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor("RANDOM")
                .setTitle("Top")
                .setDescription(str)
            message.channel.send(emb);

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
            console.log(`=> ${newError(err, "top", IDs)}`);
        }
    },

    config: {
        name: "top",
        noalias: "Sem sinonimos",
        aliases: [],
        description: "Ve quem tem mais dinheiro",
        usage: "top",
        accessableby: "Membros"
    }
}