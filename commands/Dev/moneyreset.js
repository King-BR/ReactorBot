const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    run: async (client, botUtils, message, args) => {
        if(!botUtils.isDev(message.author.id)) return message.channel.send("Voce não tem permissão para executar esse comando")

        newError = botUtils.newError;

        try {

            const user = message.mentions.users.first()

            botUtils.jsonChange('./dataBank/balance.json', balance => {
                const id = user ? user.id : message.author.id;
                delete balance[id];
                message.channel.send(`O valor de ${user ? user.username : message.author.username} foi resetado.`);
                return balance
            });

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
            console.log(`=> ${newError(err, "moneyreset", IDs)}`);
        }
    },

    config: {
        name: "moneyreset",
        noalias: "Sem sinonimos",
        aliases: [],
        description: "Retira todo o dinheiro de tal membro",
        usage: "moneyreset [Membro]",
        accessableby: "Desenvolvedores"
    }
}