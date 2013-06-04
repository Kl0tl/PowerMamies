! define(["assets", "utils", "gamescene", "keyboard"], function (assets, utils, gamescene, keyboard) {
	
	var CANVAS = utils.$("screen")
		, CTX = CANVAS.getContext("2d")
		, WIDTH = CANVAS.width
		, HEIGHT = CANVAS.height;

	var character_scene = gamescene.extend({
		"score": 0
	});

	
	character_scene.on("start", function () {
		console.log("[gamescene " + this.name + "] started");
		
		CTX.fillStyle = "#000";
		CTX.fillRect(0, 0, WIDTH, HEIGHT);

		CTX.drawImage(assets.get("background.jpg"), 0, 0);

		CTX.shadowBlur = 15;
		CTX.shadowColor = "#fff";

		CTX.fillStyle = "#fff";
		CTX.textAlign = "center";
		CTX.font = "25pt Helvetica";
		CTX.fillText("Game Over", WIDTH * 0.5, HEIGHT * 0.5);

		CTX.font = "15pt Helvetica";
		CTX.fillText("Score: " + this.score, WIDTH * 0.5, HEIGHT * 0.5 + 35);

	}, character_scene);


	return character_scene;

});