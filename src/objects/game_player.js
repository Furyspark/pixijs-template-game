function Game_Player() {
  this.initialize.apply(this, arguments);
}

Game_Player.prototype = Object.create(Game_Object.prototype);
Game_Player.prototype.constructor = Game_Player;

Game_Player.prototype.initialize = function(str1, str2, no) {
  Game_Object.prototype.initialize.call(this);

  // Initialize animations
  var spr = ImageManager.spriteSheetCache.getItem("sprKeen");
  this.animation.add("idle", [spr.get("keen_idle_001.png")]);
  this.animation.add("move", [
    spr.get("keen_move_001.png"),
    spr.get("keen_move_002.png"),
    spr.get("keen_move_003.png"),
    spr.get("keen_move_004.png")
  ]);
  this.animation.play("move");
}
