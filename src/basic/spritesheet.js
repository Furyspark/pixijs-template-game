function SpriteSheet() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * Holds textures by frame.
 * @param {Object} src - Source object with the sprite sheet textures.
 * @constructs SpriteSheet
 */
SpriteSheet.prototype.initialize = function(src) {
  /**
   * Holds frame textures.
   * @type {Object.<string, PIXI.Texture>}
   */
  this._textures = [];
  this.applySource(src);
}

/**
 * Gather textures from a source object.
 * @param {Object} src - Source object with the sprite sheet textures.
 */
SpriteSheet.prototype.applySource = function(src) {
  for(var a in src) {
    this._textures[a] = src[a];
  }
}

/**
 * Retrieves a texture.
 * @param {string} key - The key of the texture.
 * @returns {PIXI.Texture} The texture stored under the key in this sprite sheet.
 */
SpriteSheet.prototype.get = function(key) {
  return this._textures[key];
}
