! define(["math"], function (math) {
	
	var Vec2 = function Vec2(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};


	Vec2.prototype = {

			constructor: Vec2

		, set: function set(x, y) {
				this.x = x;
				this.y = y;

				return this;
			}

		, copy: function copy(vec) {
				this.x = vec.x;
				this.y = vec.y;

				return this;
			}

		, clone: function clone() {
				return new Vec2(this.x, this.y);
			}

		, equals: function equals(vec) {
				if (math.abs(this.x - vec.x) > vec2.precision) return false;
				if (math.abs(this.y - vec.y) > vec2.precision) return false;
				return true;
			}

		, add: function add(vec) {
				this.x += vec.x;
				this.y += vec.y;

				return this;
			}

		, sub: function sub(vec) {
				this.x -= vec.x;
				this.y -= vec.y;

				return this;
			}

		, mul: function mul(vec) {
				this.x *= vec.x;
				this.y *= vec.y;

				return this;
			}

		, div: function div(vec) {
				this.x /= vec.x;
				this.y /= vec.y;

				return this;
			}

		, scale: function scale(x, y) {
				if (y === undefined) y = x;

				this.x *= x;
				this.y *= y;

				return this;
			}

		, dot: function dot(vec) {
				return this.x * vec.x + this.y * vec.y;
			}

		, cross: function cross(vec) {
				return this.y * vec.x - this.x * vec.y;
			}
		
		, magnitude: function magnitude() {
				return math.sqrt(this.x * this.x + this.y * this.y);
			}

		, sqrMagnitude: function sqrMagnitude() {
				return this.x * this.x + this.y * this.y;
			}

		, normalize: function normalize() {
				var im = 1 / math.sqrt(this.x * this.x + this.y * this.y);

				this.x *= im;
				this.y *= im;

				return this;
			}

		, normalized: function normalized() {
				var im = 1 / math.sqrt(this.x * this.x + this.y * this.y);
				return new Vec2(this.x * im, this.y * im);
			}

		, left: function left() {
				var im = 1 / math.sqrt(this.x * this.x + this.y * this.y);
				return new Vec2(this.y * im, -this.x * im);
			}

		, right: function right() {
				var im = 1 / math.sqrt(this.x * this.x + this.y * this.y);
				return new Vec2(-this.y * im, this.x * im);
			}

		, distanceTo: function distanceTo(vec) {
				var dx = this.x - vec.x
					, dy = this.y - vec.y;
				
				return math.sqrt(dx * dx + dy * dy);
			}
		
		, sqrDistanceTo: function sqrDistanceTo(vec) {
				var dx = this.x - vec.x
					, dy = this.y - vec.y;
				
				return dx * dx + dy * dy;
			}

		, round: function round() {
				this.x = math.round(this.x);
				this.y = math.round(this.y);
				
				return this;
			}

		, angle: function angle() {
				return math.atan2(this.y, this.x);
			}
		
		, angleTo: function angleTo(v) {
				return math.atan(this.y / this.x) - math.atan(v.y / v.x);
			}

		, rotate: function rotate(theta, vec) {
				if (vec === undefined) vec = vec2.CENTER;
				
				var x = this.x - vec.x
					, y = this.y - vec.y 
					, cos = math.cos(theta)
					, sin = math.sin(theta);
				
				this.x = vec.x + (x * cos - y * sin);
				this.y = vec.y + (x * sin + y * cos);

				return this;
			}
		
		, toArray: function toArray() {
				return [this.x, this.y];
			}

		, toString: function toString() {
				return "(" + this.x + ", " + this.y + ")";
			}

	};


	Vec2.add = function add(a, b) {
		return new Vec2(a.x + b.x, a.y + b.y);
	};

	Vec2.sub = function sub(a, b) {
		return new Vec2(a.x - b.x, a.y - b.y);
	};

	Vec2.mul = function mul(a, b) {
		return new Vec2(a.x * b.x, a.y * b.y);
	};

	Vec2.div = function div(a, b) {
		return new Vec2(a.x / b.x, a.y / b.y);
	};

	Vec2.scale = function scale(a, b, c) {
		if (c === undefined) c = b;
		return new Vec2(a.x * b, a.y * c);
	};

	Vec2.random = function random(m) {
		var x = math.random()
			, y = math.random();

		if (m === undefined) m = 1;

		return new Vec2(x, y).scale(1 / math.sqrt(x * x + y * y) * m)
	};

	var vec2 = function vec2(x, y) {
		return new Vec2(x, y);
	};

	vec2.precision = 1e-6;

	vec2.CENTER = Object.freeze(new Vec2(0, 0));
	vec2.LEFT = Object.freeze(new Vec2(-1, 0));
	vec2.TOP_LEFT = Object.freeze(new Vec2(-1, -1));
	vec2.TOP = Object.freeze(new Vec2(0, -1));
	vec2.TOP_RIGHT = Object.freeze(new Vec2(1, -1));
	vec2.RIGHT = Object.freeze(new Vec2(1, 0));
	vec2.BOTTOM_RIGHT = Object.freeze(new Vec2(1, 1));
	vec2.BOTTOM = Object.freeze(new Vec2(0, 1));
	vec2.BOTTOM_LEFT = Object.freeze(new Vec2(-1, 1));

	return vec2;

});