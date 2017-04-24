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
 * Currently playing music.
 * @type {SoundFile}
 */
AudioManager.music = null;

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
 * Plays a sound effect.
 * @param {Howl} howl - The sound effect to play.
 * @param {number} [volume=1] - The volume to play the sound at. From 0.0 to 1.0.
 * @returns {SoundFile} The SoundFile created for this Howl.
 */
AudioManager.playSound = function(howl, volume) {
  if(!volume && volume !== 0) volume = 1;
  var snd = new SoundFile(howl, howl.play());
  snd.volume = volume;
  snd.loop = false;
  return snd;
}

/**
 * Plays music.
 * @param {Howl} howl - The music to play.
 * @param {number} [volume=1] - The volume of the music to play. From 0.0 to 1.0.
 * @returns {SoundFile} The SoundFile created for this Howl.
 */
AudioManager.playMusic = function(howl, volume) {
  if(!volume && volume !== 0) volume = 1;
  if(this.music) this.music.stop();
  this.music = new SoundFile(howl, howl.play());
  this.music.volume = volume;
  this.music.loop = true;
  return this.music;
}

/**
 * Stops the currently playing music.
 */
AudioManager.stopMusic = function() {
  if(this.music) this.music.stop();
}
