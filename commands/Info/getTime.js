const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    run: async (client, botUtils, message, args) => {

        newError = botUtils.newError;
        isDir = botUtils.isDir;

        try {

            const d = new Date()
            return message.reply(`Atualmente faz \`${d.getTime()}\`ms desde 1970`)

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
            console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
        }
    },

    config: {
        name: "gettime",
        noalias: "Sem sinonimos",
        aliases: [],
        description: "Pega o tempo",
        usage: "gettime",
        accessableby: "Membro"
    }
}