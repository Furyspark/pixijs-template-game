/**
 * Removes an object from the array.
 * @param {Object} obj - The object to remove.
 * @returns {Object} The removed object, or undefined if no object was found to be removed.
 */
Array.prototype.remove = function(obj) {
  var index = this.indexOf(obj);
  if(index !== -1) {
    return this.splice(index, 1)[0];
  }
  return undefined;
}

function Signal() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * A variant of the event listener.
 * @constructs Signal
 */
Signal.prototype.initialize = function() {
  /**
   * List of bindings attached to this signal.
   * @type {Array.<SignalBinding>}
   * @protected
   */
  this._bindings = [];
}

/**
 * Attaches a signal binding to this signal.
 * @param {Function} callback - The callback to call when this signal if fired.
 * @param {Object} context - The context to call the callback from.
 * @param {Array} [args=undefined] - The parameters to pass down to the callback. Has no effect if the signal dispatches with parameters.
 * @param {number} [priority=undefined] - The priority of this binding. Higher values get called first.
 */
Signal.prototype.add = function(callback, context, args, priority) {
  this._bindings.push(new SignalBinding(callback, context, args, priority, false));
}

/**
 * Attaches a signal binding to this signal. Will only be called once before it is automatically removed from this signal.
 * @param {Function} callback - The callback to call when this signal if fired.
 * @param {Object} context - The context to call the callback from.
 * @param {Array} [args=[]] - The parameters to pass down to the callback. Has no effect if the signal dispatches with parameters.
 * @param {number} [priority=50] - The priority of this binding. Higher values get called first.
 */
Signal.prototype.addOnce = function(callback, context, args, priority) {
  this._bindings.push(new SignalBinding(callback, context, args, priority, true));
}

/**
 * Removes a binding from this signal.
 * @param {Function} callback - The callback of the binding to remove.
 * @param {Object} context - The context that was assigned to this binding.
 */
Signal.prototype.remove = function(callback, context) {
  for(var a = 0;a < this._bindings.length;a++) {
    var obj = this._bindings[a];
    if(obj.callback === callback && obj.context === context) {
      this._bindings.splice(a, 1);
      return true;
    }
  }
  return false;
}

/**
 * Function used in sorting the bindings.
 * @param {SignalBinding} a - First object to test against.
 * @param {SignalBinding} b - Second object to test against.
 * @protected
 */
Signal.prototype.sortFunction = function(a, b) {
  if(a.priority < b.priority) return 1;
  if(a.priority > b.priority) return -1;
  return 0;
}

/**
 * Fires this signal, calling all bindings' callbacks.
 * @param {Array} [args=[]] - Optional parameters to pass to the callbacks.
 */
Signal.prototype.dispatch = function(args) {
  if(!args instanceof Array) args = [];
  var binds = [];
  for(var a = 0;a < this._bindings.length;a++) {
    var bind = this._bindings[a];
    if(bind.once) {
      this._bindings.splice(a, 1);
      a--;
    }
    binds.push(bind);
  }
  binds = binds.sort(this.sortFunction);
  for(var a = 0;a < binds.length;a++) {
    var bind = binds[a];
    bind.dispatch(args);
  }
}

function SignalBinding() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * Contains data on a binding for signals.
 * @param {Function} callback - The function to call when this binding is dispatched.
 * @param {Object} context - The context to call this binding's callback from.
 * @param {Array} [args=[]] - The parameters to hand over to the callback when it is fired. Has no effect if the signal calls with parameters.
 * @param {number} [priority=50] - The priority of this binding. Higher values get called first.
 * @param {Boolean} [once=false] - Whether to remove this binding once it has been dispatched once.
 * @constructs SignalBinding
 */
SignalBinding.prototype.initialize = function(callback, context, args, priority, once) {
  if(!args instanceof Array) args = [];
  if(!priority && priority !== 0) priority = 50;
  if(!once && once !== false) once = false;
  /**
   * The function to call when this binding is dispatched.
   * @type {Function}
   */
  this.callback = callback;
  /**
   * The context to call this binding's callback from.
   * @type {Object}
   */
  this.context = context;
  /**
   * The parameters to hand over to the callback when it is fired. Has no effect if the signal calls with parameters.
   * @type {Array}
   */
  this.args = args;
  /**
   * The priority of this binding. Higher values get called first.
   * @type {number}
   */
  this.priority = priority;
  /**
   * Whether to remove this binding once it has been dispatched once.
   * @type {Boolean}
   */
  this.once = once;
}

/**
 * Fires this binding's callback.
 * @param {Array} [args=[]] - The arguments to pass down to this binding. Will override this binding's own arguments.
 */
SignalBinding.prototype.dispatch = function(args) {
  if(!(args instanceof Array)) args = [];
  if(args.length === 0) args = this.args;
  this.callback.apply(this.context, args);
}

function Point() {
  this.initialize.apply(this, arguments);
}

Point.prototype = Object.create(PIXI.Point.prototype);
Point.prototype.constructor = Point;

/**
 * @class
 * Represents a geometrical point with an x and y value.
 * @param {number} x - Original x position of this point.
 * @param {number} y - Original y position of this point.
 * @constructs Point
 */
Point.prototype.initialize = function(x, y) {
  PIXI.Point.prototype.constructor.call(this, x, y);
}

/**
 * Duplicates this point.
 * @returns {Point} The clone of this point.
 */
Point.prototype.clone = function() {
  return new Point(this.x, this.y);
}

/**
 * Returns the distance to another point.
 * @param {Point} toPos - The other point to test against.
 * @returns {number} The distance between the two points.
 */
Point.prototype.distanceTo = function(toPos) {
  return Math.sqrt(Math.pow(this.x - toPos.x, 2) + Math.pow(this.y - toPos.y, 2));
}

/**
 * Returns the angle between two points.
 * @param {Point} toPos - The other point to test against.
 * @returns {number} The angle in radians to the other point.
 */
Point.prototype.rotationTo = function(toPos) {
  var delta = new Point(toPos.x - this.x, toPos.y - this.y);
  var radians = Math.atan2(delta.y, delta.x);
  return radians;
}

/**
 * Rotates a point around an angle.
 * @param {number} angle - The angle in radians to rotate around.
 */
Point.prototype.rotate = function(angle) {
  var x = this.x;
  var y = this.y;
  this.set(
    Math.round((x * Math.cos(angle) - y * Math.sin(angle)) * 100) / 100,
    Math.round((x * Math.sin(angle) + y * Math.cos(angle)) * 100) / 100
  );
}

function Rect() {
  this.initialize.apply(this, arguments);
}

Rect.prototype = Object.create(PIXI.Rectangle.prototype);
Rect.prototype.constructor = Rect;

/**
 * @class
 */
Object.defineProperties(Rect.prototype, {
  /**
   * Same as Rect.x
   * @memberof Rect.prototype
   */
  left: {
    get: function() { return this.x; },
    set: function(value) { this.x = value; }
  },
  /**
   * Same as Rect.y
   * @memberof Rect.prototype
   */
  top: {
    get: function() { return this.y; },
    set: function(value) { this.y = value; }
  },
  /**
   * Same as Rect.x + Rect.width
   * @memberof Rect.prototype
   */
  right: {
    get: function() { return this.x + this.width; },
    set: function(value) { this.width = value - this.x; }
  },
  /**
   * Same as Rect.y + Rect.height
   * @memberof Rect.prototype
   */
  bottom: {
    get: function() { return this.y + this.height; },
    set: function(value) { this.height = value - this.y; }
  }
});

/**
 * Represents a geometrical rectangle.
 * @param {number} x - Original left of the rectangle.
 * @param {number} y - Original top of the rectangle.
 * @param {number} w - Original width of the rectangle.
 * @param {number} h - Original height of the rectangle.
 * @constructs Rect
 */
Rect.prototype.initialize = function(x, y, w, h) {
  PIXI.Rectangle.prototype.constructor.call(this, x, y, w, h);
}

/**
 * Whether this rectangle overlaps with another rectangle.
 * @param {Rect} rect - Other rectangle to test against.
 * @returns {Boolean} Whether the two rectangles overlap.
 */
Rect.prototype.overlap = function(rect) {
  return ((rect.right > this.left && rect.left < this.right) &&
  (rect.bottom > this.top && rect.top < this.bottom));
}

/**
 * Duplicates this rectangle.
 * @returns {Rect} A duplicate of this rectangle.
 */
Rect.prototype.clone = function() {
  return new Rect(this.x, this.y, this.width, this.height);
}

/**
 * Rotates the rectangle by a certain amount.
 * @param {number} angle - The angle in radians to rotate this rect.
 */
Rect.prototype.rotate = function(angle) {
  var tl = new Point(this.x, this.y);
  var tr = new Point(this.x + this.width, this.y);
  var bl = new Point(this.x, this.y + this.height);
  var br = new Point(this.x + this.width, this.y + this.height);
  tl.rotate(angle);
  tr.rotate(angle);
  bl.rotate(angle);
  br.rotate(angle);
  this.x = Math.min(tl.x, tr.x, bl.x, br.x);
  this.y = Math.min(tl.y, tr.y, bl.y, br.y);
  this.width = Math.max(tl.x, tr.x, bl.x, br.x) - Math.min(tl.x, tr.x, bl.x, br.x);
  this.height = Math.max(tl.y, tr.y, bl.y, br.y) - Math.min(tl.y, tr.y, br.y, br.y);
}

function Cache() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * Stores any kind of data, but should only hold one type per cache.
 * @constructs Cache
 */
Cache.prototype.initialize = function() {
  /**
   * Holds all the items as a dictionary data type.
   * @type {Object.<string, Object>}
   */
  this._items = {};
}

/**
 * Stores an object in the cache.
 * @param {string} key - The key to store the object under.
 * @param {Object} item - The object to store in the cache.
 */
Cache.prototype.setItem = function(key, item) {
  this._items[key] = item;
}

/**
 * Retrieves an item from the cache.
 * @param {string} key - The key under which the item is stored.
 * @returns {Object} The item to be retrieved.
 */
Cache.prototype.getItem = function(key) {
  return this._items[key];
}

function Loader() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 */

/** @constant */
Loader.TYPE_MISC = 0;
/** @constant */
Loader.TYPE_JSON = 1;
/** @constant */
Loader.TYPE_IMAGE = 2;
/** @constant */
Loader.TYPE_SPRITESHEET = 3;
/** @constant */
Loader.TYPE_AUDIO = 4;

/**
 * Object responsible for handling asset loading.
 * @constructs Loader
 */
Loader.prototype.initialize = function() {
  this.initMembers();
}

/**
 * Initializes member variables.
 */
Loader.prototype.initMembers = function() {
  /**
   * Dispatches when this loader's asset is done loading.
   * Has the asset as a parameter.
   * @type {Signal}
   */
  this.onComplete = new Signal();
  /**
   * URL of the file to load.
   * @type {string}
   */
  this.url = "";
}

/**
 * Starts loading an asset.
 * @param {string} url - The url of the file to load.
 * @param {number} type - The type of asset to load. Refer to the Loader.TYPE_* constants.
 */
Loader.prototype.load = function(url, type) {
  this.url = url;
  if(type === Loader.TYPE_JSON) this.loadJSON();
  else if(type === Loader.TYPE_IMAGE) this.loadImage();
  else if(type === Loader.TYPE_SPRITESHEET) this.loadSpriteSheet();
  else if(type === Loader.TYPE_AUDIO) this.loadAudio();
  else this.loadRaw();
}

/**
 * Loads the data as a JSON object.
 */
Loader.prototype.loadJSON = function() {
  var loader = this;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.url);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      loader.onComplete.dispatch([JSON.parse(xhr.responseText)]);
    }
  };
  xhr.send();
}

/**
 * Loads the data as a string.
 */
Loader.prototype.loadRaw = function() {
  var loader = this;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.url);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      loader.onComplete.dispatch([xhr.responseText]);
    }
  };
  xhr.send();
}

/**
 * Loads the file as an image.
 */
Loader.prototype.loadImage = function() {
  var loader = this;
  var subLoader = new PIXI.loaders.Loader();
  var key = "image" + ImageManager._imagesLoaded.toString();
  subLoader.add(key, this.url)
    .load(function(subLoader, resources) {
      var texture = resources[key].texture;
      loader.onComplete.dispatch([texture]);
    });
}

/**
 * Loads the file as an sprite sheet.
 */
Loader.prototype.loadSpriteSheet = function() {
  var loader = this;
  var subLoader = new PIXI.loaders.Loader();
  var key = "spritesheet" + ImageManager._imagesLoaded.toString();
  subLoader.add(key, this.url)
    .load(function(subLoader, resources) {
      var src = resources[key].textures;
      var spritesheet = new SpriteSheet(src);
      loader.onComplete.dispatch([spritesheet]);
    });
}

/**
 * Loads the file as audio.
 */
Loader.prototype.loadAudio = function() {
  var loader = this;
  var subLoader = new Howl({
    src: [this.url],
    onload: function() {
      loader.onComplete.dispatch([subLoader]);
    }
  });
}

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

function Camera() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * Viewport into the world.
 * @param {Rect} world - The portion of the world that is visible.
 * @param {Rect} port - The portion of the screen that this camera will be drawn to.
 * @param {PIXI.DisplayObject=} target - The initial target of this camera.
 * @constructs Camera
 */
Camera.prototype.initialize = function(world, port, target) {
  /**
   * The portion of the world that is visible on this camera.
   * @type {Rect}
   */
  this.world = world;
  /**
   * The portion of the screen that this camera will be draw to.
   * @type {Rect}
   */
  this.port = port;
  /**
   * The target of this camera. Most commonly a map's stage.
   * @type {PIXI.DisplayObject}
   */
  this.target = null;
  /**
   * This camera's render texture.
   * @type {PIXI.RenderTexture}
   * @protected
   */
  this.texture = PIXI.RenderTexture.create(this.world.width, this.world.height);
  /**
   * This camera's sprite, to be added to a scene's stage for example.
   * @type {PIXI.Sprite}
   */
  this.view = new PIXI.Sprite(this.texture);
  if(target instanceof PIXI.DisplayObject) this.setTarget(target);
  this.refresh();
}

/**
 * Sets the target of this camera.
 * @param {PIXI.DisplayObject} target - The new target of this camera.
 */
Camera.prototype.setTarget = function(target) {
  this.target = target;
}

/**
 * Refreshes the camera's texture position etc.
 * @protected
 */
Camera.prototype.refresh = function() {
  // Update world size
  if(this.texture.width !== this.world.width || this.texture.height !== this.world.height) {
    this.texture.resize(this.world.width, this.world.height, false);
  }
  // Update view size
  if(this.view.width !== this.port.width || this.view.height !== this.port.height) {
    this.view.width = this.port.width;
    this.view.height = this.port.height;
  }
}

/**
 * Renders the camera.
 */
Camera.prototype.render = function() {
  this.refresh();
  this.target.setTransform(
    -this.world.x,
    -this.world.y
  );
  Core.renderer.render(this.target, this.texture);
}

function Key() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * An abstract object for an input button.
 * @constructs Key
 */
Key.prototype.initialize = function() {
  /**
   * Indicates whether this key is being held down currently.
   * @type {Boolean}
   */
  this.down = false;
  /**
   * Fired when the key is pressed.
   * @type {Signal}
   */
  this.onPress = new Signal();
  /**
   * Fired when the key is released.
   * @type {Signal}
   */
  this.onRelease = new Signal();

  this.attachBasicEvents();
}

/**
 * Adds basic events for this key.
 * @protected
 */
Key.prototype.attachBasicEvents = function() {
  this.onPress.add(function() {
    this.down = true;
  }, this, [], 100);
  this.onRelease.add(function() {
    this.down = false;
  }, this, [], 100);
}

/**
 * The core of the game.
 * @namespace
 */
function Core() {}

/**
 * Starts the game.
 * @protected
 */
Core.start = function() {
  this.initRenderer(800, 600);
  this.fitContent_LetterBox();
  this.attachBasicEvents();
  this.startManagers();
  this.startGame();
}

/**
 * Initializes the renderer.
 * @param {number} width - Width of the game screen.
 * @param {number} height - Height of the game screen.
 * @protected
 */
Core.initRenderer = function(width, height) {
  /**
   * The renderer of the game view.
   * @type {PIXI.WebGLRenderer}
   */
  this.renderer = new PIXI.WebGLRenderer({
    width: width,
    height: height,
    roundPixels: true
  });
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  this.renderer.view.style.position = "absolute";
  document.body.appendChild(this.renderer.view);
}

/**
 * Fits the game screen to the window.
 */
Core.fitContent = function() {
  var iw = window.innerWidth;
  var ih = window.innerHeight;
  this.renderer.view.style.width = iw.toString() + "px";
  this.renderer.view.style.height = ih.toString() + "px";
}

/**
 * Scales the content to a letterbox.
 */
Core.fitContent_LetterBox = function() {
  var iw = window.innerWidth;
  var ih = window.innerHeight;
  var winRatio = iw / ih;
  var gameRatio = this.renderer.width / this.renderer.height;
  var left = 0;
  var top = 0;
  var width = iw;
  var height = ih;
  if(winRatio <= gameRatio) {
    height = Math.floor(width / gameRatio);
    top = Math.floor((ih / 2) - (height / 2));
  } else {
    width = Math.floor(height * gameRatio);
    left = Math.floor((iw / 2) - (width / 2));
  }
  this.renderer.view.style.width = width.toString() + "px";
  this.renderer.view.style.height = height.toString() + "px";
  this.renderer.view.style.left = left.toString() + "px";
  this.renderer.view.style.top = top.toString() + "px";
}

/**
 * Adds basic event listeners.
 * @protected
 */
Core.attachBasicEvents = function() {
  // Fit game screen on resize.
  window.addEventListener("resize", function() {
    Core.fitContent_LetterBox();
  });
}

/**
 * Starts the game, booting up the Boot scene.
 */
Core.startGame = function() {
  SceneManager.push(new Scene_Boot());
  this.update();
}

/**
 * Starts various managers that need starting up.
 */
Core.startManagers = function() {
  InputManager.start();
  TweenManager.start();
}

/**
 * Updates the game, and renders it.
 * @param {DOMHighResTimeStamp} time - The time from a requestAnimationFrame callback.
 */
Core.update = function(time) {
  requestAnimationFrame(this.update.bind(this));
  SceneManager.update();
  TweenManager.update(time);
  this.render();
}

/**
 * Renders the game.
 */
Core.render = function() {
  SceneManager.render();
}

/**
 * Returns the filename of a URL.
 * @param {string} url - The full URL of a file.
 * @returns {string} The filename with the path cut off.
 */
Core.getFilename = function(url) {
  return url.split("/").slice(-1)[0];
}

/**
 * Returns the filename of a URL without the file extension.
 * @param {string} url - The full URL of a file.
 * @returns {string} The filename with the path and the extension part cut off.
 */
Core.getBaseFilename = function(url) {
  return url.split("/").slice(-1)[0].split(".").slice(0, -1).join(".");
}

/**
 * Removes a string from a given array, and if the array is empty, run a callback function.
 * @param {string} key - The string to remove from the array.
 * @param {Array} arr - The array from which to remove the string.
 * @param {Function} callback - The callback function to call if the array is empty after this.
 */
Core.checkCompletion = function(key, arr, callback) {
  arr.remove(key);
  if(arr.length === 0) callback();
}

/**
 * Manager responsible for handling scenes.
 * @namespace
 */
function SceneManager() {}

/**
 * Contains the active scenes.
 * @type {Array.<Scene_Base>}
 * @protected
*/
SceneManager._stack = [];

/**
 * Adds a scene to the stack.
 * @param {Scene_Base} scene - The scene to add.
 */
SceneManager.push = function(scene) {
  var oldScene = this.current();
  if(!!oldScene) oldScene.pause();
  this._stack.push(scene);
  scene.start();
}

/**
 * Removes the currently active scene.
 */
SceneManager.pop = function() {
  var oldScene = this._stack.slice(-1);
  oldScene.stop();
  this._stack.pop();
  var scene = this.current();
  if(!!scene) scene.resume();
}

/**
 * Retrieves the currently active scene.
 * @returns {Scene_Base} The currently active scene.
 */
SceneManager.current = function() {
  return this._stack[this._stack.length-1];
}

/**
 * Updates the current scene.
 */
SceneManager.update = function() {
  var scene = this.current();
  if(!scene) return;
  scene.update();
}

/**
 * Renders the current scene.
 */
SceneManager.render = function() {
  var scene = this.current();
  if(!scene) return;
  scene.render();
}

/**
 * Handles the loading and caching of (JSON) data.
 * @namespace
 */
function DataManager() {}

/**
 * Cache containing JSON data.
 * @type {Cache}
 */
DataManager.cache = new Cache();
/**
 * Number of JSON files this manager has loaded.
 * @type {number}
 * @protected
 */
DataManager._loaded = 0;

/**
 * Loads a JSON object.
 * @param {string} key - The key to store the object as. If this is an empty string the asset won't be stored.
 * @param {string} url - The path to the file to load.
 * @returns {Loader} The loader responsible for loading the asset.
 */
DataManager.loadJSON = function(key, url) {
  var loader = new Loader();
  loader.load(url, Loader.TYPE_JSON);
  this._loaded++;
  if(key !== "") {
    loader.onComplete.addOnce(function(data) {
      this.cache.setItem(key, data);
    }, this);
  }
  return loader;
}

/**
 * Object responsible for managing textures.
 * @namespace
 */
function ImageManager() {}

/**
 * Cache containing single images.
 * @type {Cache}
 */
ImageManager.imageCache = new Cache();
/**
 * Cache containing sprite sheets.
 * @type {Cache}
 */
ImageManager.spriteSheetCache = new Cache();
/**
 * Number of single images this manager has loaded.
 * @type {number}
 * @protected
 */
ImageManager._imagesLoaded = 0;
/**
 * Number of sprite sheets this manager has loaded.
 * @type {number}
 * @protected
 */
ImageManager._spriteSheetsLoaded = 0;

/**
 * Loads a single image.
 * @param {string} key - The key to store the object as. If this is an empty string the asset won't be stored.
 * @param {string} url - The path to the file to load.
 * @returns {Loader} The loader responsible for loading the asset.
 */
ImageManager.loadImage = function(key, url) {
  var loader = new Loader();
  loader.load(url, Loader.TYPE_IMAGE);
  this._imagesLoaded++;
  if(key !== "") {
    loader.onComplete.addOnce(function(texture) {
      this.imageCache.setItem(key, texture);
    }, this);
  }
  return loader;
}

/**
 * Loads a sprite sheet.
 * @param {string} key - The key to store the object as. If this is an empty string the asset won't be stored.
 * @param {string} url - The path to the file to load.
 * @returns {Loader} The loader responsible for loading the asset.
 */
ImageManager.loadSpriteSheet = function(key, url) {
  var loader = new Loader();
  loader.load(url, Loader.TYPE_SPRITESHEET);
  this._spriteSheetsLoaded++;
  if(key !== "") {
    loader.onComplete.addOnce(function(spritesheet) {
      this.spriteSheetCache.setItem(key, spritesheet);
    }, this);
  }
  return loader;
}

/**
 * Object responsible for managing audio files.
 * @namespace
 */
function AudioManager() {}

/**
 * Cache containing audio files.
 * @type {Cache}
 */
AudioManager.cache = new Cache();
/**
 * Number of audio files this manager has loaded.
 * @type {number}
 */
AudioManager._audioLoaded = 0;

/**
 * Loads an audio file.
 * @param {string} key - The key to store the object as. If this is an empty string the asset won't be stored.
 * @param {string} url - The path to the file to load.
 * @returns {Loader} The loader responsible for loading the asset.
 */
AudioManager.loadAudio = function(key, url) {
  var loader = new Loader();
  loader.load(url, Loader.TYPE_AUDIO);
  this._audioLoaded++;
  if(key !== "") {
    loader.onComplete.addOnce(function(howl) {
      this.cache.setItem(key, howl);
    }, this);
  }
  return loader;
}

/**
 * Handles user input.
 * @namespace
 */
function InputManager() {}

/**
 * Starts the input manager.
 * @protected
 */
InputManager.start = function() {
  this.initMembers();
  this.attachBasicEvents();
}

/**
 * Initializes member variables.
 * @protected
 */
InputManager.initMembers = function() {
  this.position = {
    mouse: {
      screen: new Point(),
      game: new Point()
    }
  };
  // Add buttons
  this.buttons = {};
  var keys = [
    "Alt",
    "Control",
    "Shift",
    "CapsLock",
    "NumLock",
    "ScrollLock",
    "Enter",
    "Tab",
    " ",
    "ArrowDown",
    "ArrowLeft",
    "ArrowUp",
    "ArrowRight",
    "End",
    "Home",
    "PageDown",
    "PageUp",
    "Backspace",
    "Delete",
    "Insert",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
    "F13",
    "F14",
    "F15",
    "F16",
    "F17",
    "F18",
    "F19",
    "F20",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "-",
    "=",
    "[",
    "]",
    ";",
    "'",
    ",",
    ".",
    "/",
    "\\",
    "`",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "Numpad0",
    "Numpad1",
    "Numpad2",
    "Numpad3",
    "Numpad4",
    "Numpad5",
    "Numpad6",
    "Numpad7",
    "Numpad8",
    "Numpad9",
    "NumpadDelete",
    "NumpadEnter",
    "NumpadAdd",
    "NumpadSubtract",
    "NumpadMultiply",
    "NumpadDivide",
    "Mouse1",
    "Mouse2",
    "Mouse3",
    "Mouse4",
    "Mouse5"
  ];
  for(var a = 0;a < keys.length;a++) {
    var keyName = keys[a];
    this.buttons[keyName] = new Key();
  }
}

/**
 * Adds basic event listeners.
 * @protected
 */
InputManager.attachBasicEvents = function() {
  // Update mouse position on the screen
  window.addEventListener("mousemove", this._onMouseMoveScreen.bind(this));
  // Update mouse position in the renderer
  Core.renderer.view.addEventListener("mousemove", this._onMouseMoveContent.bind(this));
  // Mouse down
  Core.renderer.view.addEventListener("mousedown", this._onMouseDown.bind(this));
  // Mouse up
  window.addEventListener("mouseup", this._onMouseUp.bind(this));
  // Key down
  window.addEventListener("keydown", this._onKeyDown.bind(this));
  // Key up
  window.addEventListener("keyup", this._onKeyUp.bind(this));
}

/**
 * Event listener for a mouse screen move event.
 * @param {MouseEvent} e - The event associated with this listener.
 * @protected
 */
InputManager._onMouseMoveScreen = function(e) {
  this.position.mouse.screen.set(e.screenX, e.screenY);
}

/**
 * Event listener for a mouse content move event.
 * @param {MouseEvent} e - The event associated with this listener.
 * @protected
 */
InputManager._onMouseMoveContent = function(e) {
  var rect = Core.renderer.view.getBoundingClientRect();
  var gameX = Math.round((e.clientX - rect.left) * (Core.renderer.width / (rect.right - rect.left)));
  var gameY = Math.round((e.clientY - rect.top) * (Core.renderer.height / (rect.bottom - rect.top)));
  this.position.mouse.game.set(gameX, gameY);
}

/**
 * Event listener for mouse down event.
 * @param {MouseEvent} e - The event associated with this listener.
 * @protected
 */
InputManager._onMouseDown = function(e) {
  var name = "Mouse" + (e.button+1).toString();
  this.buttons[name].onPress.dispatch();
}

/**
 * Event listener for mouse up event.
 * @param {MouseEvent} e - The event associated with this listener.
 * @protected
 */
InputManager._onMouseUp = function(e) {
  var name = "Mouse" + (e.button+1).toString();
  this.buttons[name].onRelease.dispatch();
}

/**
 * Event listener for a keyboard key press event.
 * @param {KeyboardEvent} e - The event associated with this listener.
 * @protected
 */
InputManager._onKeyDown = function(e) {
  var keyName = this.convertKeyboardEventToButton(e);
  if(!!this.buttons[keyName]) {
    this.buttons[keyName].onPress.dispatch();
  }
}

/**
 * Event listener for a keyboard key release event.
 * @param {KeyboardEvent} e - The event associated with this listener.
 * @protected
 */
InputManager._onKeyUp = function(e) {
  var keyName = this.convertKeyboardEventToButton(e);
  if(!!this.buttons[keyName]) {
    this.buttons[keyName].onRelease.dispatch();
  }
}

/**
 * Converts a keyboard event to an appropriate InputManager button variable name.
 * @param {KeyboardEvent} e - The keyboard event to convert.
 * @returns {string} An appropriate variable name for InputManager buttons, or the default value.
 */
InputManager.convertKeyboardEventToButton = function(e) {
  var key = e.key;
  // Determine and return results
  switch(key) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "Enter":
      if(e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
        return "Numpad" + key.toString();
      }
      break;
    case "-":
      if(e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
        return "NumpadSubtract";
      }
      break;
    case "+":
      if(e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
        return "NumpadAdd";
      }
      break;
    case "/":
      if(e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
        return "NumpadDivide";
      }
      break;
    case "*":
      if(e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
        return "NumpadMultiply";
      }
      break;
  }
  // Convert shifted misc keys
  if(key === "~") key = "`";
  else if(key === "_") key = "-";
  else if(key === "+") key = "=";
  else if(key === "{") key = "[";
  else if(key === "}") key = "]";
  else if(key === ":") key = ";";
  else if(key === "\"") key = "'";
  else if(key === "<") key = ",";
  else if(key === ">") key = ".";
  else if(key === "?") key = "/";
  else if(key === "|") key = "\\";
  else if(key === "!") key = "1";
  else if(key === "@") key = "2";
  else if(key === "#") key = "3";
  else if(key === "$") key = "4";
  else if(key === "%") key = "5";
  else if(key === "^") key = "6";
  else if(key === "&") key = "7";
  else if(key === "*") key = "8";
  else if(key === "(") key = "9";
  else if(key === ")") key = "0";
  // Return results
  return key;
}

/**
 * Handles tweens.
 * @namespace
 */
function TweenManager() {}

TweenManager.start = function() {
  this.initMembers();
}

/**
 * Initializes member variables.
 * @protected
 */
TweenManager.initMembers = function() {
}

/**
 * Creates a new tween.
 * @param {Object} obj - The object to tween.
 * @returns {TWEEN.Tween} The newly created tween.
 */
TweenManager.create = function(obj) {
  var tween = new TWEEN.Tween(obj);
  return tween;
}

/**
 * Updates this manager.
 * @param {DOMHighResTimeStamp} time - A timestamp as given by requestAnimationFrame
 * @protected
 */
TweenManager.update = function(time) {
  TWEEN.update(time);
}

function Scene_Base() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * The base for all scenes.
 * @constructs Scene_Base
 */
Scene_Base.prototype.initialize = function() {
  this.initMembers();
}

/**
 * Initializes member variables.
 * @protected
 */
Scene_Base.prototype.initMembers = function() {
  /**
   * Contains this scene's display objects.
   * @type {PIXI.Container}
   */
  this.stage = new PIXI.Container();
  /**
   * List containing this scene's cameras.
   * @type {Array.<Camera>}
   */
  this.cameras = [];
}

/**
 * Called whenever this scene starts for the first time.
 * @abstract
 */
Scene_Base.prototype.start = function() {}

/**
 * Called whenever this scene stops for the last time.
 * @abstract
 */
Scene_Base.prototype.stop = function() {}

/**
 * Called whenever this scene resumes from a paused state.
 * @abstract
 */
Scene_Base.prototype.resume = function() {}

/**
 * Called whenever this scene pauses from an active state.
 * @abstract
 */
Scene_Base.prototype.pause = function() {}

/**
* Updates this scene's logic once evey frame.
* @abstract
*/
Scene_Base.prototype.update = function() {}

/**
 * Renders this scene's cameras.
 * @abstract
 */
Scene_Base.prototype.render = function() {
  this.renderCameras();
  Core.renderer.render(this.stage);
}

/**
 * Renders this scene's cameras.
 */
Scene_Base.prototype.renderCameras = function() {
  for(var a = 0;a < this.cameras.length;a++) {
    var camera = this.cameras[a];
    camera.render();
  }
}

/**
 * Adds a camera to this scene.
 * @param {Rect} world - The portion of the world that is visible.
 * @param {Rect} port - The portion of the screen that this camera will be drawn to.
 * @param {PIXI.DisplayObject=} target - The initial target of this camera.
 * @returns {Camera} The newly made camera.
 */
Scene_Base.prototype.addCamera = function(world, port, target) {
  var camera = new Camera(world, port, target);
  this.cameras.push(camera);
  this.stage.addChild(camera.view);
  return camera;
}

function Scene_Boot() {
  this.initialize.apply(this, arguments);
}

Scene_Boot.prototype = Object.create(Scene_Base.prototype);
Scene_Boot.prototype.constructor = Scene_Boot;

/**
 * @class
 * The first scene in the game, used for preloading etc.
 * @constructs Scene_Boot
 * @augments Scene_Base
 */
Scene_Boot.prototype.initialize = function() {
  Scene_Base.prototype.initialize.call(this);
}

/**
 * Called whenever this scene starts for the first time.
 */
Scene_Boot.prototype.start = function() {
  Scene_Base.prototype.start.call(this);
  this.loadAssetList();
}

/**
 * Loads the asset list.
 */
Scene_Boot.prototype.loadAssetList = function() {
  var loader = DataManager.loadJSON("", "assets/assetlist.json");
  loader.onComplete.addOnce(function(list) {
    this.loadAssets(list);
  }, this, [], 45);
}

/**
 * Starts loading base game assets.
 */
Scene_Boot.prototype.loadAssets = function(list) {
  var keys = [];
  // Load data
  for(var a = 0;a < list.data.length;a++) {
    let obj = list.data[a];
    keys.push(obj.key);
    var loader = DataManager.loadJSON(obj.key, obj.url);
    loader.onComplete.addOnce(function() {
      Core.checkCompletion(obj.key, keys, this.nextScene.bind(this));
    }, this, [], 45);
  }
  // Load images
  for(var a = 0;a < list.images.length;a++) {
    let obj = list.images[a];
    keys.push(obj.key);
    var loader = ImageManager.loadImage(obj.key, obj.url);
    loader.onComplete.addOnce(function() {
      Core.checkCompletion(obj.key, keys, this.nextScene.bind(this));
    }, this, [], 45);
  }
  // Load sprite sheets
  for(var a = 0;a < list.spritesheets.length;a++) {
    let obj = list.spritesheets[a];
    keys.push(obj.key);
    var loader = ImageManager.loadSpriteSheet(obj.key, obj.url);
    loader.onComplete.addOnce(function() {
      Core.checkCompletion(obj.key, keys, this.nextScene.bind(this));
    }, this, [], 45);
  }
  // Load audio files
  for(var a = 0;a < list.audio.length;a++) {
    let obj = list.audio[a];
    keys.push(obj.key);
    var loader = AudioManager.loadAudio(obj.key, obj.url);
    loader.onComplete.addOnce(function() {
      Core.checkCompletion(obj.key, keys, this.nextScene.bind(this));
    }, this, [], 45);
  }
}

/**
 * Starts the next scene.
 */
Scene_Boot.prototype.nextScene = function() {
  SceneManager.push(new Scene_Game());
}

function Scene_Game() {
  this.initialize.apply(this, arguments);
}

Scene_Game.prototype = Object.create(Scene_Base.prototype);
Scene_Game.prototype.constructor = Scene_Game;

/**
 * @class
 * Scene responsible for handling gameplay.
 * @constructs Scene_Game
 * @augments Scene_Base
 */
Scene_Game.prototype.initialize = function() {
  Scene_Base.prototype.initialize.call(this);
}

/**
 * Called whenever this scene starts for the first time.
 */
Scene_Game.prototype.start = function() {
  Scene_Base.prototype.start.call(this);
  var map = new Game_Map();
  var cam = this.addCamera(
    new Rect(0, 0, 400, 300),
    new Rect(0, 0, 800, 600),
    map.stage
  );
  map.load("assets/maps/test.json");
  map.onCreate.addOnce(function() {
    var coords = { x: 0, y: 0 };
    var tween = TweenManager.create(coords)
      .to({ x: 200, y: 150 }, 2500)
      .onUpdate(function() {
        cam.world.x = this.x;
        cam.world.y = this.y;
      })
      .start();
    var coords2 = { x: cam.port.width, y: cam.port.height };
    var tween = TweenManager.create(coords2)
      .to({ x: 400, y: 300}, 2500)
      .onUpdate(function() {
        cam.port.width = this.x;
        cam.port.height = this.y;
      })
      .start();
  }, this);
}

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

function Game_Object() {
  this.initialize.apply(this, arguments);
}

Game_Object.prototype = Object.create(PIXI.Sprite.prototype);
Game_Object.prototype.constructor = Game_Object;

/**
 * @class
 * The base for all game objects.
 * @constructs Game_Object
 */
Game_Object.prototype.initialize = function() {
  /**
   * Storage space of this object's components.
   * @type {Array.<Component_Base>}
   */
  this.components = [];
}

/**
 * Updates this object's logic.
 */
Game_Object.prototype.update = function() {
  for(var a = 0;a < this.components.length;a++) {
    var comp = this.components[a];
    comp.update();
  }
}

/**
 * Attaches a component to this object.
 * @param {Component_Base} component - A new component to add.
 * @returns {Component_Base} The newly inserted component.
 */
Game_Object.prototype.attachComponent = function(component) {
  this.components.push(component);
  return component;
}

/**
 * Removes a component from this object.
 * @param {Component_Base} component - The component to remove.
 */
Game_Object.prototype.removeComponent = function(component) {
  this.components.remove(component);
}

/**
 * Checks whether this object has a component of a given type.
 * @param {Component_Base} component - The component to check for.
 * @returns {Boolean} Whether this object has a component of the given type.
 */
Game_Object.prototype.hasComponent = function(component) {
  for(var a = 0;a < this.components.length;a++) {
    var test = this.components[a];
    if(test instanceof component) return true;
  }
  return false;
}

/**
 * Returns a list with the components of the specified type on this object.
 * @param {Component_Base} component - The component to list.
 * @returns {Array.<Component_Base>} An array containing this object's components of the specified type.
 */
Game_Object.prototype.getComponents = function(component) {
  var result = [];
  for(var a = 0;a < this.components.length;a++) {
    var test = this.components[a];
    if(test instanceof component) result.push(test);
  }
  return result;
}

function Game_Player() {
  this.initialize.apply(this, arguments);
}

Game_Player.prototype = Object.create(Game_Object.prototype);
Game_Player.prototype.constructor = Game_Player;

Game_Player.prototype.initialize = function(str1, str2, no) {
  Game_Object.prototype.initialize.call(this);
}

function Component_Base() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * The base for all components.
 * @param {Game_Object} parent - The game object that this component belongs to.
 * @constructs Component_Base
 */
Component_Base.prototype.initialize = function(parent) {
  /**
   * The game object that this component belongs to.
   * @type {Game_Object}
   */
  this.parent = parent;
}

/**
 * Called every frame.
 * @abstract
 */
Component_Base.prototype.update = function() {}

function Component_Physics_Platform() {
  this.initialize.apply(this, arguments);
}

Component_Physics_Platform.prototype = Object.create(Component_Base.prototype);
Component_Physics_Platform.prototype.constructor = Component_Physics_Platform;

/**
 * @class
 * Controls a game object with platform physics.
 * @param {Game_Object} parent - The game object that this component belongs to.
 * @constructs Component_Physics_Platform
 */
Component_Physics_Platform.prototype.initialize = function(parent) {
  Component_Base.prototype.initialize.call(this, parent);
}

window.addEventListener("load", Core.start.bind(Core));
