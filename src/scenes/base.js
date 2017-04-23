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
