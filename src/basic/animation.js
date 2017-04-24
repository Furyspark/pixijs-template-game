function Animation() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * Represents an animation for a PIXI.Sprite.
 * @param {AnimationController} parent - The controller this animation belongs to.
 * @constructs Animation
 */
Animation.prototype.initialize = function(parent) {
  /**
   * The controller this animation belongs to.
   * @type {AnimationController}
   */
  this.parent = parent;
  /**
   * Contains the frames used for this animation.
   * @type {Array.<PIXI.Texture>}
   */
  this.frames = [];
  /**
   * Frames per second of this animation.
   * @type {number}
   */
  this.fps = 15;
}
