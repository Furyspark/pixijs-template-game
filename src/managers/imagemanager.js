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
