const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    run: async (client, botUtils, message, args) => {

        try {

            let bal = botUtils.jsonPull('./dataBank/balance.json')
            const user = message.mentions.members.first();
            
            if (message.author == client.users.cache.get("657752992153337876")) return message.reply('sai fora Rodrigo');
            if(!user)return message.reply('Precisa informar o usuario a se enviar o dinheiro');
            if(!parseInt(args[1]))return message.reply('Não foi possivel indentificar a quantia de dinheiro a se informar');
            if (user.user.bot)return message.reply('Nem vem com essa putaria');
            if ((bal[message.author.id] || 0) < parseInt(args[1]))return message.reply('Você não possui dinheiro o suficiente');
            if (parseInt(args[1]) < 0)return message.reply('Você não pode roubar dinheiro');
            if (user.id == message.author)return message.reply('Você não pode se dar dinheiro');

            bal[message.author.id] = (bal[message.author.id] || 0) - parseInt(args[1]);
            bal[user.id] = (bal[user.id] || 0) + parseInt(args[1]);

            botUtils.jsonPush('./dataBank/balance.json',bal);

            message.reply('seu dinheiro foi enviado');

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
        name: "give",
        noalias: "sem sinonimos",
        aliases: [],
        description: "Da seu dinheiro para outro jogador",
        usage: "give <Memnro> <Quantia>",
        accessableby: "Membros"
    }
}