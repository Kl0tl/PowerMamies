! define(function () {
	
	var Spritesheet = function Spritesheet(source, frameWidth, frameHeight) {
		this.source = source;
		
		this.frameWidth = frameWidth;
		this.frameHeight = frameHeight;
	};

	Spritesheet.prototype = {

			constructor: Spritesheet

		, at: function at(frame, paddingX, paddingY) {
				var canvas = document.createElement("canvas");

				canvas.width = this.frameWidth;
				canvas.height = this.frameHeight;

				this.render(canvas.getContext("2d"), frame, paddingX, paddingY);

				return canvas;
			}

		, render: function render(ctx, frame, paddingX, paddingY) {
				if (paddingX === undefined) paddingX = 0;
				if (paddingY === undefined) paddingY = 0;

				var width = this.frameWidth - paddingX * 2
					, height = this.frameHeight - paddingY * 2;

				ctx.drawImage(
						this.source
					, paddingX + frame % (this.source.width / this.frameWidth) * this.frameWidth
					, paddingY + (frame / (this.source.width / this.frameWidth) | 0)* this.frameHeight
					, width
					, height
					, paddingX
					, paddingY
					, width
					, height
				);

				return this;
			}

	};

	var spritesheet = function spritesheet(source, frameWidth, frameHeight) {
		return new Spritesheet(source, frameWidth, frameHeight);
	}

	return spritesheet;

});