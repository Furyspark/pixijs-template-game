function Game_Map() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * Contains a full game area.
 * @constructs Game_Map
 */
Game_Map.prototype.initialize = function() {
  /**
   * The map source object.
   * @type {Object}
   */
  this.src = {};
  /**
   * List containing this map's tilesets.
   * @type {Array.<Game_Tileset>}
   */
  this.tilesets = [];
  /**
   * Root display object of this map.
   * @type {PIXI.Container}
   */
  this.stage = new PIXI.Container();
  /**
   * List containing this map's layers.
   * @type {Array.<Layer_Base>}
   */
  this.layers = [];
  /**
   * Fired when the map is created.
   * @type {Signal}
   */
  this.onCreate = new Signal();
}

/**
 * Loads a Tiled JSON map from a url.
 * @param {string} url - The url to the file.
 */
Game_Map.prototype.load = function(url) {
  var loader = DataManager.loadJSON("", url);
  loader.onComplete.addOnce(function(obj) {
    this.src = obj;
    this.loadAssets();
  }, this, [], 45);
}

/**
 * Loads the map assets.
 */
Game_Map.prototype.loadAssets = function() {
  var keys = [];
  // Load tilesets
  for(var a = 0;a < this.src.tilesets.length;a++) {
    var tsSrc = this.src.tilesets[a];
    let ts = new Game_Tileset(tsSrc);
    let key = "tileset" + a.toString();
    keys.push(key);
    ts.onComplete.addOnce(function() {
      this.tilesets.push(ts);
      Core.checkCompletion(key, keys, this.parse.bind(this));
    }, this, []);
  }
}

/**
 * Creates the game side of the map, after all assets have been loaded.
 * @protected
 */
Game_Map.prototype.parse = function() {
  this.sortTilesets();
  // Create layers
  for(var a = 0;a < this.src.layers.length;a++) {
    var layerSrc = this.src.layers[a];
    // Tile Layer
    if(layerSrc.type === "tilelayer") {
      var layer = new Layer_Tile(this, layerSrc);
      this.layers.push(layer);
    }
    // Object Layer
    else if(layerSrc.type === "objectgroup") {
      var layer = new Layer_Object(this, layerSrc);
      this.layers.push(layer);
    }
  }
  // Fire onCreate signal
  this.onCreate.dispatch();
}

/**
 * Sorts the tilesets by firstgid
 * @protected
 */
Game_Map.prototype.sortTilesets = function() {
  this.tilesets = this.tilesets.sort(function(a, b) {
    if(a.firstgid > b.firstgid) return 1;
    if(a.firstgid < b.firstgid) return -1;
    return 0;
  });
}

/**
 * Determines the tileset the given GID belongs to.
 * @param {number} gid - The GID to search a tileset for.
 * @returns {Game_Tileset} The tileset returned.
 */
Game_Map.prototype.getTilesetByGID = function(gid) {
  for(var a = this.tilesets.length - 1;a >= 0;a--) {
    var ts = this.tilesets[a];
    if(gid >= ts.firstgid) return ts;
  }
  return undefined;
}

/**
 * Converts a tile index to a tile position.
 * @param {number} index - The index to convert to a position.
 * @returns {Point} The calculated position.
 */
Game_Map.prototype.getPosition = function(index) {
  return new Point(
    index % this.src.width,
    Math.floor(index / this.src.width)
  );
}

/**
 * Converts a tile position to a tile index.
 * @param {number} x - The X position input.
 * @param {number} y - The Y position input.
 * @returns {number} The calculated index.
 */
Game_Map.prototype.getIndex = function(x, y) {
  return x + y * this.src.width;
}

/**
 * Updates the map.
 */
Game_Map.prototype.update = function() {
  this.layers.forEach(function(layer) {
    layer.update();
  });
}
