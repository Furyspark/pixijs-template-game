/**
 * Manager responsible for handling scenes.
 * @namespace
 */
function SceneManager() {}

/**
 * Contains the active scenes.
 * @type {Array.<Scene_Base>}
 * @protected
*/
SceneManager._stack = [];

/**
 * Adds a scene to the stack.
 * @param {Scene_Base} scene - The scene to add.
 */
SceneManager.push = function(scene) {
  var oldScene = this.current();
  if(!!oldScene) oldScene.pause();
  this._stack.push(scene);
  scene.start();
}

/**
 * Removes the currently active scene.
 */
SceneManager.pop = function() {
  var oldScene = this._stack.slice(-1);
  oldScene.stop();
  this._stack.pop();
  var scene = this.current();
  if(!!scene) scene.resume();
}

/**
 * Retrieves the currently active scene.
 * @returns {Scene_Base} The currently active scene.
 */
SceneManager.current = function() {
  return this._stack[this._stack.length-1];
}

/**
 * Updates the current scene.
 */
SceneManager.update = function() {
  var scene = this.current();
  if(!scene) return;
  scene.update();
}

/**
 * Renders the current scene.
 */
SceneManager.render = function() {
  var scene = this.current();
  if(!scene) return;
  scene.render();
}
