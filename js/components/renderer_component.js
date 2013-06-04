! define(["math"], function (math) {

	var Renderer = function Renderer(self, options) {
		this.source = options.source || null;

		this.alpha = (options.alpha === undefined) ? 1 : options.alpha;
		
		this.subPixels = options.subPixels || false;
		this.imageSmoothing = options.imageSmoothing || false;

		this.enabled = (options.enabled === undefined) ? true : options.enabled;

		this.parent = self;
	};

	Renderer.prototype = {

			constructor: Renderer

		, render: function render(ctx) {
				if (!this.enabled) return this;

				var parent_transform = this.parent.transform
					
					, scale = parent_transform.localScale
					, rotation = parent_transform.localRtation
					
					, width = this.source.width
					, height = this.source.height
					
					, x = parent_transform.localPosition.x - width * 0.5
					, y = parent_transform.localPosition.y - height * 0.5;

				if (!this.subpixels) {
					x = math.round(x);
					y = math.round(y);
				}

				ctx.save();

				ctx.globalAlpha = this.alpha;
				ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = this.imageSmoothing;

				ctx.translate(x, y);

				if (rotation) ctx.rotate(rotation);

				if ("function" === typeof this.source) this.source(ctx);
				else ctx.drawImage(this.source, 0, 0, width, height, 0, 0, width * scale.x, height * scale.y);

				ctx.restore();

				return this;
			}

	};


	var renderer_component = function renderer_component(self, options) {
		return new Renderer(self, options);
	}

	renderer_component.exports = "renderer";


	return renderer_component;

});