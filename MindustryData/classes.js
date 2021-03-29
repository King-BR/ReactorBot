const { Color, Consumers, TextureRegion, Layer } = require("./utils");

class UnlockableContent {

  constructor (name) {

    this.mod;
    this.name = name
    this.unlocked = false;

  }

  getName(){
    return this.mod === null ? this.name : `${this.mod}-${this.name}`;
  }
}

class Item extends UnlockableContent {

    /**
     * @param {String} name  
     * @param {Color} color 
     */
    constructor(name, color) {
        super(name);
        this.color = color;
        this.explosiveness = 0;
        this.flammability = 0;
        this.radioactivit = 0;
        this.charge = 0;
        this.hardness = 0;
        this.cost = 1;
        this.lowPriority = false;
    }

}

class Block extends UnlockableContent {

    /**
     * @param {String} name 
     */
    constructor(name) {

        super(name)

        this.hasItems = false;
        this.hasLiquids = false;
        this.hasPower = false;

        this.outputsLiquid = false;
        this.consumesPower = true;
        this.outputsPower = false;
        this.outputsPayload = false;
        this.outputFacing = true;
        this.acceptsItems = false;

        this.itemCapacity = 10;
        this.liquidCapacity = 10;
        this.liquidPressure = 1;

        consumes = new Consumers();

        /** whether to display flow rate */
        this.displayFlow = true;
        /** whether this block is visible in the editor */
        this.inEditor = true;
        /** the last configuration value applied to this block. */
        this.lastConfig = {};
        /** whether to save the last config and apply it to newly placed blocks */
        this.saveConfig = false;
        /** whether this block has a tile entity that updates */
        this.update = false;
        /** whether this block has health and can be destroyed */
        this.destructible = false;
        /** whether unloaders work on this block*/
        this.unloadable = true;
        /** whether this is solid */
        this.solid = false;
        /** whether this block CAN be solid. */
        this.solidifes = false;
        /** whether this is rotateable */
        this.rotate = false;
        /** for static blocks only: if true, tile data() is saved in world data. */
        this.saveData = false;
        /** whether you can break this with rightclick */
        this.breakable = false;
        /** whether to add this block to brokenblocks */
        this.rebuildable = true;
        /** whether this water can only be placed on water */
        this.requiresWater = false;
        /** whether this water can be placed on any liquids, anywhere */
        this.placeableLiquid = false;
        /** whether this floor can be placed on. */
        this.placeableOn = true;
        /** whether this block has insulating properties. */
        this.insulated = false;
        /** whether the sprite is a full square. */
        this.squareSprite = true;
        /** whether this block absorbs laser attacks. */
        this.absorbLasers = false;
        /** if false, the status is never drawn */
        this.enableDrawStatus = true;
        /** whether to draw disabled status */
        this.drawDisabled = true;
        /** whether to automatically reset enabled status after a logic block has not interacted for a while. */
        this.autoResetEnabled = true;
        /** if true, the block stops updating when disabled */
        this.noUpdateDisabled = false;
        /** Whether to use this block's color in the minimap. Only used for overlays. */
        this.useColor = true;
        /** tile entity health */
        this.health = -1;
        /** base block explosiveness */
        this.baseExplosiveness = 0;
        /** whether this block can be placed on edges of liquids. */
        this.floating = false;
        /** multiblock size */
        this.size = 1;
        /** multiblock offset */
        this.offset = 0;
        /** Whether to draw this block in the expanded draw range. */
        this.expanded = false;
        /** Max of timers used. */
        this.timers = 0;
        /** Cache layer. Only used for 'cached' rendering. */
        this.cacheLayer = "this.normal";
        /** Special flag; if false, floor will be drawn under this block even if it is cached. */
        this.fillsTile = true;
        /** whether this block can be replaced in all cases */
        this.alwaysReplace = false;
        /** The block group. Unless canReplace is overriden, blocks in the same group can replace each other. */
        this.group = "none";
        /** List of block flags. Used for AI indexing. */
        this.flags = [];
        /** Targeting priority of this block, as seen by enemies .*/
        this.priority = "base";
        /** How much this block affects the unit cap by.
         * The block flags must contain unitModifier in order for this to work. */
        this.unitCapModifier = 0;
        /** Whether the block can be tapped and selected to configure. */
        this.configurable = false;
        /** If true, this block can be configured by logic. */
        this.logicConfigurable = false;
        /** Whether this block consumes touchDown events when tapped. */
        this.consumesTap = false;
        /** Whether to draw the glow of the liquid for this block, if it has one. */
        this.drawLiquidLight = true;
        /** Whether to periodically sync this block across the network. */
        this.sync = false;
        /** Whether this block uses conveyor-type placement mode. */
        this.conveyorPlacement = false;
        /** Whether to swap the diagonal placement modes. */
        this.swapDiagonalPlacement = false;
        /**
         * The color of this block when displayed on the minimap or map preview.
         * Do not set manually! This is overridden when loading for most blocks.
         */
        this.mapColor = new Color(0, 0, 0, 1);
        /** Whether this block has a minimap color. */
        this.hasColor = false;
        /** Whether units target this block. */
        this.targetable = true;
        /** Whether the overdrive core has any effect on this block. */
        this.canOverdrive = true;
        /** Outlined icon color.*/
        this.outlineColor = Color.valueOf("404049");
        /** Whether the icon region has an outline added. */
        this.outlineIcon = false;
        /** Whether this block has a shadow under it. */
        this.hasShadow = true;
        /** Sounds made when this block breaks.*/
        this.breakSound = "boom";
        /** How reflective this block is. */
        this.albedo = 0;
        /** Environmental passive light color. */
        this.lightColor = Color.white.cpy();
        /**
         * Whether this environmental block passively emits light.
         * Not valid for non-environmental blocks. */
        this.emitLight = false;
        /** Radius of the light emitted by this block. */
        this.lightRadius = 60;

        /** The sound that this block makes while active. One sound loop. Do not overuse. */
        this.loopSound = "none";
        /** Active sound base volume. */
        this.loopSoundVolume = 0.5;

        /** The sound that this block makes while idle. Uses one sound loop for all blocks. */
        this.ambientSound = "none";
        /** Idle sound base volume. */
        this.ambientSoundVolume = 0.05;

        /** Cost of constructing this block. */
        this.requirements = {};
        /** Category in place menu. */
        this.category = Category.distribution;
        this./** Cost of building this block; do not modify directly! */
            this.buildCost = 0;
        /** Whether this block is visible and can currently be built. */
        this.buildVisibility = BuildVisibility.hidden;
        /** Multiplier for speed of building this block. */
        this.buildCostMultiplier = 1;
        /** Build completion at which deconstruction finishes. */
        this.deconstructThreshold = 0;
        /** Multiplier for cost of research in tech tree. */
        this.researchCostMultiplier = 1;
        /** Whether this block has instant transfer.*/
        this.instantTransfer = false;
        /** Whether you can rotate this block with Keybind rotateplaced + Scroll Wheel. */
        this.quickRotate = true;

        region = TextureRegion.Load("@");
        teamRegion = TextureRegion.Load("@-team");
    }

    Draw(World) {
        World.draw(this.region, 0, 0);
    }

    minimapColor(){
        return 0;
    }

    outputsItems(){
        return this.hasItems;
    }

    getContentType(){
        return ContentType.block;
    }
}

// Draw()
// minimapColor()
// outputsItems()