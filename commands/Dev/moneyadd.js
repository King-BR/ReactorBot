const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    run: async (client, botUtils, message, args) => {
        if(!botUtils.isDev(message.author.id)) return message.channel.send("Voce não tem permissão para executar esse comando")

        newError = botUtils.newError;

        try {

            const user = message.mentions.users.first()
            
            if(!parseInt(args[1] || args[0]))return message.reply('Não foi possivel indentificar a quantia de dinheiro a se informar');
            if (user && user.bot)return message.reply('Nem vem com essa putaria');

            botUtils.jsonChange('./dataBank/balance.json', balance => {
                const id = user ? user.id : message.author.id;
                const quant = parseInt(args[1] || args[0]);
                balance[id] = (balance[id] || 0) + quant;
                message.channel.send(`Foi adicionado: ${parseInt(args[1] || args[0])}\$, totalizando: ${balance[id]}\$.`);
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
            console.log(`=> ${newError(err, "error", IDs)}`);
        }
    },

    config: {
        name: "moneyadd",
        noalias: "Sem sinonimos",
        aliases: [],
        description: "adiciona adinheiro na conta de um jogador",
        usage: "moneyadd [Membro] <Quantia>",
        accessableby: "Desenvolvedores"
    }
}