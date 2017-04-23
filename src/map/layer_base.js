function Layer_Base() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * The base for all map layers.
 * @param {Game_Map} map - The map this layer belongs to.
 * @constructs Layer_Base
 */
Layer_Base.prototype.initialize = function(map) {
  /**
   * Root of this layer's display objects
   * @type {PIXI.Container}
   */
  this.root = new PIXI.Container();
  /**
   * The map for this layer.
   * @type {Game_Map}
   */
  this.map = map;

  this.map.stage.addChild(this.root);
}
