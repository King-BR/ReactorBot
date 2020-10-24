const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    run: async (client, botUtils, message, args) => {

        try {

            const user = args[0] ? message.mentions.users.first() : message.author;
            const nick = args[0] ? `O ${user.username}` : "Você";
            const bal = botUtils.jsonPull('./dataBank/balance.json')

            let emb = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor("RANDOM")
                .setTitle("Bufunfa")
                .setDescription(`${nick} possui: ${bal[user.id] || 0}\$`)
                .setThumbnail(user.displayAvatarURL({dynamic: true, format: "png", size: 1024}));
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
            console.log(`=> ${newError(err, "balance", IDs)}`);
        }
    },

    config: {
        name: "balance",
        noalias: "Money, Dinheiro, Carteira",
        aliases: ['money','dinheiro','carteira','bufunfa','b'],
        description: "Ve quanto dinheiro você possui",
        usage: "balance",
        accessableby: "Membros"
    }
}