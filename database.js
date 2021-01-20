const { formatDate } = require("./utils.js");
var mongoose = require("mongoose");
Schema = mongoose.Schema;

// Tentar conectar na database
mongoose.connect(process.env.DATABASEURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}, error => {
  // Caso aconteça erro ao tentar conectar
  if (error) {
    console.log(`Erro: ${error}`);
    process.exit(1);
    return;
  }

  // Caso tenha sucesso ao conectar informa no console
  console.log("\nConectado ao banco de dados\n");
  return;
});

// Cria o schema de warns
var Warn = new Schema({
  _id: String,
  reason: {
    type: String,
    default: "Sem razão informada"
  },
  pardon: {
    pardoned: {
      type: Boolean,
      default: false
    },
    by: String
  },
  date: {
    type: String,
    default: formatDate(new Date())
  }
});

// Cria o schema do MindustryRP
var MindustryRP = new Schema({
  _id: String,
  resources: {
    copper: 0,
    lead: 0,
    plastanium: 0,
    phase_fabric: 0,
    surge_alloy: 0,
    spore_pod: 0,
    blast_compound: 0,
    pyratite: 0,
    metaglass: 0,
    graphite: 0,
    sand: 0,
    coal: 0,
    titanium: 0,
    thorium: 0,
    scrap: 0,
    silicon: 0,
    water: 0,
    slag: 0,
    oil: 0,
    cryofluid: 0
  },
  buildings: {
    blast_mixer: 0,
    melter: 0,
    separator: 0,
    disassembler: 0,
    spore_press: 0,
    pulverizer: 0,
    coal_centrifuge: 0,
    incinerator: 0,
    copper_wall: 0,
    large_copper_wall: 0,
    titanium_wall: 0,
    large_titanium_wall: 0,
    plastanium_wall: 0,
    large_plastanium_wall: 0,
    thorium_wall: 0,
    large_thorium_wall: 0,
    phase_wall: 0
  }
});

// Cria o schema de usuarios
var User = new Schema({
  _id: String,
  mindustryRP: {
    type: MindustryRP,
    default: () => ({})
  },
  money: {
    type: Number,
    default: 0
  },
  txp: {
    type: Number,
    default: 0
  },
  warn: {
    quant: {
      type: Number,
      default: 0
    },
    history: [Warn]
  }
});

// Cria o schema de clans
var Clan = new Schema({
  _id: String,
  name: {
    type: String,
    default: "Sem nome"
  },
  image: String,
  desc: {
    type: String,
    default: "Sem descrição"
  },
  level: {
    type: Number,
    default: 1
  },
  maxMembers: {
    type: Number,
    default: 10
  },
  founders: {
    type: Array,
    default: []
  },
  members: {
    type: Array,
    default: []
  },
  role: String,
  channel: {
    text: String,
    voice: String,
    category: String
  }
});

// Cria o schema de bases
var Base = new Schema({
  _id: String,
  name: String,
  level: {
    type: Number,
    default: 1
  },
  stats: {
    type: MindustryRP,
    default: () => ({})
  }
});

// Cria os models na database
var Users = mongoose.model('Users', User);
var Clans = mongoose.model('Clans', Clan);
var Bases = mongoose.model('Bases', Base);

// Exporta os models para uso nos codigos
module.exports = {
  Users: Users,
  Clans: Clans,
  Bases: Bases,
  UserSchema: User,
  WarnSchema: Warn
}