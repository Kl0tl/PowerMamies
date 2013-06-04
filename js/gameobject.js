! define(["transform_component", "events"], function (transform_component, events) {

	var UID = -1
		, IDS = {}
		, SEPARATOR = /,\s+/

		, Gameobject = function Gameobject() {
				this.id = gameobject.uid();
				this.userData = {};
				this.transform = transform_component();
				this.events = events();

				this.components = {"transform": true, "events": true};
			};

	var gameobject = function gameobject() {
		return new Gameobject();
	}

	gameobject.uid = function () {
		return (UID += 1);
	}

	gameobject.all = [];
	gameobject.defered_add = [];
	gameobject.defered_destroy = {};

	gameobject.updating = false;
	gameobject.rendering = false;

	gameobject.auto_sort = true;
	gameobject.sort_next_frame = false;
	
	gameobject.sort_function = function sort_function(a, b) {
		return b.transform.depth - a.transform.depth;
	};

	gameobject.sort = function sort() {
		if (gameobject.updating || gameobject.rendering) {
			gameobject.sort_next_frame = true;
		} else {
			gameobject.all.sort(gameobject.sort_function);
		}

		return this;
	};

	gameobject.$ = function $(selector) {
		return IDS[selector];
	};

	gameobject.add = function add(go, sort) {
		if (gameobject.updating || gameobject.rendering) {
			gameobject.defered_add.push(go);
			if (sort === true) gameobject.sort_next_frame = true;
		} else {
			IDS[go.id] = go;
			gameobject.all.push(go);
			if (sort === true) gameobject.all.sort(gameobject.sort_function);
			go.events.trigger("start");
		}
		return this;
	};

	gameobject.remove = function remove(go) {
		gameobject.defered_destroy[go.id] = true;
		return this;
	};

	gameobject.update = function update(now, dt) {
		var ids = IDS
			, all = gameobject.all
			, defered_add = gameobject.defered_add
			, defered_destroy = gameobject.defered_destroy;

		for (var i = 0, go; go = defered_add[i]; i += 1) {
			all.push(go);
			ids[go.id] = go;
			go.events.trigger("start");
		}

		defered_add.length = 0;

		if (gameobject.auto_sort || gameobject.sort_next_frame) {
			gameobject.sort_next_frame = false;
			gameobject.all.sort(gameobject.sort_function);
		}

		gameobject.updating = true;

		for (i = 0; go = all[i]; i += 1) {
			if (defered_destroy[go.id]) {
				all.splice(i--, 1);
				delete ids[go.id];
				delete defered_destroy[go.id];
				go.events.trigger("destroy");
			} else {
				go.events.trigger("update", now, dt);
			}
		}

		gameobject.updating = false;

		return this;
	};

	gameobject.render = function render(ctx) {
		var all = gameobject.all;

		gameobject.rendering = true;

		for (var i = 0, go; go = all[i]; i += 1) {
			go.events.trigger("render", ctx);
		}

		gameobject.rendering = false;
	};



	Gameobject.prototype = {

			constructor: Gameobject

		, data: function data(property, value) {
				if ("object" === typeof property) {
					for (var key in property) {
						this.userData[key] = property[key];
					}
				} else if (value === undefined) {
					return this.userData[property];
				} else {
					this.userData[property] = value;
				}

				return this;
			}

		, addComponent: function addComponent(component, options) {
				var id = component.exports || component.name;

				if (options === undefined) options = {};

				this[id] = component(this, options);
				this.components[id] = true;

				this.events.trigger("addComponent:" + id, options);

				return this;
			}

		, removeComponent: function removeComponent(removers) {
				var events = this.events
					, components = this.components;

				removers = removers.split(SEPARATOR);

				for (var i = 0, remover; remover = removers[i]; i += 1) {
					var id = remover.name;

					events.trigger("removeComponent:" + id);

					delete this[id];
					delete components[id];
				}

				return this;
			}

		, hasComponent: function hasComponent(component) {
				return this.components.hasOwnProperty(component);
			}

	};

	return gameobject;

});