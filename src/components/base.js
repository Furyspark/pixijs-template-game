function Component_Base() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * The base for all components.
 * @param {Game_Object} parent - The game object that this component belongs to.
 * @constructs Component_Base
 */
Component_Base.prototype.initialize = function(parent) {
  /**
   * The game object that this component belongs to.
   * @type {Game_Object}
   */
  this.parent = parent;
}

/**
 * Called every frame.
 * @abstract
 */
Component_Base.prototype.update = function() {}
