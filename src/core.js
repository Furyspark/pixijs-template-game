/**
 * The core of the game.
 * @namespace
 */
function Core() {}

/**
 * Starts the game.
 * @protected
 */
Core.start = function() {
  this.initRenderer(800, 600);
  this.fitContent_LetterBox();
  this.attachBasicEvents();
  this.startManagers();
  this.startGame();
}

/**
 * Initializes the renderer.
 * @param {number} width - Width of the game screen.
 * @param {number} height - Height of the game screen.
 * @protected
 */
Core.initRenderer = function(width, height) {
  /**
   * The renderer of the game view.
   * @type {PIXI.WebGLRenderer}
   */
  this.renderer = new PIXI.WebGLRenderer({
    width: width,
    height: height,
    roundPixels: true
  });
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  this.renderer.view.style.position = "absolute";
  document.body.appendChild(this.renderer.view);
}

/**
 * Fits the game screen to the window.
 */
Core.fitContent = function() {
  var iw = window.innerWidth;
  var ih = window.innerHeight;
  this.renderer.view.style.width = iw.toString() + "px";
  this.renderer.view.style.height = ih.toString() + "px";
}

/**
 * Scales the content to a letterbox.
 */
Core.fitContent_LetterBox = function() {
  var iw = window.innerWidth;
  var ih = window.innerHeight;
  var winRatio = iw / ih;
  var gameRatio = this.renderer.width / this.renderer.height;
  var left = 0;
  var top = 0;
  var width = iw;
  var height = ih;
  if(winRatio <= gameRatio) {
    height = Math.floor(width / gameRatio);
    top = Math.floor((ih / 2) - (height / 2));
  } else {
    width = Math.floor(height * gameRatio);
    left = Math.floor((iw / 2) - (width / 2));
  }
  this.renderer.view.style.width = width.toString() + "px";
  this.renderer.view.style.height = height.toString() + "px";
  this.renderer.view.style.left = left.toString() + "px";
  this.renderer.view.style.top = top.toString() + "px";
}

/**
 * Adds basic event listeners.
 * @protected
 */
Core.attachBasicEvents = function() {
  // Fit game screen on resize.
  window.addEventListener("resize", function() {
    Core.fitContent_LetterBox();
  });
}

/**
 * Starts the game, booting up the Boot scene.
 */
Core.startGame = function() {
  SceneManager.push(new Scene_Boot());
  this.update();
}

/**
 * Starts various managers that need starting up.
 */
Core.startManagers = function() {
  InputManager.start();
  TweenManager.start();
}

/**
 * Updates the game, and renders it.
 * @param {DOMHighResTimeStamp} time - The time from a requestAnimationFrame callback.
 */
Core.update = function(time) {
  requestAnimationFrame(this.update.bind(this));
  InputManager.update();
  TweenManager.update(time);
  SceneManager.update();
  this.render();
}

/**
 * Renders the game.
 */
Core.render = function() {
  SceneManager.render();
}

/**
 * Returns the filename of a URL.
 * @param {string} url - The full URL of a file.
 * @returns {string} The filename with the path cut off.
 */
Core.getFilename = function(url) {
  return url.split("/").slice(-1)[0];
}

/**
 * Returns the filename of a URL without the file extension.
 * @param {string} url - The full URL of a file.
 * @returns {string} The filename with the path and the extension part cut off.
 */
Core.getBaseFilename = function(url) {
  return url.split("/").slice(-1)[0].split(".").slice(0, -1).join(".");
}

/**
 * Removes a string from a given array, and if the array is empty, run a callback function.
 * @param {string} key - The string to remove from the array.
 * @param {Array} arr - The array from which to remove the string.
 * @param {Function} callback - The callback function to call if the array is empty after this.
 */
Core.checkCompletion = function(key, arr, callback) {
  arr.remove(key);
  if(arr.length === 0) callback();
}
