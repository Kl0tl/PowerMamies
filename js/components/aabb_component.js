! define(["vec2", "math"], function (vec2, math) {

	var __v1 = vec2()
		, __v2 = vec2();

	var Aabb = function Aabb(self, options) {
		var position = vec2();

		this.width = options.width || 2;
		this.height = options.height || 2;

		this.extents = vec2();

		this.offset = vec2(options.offsetX, options.offsetY);

		this.trigger = Boolean(options.trigger);

		this.events = (options.events === undefined) ? true : options.events;
		this.enabled = (options.enabled === undefined) ? true : options.enabled;

		this.parent = self;

		this._collisions = {};
		this._position = self.transform.localPosition.clone();

		Object.defineProperty(this, "position", {
				get: function get() {
					var parent_transform = this.parent.transform;
					return position.copy(this.offset).mul(parent_transform.localScale).add(parent_transform.localPosition);
				}
			, enumerable: true
		});

		return this.rescale();
	};


	Aabb.prototype = {

			constructor: Aabb

		, resize: function resize(width, height) {
				if (height === undefined) height = width;

				this.width = width;
				this.height = height;

				return this.rescale();
			}

		, rescale: function rescale() {
				var parent_scale = this.parent.transform.localScale;

				this.extents.set(
						math.abs(this.width * 0.5 * parent_scale.x)
					, math.abs(this.height * 0.5 * parent_scale.y)
				);

				return this;
			}

		, left: function left() {
				return this.position.x - this.extents.x;
			}
		, top: function top() {
				return this.position.y - this.extents.y;
			}
		, right: function right() {
				return this.position.x + this.extents.x;
			}
		, bottom: function bottom() {
				return this.position.y + this.extents.y;
			}

		, contains: function contains(x, y) {
				if (!this.enabled) return false;

				var position = this.position
					, w = this.extents.x
					, h = this.extents.y;

				if (x < position.x - w) return false;
				if (x > position.x + w) return false;
				if (y < position.y - h) return false;
				if (y  >position.y + h) return false;

				return true;
			}

		/*
		, collision: function collision(other) {
				if (!this.enabled || !other.enabled || this.trigger || other.trigger) return false;

				var position = __v1.copy(this.position)
					, collisionNormal = __v2.copy(position).sub(other.position)
					, overlapX = (this.extents.x + other.extents.x) - math.abs(collisionNormal.x)
					, overlapY = (this.extents.y + other.extents.y) - math.abs(collisionNormal.y);

				if (overlapX > 0 && overlapY > 0) {
					var velocityX = position.x - this._position.x
						, velocityY = position.y - this._position.y
						, timeOfCollisionX = 1
						, timeOfCollisionY = 1
						, collisionDepth = 0;

					if (velocityX > 0) timeOfCollisionX = other.left() - this.right();
					else if (velocityX < 0) timeOfCollisionX = other.right() - this.left();

					if (velocityY > 0) timeOfCollisionY = other.top() - this.bottom();
					else if (velocityY < 0) timeOfCollisionY = other.bottom() - this.top();

					//timeOfCollisionX = math.abs(timeOfCollisionX / velocityX);
					//timeOfCollisionY = math.abs(timeOfCollisionY / velocityY);

					timeOfCollisionX /= velocityX;
					timeOfCollisionY /= velocityY;

					if (collisionNormal.x < 0 || collisionNormal.y > 0) {
						timeOfCollisionX = math.abs(timeOfCollisionX);
						timeOfCollisionY = math.abs(timeOfCollisionY);
					}

					if (timeOfCollisionX <= timeOfCollisionY) {
						collisionNormal.x = math.sign(collisionNormal.x);
						collisionDepth = overlapX;
					} else {
						collisionNormal.x = 0;
					}

					if (timeOfCollisionY <= timeOfCollisionX) {
						collisionNormal.y = math.sign(collisionNormal.y);
						collisionDepth = overlapY;
					} else {
						collisionNormal.y = 0;
					}

					if (this._collisions[other.parent.id]) {
						this.events && this.parent.events.trigger("collision:stay", other, collisionNormal, collisionDepth);
					} else {
						this._collisions[other.parent.id] = true;
						this.events && this.parent.events.trigger("collision:enter", other, collisionNormal, collisionDepth);
					}
				
					return true;
				}

				if (this._collisions[other.parent.id]) {
					this._collisions[other.parent.id] = false;
					this.events && this.parent.events.trigger("collision:exit", other);
				}
				
				return false;
			}//*/

			, collision: function collision(other) {
				if (!this.enabled || !other.enabled) return this;

				var v = __v1.copy(this.position).sub(other.position)
					, overlapX = math.abs(v.x) - (this.extents.x + other.extents.x)
					, overlapY = math.abs(v.y) - (this.extents.y + other.extents.y)
					, collisionDepth = 0;

				if (0 > overlapX && 0 > overlapY) {
					if (overlapX > overlapY) {
						collisionDepth = overlapX;
						v.set(0 > v.x ? 1 : -1, 0);
					} else {
						collisionDepth = overlapY;
						v.set(0, 0 > v.y ? 1 : -1);
					}

					if (this._collisions[other.parent.id]) {
						this.events && this.parent.events.trigger("collision:stay", other, v, collisionDepth);
					} else {
						this._collisions[other.parent.id] = true;
						this.events && this.parent.events.trigger("collision:enter", other, v, collisionDepth);
					}

					return true;
				}

				if (this._collisions[other.parent.id]) {
					this._collisions[other.parent.id] = false;
					this.events && this.parent.events.trigger("collision:exit", other);
				}
				
				return false;
			}

	};


	var aabb_component = function aabb_component(self, options) {
		return new Aabb(self, options);
	};

	aabb_component.exports = "aabb";


	return aabb_component;

});