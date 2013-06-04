! define(["vec2", "math"], function (vec2, math) {

	var Transform = function Transform(self, options) {
		this.localPosition = vec2();
		this.localScale = vec2(1, 1);
		this.localRotation = 0;
		
		this.depth = 0;
		
		this.anchor = vec2(0, 0);
		
		this.axes = [1, 0, 0, 1];
		
		this.parent = self;
	};


	Transform.prototype = {

			constructor: Transform

		, translate: function translate(x, y) {
				var rotation = this.rotation;

				if (rotation) {
					var cos = this.axes[0], sin = this.axes[1];

					this.localPosition.x += cos * x - sin * y;
					this.localPosition.y += sin * x + cos * y;
				} else {
					this.localPosition.set(x, y);
				}

				this.parent.events.trigger("translate", x, y);

				return this;
			}
		
		, translateTo: function translateTo(x, y) {
				var x = this.localPosition.x
					, y = this.localPosition.y;

				this.localPosition.set(x, y);

				this.parent.events.trigger("translate", x - x, y - y);

				return this;
			}

		, rotate: function rotate(theta) {
				this.localPosition.rotate(theta, this.anchor);
				this.localRotation = (this.localRotation + theta) % math.tau;

				this.axes[0] = math.cos(this.localRotation);
				this.axes[1] = math.sin(this.localRotation);
				this.axes[2] = -this.axes[1];
				this.axes[3] = this.axes[0];

				this.parent.events.trigger("rotate", theta);

				return this;
			}
		
		, rotateTo: function rotateTo(theta) {
				return this.rotate(theta - this.localRotation);
			}

		, scale: function scale(x, y) {
				if (y === undefined) y = x;
				
				this.localScale.x *= x;
				this.localScale.y *= y;
				
				this.parent.events.trigger("scale", x, y);

				return this;
			}
		
		, scaleTo: function scaleTo(x, y) {
			if (y === undefined) y = x;
			
			var scaleX = this.localScale.x
				, scaleY = this.localScale.y;

			this.localScale.set(x, y);

			this.parent.events.trigger("scale", x - scaleX, y - scaleY);

			return this;
		}

	};


	var transform_component = function transform_component(self, options) {
		return new Transform(self, options);
	}

	transform_component.exports = "transform";


	return transform_component;

});