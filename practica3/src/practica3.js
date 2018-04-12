var game = function() {
var Q = window.Q = Quintus()
	.include("Scenes, Sprites, Input, UI, Touch, TMX, Anim, 2D")
	.setup({ width: 320, height: 480 })
	.controls().touch()

	Q.loadTMX("level.tmx", function() {
		Q.stageScene("level1");
	});

	Q.scene("level1", function(stage) {
		Q.stageTMX("level.tmx", stage);
		var mario = stage.insert(new Q.Mario());
		stage.add("viewport").follow(mario);
	});

	Q.Sprite.extend("Mario", {
		init: function(p) {
			this.add("2d, platformerControls")
			this._super({
				sheet: "marioR",
				x: 150,
				y: 380
			});
		}
	});

	Q.load("mario_small.png, mario_small.json", function() {
		Q.compileSheet("mario_small.png", "mario_small.json")
	});

}