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
    console.log("Erro:\n");
    console.error(error);
    return process.exit(1);
  }

  // Caso tenha sucesso ao conectar informa no console
  console.log("\nConectado ao banco de dados\n");
  return;
});

//#region Schemas
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

// Cria o schema dos recursos do MindustryRP
var MindustryRP_resources = new Schema({
  _id: String,
  copper: { type: Number, default: 0 },
  lead: { type: Number, default: 0 },
  plastanium: { type: Number, default: 0 },
  phase_fabric: { type: Number, default: 0 },
  surge_alloy: { type: Number, default: 0 },
  spore_pod: { type: Number, default: 0 },
  blast_compound: { type: Number, default: 0 },
  pyratite: { type: Number, default: 0 },
  metaglass: { type: Number, default: 0 },
  graphite: { type: Number, default: 0 },
  sand: { type: Number, default: 0 },
  coal: { type: Number, default: 0 },
  titanium: { type: Number, default: 0 },
  thorium: { type: Number, default: 0 },
  scrap: { type: Number, default: 0 },
  silicon: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  slag: { type: Number, default: 0 },
  oil: { type: Number, default: 0 },
  cryofluid: { type: Number, default: 0 }
});

// Cria o schema de construções do MindustryRP
var MindustryRP_buildings = new Schema({
  _id: String,
  blast_mixer: { type: Number, default: 0 },
  melter: { type: Number, default: 0 },
  separator: { type: Number, default: 0 },
  disassembler: { type: Number, default: 0 },
  spore_press: { type: Number, default: 0 },
  pulverizer: { type: Number, default: 0 },
  coal_centrifuge: { type: Number, default: 0 },
  incinerator: { type: Number, default: 0 },
  copper_wall: { type: Number, default: 0 },
  large_copper_wall: { type: Number, default: 0 },
  titanium_wall: { type: Number, default: 0 },
  large_titanium_wall: { type: Number, default: 0 },
  plastanium_wall: { type: Number, default: 0 },
  large_plastanium_wall: { type: Number, default: 0 },
  thorium_wall: { type: Number, default: 0 },
  large_thorium_wall: { type: Number, default: 0 },
  phase_wall: { type: Number, default: 0 },
  large_phase_wall: { type: Number, default: 0 },
  surge_wall: { type: Number, default: 0 },
  large_surge_wall: { type: Number, default: 0 },
  door: { type: Number, default: 0 },
  large_door: { type: Number, default: 0 },
  scrap_wall: { type: Number, default: 0 },
  large_scrap_wall: { type: Number, default: 0 },
  huge_scrap_wall: { type: Number, default: 0 },
  gigantic_scrap_wall: { type: Number, default: 0 },
  mender: { type: Number, default: 0 },
  mend_projector: { type: Number, default: 0 },
  overdrive_projector: { type: Number, default: 0 },
  overdrive_dome: { type: Number, default: 0 },
  force_projector: { type: Number, default: 0 },
  shock_mine: { type: Number, default: 0 },
  conveyor: { type: Number, default: 0 },
  titanium_conveyor: { type: Number, default: 0 },
  plastanium_conveyor: { type: Number, default: 0 },
  armored_conveyor: { type: Number, default: 0 },
  junction: { type: Number, default: 0 },
  bridge_conveyor: { type: Number, default: 0 },
  phase_conveyor: { type: Number, default: 0 },
  sorter: { type: Number, default: 0 },
  inverted_sorter: { type: Number, default: 0 },
  router: { type: Number, default: 0 },
  distributor: { type: Number, default: 0 },
  overflow_gate: { type: Number, default: 0 },
  underflow_gate: { type: Number, default: 0 },
  mass_driver: { type: Number, default: 0 },
  payload_conveyor: { type: Number, default: 0 },
  payload_router: { type: Number, default: 0 },
  mechanical_pump: { type: Number, default: 0 },
  rotary_pump: { type: Number, default: 0 },
  thermal_pump: { type: Number, default: 0 },
  conduit: { type: Number, default: 0 },
  pulse_conduit: { type: Number, default: 0 },
  plated_conduit: { type: Number, default: 0 },
  liquid_router: { type: Number, default: 0 },
  liquid_tank: { type: Number, default: 0 },
  liquid_junction: { type: Number, default: 0 },
  bridge_conduit: { type: Number, default: 0 },
  phase_conduit: { type: Number, default: 0 },
  power_node: { type: Number, default: 0 },
  large_power_node: { type: Number, default: 0 },
  surge_tower: { type: Number, default: 0 },
  battery_diode: { type: Number, default: 0 },
  battery: { type: Number, default: 0 },
  large_battery: { type: Number, default: 0 },
  combustion_generator: { type: Number, default: 0 },
  thermal_generator: { type: Number, default: 0 },
  steam_generator: { type: Number, default: 0 },
  differential_generator: { type: Number, default: 0 },
  rtg_generator: { type: Number, default: 0 },
  solar_panel: { type: Number, default: 0 },
  large_solar_panel: { type: Number, default: 0 },
  thorium_reactor: { type: Number, default: 0 },
  impact_reactor: { type: Number, default: 0 },
  mechanical_drill: { type: Number, default: 0 },
  pneumatic_drill: { type: Number, default: 0 },
  laser_drill: { type: Number, default: 0 },
  airblast_drill: { type: Number, default: 0 },
  water_extractor: { type: Number, default: 0 },
  cultivator: { type: Number, default: 0 },
  oil_extractor: { type: Number, default: 0 },
  vault: { type: Number, default: 0 },
  conteiner: { type: Number, default: 0 },
  unloader: { type: Number, default: 0 },
  duo: { type: Number, default: 0 },
  scatter: { type: Number, default: 0 },
  scorch: { type: Number, default: 0 },
  hail: { type: Number, default: 0 },
  wave: { type: Number, default: 0 },
  lancer: { type: Number, default: 0 },
  arc: { type: Number, default: 0 },
  parallax: { type: Number, default: 0 },
  swarmer: { type: Number, default: 0 },
  salvo: { type: Number, default: 0 },
  segment: { type: Number, default: 0 },
  tsunami: { type: Number, default: 0 },
  fuse: { type: Number, default: 0 },
  ripple: { type: Number, default: 0 },
  cyclone: { type: Number, default: 0 },
  foreshadow: { type: Number, default: 0 },
  spectre: { type: Number, default: 0 },
  meltdown: { type: Number, default: 0 },
  command_center: { type: Number, default: 0 },
  ground_factory: { type: Number, default: 0 },
  air_factory: { type: Number, default: 0 },
  naval_factory: { type: Number, default: 0 },
  additive_reconstructor: { type: Number, default: 0 },
  multiplicative_reconstructor: { type: Number, default: 0 },
  exponential_reconstrutctor: { type: Number, default: 0 },
  tetrative_reconstructor: { type: Number, default: 0 },
  repair_point: { type: Number, default: 0 },
  resupply_point: { type: Number, default: 0 },
  illuminator: { type: Number, default: 0 },
  launch_pad: { type: Number, default: 0 },
  large_launch_pad: { type: Number, default: 0 },
  message: { type: Number, default: 0 },
  switch: { type: Number, default: 0 },
  micro_processor: { type: Number, default: 0 },
  logic_processor: { type: Number, default: 0 },
  hyper_processor: { type: Number, default: 0 },
  memory_cell: { type: Number, default: 0 },
  memory_bank: { type: Number, default: 0 },
  logic_display: { type: Number, default: 0 },
  large_logic_display: { type: Number, default: 0 },
  graphite_press: { type: Number, default: 0 },
  multi_press: { type: Number, default: 0 },
  silicon_smelter: { type: Number, default: 0 },
  silicon_crucible: { type: Number, default: 0 },
  kiln: { type: Number, default: 0 },
  plastanium_compressor: { type: Number, default: 0 },
  phase_weaver: { type: Number, default: 0 },
  allow_smelter: { type: Number, default: 0 },
  cryofluid_mixer: { type: Number, default: 0 },
  pyratite_mixer: { type: Number, default: 0 }
});

// Cria o schema de unidades do MindustryRP
var MindustryRP_units = new Schema({
  _id: String,
  dagger: { type: Number, default: 0 },
  mace: { type: Number, default: 0 },
  crawler: { type: Number, default: 0 },
  atrax: { type: Number, default: 0 },
  spiroct: { type: Number, default: 0 },
  arkyid: { type: Number, default: 0 },
  toxopid: { type: Number, default: 0 },
  flare: { type: Number, default: 0 },
  horizon: { type: Number, default: 0 },
  zenith: { type: Number, default: 0 },
  antumbra: { type: Number, default: 0 },
  eclipse: { type: Number, default: 0 },
  fortress: { type: Number, default: 0 },
  mono: { type: Number, default: 0 },
  poly: { type: Number, default: 0 },
  mega: { type: Number, default: 0 },
  quad: { type: Number, default: 0 },
  oct: { type: Number, default: 0 },
  risso: { type: Number, default: 0 },
  minke: { type: Number, default: 0 },
  bryde: { type: Number, default: 0 },
  sei: { type: Number, default: 0 },
  omura: { type: Number, default: 0 },
  scepter: { type: Number, default: 0 },
  reign: { type: Number, default: 0 },
  nova: { type: Number, default: 0 },
  pulsar: { type: Number, default: 0 },
  quasar: { type: Number, default: 0 },
  vela: { type: Number, default: 0 },
  corvus: { type: Number, default: 0 }
});

// Cria o schema de usuarios
var User = new Schema({
  _id: String,
  mindustryRP: {
    resources: {
      type: MindustryRP_resources,
      default: () => ({})
    },
    units: {
      type: MindustryRP_units,
      default: () => ({})
    }
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
  },
  resources: {
    type: MindustryRP_resources,
    default: () => ({})
  },
  units: {
    type: MindustryRP_units,
    default: () => ({})
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
  resources: {
    type: MindustryRP_resources,
    default: () => ({})
  },
  buildings: {
    type: MindustryRP_buildings,
    default: () => ({})
  },
  units: {
    type: MindustryRP_units,
    default: () => ({})
  }
});
//#endregion


//#region Models
// Cria os models na database
var Users = mongoose.model('Users', User);
var Clans = mongoose.model('Clans', Clan);
var Bases = mongoose.model('Bases', Base);
//#endregion


//#region Exports
// Exporta os models para uso nos codigos
module.exports = {
  Users: Users,
  Clans: Clans,
  Bases: Bases,
  WarnSchema: Warn,
  UserSchema: User,
  ClanSchema: Clan,
  BaseSchema: Base,
}
//#endregion