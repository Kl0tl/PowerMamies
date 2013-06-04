! define(["gameobject"], function (gameobject) {
	
	var utils = require("utils");

	var CANVAS = utils.$("screen")
		, WIDHT = CANVAS.width
		, HEIGHT = CANVAS.height;

	var Collisions = function Collisions(self, options) {
		self.events.on("update", function () {
			var others = gameobject.all;
			for (var i = 0, other; other = others[i]; i += 1) {
				if (other === this || other.aabb == null) continue;
				this.aabb.collision(other.aabb);
			}

			var position = this.transform.localPosition;

			if (position.x < 50) {
				position.x = 50;
			}

			if (position.y > HEIGHT - 50) {
				position.y = HEIGHT - 50;
			} else if (position.y < HEIGHT - 240) {
				position.y = HEIGHT - 240;
			}
		}, self);

		self.events.on("collision:enter, collision:stay", function (other, normal, depth) {
			if (!this.aabb.trigger && !other.trigger) this.transform.localPosition.add(normal.scale(depth));
		}, self);
	};


	var collisions_component = function collisions_component(self, options) {
		return new Collisions(self, options);
	};

	collisions_component.exports = "collisions";

	return collisions_component;

});