const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    run: async (client, botUtils, message, args) => {

        try {

            let str = ''

            botUtils.jsonChange('./dataBank/balance.json', balance => {
                let ord = [];
                for (var userid in balance) {
                    ord.push([client.users.cache.get(userid).username, balance[userid]]);
                }
                
                ord.sort((a,b) => {
                    return b[1]-a[1];
                });

                for(let i = 0; i<Math.min(ord.length,10);i++){
                    str += `**${ord[i][0]}**: ${ord[i][1]}\$\n`;
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
            console.log(`=> ${newError(err, "error", IDs)}`);
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