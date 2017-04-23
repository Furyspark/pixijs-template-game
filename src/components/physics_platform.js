function Component_Physics_Platform() {
  this.initialize.apply(this, arguments);
}

Component_Physics_Platform.prototype = Object.create(Component_Base.prototype);
Component_Physics_Platform.prototype.constructor = Component_Physics_Platform;

/**
 * @class
 * Controls a game object with platform physics.
 * @param {Game_Object} parent - The game object that this component belongs to.
 * @constructs Component_Physics_Platform
 */
Component_Physics_Platform.prototype.initialize = function(parent) {
  Component_Base.prototype.initialize.call(this, parent);
}
