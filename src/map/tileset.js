function Game_Tileset() {
  this.initialize.apply(this, arguments);
}

/**
 * Gives the path to the tileset directory.
 * @returns {string} The path to the tileset directory.
 * @memberof Game_Tileset
 */
Game_Tileset.tilesetDir = function() {
  return "assets/tilesets/";
}

/**
 * Gives the path to the tileset image directory.
 * @returns {string} The path to the tileset image directory.
 * @memberof Game_Tileset
 */
Game_Tileset.tilesetImageDir = function() {
  return "assets/gfx/tilesets/";
}

/**
 * @class
 * Represents a tileset for a map.
 * @param {Object} src - The tileset source, including first GID.
 * @constructs Game_Tileset
 */
Game_Tileset.prototype.initialize = function(src) {
  /**
   * The tileset source object.
   * @type {Object}
   */
  this.src = {};
  /**
   * The first GID of this tileset.
   * @type {number}
   */
  this.firstgid = src.firstgid;
  /**
   * Dispatches when this tileset is fully loaded.
   * @type {Signal}
   */
  this.onComplete = new Signal();
  /**
   * This tileset's image texture.
   * @type {PIXI.Texture}
   */
  this.texture = null;

  this.load(src.source);
}

/**
 * Loads the tileset data.
 * @param {string} url - The path to the tileset file.
 * @protected
 */
Game_Tileset.prototype.load = function(url) {
  var filename = Core.getFilename(url);
  var loader = DataManager.loadJSON("", Game_Tileset.tilesetDir() + filename);
  loader.onComplete.addOnce(function(data) {
    this.src = data;
    if(!!data.image) this.loadImage(data.image);
    else this.onComplete.dispatch();
  }, this, [], 45);
}

/**
 * Loads the tileset image.
 * @param {string} url - The path to the tileset file.
 * @protected
 */
Game_Tileset.prototype.loadImage = function(url) {
  var filename = Core.getFilename(url);
  var loader = ImageManager.loadImage("", Game_Tileset.tilesetImageDir() + filename);
  loader.onComplete.addOnce(function(texture) {
    this.texture = texture;
    this.onComplete.dispatch();
  }, this, [], 45);
}

/**
 * Retrieves properties for a tile by UID.
 * @param {number} uid - The UID of the tile.
 * @returns {Object} The properties for the tile, or undefined.
 */
Game_Tileset.prototype.getTileProperties = function(uid) {
  if(!this.src.tileproperties) return undefined;
  if(!this.src.tileproperties[uid]) return undefined;
  return this.src.tileproperties[uid];
}

/**
 * Returns a texture for a tile.
 * @param {number} index - The index of the tile in the tileset.
 * @returns {PIXI.Texture} The cropped texture.
 */
Game_Tileset.prototype.getTileTexture = function(index) {
  var rect = this.getTileRect(index);
  var result = new PIXI.Texture(this.texture, rect);
  return result;
}

/**
 * Returns a rectangle for a tile cropping.
 * @param {number} index - The index of the tile in the tileset.
 * @returns {Rect} The cropping.
 */
Game_Tileset.prototype.getTileRect = function(index) {
  var xy = this.getTileXY(index);
  return new Rect(
    this.src.margin + (this.src.tilewidth + this.src.spacing) * xy.x,
    this.src.margin + (this.src.tileheight + this.src.spacing) * xy.y,
    this.src.tilewidth,
    this.src.tileheight
  );
}

/**
 * Converts an index to a position of a tile in this tileset.
 * @param {number} index - The index of the tile in this tileset.
 * @returns {Point} The position of the tile in this tileset in tile space.
 */
Game_Tileset.prototype.getTileXY = function(index) {
  return new Point(
    index % this.src.columns,
    Math.floor(index / this.src.columns)
  );
}
