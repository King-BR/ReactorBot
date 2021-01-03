const Discord = require("discord.js");
const botUtils = require("../../utils.js");
const fs = require("fs")

module.exports = {
  run: async (client, message, args) => {
    newError = botUtils.newError;

    try {

      if (!args[0]) return message.reply("é necessario enviar um codigo de esquema")
      let schema = botUtils.mndGetScheme(args[0]);

      //#region detect errors

      if (!isNaN(schema)) {
        if (schema == 1) return message.reply("Isso não é um codigo de esquema");
        if (schema == 2) return message.reply("Esse codigo é muito antigo");
        if (schema >= 3) return message.reply("O codigo esta corrompido, teste no jogo para ver funciona, caso funcione no jogo fale com algum adm (" + schema + ")");
      }

      if (!schema.names.includes("item-source") || !schema.names.includes("item-void")) return message.reply("Sua schematica precisa de no mínimo um `item-source` e um `item-void`")

      //#endregion

      //#region criando memoria
      const atlas = JSON.parse(fs.readFileSync('./images/blocks.atlas'));
      schema.memory = []
      for (let x = 0; x < schema.width; x++) {
        schema.memory[x] = [];
        for (let y = 0; y < schema.height; y++) {
          schema.memory[x][y] = -1;
        }
      }
      if (schema.blocks.some((block, id) => {
        let a = atlas[schema.names[block.type]]
        let size = a ? a[0] : 1;

        for (let x = -Math.floor((size - 1) / 2); x <= Math.floor(size / 2); x++) {
          for (let y = -Math.floor((size - 1) / 2); y <= Math.floor(size / 2); y++) {
            x = block.position[0] + x;
            y = block.position[1] + y;

            if (x < 0 || x > schema.width - 1 || y < 0 || y > schema.height - 1) return true;
            if (schema.memory[x][y] >= 0) return true;

            schema.memory[x][y] = id;

          }
        }
        return false;
      })) return message.reply("Não posso calcular uma schematic _CURSED_")
      //#endregion

      //criando funções
      const getSides = (size, x, y) => {
        let sides = []
        for (let i = - Math.floor(size / 2 - 0.5); i <= Math.floor(size / 2); i++) {
          let lx, ly;

          lx = x + i;
          ly = y - Math.ceil(size / 2);
          if (lx >= 0 && ly >= 0 && lx < schema.width && ly < schema.height)
            sides.push([lx, ly,0]);

          lx = x + i;
          ly = y + Math.ceil(size / 2 + 0.5);
          if (lx >= 0 && ly >= 0 && lx < schema.width && ly < schema.height)
            sides.push([lx, ly,1]);

          lx = x - Math.ceil(size / 2);
          ly = y + i;
          if (lx >= 0 && ly >= 0 && lx < schema.width && ly < schema.height)
            sides.push([lx, ly,2]);

          lx = x + Math.ceil(size / 2 + 0.5);
          ly = y + i;
          if (lx >= 0 && ly >= 0 && lx < schema.width && ly < schema.height)
            sides.push([lx, ly,3]);

        }
        return sides.map(v => [schema.memory[v[0]][v[1]],v[2]]).filter(v => v[0] >= 0);
      }

      const Couts = JSON.parse(fs.readFileSync('./dataBank/mindustryBlocks.json'));
      const Cdir = ["conveyor"]

      let nodes = []
      let connections = []

      schema.blocks.forEach((v, i) => {
        let name = schema.names[v.type]
        console.log
        if (Couts.items.includes(name)) {
          getSides(atlas[name][0] || 1, v.position[0], v.position[1]).forEach((a) => {
            connections.push([i, a[0], 0, -1])
          })
          nodes.push([i])
        } else if (Cdir.includes(name)) {
          let x = v.position[0] + Math.round(Math.cos(v.rotation*Math.PI/2))
          let y = v.position[1] + Math.round(Math.sin(v.rotation*Math.PI/2))
          let res = schema.memory[x][y]
          if(res >= 0 )connections.push([i, res, 0, -1])
          nodes.push([i])
        }
      })

      console.log(connections)
      console.log(nodes)

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
    name: "infoschem",
    aliases: ['ischem'],
    description: "Pega informações do schema",
    usage: "!infoschem <codigo>",
    accessableby: "Membros"
  }
}