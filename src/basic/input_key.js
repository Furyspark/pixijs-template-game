function Input_Key() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * An abstract object for an input button.
 * @constructs Input_Key
 */
Input_Key.prototype.initialize = function() {
  /**
   * Indicates whether this key is being held down currently.
   * @type {Boolean}
   */
  this.down = false;
  /**
   * Fired when the key is pressed.
   * @type {Signal}
   */
  this.onPress = new Signal();
  /**
   * Fired when the key is released.
   * @type {Signal}
   */
  this.onRelease = new Signal();

  this.attachBasicEvents();
}

/**
 * Adds basic events for this key.
 * @protected
 */
Input_Key.prototype.attachBasicEvents = function() {
  this.onPress.add(function() {
    this.down = true;
  }, this, [], 100);
  this.onRelease.add(function() {
    this.down = false;
  }, this, [], 100);
}
