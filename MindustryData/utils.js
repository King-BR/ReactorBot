//Enums

const ConsumeType = Object.freeze({
  item: 0,
  power: 1,
  liquid: 2
})
const Layer = Object.freeze({
  //min layer
  min: -11,
  //background, which may be planets or an image or nothing at all
  background: -10,
  //floor tiles
  floor: 0,
  //scorch marks on the floor
  scorch: 10,
  //things such as spent casings or rubble
  debris: 20,
  //stuff under blocks, like connections of conveyors/conduits
  blockUnder: 29.5,
  //base block layer - most blocks go here
  block: 30,
  //things drawn over blocks (intermediate layer)
  blockOver: 35,
  //blocks currently in progress *shaders used*
  blockBuilding: 40,
  //turrets
  turret: 50,
  //ground units
  groundUnit: 60,
  //power lines
  power: 70,
  //certain multi-legged units
  legUnit: 75,
  //darkness over block clusters
  darkness: 80,
  //building plans
  plans: 85,
  //flying units (low altitude)
  flyingUnitLow: 90,
  //bullets *bloom begin*
  bullet: 100,
  //effects *bloom end*
  effect: 110,
  //flying units
  flyingUnit: 115,
  //overlaied UI, like block config guides
  overlayUI: 120,
  //build beam effects
  buildBeam: 122,
  //shield effects
  shields: 125,
  //weather effects, e.g. rain and snow TODO draw before overlay UI?
  weather: 130,
  //light rendering *shaders used*
  light: 140,
  //names of players in the game
  playerName: 150,
  //space effects, currently only the land and launch effects
  space: 160,
  //the end of all layers
  end: 200,
  //things after pixelation - used for text
  endPixeled: 210,
  //max layer
  max: 220
})
const ContentType = Object.freeze({
  item: 0,
  block: 1,
  mech_UNUSED: 2,
  bullet: 3,
  liquid: 4,
  status: 5,
  unit: 6,
  weather: 7,
  effect_UNUSED: 8,
  sector: 9,
  loadout_UNUSED: 10,
  typeid_UNUSED: 11,
  error: 12,
  planet: 13,
  ammo: 14
})
const BlockGroup = Object.freeze({
  none: 0,
  walls: 1,
  projectors: 2,
  turrets: 4,
  transportation: 5,
  power: 6,
  liquids: 7,
  drills: 8,
  units: 9,
  logic: 10
})

// Class

class Color {

  /**
   * Retorna uma cor
   * @param {*} r - Vermelho 0-1
   * @param {*} g - Verde 0-1
   * @param {*} b - Azul 0-1
   * @param {*} a - Alfa 0-1
   */
  constructor(r, g, b, a = 1) {
    this.color = [r, g, b, a].map(v => v * 255);
  }

  rgb() {
    return "#" + this.color.slice(0, 3).map(v => v.toString(16).padStart(2, "0")).join("");
  }

  rgba() {
    return "#" + this.color.map(v => v.toString(16).padStart(2, "0")).join("");
  }

  /**
   * @param {String} txt
   */
  static valueOf(txt) {
    console.log(txt.match());
    return module.exports.Color(txt)
  }

}

class Consume {

  constructor() {
    this.optional = false;
    this.booster = false;
    this.update = true;
  }

  optional(optional, boost) {
    this.optional = optional;
    this.booster = boost;
    return this;
  }

  boost() {
    optional(true, true);
  }

  update(update) {
    this.update = update;
    return this;
  }

  applyItemFilter() {

  }

  applyLiquidFilter() {

  }
}

class ConsumeItems extends Consume {

  constructor(items) {
    super();
    this.items = items;
  }

  optional(optional, boost) {
    this.optional = optional;
    this.booster = boost;
    return this;
  }

  boost() {
    optional(true, true);
  }

  applyItemFilter() { }

  update(update) {
    this.update = update;
    return this;
  }

  type() {
    return 0;
  }

}

class ConsumePower extends Consume {

  /**
   * 
   * @param {Number} usage 
   * @param {Number} capacity 
   * @param {Boolean} buffered 
   */
  constructor(usage, capacity, buffered) {
    super();
    this.usae = usage || 0;
    this.capacity = capacity || 0;
    this.buffered = buffered || false;
  }

  type() {
    return 1;
  }

}

class ConsumeLiquidBase extends Consume {

  constructor(amount) {
    super();
    this.amount = amount;
  }

  type() {
    return 2;
  }
}

class ConsumeLiquid extends ConsumeLiquidBase {

  /**
   * 
   * @param {{id: Number}} liquid 
   * @param {Number} amount 
   */
  constructor(liquid, amount) {
    super(amount);
    this.liquid = liquid;
  }

  ConsumeLiquid() {
    this(null, 0);
  }

  applyLiquidFilter(filter) {
    filter[this.liquid.id] = true
  }

}

class ConditionalConsumePower extends ConsumePower {

  /**
   * 
   * @param {Number} usage
   * @param {*} Building 
   */
  constructor(usage, consume) {
    super(usage, 0, false);
    this.consume = consume;
  }
}

class ConsumeLiquidFilter extends ConsumeLiquidBase {

  /**
   * 
   * @param {Function} liquid 
   * @param {Number} amount 
   */
  constructor(liquid, amount) {
    super(amount);
    this.filter = liquid;
  }

  applyLiquidFilter(arr) {
    content.liquids.forEach(item => arr[item.id] = this.filter(item));
  }


}

class ConsumeItemFilter extends Consume {
  constructor(item) {
    super();
    this.filter = item;
  }

  applyItemFilter(arr) {
    content.items.forEach(item => arr[item.id] = this.filter(item));
  }

  type() {
    return 0;
  }
}

class ConsumeItemDynamic extends Consume {
  constructor(items) {
    super();
    this.items = items;
  }
  applyItemFilter(filter) {

  }

  type() {
    return 0;
  }
}

class Consumers {

  constructor(liquid, amount) {
    this.map = [];
    this.results = [];
    this.optionalResults = [];

    itemFilters = [];
    liquidFilters = [];
  }

  any() {
    return this.results != null && this.results.length > 0;
  }

  /**
   * 
   * @param {Consume} c 
   */
  each(c) {
    this.map.forEach(cons => {
      if (cons != null);
      c.get(this.liquid)
    })
  }

  /**
   * 
   * @param {Consume} consume 
   */
  add(consume) {
    this.map[consume.type] = consume;
    return consume;
  }

  /**
   * 
   * @param {Number} type 
   */
  remove(type) {
    this.map[type] = null;
  }

  /**
   * 
   * @param {Number} type 
   */
  has(type) {
    return this.map(type) != null;
  }

  /**
   * 
   * @param {Number} type 
   * @returns {Consume}
   */
  get(type) {
    if (map[type] == null) {
      throw new Error("Block does not contain consumer of type '" + type + "'!");
    }
    return map[type];
  }

  getItem() { return this.get(0); }
  getPower() { return this.get(1); }
  getLiquid() { return this.get(2); }
  hasPower() { return this.has(1); }

  /**
   * 
   * @param {Liquid} liquid 
   * @param {Number} amount
   */
  liquid(liquid, amount) {
    return this.add(new ConsumeLiquid(liquid, amount));
  }

  /**
   * 
   * @param {Number} powerPerTick 
   */
  power(powerPerTick) {
    return this.add(new ConsumePower(powerPerTick, 0, false));
  }

  /**
   * 
   * @param {Number} powerPerTick 
   */
  powerCond(usage, cons) {
    return this.add(new ConditionalConsumePower(usage, cons));
  }

  /**
   * 
   * @param {Number} powerCapacity 
   */
  powerBuffered(powerCapacity) {
    return this.add(new ConsumePower(0, powerCapacity, true));
  }

  /**
   * 
   * @param {*} item 
   * @param {Number?} amount 
   */
  item(item, amount = 1) {
    return add(new ConsumeItems([item, amount]));
  }

  /**
   * 
   * @param {*...} items 
   * @returns 
   */
  items(items) {
    return add(new ConsumeItems(items));
  }
}

class TextureRegion {

  /**
   * 
   * @param {String} name 
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * 
   * @param {String} name
   * @returns {TextureRegion} 
   */
  static Load(name) {
    this.name = name;
    this.replace = true;
  }
}


module.exports = {
  Color: Color,
  Consume: Consume,
  Consumers: Consumers,
  ConsumeItems: ConsumeItems,
  ConsumeLiquidBase: ConsumeLiquidBase,
  ConsumeLiquid: ConsumeLiquid,
  ConsumeItems: ConsumeItemsFilter,
  ConsumeLiquid: ConsumeLiquidFilter,
  ConsumeItemDynamic: ConsumeItemDynamic,
  ConsumePower: ConsumePower,
  TextureRegion: TextureRegion,

  Layer: Layer,
  ContentType: ContentType
}