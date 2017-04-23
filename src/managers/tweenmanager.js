/**
 * Handles tweens.
 * @namespace
 */
function TweenManager() {}

TweenManager.start = function() {
  this.initMembers();
}

/**
 * Initializes member variables.
 * @protected
 */
TweenManager.initMembers = function() {
}

/**
 * Creates a new tween.
 * @param {Object} obj - The object to tween.
 * @returns {TWEEN.Tween} The newly created tween.
 */
TweenManager.create = function(obj) {
  var tween = new TWEEN.Tween(obj);
  return tween;
}

/**
 * Updates this manager.
 * @param {DOMHighResTimeStamp} time - A timestamp as given by requestAnimationFrame
 * @protected
 */
TweenManager.update = function(time) {
  TWEEN.update(time);
}
