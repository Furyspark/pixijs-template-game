function Scene_Game() {
  this.initialize.apply(this, arguments);
}

Scene_Game.prototype = Object.create(Scene_Base.prototype);
Scene_Game.prototype.constructor = Scene_Game;

/**
 * @class
 * Scene responsible for handling gameplay.
 * @constructs Scene_Game
 * @augments Scene_Base
 */
Scene_Game.prototype.initialize = function() {
  Scene_Base.prototype.initialize.call(this);
}

/**
 * Called whenever this scene starts for the first time.
 */
Scene_Game.prototype.start = function() {
  Scene_Base.prototype.start.call(this);
  var map = new Game_Map();
  var cam = this.addCamera(
    new Rect(0, 0, 400, 300),
    new Rect(0, 0, 800, 600),
    map.stage
  );
  map.load("assets/maps/test.json");
}

/**
 * Updates this scene's logic once evey frame.
 */
Scene_Game.prototype.update = function() {
}
