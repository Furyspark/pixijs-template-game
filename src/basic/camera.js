function Camera() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * Viewport into the world.
 * @param {Rect} world - The portion of the world that is visible.
 * @param {Rect} port - The portion of the screen that this camera will be drawn to.
 * @param {PIXI.DisplayObject=} target - The initial target of this camera.
 * @constructs Camera
 */
Camera.prototype.initialize = function(world, port, target) {
  /**
   * The portion of the world that is visible on this camera.
   * @type {Rect}
   */
  this.world = world;
  /**
   * The portion of the screen that this camera will be draw to.
   * @type {Rect}
   */
  this.port = port;
  /**
   * The target of this camera. Most commonly a map's stage.
   * @type {PIXI.DisplayObject}
   */
  this.target = null;
  /**
   * This camera's render texture.
   * @type {PIXI.RenderTexture}
   * @protected
   */
  this.texture = PIXI.RenderTexture.create(this.world.width, this.world.height);
  /**
   * This camera's sprite, to be added to a scene's stage for example.
   * @type {PIXI.Sprite}
   */
  this.view = new PIXI.Sprite(this.texture);
  if(target instanceof PIXI.DisplayObject) this.setTarget(target);
  this.refresh();
}

/**
 * Sets the target of this camera.
 * @param {PIXI.DisplayObject} target - The new target of this camera.
 */
Camera.prototype.setTarget = function(target) {
  this.target = target;
}

/**
 * Refreshes the camera's texture position etc.
 * @protected
 */
Camera.prototype.refresh = function() {
  // Update world size
  if(this.texture.width !== this.world.width || this.texture.height !== this.world.height) {
    this.texture.resize(this.world.width, this.world.height, false);
  }
  // Update view size
  if(this.view.width !== this.port.width || this.view.height !== this.port.height) {
    this.view.width = this.port.width;
    this.view.height = this.port.height;
  }
}

/**
 * Renders the camera.
 */
Camera.prototype.render = function() {
  this.refresh();
  this.target.setTransform(
    -this.world.x,
    -this.world.y
  );
  Core.renderer.render(this.target, this.texture);
}
