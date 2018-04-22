var game = function() {
var Q = window.Q = Quintus()
	.include("Sprites, Scenes, Input, UI, Touch, TMX, Anim, 2D")
	.setup({ width: 320, height: 480 })
	.controls().touch()

	Q.Sprite.extend("Mario", {
		init: function(p) {
			this._super(p, {
				sheet: "marioR",
				frame: 0,
				x: 150,
				y: 380
			});
			this.add("2d, platformerControls");
			this.on("hit.sprite", function(collision) {
				// TODO
			});
		},

		step: function(dt) {
			if (this.p.y >= 700) {
				this.p.sheet = "marioR";
				this.p.frame = 0;
				this.p.x = 150;
				this.p.y = 380;
			}
		}
	});

	Q.Sprite.extend("Goomba", {
		init: function(p) {
			this._super(p, {
				sheet: "goomba",
				frame: 0,
				x: 1600,
				y: 380,
				vx: 100
			});

			this.add("2d, aiBounce");
			this.on("bump.left, bump.right, bump.bottom", function(collision) {
				if (collision.obj.isA("Mario")) {
					Q.stageScene("endGame", 1, { label: "You Died" });
					collision.obj.destroy();
				}
			});
			this.on("bump.top", function(collision) {
				if (collision.obj.isA("Mario")) {
					this.destroy();
					collision.obj.p.vy = -300;
				}
			})
		}
	});

	Q.Sprite.extend("Bloopa", {
		init: function(p) {
			this._super(p, {
				sheet: "bloopa",
				gravity: 0.1,
				frame: 0,
				x: 500,
				y: 480,
				vy: 50
			});

			this.add("2d, aiBounce");
			this.on("bump.left, bump.right, bump.bottom", function(collision) {
				if (collision.obj.isA("Mario")) {
					Q.stageScene("endGame", 1, { label: "You Died" });
					collision.obj.destroy();
				}
				else this.p.vy = -100;
			})
			this.on("bump.top", function(collision) {
				if (collision.obj.isA("Mario")) {
					this.destroy();
					collision.obj.p.vy = -300;
				}
			})
		}
	});

	Q.Sprite.extend("Princess", {
		init: function(p) {
			this._super(p, {
				sheet: "princess",
				frame: 0,
				x: 1800,
				y: 380
			});

			this.on("bump.left, bump.right, bump.top", function(collision) {
				if (collision.obj.isA("Mario")) {
					Q.stageScene("winGame", 1, { label: "You Won!" });
				}
			})
		}
	});

	Q.scene("level1", function(stage) {
		Q.stageTMX("level.tmx", stage);
		const mario = stage.insert(new Q.Mario());
		stage.add("viewport").follow(mario);
		stage.viewport.offsetX = -130;
		stage.viewport.offsetY = 160;

		stage.insert(new Q.Goomba());
		stage.insert(new Q.Bloopa());
		stage.insert(new Q.Princess());
	});

	Q.scene("endGame", function(stage) {
		const container = stage.insert(
			new Q.UI.Container({
				x: Q.width/2,
				y: Q.height/2,
				fill: "rgba(0,0,0,0.5)"
			})
		);

		const button = container.insert(
			new Q.UI.Button({
				x: 0,
				y: 0,
				fill: "#CCCCCC",
				label: "Play Again"
			})
		);

		const label = container.insert(
			new Q.UI.Text({
				x: 10,
				y: -10 - button.p.h,
				label: stage.options.label
			})
		);

		button.on("click", function() {
			Q.clearStages();
			Q.stageScene("level1");
		});

		container.fit(20);
	});

	Q.scene("winGame", function(stage) {
		const container = stage.insert(
			new Q.UI.Container({
				x: Q.width/2,
				y: Q.height/2,
				fill: "rgba(0,0,0,0.5)"
			})
		);

		const button = container.insert(
			new Q.UI.Button({
				x: 0,
				y: 0,
				fill: "#CCCCCC",
				label: "Play Again"
			})
		);

		const label = container.insert(
			new Q.UI.Text({
				x: 10,
				y: -10 - button.p.h,
				label: stage.options.label
			})
		);

		button.on("click", function() {
			Q.clearStages();
			Q.stageScene("level1");
		});
		
		container.fit(20);
	});

	Q.scene("mainMenu", function(stage) {
		const container = stage.insert(
			new Q.UI.Container({
				x: Q.width,
				y: Q.height
			})
		);

		const button = container.insert(
			new Q.UI.Button({
				x: -Q.width/2,
				y: -Q.height/2,
				fill: "#CCCCCC",
				asset: "mainTitle.png"
			})
		);

		button.on("click", function() {
			Q.clearStages();
			Q.stageScene("level1");
		});

		container.fit(20);
	})
	
	Q.loadTMX("level.tmx, mario_small.json, mario_small.png, goomba.json, goomba.png, bloopa.json, bloopa.png, princess.json, princess.png", function() {
		Q.compileSheets("mario_small.png", "mario_small.json");
		Q.compileSheets("goomba.png", "goomba.json");
		Q.compileSheets("bloopa.png", "bloopa.json");
		Q.compileSheets("princess.png", "princess.json");
		Q.stageScene("level1");
	});
};
