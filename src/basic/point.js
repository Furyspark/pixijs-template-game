function Point() {
  this.initialize.apply(this, arguments);
}

Point.prototype = Object.create(PIXI.Point.prototype);
Point.prototype.constructor = Point;

/**
 * @class
 * Represents a geometrical point with an x and y value.
 * @param {number} x - Original x position of this point.
 * @param {number} y - Original y position of this point.
 * @constructs Point
 */
Point.prototype.initialize = function(x, y) {
  PIXI.Point.prototype.constructor.call(this, x, y);
}

/**
 * Duplicates this point.
 * @returns {Point} The clone of this point.
 */
Point.prototype.clone = function() {
  return new Point(this.x, this.y);
}

/**
 * Returns the distance to another point.
 * @param {Point} toPos - The other point to test against.
 * @returns {number} The distance between the two points.
 */
Point.prototype.distanceTo = function(toPos) {
  return Math.sqrt(Math.pow(this.x - toPos.x, 2) + Math.pow(this.y - toPos.y, 2));
}

/**
 * Returns the angle between two points.
 * @param {Point} toPos - The other point to test against.
 * @returns {number} The angle in radians to the other point.
 */
Point.prototype.rotationTo = function(toPos) {
  var delta = new Point(toPos.x - this.x, toPos.y - this.y);
  var radians = Math.atan2(delta.y, delta.x);
  return radians;
}

/**
 * Rotates a point around an angle.
 * @param {number} angle - The angle in radians to rotate around.
 */
Point.prototype.rotate = function(angle) {
  var x = this.x;
  var y = this.y;
  this.set(
    Math.round((x * Math.cos(angle) - y * Math.sin(angle)) * 100) / 100,
    Math.round((x * Math.sin(angle) + y * Math.cos(angle)) * 100) / 100
  );
}
