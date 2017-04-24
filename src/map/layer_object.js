function Layer_Object() {
  this.initialize.apply(this, arguments);
}

Layer_Object.prototype = Object.create(Layer_Base.prototype);
Layer_Object.prototype.constructor = Layer_Object;

/**
 * @class
 * Layer containing game objects.
 * @param {Game_Map} map - The map this layer belongs to.
 * @param {Object} src - The layer source as defined in a Tiled map.
 * @constructs Layer_Object
 * @augments Layer_Base
 */
Layer_Object.prototype.initialize = function(map, src) {
  Layer_Base.prototype.initialize.call(this, map);
  /**
   * Objects in this layer.
   * @type {Array.<Game_Object>}
   */
  this.objects = [];
  /**
   * The map this layer belongs to.
   * @type {Game_Map}
   */
  this.map = map;
  this.parse(src);
}

/**
 * Parses the layer from a source.
 * @param {Object} src - The layer source as defined in a Tiled map.
 * @protected
 */
Layer_Object.prototype.parse = function(src) {
  for(var a = 0;a < src.objects.length;a++) {
    var objectSrc = src.objects[a];
    this.createObjectBySource(objectSrc);
  }
}

/**
 * Creates an object from a Tiled object source.
 * @param {Object} src - The source data for the object.
 */
Layer_Object.prototype.createObjectBySource = function(src) {
  var properties = this.getObjectProperties(src);
  // Determine object placement
  var placement = new Rect(
    src.x,
    src.y - src.height,
    src.width,
    src.height
  );
  // Determine object class
  var cls = Game_Object;
  for(var a in properties) {
    var group = properties[a];
    for(var b in group) {
      if(b === "object_type") cls = eval(group[b]);
    }
  }
  // Determine object parameters
  var params = [];
  if(properties.object) {
    for(var a in properties.object) {
      if(a.match(/param([0-9]+)/)) {
        var index = parseInt(RegExp.$1);
        var value = properties.object[a];
        params.push({index: index, value: value});
      }
    }
  }
  params = params.sort(function(a, b) {
    if(a.index > b.index) return 1;
    if(a.index < b.index) return -1;
    return 0;
  });
  params = params.map(function(obj) {
    return obj.value;
  });
  params.unshift(cls);
  // Create game object
  var obj = new (Function.prototype.bind.apply(cls, params));
  obj.tiledProperties = properties;
  obj.x = placement.x + placement.width * 0.5;
  obj.y = placement.y + placement.height;
  this.root.addChild(obj);
}

/**
 * Retrieve properties for a Tiled object.
 * @param {Object} src - The source data for the object.
 * @returns {Object} An object containing the property hashes for the object.
 */
Layer_Object.prototype.getObjectProperties = function(src) {
  var properties = {
    instance: src.properties
  };
  var gid = src.gid || 0;
  if(gid > 0) {
    var ts = this.map.getTilesetByGID(gid);
    var obj = ts.getTileProperties(gid - ts.firstgid);
    if(!!obj) properties.object = obj;
  }
  return properties;
}

/**
 * Updates this layer.
 */
Layer_Object.prototype.update = function() {
  Layer_Base.prototype.update.call(this);
  this.root.children.forEach(function(obj) {
    obj.update();
  });
}
