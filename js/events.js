! define(["utils"], function (utils) {

	var SEPARATOR = /,\s+/

		, Events = function Events() {};


	Events.prototype = {

			constructor: Events

		, on: function on(events, callback, context) {
				var listeners = this.listeners || (this.listeners = {});
				
				events = events.split(SEPARATOR);

				callback.__context = context || window;

				for (var i = 0, event; event = events[i]; i += 1) {
					(listeners[event] || (listeners[event] = [])).push(callback);
				}

				return this;
			}

		, off: function off(events, remover, context) {
				if (events === undefined) {
					this.listeners = {};
				} else {
					var listeners = this.listeners || (this.listeners = {})
						, hasRemover = (remover === undefined);

					events = events.split(SEPARATOR);
					if (context === undefined) context = window;

					for (var i = 0, event; event = events[i]; i += 1) {
						var callbacks = listeners[event];

						if (callbacks === undefined) continue;

						if (hasRemover) {
							for (var n = 0, callback; callback = callbacks[n]; n += 1) {
								if (callback === remover && callback.__context === context) {
									callbacks.splice(n--, 1);
								}
							}
						} else {
							callbacks.length = 0;
						}
					}
				}

				return this;
			}

		, trigger: function trigger(events) {
				var args = utils.slice(arguments, 1)
					, listeners = this.listeners || (this.listeners = {});

				events = events.split(SEPARATOR);

				for (var i = 0, event; event = events[i]; i += 1) {
					var callbacks = listeners[event];

					if (callbacks === undefined) continue;

					for (var n = 0, callback; callback = callbacks[n]; n += 1) {
						callback.apply(callback.__context, args);
					}
				}

				return this;
			}

	};

	var events = function events() {
		return new Events();
	};

	events.mixin = function mixin(dest) {
		var source = Events.prototype;

		dest.on = source.on;
		dest.off = source.off;
		dest.trigger = source.trigger;

		return dest;
	};

	events.extend = function extend() {
		var sources = utils.slice(arguments)
			, dest = new Events();

		for (var i = 0, source; source = sources[i]; i += 1) {
			for (var key in source) {
				dest[key] = source[key];
			}
		}

		return dest;
	};


	return events;

});