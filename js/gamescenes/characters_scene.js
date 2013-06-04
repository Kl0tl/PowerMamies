! define(["assets", "utils", "mouse", "gameobject", "button_component", "gamescene"], function (assets, utils, mouse, gameobject, button_component, gamescene) {
	
	var CANVAS = utils.$("screen")
		, CTX = CANVAS.getContext("2d")
		, WIDTH = CANVAS.width
		, HEIGHT = CANVAS.height;

	var RED = null
		, ORANGE = null
		, YELLOW = null
		, GREEN = null
		, BLUE = null
		, PURPLE = null;

	var character_scene = gamescene.extend({
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

	character_scene.on("start", function () {
		console.log("[gamescene " + this.name + "] started");
		
		this.background = assets.get("background.jpg");

		if (assets.audio) {
			var audio = assets.get("music.character.audio*")
			audio.loop = true;
			audio.play();

			assets.get("fx.character.audio*").play();
		}

		RED = gameobject()
			.addComponent(button_component, {
					"hover_sprite": assets.get("character.red.hover.png")
				, "normal_sprite": assets.get("character.red.normal.png")
				, width: 76
				, height: 136
				, onclick: function () {
						assets.get("fx.button.audio*").play();
						gamescene.active("levels");
					}
			});
		RED.transform.localPosition.set(166 + 126 * 3, HEIGHT * 0.5);
		gameobject.add(RED);

		ORANGE = gameobject()
			.addComponent(button_component, {
					"hover_sprite": assets.get("character.orange.hover.png")
				, "normal_sprite": assets.get("character.orange.normal.png")
				, active: false
			});
		ORANGE.transform.localPosition.set(166 + 126 * 4, HEIGHT * 0.5);
		gameobject.add(ORANGE);
		
		YELLOW = gameobject()
			.addComponent(button_component, {
					"hover_sprite": assets.get("character.yellow.hover.png")
				, "normal_sprite": assets.get("character.yellow.normal.png")
				, active: false
			});
		YELLOW.transform.localPosition.set(166 + 126 * 5, HEIGHT * 0.5);
		gameobject.add(YELLOW);
		
		GREEN = gameobject()
			.addComponent(button_component, {
					"hover_sprite": assets.get("character.green.hover.png")
				, "normal_sprite": assets.get("character.green.normal.png")
				, active: false
			});
		GREEN.transform.localPosition.set(166 + 126 * 2, HEIGHT * 0.5);
		gameobject.add(GREEN);
		
		BLUE = gameobject()
			.addComponent(button_component, {
					"hover_sprite": assets.get("character.blue.hover.png")
				, "normal_sprite": assets.get("character.blue.normal.png")
				, active: false
			});
		BLUE.transform.localPosition.set(166 + 126, HEIGHT * 0.5);
		gameobject.add(BLUE);

		PURPLE = gameobject()
			.addComponent(button_component, {
					"hover_sprite": assets.get("character.purple.hover.png")
				, "normal_sprite": assets.get("character.purple.normal.png")
				, active: false
			});
		PURPLE.transform.localPosition.set(166, HEIGHT * 0.5);
		gameobject.add(PURPLE);

		mouse.listen(CANVAS);
	}, character_scene);

	character_scene.on("destroy", function () {
		console.log("[gamescene " + this.name + "] destroyed");
		
		gameobject.remove(RED);
		gameobject.remove(ORANGE);
		gameobject.remove(YELLOW);
		gameobject.remove(GREEN);
		gameobject.remove(BLUE);
		gameobject.remove(PURPLE);
	}, character_scene);

	character_scene.on("eachframe", function (now) {
		this.update(now, this.deltaTime);
		this.render(CTX);
	}, character_scene);


	return character_scene;

});