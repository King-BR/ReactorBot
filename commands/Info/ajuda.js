const Discord = require("discord.js");
const config = require("../../config.json");
const fs = require("fs");

prefix = config.prefix;

module.exports = {
    run: (client, botUtils, message, args) => {
        newError = botUtils.newError;
        isDir = botUtils.isDir;

        try {
            if (args[0] === "ajuda") return message.channel.send(`burro da porra`);
            if (args[0]) {
                let command = args[0];
                if (client.commands.has(command) || client.commands.get(client.aliases.get(command))) {
                    command = client.commands.get(command) || client.commands.get(client.aliases.get(command));
                    let embed = new Discord.MessageEmbed()
                        .setColor("RANDOM")
                        .setDescription(`O meu prefixo é: ${prefix}\n
                            **Comando:** ${command.config.name}\n
                            **Descrição:** ${command.config.description || "Sem descrição"}\n
                            **Uso:** ${command.config.usage || "Sem uso definido"}\n
                            parametros entre <> são obrigatorios
                            parametros entre [] são opcionais\n
                            **Acessivel para:** ${command.config.accessableby || "todo mundo"}\n
                            **Sinonimos:** ${command.config.noalias || command.config.aliases.join(", ")}`)
                        .setFooter(`Requisitado por: ${message.author.username}`);
                    message.channel.send(embed);
                }
                return;
            }

            if (!args[0]) {
                let embedHelp = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setTitle("Lista de comandos")
                    .setDescription("Use " + prefix + "ajuda [nome do comando] para ver mais informações do comando")
                    .setFooter(`Requisitado por: ${message.author.tag}`, message.author.displayAvatarURL);
                let commandsFolder = fs.readdirSync("commands");

                commandsFolder.forEach(folder => {
                    if (folder === "teste") return console.log("Achou a paste de teste");
                    if (folder === 'ZZZdev' && (message.author.id !== "291693225411084289" && message.author.id !== "375462796697010176")) return;
                    var all = fs.readdirSync(`commands/${folder}`);
                    var files = all.filter(f => {
                        let dirCheck = isDir(`commands/${folder}/${f}`);
                        return f.split(".").slice(-1)[0] === "js" && !dirCheck;
                    });
                    let string = files.map(f => {
                        let pull = require(`../../commands/${folder}/${f}`);
                        return pull.config.name;
                    }).join(", ");
                    let folderName = folder.replace('ZZZ', '');
                    embedHelp.addField(`**${folderName}**`, `\`${string}\``);
                });
                message.channel.send(embedHelp);
            }
        } catch (err) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Erro inesperado")
                .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
            message.channel.send(embed)
            console.log(`=> ${newError(err, "ajuda", message.guild.id)}`);
        }
    },
    config: {
        name: "ajuda",
        noalias: "Sem sinonimos",
        aliases: [],
        description: "lista de comandos",
        usage: "ajuda [nome do comando]",
        accessableby: "Membros"
    }
}