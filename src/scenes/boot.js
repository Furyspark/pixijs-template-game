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
