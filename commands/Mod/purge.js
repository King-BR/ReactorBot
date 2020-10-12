const Discord = require("discord.js");

module.exports = {
    // Execução do comando
    run: (client, botUtils, message, args) => {
        newError = botUtils.newError;
        try {
            // Codigo do comando
            if(!message.member.hasPermission("MANAGE_MESSAGES", "ADMINISTRATOR")) return message.channel.send("Você não tem permissão para isso");
            if(typeof parseInt(args[0]) != "number") return message.channel.send("Quantidade invalida");

		    message.channel.bulkDelete(parseInt(args[0]) + 1)
                .then(messages => message.channel.send(`Foram deletadas ${messages.size - 1} mensagens.`));

        } catch(err) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Erro inesperado")
                .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
            message.channel.send(embed)
            console.log(`=> ${newError(err, this.config.name, message.guild.id)}`);
        }
    },

    // Configuração do comando
    config: {
        name: "purge",
        noalias: "Sem sinonimos",
        aliases: [],
        description: "Apage mensagens do canal",
        usage: "purge <quantidade>",
        accessableby: "STAFF"
    }
}