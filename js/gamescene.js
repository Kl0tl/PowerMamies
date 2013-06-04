! define(["events", "utils", "raf"], function (events, utils) {

	var Gamescene = function Gamescene() {
		this.name = "";
			
		this.startTime = 0;
		this.deltaTime = 0; 
		this.timeScale = 1;
	};

	Gamescene.prototype = events.mixin({

			constructor: Gamescene

	});

	var ACTIVE = null
		, NEXT = null

		, COUNT = 0

		, ANIMATION_FRAME = null

		, GAMESCENES = {};

	var gamescene = function gamescene() {
		return new GameScene();
	}

	gamescene.add = function add(scenes, scene) {
			if ("object" !== typeof scenes) {
				name = scenes;
				(scenes = {})[name] = scene;
			}

			for (var key in scenes) {
				GAMESCENES[scenes[key].name = key] = scenes[key];
				COUNT += 1;
			}

			return this;
	};

	gamescene.get = function get(name) {
		return GAMESCENES[name];
	};

	gamescene.has = function has(name) {
		return utils.own(GAMESCENES, name);
	};

	gamescene.active = function active(name) {
		if (name === undefined) return ACTIVE;
		if (this.has(name)) NEXT = name;

		return this;
	};

	gamescene.pause = function pause() {
		if (this.isPaused()) return this;

		ACTIVE && ACTIVE.trigger("pause");

		window.cancelAnimationFrame(ANIMATION_FRAME);
		ANIMATION_FRAME = null;

		return this;
	};

	gamescene.resume = function resume() {
		if (!this.isPaused()) return this;

		ACTIVE && ACTIVE.trigger("resume");
		this.loop();

		return this;
	};

	gamescene.toggle = function toggle() {
		if (this.isPaused()) this.resume();
		else this.pause();

		return this;
	};

	gamescene.isPaused = function isPaused() {
		return (ANIMATION_FRAME === null);
	};

	gamescene.loop = function loop() {
		var last = Date.now()
			, callback = function callback() {
				ANIMATION_FRAME = window.requestAnimationFrame(callback);

				var now = Date.now()
					, scene = ACTIVE;

				if (NEXT) {
					scene && (scene.trigger("destroy").startTime = 0);

					scene = ACTIVE = GAMESCENES[NEXT];
					NEXT = null;

					scene.trigger("start").startTime = now;
				}

				if (scene) {
					scene.deltaTime = (now - last) * scene.timeScale;
					scene.trigger("eachframe", now);
				}

				last = now;
			};

		ANIMATION_FRAME = window.requestAnimationFrame(callback);

		return this;
	};

	gamescene.mixin = function mixin(dest) {
		dest.name = "";
		dest.startTime = 0
		dest.deltaTime = 0;
		dest.timeScale = 1;

		return dest;
	};

	gamescene.extend = function extend() {
		var sources = utils.slice(arguments)
			, dest = new Gamescene();

		for (var i = 0, source; source = sources[i]; i += 1) {
			for (var key in source) {
				dest[key] = source[key];
			}
		}

		return dest;
	};


	return gamescene;

});