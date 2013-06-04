! define(["animation"], function (animation) {
	
	var Animation = function Animation(self) {
		this.all = {};
			
		this.currentAnimation = null;
		this.previousAnimation = "";
			
		this.parent = self;
			
		this._lastFrame = 0;
	};


	Animation.prototype = {

			constructor: Animation

		, add: function add(name, options) {
				if ("object" === typeof name) {
					for (var key in name) {
						this.all[key] = name[key];
					}
				} else {
					this.all[name] = options;
				}

				return this;
			}

		, play: function play(name) {
				if (!this.all[name]) return this;

				if (this.currentAnimation) {
					if (this.currentAnimation.name === name || !this.currentAnimation.cancelable) return this;
					this.stop();
				}

				var options = this.all[name]
					, a = this.currentAnimation = animation(name, options.spritesheet, options);

				if (a.useLastFrameFrom[this.previousAnimation] && (0 < this._lastFrame)) {
					animation.time = this._lastFrame;
					if (animation.time >= animation.frameTime * animation.length) {
						animation.time = 0;
					}
				}

				this._lastFrame = 0;

				return this;
			}

		, stop: function stop(name) {
				var a = this.currentAnimation;

				if (name === undefined) name = a.name;
				if ((a == null) || (name !== a.name) || !a.cancelable) return this;

				if (a.saveLastFrame) this._lastFrame = a.time;

				this.currentAnimation = null;
				this.previousAnimation = a.name;

				a.onStop && a.onStop();

				return this;
			}

		, isPlaying: function isPlaying(name) {
				if (name === undefined) return Boolean(this.currentAnimation);	
				return this.currentAnimation && this.currentAnimation.name === name;
			}

		, update: function update() {
				this.currentAnimation && this.currentAnimation.update();
				return this;
			}

		, pause: function pause() {
			this.currentAnimation && this.currentAnimation.pause();
			return this;
		}

		, resume: function resume() {
			this.currentAnimation && this.currentAnimation.resume();
			return this;
		}

		, toggle: function toggle() {
				this.currentAnimation && this.currentAnimation.toggle();
				return this;
			}

	};


	var animation_component = function animation_component(self, options) {
		return new Animation(self, options);
	};

	animation_component.exports = "animation";


	return animation_component;

});