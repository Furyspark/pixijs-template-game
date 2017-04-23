function Layer_Tile() {
  this.initialize.apply(this, arguments);
}

Layer_Tile.prototype = Object.create(Layer_Base.prototype);
Layer_Tile.prototype.constructor = Layer_Tile;

/**
 * @class
 * Layer containing tiles.
 * @param {Object} map - The map this layer belongs to.
 * @param {Object} src - The layer source as defined in a Tiled map.
 * @constructs Layer_Tile
 * @augments Layer_Base
 */
Layer_Tile.prototype.initialize = function(map, src) {
  Layer_Base.prototype.initialize.call(this, map);
  /**
   * Tiles in this layer.
   * @type {Array.<Tile>}
   */
  this.tiles = [];
  this.parse(src);
}

/**
 * Clears the tiles in this layer.
 */
Layer_Tile.prototype.clear = function() {
  for(var a = 0;a < this.tiles.length;a++) {
    var tile = this.tiles[a];
    if(!!tile) this.root.removeChild(tile);
  }
  this.tiles = [];
  for(var a = 0;a < this.map.src.width * this.map.src.height;a++) {
    this.tiles[a] = null;
  }
}

/**
 * Parses the layer from a source.
 * @param {Object} src - The layer source as defined in a Tiled map.
 * @protected
 */
Layer_Tile.prototype.parse = function(src) {
  this.clear();
  for(var index = 0;index < src.data.length;index++) {
    var gid = src.data[index];
    if(gid > 0) {
      var ts = this.map.getTilesetByGID(gid);
      if(!ts) continue;
      var uid = gid - ts.firstgid;
      var texture = ts.getTileTexture(uid);
      var tile = new Tile(texture);
      this.setTile(index, tile);
      // Set properties if found
      if(ts.src.tileproperties && ts.src.tileproperties[uid.toString()]) {
        let tileProp = ts.src.tileproperties[uid.toString()];
        for(var b in tileProp) {
          tile.setProperty(b, tileProp[b]);
        }
      }
    }
  }
}

/**
 * Sets a tile to a slot in this layer.
 * @param {number} index - The index to set a tile for.
 * @param {Tile} tile - The tile to place.
 */
Layer_Tile.prototype.setTile = function(index, tile) {
  var oldTile = this.tiles[index];
  if(!!oldTile) this.root.removeChild(oldTile);
  this.tiles[index] = tile;
  this.root.addChild(tile);
  // Set tile position
  var pos = this.map.getPosition(index);
  tile.x = pos.x * this.map.src.tilewidth;
  tile.y = pos.y * this.map.src.tileheight;
}
