! define(["assets", "gamescene", "utils", "levelData"], function (assets, gamescene, utils, levelData) {

	var CANVAS = utils.$("back")
		, CTX = CANVAS.getContext("2d")
		
		, WIDTH = CANVAS.width
		, HEIGHT = CANVAS.height

		, PROGRESS = 0
		, ALPHA = 1;


	var loading_scene = gamescene.extend({
				"onprogress": function onprogress(a, b, path) {
					PROGRESS = a / b;
					console.log((PROGRESS * 100 | 0) + "% - " + path + " loaded");
				}

			, "oncomplete": function oncomplete() {
					assets
						.off("progress", loading_scene.onprogress)
						.off("complete", loading_scene.oncomplete);

					gamescene.active("start");
				}

			, "update": function update(dt) {
					// TODO : interpolate ALPHA
				}

			, "render": function render(ctx) {
					var value = ALPHA * 255 | 0
						, width = WIDTH
						, height = HEIGHT
						, x = width * 0.5 | 0
						, y = height * 0.5 | 0;

					ctx.fillStyle = "black";
					ctx.fillRect(0, 0, width, height);

					ctx.shadowBlur = 0;

					ctx.fillStyle = "#DDDDDD";
					ctx.fillRect(0, height - 15, width * PROGRESS, 15);
					
					ctx.shadowBlur = 15;
					ctx.shadowColor = "rgb(" + value + ", " + value + ", " + value + ")";

					ctx.font = "50pt Calibri";
					ctx.textAlign = "center";
					ctx.fillText("Loading", x, y);
				}
		})

		.on("start", function () {
			console.log("[gamescene " + loading_scene.name + "] started");
		})

		.on("destroy", function () {
			console.log("[gamescene " + loading_scene.name + "] destroyed");

			CTX.shadowBlur = 0;
		})

		.on("eachframe", function (dt) {
			loading_scene.update(dt);
			loading_scene.render(CTX);
		});


	return loading_scene;

});