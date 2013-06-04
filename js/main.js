require.config({
	paths: {
			"assets": "assets"
		, "mouse": "mouse"
		, "keyboard": "keyboard"
		, "events": "events"
		, "gameobject": "gameobject"
		, "gamescene": "gamescene"
		, "spritesheet": "spritesheet"
		, "animation": "animation"
		, "transition": "transition"
		, "math": "math"
		, "vec2": "vec2"
		, "raf": "raf"
		, "utils": "utils"

		, "hit_depth": "hit_depth"

		, "aabb_component": "components/aabb_component"
		, "renderer_component": "components/renderer_component"
		, "transform_component": "components/transform_component"
		, "animation_component": "components/animation_component"
		, "red_component": "components/red_component"
		, "dash_cloud_component": "components/dash_cloud_component"
		, "ai_component": "components/ai_component"
		, "collisions_component": "components/collisions_component"
		, "button_component": "components/button_component"

		, "start_scene": "gamescenes/start_scene"
		, "loading_scene": "gamescenes/loading_scene"
		, "characters_scene": "gamescenes/characters_scene"
		, "levels_scene": "gamescenes/levels_scene"
		, "game_scene": "gamescenes/game_scene"
		, "gameover_scene": "gamescenes/gameover_scene"

		, "levelData": "data/levelData"
		, "_": "data/underscore"
	}
});

require(["gamescene", "assets", "start_scene", "loading_scene", "characters_scene", "levels_scene", "game_scene", "gameover_scene", "_"], function (gamescene, assets, start_scene, loading_scene, characters_scene, levels_scene, game_scene, gameover_scene) {

	gamescene
		.add({
				"start": start_scene
			, "loading": loading_scene
			, "characters": characters_scene
			, "levels": levels_scene
			, "game": game_scene
			, "game_over": gameover_scene
		})
		.active("loading")
		.loop();

	assets
		.on("progress", loading_scene.onprogress)
		.on("complete", loading_scene.oncomplete)
		.root("images/")
		//.nocache(true)
		.load([
				"home.background.jpg"
			, "background.jpg"

			, "@red.spritesheet.256x256.png"
			, "@racaille.spritesheet.256x256.png"
			, "@racaille2.spritesheet.256x256.png"
			, "@blacaille.spritesheet.256x256.png"

			//, "debug.dash_cloud.png"
			//, "debug.hit_collider.ai.png"
			//, "debug.hit_collider.red.png"

			//, "dash_cloup.png"

			, "decorPremierPlan.png"
			, "decorFond.png"

			, "background0.png"
			, "background1.png"
			, "background2.png"
			, "background3.png"
			, "background4.png"
			, "background5.png"

			, "trainFront.png"
			, "trainBack.png"

			, "character.red.normal.png"
			, "character.orange.normal.png"
			, "character.yellow.normal.png"
			, "character.green.normal.png"
			, "character.blue.normal.png"
			, "character.purple.normal.png"
			
			, "character.red.hover.png"
			, "character.orange.hover.png"
			, "character.yellow.hover.png"
			, "character.green.hover.png"
			, "character.blue.hover.png"
			, "character.purple.hover.png"

			, "metro_lines/metro_line1.normal.png"
			, "metro_lines/metro_line2.normal.png"
			, "metro_lines/metro_line3.normal.png"
			, "metro_lines/metro_line4.normal.png"
			, "metro_lines/metro_line5.normal.png"
			, "metro_lines/metro_line6.normal.png"
			, "metro_lines/metro_line7.normal.png"
			, "metro_lines/metro_line8.normal.png"
			, "metro_lines/metro_line9.normal.png"
			, "metro_lines/metro_line10.normal.png"
			, "metro_lines/metro_line11.normal.png"
			, "metro_lines/metro_line12.normal.png"
			, "metro_lines/metro_line13.normal.png"
			, "metro_lines/metro_line14.normal.png"

			, "metro_lines/metro_line1.hover.png"
			, "metro_lines/metro_line2.hover.png"
			, "metro_lines/metro_line3.hover.png"
			, "metro_lines/metro_line4.hover.png"
			, "metro_lines/metro_line5.hover.png"
			, "metro_lines/metro_line6.hover.png"
			, "metro_lines/metro_line7.hover.png"
			, "metro_lines/metro_line8.hover.png"
			, "metro_lines/metro_line9.hover.png"
			, "metro_lines/metro_line10.hover.png"
			, "metro_lines/metro_line11.hover.png"
			, "metro_lines/metro_line12.hover.png"
			, "metro_lines/metro_line13.hover.png"
			, "metro_lines/metro_line14.hover.png"

			, "../audio/fx.button.audio*"
			, "../audio/fx.character.audio*"
			// , "../audio/fx.metro.audio*"
			, "../audio/fx.mamy.punch.audio*"
			, "../audio/fx.punch0.audio*"
			, "../audio/fx.punch1.audio*"
			, "../audio/fx.punch2.audio*"
			, "../audio/fx.punch3.audio*"
			, "../audio/fx.ready.audio*"
			, "../audio/fx.mamy.death.audio*"
			, "../audio/music.character.audio*"
			, "../audio/music.intro.audio*"
			, "../audio/music.map0.audio*"
			, "../audio/music.map1.audio*"
			, "../audio/music.map2.audio*"
		].join(", "));

});