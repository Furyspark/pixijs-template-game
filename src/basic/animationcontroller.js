function AnimationController() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * A controller for a sprite's animations.
 * @param {PIXI.Sprite} parent - The sprite this animation controller belongs to.
 * @constructs AnimationController
 */
AnimationController.prototype.initialize = function(parent) {
  /**
   * The sprite this animation controller belongs to.
   * @type {PIXI.Sprite}
   */
  this.parent = parent;
  /**
   * The animations in this controller.
   * @type {Object.<string, Animation>}
   */
  this.animations = {};
  /**
   * The name of the currently playing animation.
   * @type {string}
   */
  this.current = "";
}

/**
 * Adds an animation.
 * @param {string} key - The key/internal name of the animation.
 * @param {Array.<PIXI.Texture>} frames - The frames of the animation.
 * @returns {Animation} The newly created animation.
 */
AnimationController.prototype.add = function(key, frames) {
  var anim = new Animation(this);
  anim.frames = frames;
  this.animations[key] = anim;
  return anim;
}

/**
 * Plays an animation.
 * @param {string} key - The key/internal name of the animation.
 */
AnimationController.prototype.play = function(key) {
  if(this.current !== key) {
    this.current = key;
  }
}
