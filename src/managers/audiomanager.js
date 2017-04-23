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
