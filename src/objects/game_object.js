function Game_Object() {
  this.initialize.apply(this, arguments);
}

Game_Object.prototype = Object.create(PIXI.Sprite.prototype);
Game_Object.prototype.constructor = Game_Object;

/**
 * @class
 * The base for all game objects.
 * @constructs Game_Object
 */
Game_Object.prototype.initialize = function() {
  /**
   * Storage space of this object's components.
   * @type {Array.<Component_Base>}
   */
  this.components = [];
}

/**
 * Updates this object's logic.
 */
Game_Object.prototype.update = function() {
  for(var a = 0;a < this.components.length;a++) {
    var comp = this.components[a];
    comp.update();
  }
}

/**
 * Attaches a component to this object.
 * @param {Component_Base} component - A new component to add.
 * @returns {Component_Base} The newly inserted component.
 */
Game_Object.prototype.attachComponent = function(component) {
  this.components.push(component);
  return component;
}

/**
 * Removes a component from this object.
 * @param {Component_Base} component - The component to remove.
 */
Game_Object.prototype.removeComponent = function(component) {
  this.components.remove(component);
}

/**
 * Checks whether this object has a component of a given type.
 * @param {Component_Base} component - The component to check for.
 * @returns {Boolean} Whether this object has a component of the given type.
 */
Game_Object.prototype.hasComponent = function(component) {
  for(var a = 0;a < this.components.length;a++) {
    var test = this.components[a];
    if(test instanceof component) return true;
  }
  return false;
}

/**
 * Returns a list with the components of the specified type on this object.
 * @param {Component_Base} component - The component to list.
 * @returns {Array.<Component_Base>} An array containing this object's components of the specified type.
 */
Game_Object.prototype.getComponents = function(component) {
  var result = [];
  for(var a = 0;a < this.components.length;a++) {
    var test = this.components[a];
    if(test instanceof component) result.push(test);
  }
  return result;
}
