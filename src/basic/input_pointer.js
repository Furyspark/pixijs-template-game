function Input_Pointer() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * Represents a pointer, such as a mouse.
 * @constructs Input_Pointer
 */
Input_Pointer.prototype.initialize = function() {
  /**
   * The position of this pointer.
   * @type {Point}
   * @readonly
   */
  this.position = new Point();
  /**
   * Movement since last update.
   * @type {Point}
   * @readonly
   */
  this.movement = new Point();
}

/**
 * Updates position from InputManager.update.
 */
Input_Pointer.updatePosition = function(x, y) {
  var prevX = this.position.x;
  var prevY = this.position.y;
  this.position.set(x, y);
  this.movement.set(this.position.x - prevX, this.position.y - prevY);
}
