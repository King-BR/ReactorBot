const Discord = require("discord.js");
const { Clans } = require("../../database.js");
const isImageUrl = require("is-image-url");
const { prefix } = require("../../config.json");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      Clans.find({}, (errDBclans, clans) => {
        if (errDBclans) {
          let embed = new Discord.MessageEmbed()
            .setTitle("Erro inesperado")
            .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
          message.channel.send(embed);

          let IDs = {
            server: message.guild.id,
            user: message.author.id,
            msg: message.id
          }
          console.log(`=> ${newError(errDBclans, module.exports.config.name, IDs)}`);
          return;
        }

        if (!clans || clans.length == 0) return message.channel.send("Você precisa ser fundador de um clã para poder usar esse comando");

        try {
          let c = clans.filter(c => {
            return c.founders.includes(message.author.id);
          });

          if (!c[0]) return message.channel.send("Você precisa ser fundador de um clã para poder usar esse comando");

          Clans.findById(c[0]._id, (errDBclan, clan) => {
            if (errDBclan) {
              let embed = new Discord.MessageEmbed()
                .setTitle("Erro inesperado")
                .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
              message.channel.send(embed);

              let IDs = {
                server: message.guild.id,
                user: message.author.id,
                msg: message.id
              }
              console.log(`=> ${newError(errDBclan, module.exports.config.name, IDs)}`);
              return;
            }

            if (!clan) return message.channel.send("Você precisa ser fundador de um clã para poder usar esse comando");

            try {
              switch (args[0].toLowerCase()) {
                case "name":
                case "nome": {
                  if (!args[1]) return message.channel.send("Esqueceu o novo nome");

                  let oldName = clan.name;
                  let name = args.slice(1).join(" ");
                  clan.name = name;
                  clan.save();

                  let embed = new Discord.MessageEmbed()
                    .setTitle("O nome do clã foi atualizado")
                    .addField("Novo nome", clan.name, true)
                    .addField("Antigo nome", oldName, true)
                    .setTimestamp()
                    .setColor("RANDOM");
                  message.channel.send(embed);
                  break;
                }
                case "descricao":
                case "descrição":
                case "desc": {
                  if (!args[1]) return message.channel.send("Esqueceu a nova descrição");

                  let oldDesc = clan.desc;
                  let desc = args.slice(1).join(" ");
                  clan.desc = desc;
                  clan.save();

                  let embed = new Discord.MessageEmbed()
                    .setTitle("A descrição do clã foi atualizado")
                    .addField("Nova descrição", clan.desc)
                    .addField("Antiga descrição", oldDesc)
                    .setTimestamp()
                    .setColor("RANDOM");
                  message.channel.send(embed);
                  break;
                }
                case "ft":
                case "foto":
                case "image":
                case "imagem":
                case "img": {
                  if (!args[1] && !message.attachments.first()) return message.channel.send("Esqueceu a nova foto");

                  let novaFoto;
                  if (message.attachments.first() && isImageUrl(message.attachments.first().url)) {
                    novaFoto = message.attachments.first().url;
                  } else if (isImageUrl(args[1])) {
                    novaFoto = args[1];
                  } else return message.channel.send("Imagem invalida");

                  clan.image = novaFoto;
                  clan.save();

                  let embed = new Discord.MessageEmbed()
                    .setTitle("A foto do clã foi atualizado")
                    .setThumbnail(novaFoto)
                    .setTimestamp()
                    .setColor("RANDOM");
                  message.channel.send(embed);
                  break;
                }
                case "role":
                case "cargo": {
                  switch (args[1].toLowerCase()) {
                    case "color":
                    case "cor": {
                      break;
                    }
                    case "name":
                    case "nome": {
                      break;
                    }
                    default: {
                      let embedRole = new Discord.MessageEmbed()
                        .setTitle("Configurações do cargo do clã");

                      if (clan.role && clan.role.length > 0 && message.guild.roles.fetch(clan.role)) {
                        let clanRole = message.guild.roles.cache.get(clan.role);

                        embedRole.setDescription(`Menção: ${clanRole}`)
                          .addField("Nome", `${clanRole.name}\n\nPara mudar use \`${prefix}${modules.exports.config.name} role name <novo nome>\``, true)
                          .addField("Cor", `hex: ${clanRole.hexColor}\nbase10: ${clanRole.color}\n\nPara mudar use \`${prefix}${modules.exports.config.name} role color <nova cor>\``);
                      } else {
                        embedRole.setDescription(`O seu clã não possui um cargo ainda!\n\nPara comprar use o comandos \`${prefix}clanshop buy role\``)
                      }

                      message.channel.send(embedRole);
                      break;
                    }
                  }
                  break;
                }
                default: {
                  let embedConfig = new Discord.MessageEmbed()
                    .setTitle("Configurações do clã")
                    .addField("Nome", `${clan.name}\n\nPara mudar use \`${prefix}${module.exports.config.name} nome <Novo nome do clã>\``, true)
                    .addField("Foto", `${clan.image ? "Imagem ao lado =>\n\n" : ""}Para mudar use \`${prefix}${module.exports.config.name} img <link da imagem ou imagem em anexo>\``, true)
                    .addField("Descrição", `${clan.desc ? clan.desc : "Sem descrição"}\n\nPara mudar use \`${prefix}${module.exports.config.name} desc <Nova descrição do clã>\``);

                  if (clan.image && isImageUrl(clan.image)) {
                    embedConfig.setThumbnail(clan.image);
                  }

                  message.channel.send(embedConfig);
                  break;
                }
              }
            } catch (err2) {
              let embed = new Discord.MessageEmbed()
                .setTitle("Erro inesperado")
                .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
              message.channel.send(embed);

              let IDs = {
                server: message.guild.id,
                user: message.author.id,
                msg: message.id
              }
              console.log(`=> ${newError(err2, module.exports.config.name, IDs)}`);
            }
          });
        } catch (err1) {
          let embed = new Discord.MessageEmbed()
            .setTitle("Erro inesperado")
            .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
          message.channel.send(embed);

          let IDs = {
            server: message.guild.id,
            user: message.author.id,
            msg: message.id
          }
          console.log(`=> ${newError(err1, module.exports.config.name, IDs)}`);
        }
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
      console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
    }
  },

  // Configuração do comando
  config: {
    name: "editclan",
    aliases: ["editcla", "editclã", "ec"],
    description: "Edite as informações do clã",
    usage: "editcla <opção> <informação a ser editada>",
    accessableby: "Membros"
  }
}