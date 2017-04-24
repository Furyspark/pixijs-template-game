function AnimationController() {
  this.initialize.apply(this, arguments);
}

Object.defineProperties(AnimationController.prototype, {
  /**
   * The current animation.
   * @type {Animation}
   * @readonly
   * @memberof AnimationController.prototype
   */
  current: {
    get: function() {
      if(this.key === "") return undefined;
      return this.animations[this.key];
    }
  },
  /**
   * The current frame of the current animation.
   * @type {number}
   * @memberof AnimationController.prototype
   */
  frame: {
    get: function() {
      return this._frame;
    },
    set: function(value) {
      if(this.current && value >= this.current.frames.length) value = 0;
      else if(value < 0) value = 0;
      value = Math.floor(value);
      this._frame = value;
      this.frameValue = 0;
      if(this.current) this.parent.texture = this.current.frames[this._frame];
    }
  }
});

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
   * The key of the currently playing animation.
   * @type {string}
   */
  this.key = "";
  /**
   * The current frame value. If this reaches (60 / fps), this is reset to 0 and the next frame will start.
   * @type {number}
   * @readonly
   */
  this.frameValue = 0;

  this._frame = 0;
}

/**
 * Updates the animation controller.
 */
AnimationController.prototype.update = function() {
  if(this.current) {
    this.frameValue++;
    if(this.frameValue >= (60 / this.current.fps)) {
      this.frame++;
    }
  }
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
  if(this.key !== key) {
    this.key = key;
    this.frame = 0;
  }
}
