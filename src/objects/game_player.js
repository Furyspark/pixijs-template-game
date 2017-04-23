function Game_Player() {
  this.initialize.apply(this, arguments);
}

Game_Player.prototype = Object.create(Game_Object.prototype);
Game_Player.prototype.constructor = Game_Player;

Game_Player.prototype.initialize = function(str1, str2, no) {
  Game_Object.prototype.initialize.call(this);
}
