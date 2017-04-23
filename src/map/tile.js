function Tile() {
  this.initialize.apply(this, arguments);
}

Tile.prototype = Object.create(PIXI.Sprite.prototype);
Tile.prototype.constructor = Tile;

/**
 * @class
 * A tile for a tile-based map.
 * @param {PIXI.Texture} texture - The texture used for this tile.
 * @constructs Tile
 * @augments PIXI.Sprite
 */
Tile.prototype.initialize = function(texture) {
  PIXI.Sprite.call(this, texture);
}

/**
 * Sets a property for this tile.
 * @param {string} property - The key of the property.
 * @param {Object} value - The (new) value of the property.
 */
Tile.prototype.setProperty = function(property, value) {
  this[property] = value;
}
