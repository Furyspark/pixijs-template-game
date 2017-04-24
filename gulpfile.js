var gulp = require("gulp");
var concat = require("gulp-concat");

var data = {
  app: {
    sources: [
      "src/header.js",

      "src/basic/signal.js",
      "src/basic/signalbinding.js",
      "src/basic/point.js",
      "src/basic/rect.js",
      "src/basic/cache.js",
      "src/basic/loader.js",
      "src/basic/spritesheet.js",
      "src/basic/camera.js",
      "src/basic/input_key.js",

      "src/core.js",

      "src/managers/scenemanager.js",
      "src/managers/datamanager.js",
      "src/managers/imagemanager.js",
      "src/managers/audiomanager.js",
      "src/managers/inputmanager.js",
      "src/managers/tweenmanager.js",

      "src/scenes/base.js",
      "src/scenes/boot.js",
      "src/scenes/game.js",

      "src/map/map.js",
      "src/map/tileset.js",
      "src/map/layer_base.js",
      "src/map/layer_tile.js",
      "src/map/layer_object.js",
      "src/map/tile.js",

      "src/objects/game_object.js",
      "src/objects/game_player.js",

      "src/components/base.js",
      "src/components/physics_platform.js",

      "src/footer.js"
    ],
    target: {
      fn: "app.js",
      dir: "lib/"
    }
  }
};

gulp.task("game", function() {
  gulp.src(data.app.sources)
    .pipe(concat(data.app.target.fn, { newLine: "\n" }))
    .pipe(gulp.dest(data.app.target.dir));
});

gulp.task("default", ["game"]);
