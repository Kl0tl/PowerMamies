! define(["assets", "utils", "gamescene", "keyboard"], function (assets, utils, gamescene, keyboard) {
	
	var CANVAS = utils.$("screen")
		, CTX = CANVAS.getContext("2d")
		, WIDTH = CANVAS.width
		, HEIGHT = CANVAS.height;

	var character_scene = gamescene.extend({
			"background": null	

		, "update": function update() {
				if (keyboard.inputs["13"]) {
					gamescene.active("characters");
				}
			}

		, "render": function render(ctx) {
				this.background && ctx.drawImage(this.background, 0, 0);
			}
	});

	character_scene.on("start", function () {
		console.log("[gamescene " + this.name + "] started");
		
		this.background = assets.get("home.background.jpg");

		if (assets.audio) {
			var audio = assets.get("music.intro.audio*");
			audio.loop = true;
			audio.play();
		}

		keyboard.listen(CANVAS);
	}, character_scene);

	character_scene.on("destroy", function () {
		console.log("[gamescene " + this.name + "] destroyed");
		
		CTX.shadowBlur = 0;

		if (assets.audio) {
			var audio = assets.get("music.intro.audio*");
			audio.currentTime = audio.duration;
			audio.pause();
		}
	}, character_scene);

	character_scene.on("eachframe", function (now) {
		this.update(now, this.deltaTime);
		this.render(CTX);
	}, character_scene);


	return character_scene;

});