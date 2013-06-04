! define(["events", "math", "utils"], function (events, math, utils) {

	var ROOT = ""
		, COUNT = 0 
		, NOCACHE = false
		, LOADING = false

		, ASSETS_LOADED = {}

		, SEPARATOR = /,\s+/

		, AUDIO_ELEMENT = document.createElement("audio")

		, assets = {
				audio: AUDIO_ELEMENT && AUDIO_ELEMENT.canPlayType

				, formats: {
							image: {
									"png": true
								, "jpg": true
								, "jpeg": true
								, "gif": true
							}
						, audio: ""
					}

				, root: function root(value) {
						if (value === undefined) return ROOT;
						
						ROOT = value;
						
						return this;
					}

				, nocache: function nocache(value) {
						if (value === undefined) return NOCACHE;

						NOCACHE = value;

						return this;
					}

				, count: function count() {
						return COUNT;
					}

				, loading: function loading() {
						return LOADING;
					}

				, get: function get(aliases) {
						aliases = aliases.split(SEPARATOR);

						if (1 === aliases.length) return ASSETS_LOADED[aliases[0]];

						var loaded = ASSETS_LOADED
							, assets = [];

						for (var i = 0, alias; alias = aliases[i]; i += 1) {
							assets.push(loaded[alias]);
						}

						return assets;
					}

				, all: function all() {
						return this.get(Object.keys(ASSETS_LOADED).join(", "));
					}

				, load: function load(paths) {
						paths = paths.split(SEPARATOR);
						
						var self = this
							, root = ROOT
							, nocache = NOCACHE
							, formats = self.formats
							, queue = []
							, loaded = 0
							, total = paths.length
							, audio_ext = assets.formats.audio
							, audio_supported = assets.audio;

						if (0 === total) this.trigger("complete", queue);

						LOADING = true;

						for (var i = 0, path; path = paths[i]; i += 1) ! function (path, index) {
							var ext = path.split(".").pop().toLowerCase()
								, alias = path.split("/").pop()
								, asset = null

								, onload = function (e) {
										queue[index] = asset;

										if (false !== e) {
											COUNT += 1;
											ASSETS_LOADED[alias] = asset;
										}

										loaded += 1
										self.trigger("progress", loaded, total, path, !e);

										if (loaded === total) {
											LOADING = false;
											self.trigger("complete", queue);
										}
									}

								, onerror = function () {
									asset = null;
									self.trigger("error", path);
									onload(false);
								};

							if (!nocache && alias in ASSETS_LOADED) {
								asset = ASSETS_LOADED[alias];
							} else if (formats.image[ext]) {
								asset = new Image();
								asset.onload = onload;
								asset.onerror = onerror
								asset.src = root + path + (nocache ? "?" + Date.now() * math.random() : "");
							} else if (audio_supported && ext === "audio*") {
									asset = document.createElement("audio");
									
									asset.addEventListener("canplaythrough", function oncanplaythrough(e) {
										this.removeEventListener("canplaythrough", oncanplaythrough, false);
										onload(e);
									}, false);

									asset.onerror = onerror
									
									asset.preload = "auto";

									path = path.replace(/audio\*$/, audio_ext);

									asset.setAttribute("src", root + path + (nocache ? "?" + Date.now() * math.random() : ""));

									asset.load();
							} else {
								onerror();
							}
						}(path, i);

						return this;
					}

				, isImage: function isImage(o) {
						return "[object HTMLImageElement]" === utils.toString(o);
					}
				, isCanvas: function isCanvas(o) {
						return "[object HTMLCanvasElement]" === utils.toString(o);
					}
				, isAudio: function isAudio(o) {
						return "[object HTMLAudioElement]" === utils.toString(o);
					}
				, isVideo: function isVideo(o) {
						return "[object HTMLVideoElement]" === utils.toString(o);
					}
			};

		if (assets.audio) {
			if (AUDIO_ELEMENT.canPlayType('video/ogg; codecs="theora, vorbis"')) {
				assets.formats.audio = "ogg";
			} else {
				assets.formats.audio = "m4a";
			}
		}

	return events.mixin(assets);

});