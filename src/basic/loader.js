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
