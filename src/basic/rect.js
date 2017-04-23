function Rect() {
  this.initialize.apply(this, arguments);
}

Rect.prototype = Object.create(PIXI.Rectangle.prototype);
Rect.prototype.constructor = Rect;

/**
 * @class
 */
Object.defineProperties(Rect.prototype, {
  /**
   * Same as Rect.x
   * @memberof Rect.prototype
   */
  left: {
    get: function() { return this.x; },
    set: function(value) { this.x = value; }
  },
  /**
   * Same as Rect.y
   * @memberof Rect.prototype
   */
  top: {
    get: function() { return this.y; },
    set: function(value) { this.y = value; }
  },
  /**
   * Same as Rect.x + Rect.width
   * @memberof Rect.prototype
   */
  right: {
    get: function() { return this.x + this.width; },
    set: function(value) { this.width = value - this.x; }
  },
  /**
   * Same as Rect.y + Rect.height
   * @memberof Rect.prototype
   */
  bottom: {
    get: function() { return this.y + this.height; },
    set: function(value) { this.height = value - this.y; }
  }
});

/**
 * Represents a geometrical rectangle.
 * @param {number} x - Original left of the rectangle.
 * @param {number} y - Original top of the rectangle.
 * @param {number} w - Original width of the rectangle.
 * @param {number} h - Original height of the rectangle.
 * @constructs Rect
 */
Rect.prototype.initialize = function(x, y, w, h) {
  PIXI.Rectangle.prototype.constructor.call(this, x, y, w, h);
}

/**
 * Whether this rectangle overlaps with another rectangle.
 * @param {Rect} rect - Other rectangle to test against.
 * @returns {Boolean} Whether the two rectangles overlap.
 */
Rect.prototype.overlap = function(rect) {
  return ((rect.right > this.left && rect.left < this.right) &&
  (rect.bottom > this.top && rect.top < this.bottom));
}

/**
 * Duplicates this rectangle.
 * @returns {Rect} A duplicate of this rectangle.
 */
Rect.prototype.clone = function() {
  return new Rect(this.x, this.y, this.width, this.height);
}

/**
 * Rotates the rectangle by a certain amount.
 * @param {number} angle - The angle in radians to rotate this rect.
 */
Rect.prototype.rotate = function(angle) {
  var tl = new Point(this.x, this.y);
  var tr = new Point(this.x + this.width, this.y);
  var bl = new Point(this.x, this.y + this.height);
  var br = new Point(this.x + this.width, this.y + this.height);
  tl.rotate(angle);
  tr.rotate(angle);
  bl.rotate(angle);
  br.rotate(angle);
  this.x = Math.min(tl.x, tr.x, bl.x, br.x);
  this.y = Math.min(tl.y, tr.y, bl.y, br.y);
  this.width = Math.max(tl.x, tr.x, bl.x, br.x) - Math.min(tl.x, tr.x, bl.x, br.x);
  this.height = Math.max(tl.y, tr.y, bl.y, br.y) - Math.min(tl.y, tr.y, br.y, br.y);
}
