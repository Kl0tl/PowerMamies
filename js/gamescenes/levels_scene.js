! define(["assets", "gameobject", "gamescene", "button_component", "utils", "math", "levelData", "mouse"], function (assets, gameobject, gamescene, button_component, utils, math, levelData, mouse) {

	var CANVAS = utils.$("screen")
		, CTX = CANVAS.getContext("2d")
		, WIDTH = CANVAS.width
		, HEIGHT = CANVAS.height;

	var METRO_LINES = [];

	var ONCLICK = function ONCLICK() {
		if (assets.audio) {
			var a = assets.get("fx.button.audio*");
			//a.currentTime = 0;
			a.src = a.src;
			a.play();
		}
		
		gamescene.get("game").line_number = this.parent.data("line_number");
		gamescene.active("game");
	};

	var levels_scene = gamescene.extend({
				"background": null
	
			, "update": function update(now, dt) {
					gameobject.update(now, dt);
				}
			, "render": function render(ctx) {
					ctx.fillStyle = "#000";
					ctx.fillRect(0, 0, WIDTH, HEIGHT);

					this.background && ctx.drawImage(this.background, 0, 0);

					gameobject.render(ctx);
				}
	});

	levels_scene.on("start", function () {
		console.log("[gamescene " + levels_scene.name + "] started");
	
		this.background = assets.get("background.jpg");

		for (var i = 0; i < 14; i += 1) {
			var go = gameobject()
				.addComponent(button_component, {
						"normal_sprite": assets.get("metro_line" + (i + 1) + ".normal.png")
					, "hover_sprite": assets.get("metro_line" + (i + 1) + ".hover.png")
					, "width": 50
					, "height": 50
					, "onclick": ONCLICK
				})
				.data("line_number", i + 1);

			go.transform.localPosition.set(255 + 75 * (i % 7), 245 + 75 * math.round(i / 14));

			gameobject.add(go);

			METRO_LINES.push(go);
		}
	}, levels_scene);

	levels_scene.on("destroy", function () {
		console.log("[gamescene " + levels_scene.name + "] destroyed");

		var metro_lines = METRO_LINES;
		for (var i = 0, metro_line; metro_line = metro_lines[i]; i += 1) {
			gameobject.remove(metro_line);
		}

		if (assets.audio) {
			var a = assets.get("music.character.audio*");
			a.currentTime = a.duration;
			a.pause();
		}
	}, levels_scene);

	levels_scene.on("eachframe", function (now) {
		this.update(now, this.deltaTime);
		this.render(CTX);
	}, levels_scene);

	return levels_scene;

});