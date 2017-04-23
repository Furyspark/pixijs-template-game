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
