! define(["vec2", "math"], function (vec2, math) {
	
	var Animation = function Animation(name, spritesheet, options) {
		this.name = name;

		this.currentFrame = -1;

		this.frames = options.frames || [];
		this.length = options.frames && options.frames.length || 0;

		this.padding = vec2(options.paddingX, options.paddingY);

		this.frameTime = options.frameTime || 0;

		this.time = 0;
		this.timeScale = 1;
		this.startTime = 0;

		this.loop = Boolean(options.loop);
		this.bounce = Boolean(options.bounce);

		this. useLastFrameFrom = options.useLastFrameFrom || {};
		this.saveLastFrame = Boolean(options.saveLastFrame);

		this.cancelable = (options.cancelable === undefined) ? true : options.cancelable;

		this.onStart = options.onStart || null;
		this.onEachFrame = options.onEachFrame || null;
		this.onStop = options.onStop || null;

		this.spritesheet = spritesheet;

		this._lastTime = 0;
		this._pausedAt = 0;

		this._bouncing = false;
		this._startCallbackFired = false;
	};


	Animation.prototype = {

			constructor: Animation

		, update: function update() {
				if (this.isPaused()) return this;

				var now = Date.now()
					, currentFrame;

				if (!this._startCallbackFired) {
					this._startCallbackFired = true;
					this._lastTime = this.startTime = now;
					this.onStart && this.onStart();
				}

				this.time += (now - this._lastTime) * this.timeScale * (this._bouncing ? -1 : 1);
      	this._lastTime = now;

      	currentFrame = (this.time / this.frameTime) | 0;

      	if ((0 < this.frameTime) && (currentFrame === this.currentFrame) && (0 < this.time)) {
      		return this;
      	}

      	if (!this._bouncing && (this.time < this.frameTime * this.length) || this._bouncing && (0 < this.time)) {
      		this.currentFrame = currentFrame;
      		this.onEachFrame && this.onEachFrame(currentFrame);
      	} else {
      		if (this.bounce && !this._bouncing) {
      			this._bouncing = true;
      			this.time = this.frameTime * (this.length - 1);
      		} else if (this.loop) {
      			if (this._bouncing) {
      				this.time = this.frameTime;
      				this._bouncing = false;
      			} else  {
      				this.time = 0;
      			}
      		} else {
      			this.cancelable = true;
      			this.onStop && this.onStop();
      		}
      	}

				return this;
			}

		, goToFrame: function goToFrame(frame) {
				this.time = this.frameTime * (frame | 0);
				return this;
			}

		, goToRandomFrame: function goToRandoFrame() {
				return this.goToFrame(math.random() * this.length);
			}

		, isPaused: function isPaused() {
				return 0 < this._pausedAt;
			}

		, resume: function resume() {
      	if (this.isPaused()) {
	        this._lastTime += Date.now() - this._pausedAt;
	        this._pausedAt = 0;
				}
	      
	      return this;
	    }
    
    , pause: function pause() {
	      if (!this.isPaused()) {
	        this._pausedAt = Date.now();
				}

				return this;
	    }
    
	   , toggle: function toggle() {
	      if (this.isPaused()) this.resume();
	      else this.pause();

	      return this;
	    }

	   , rewind: function rewind() {
	      this.time = 0;
	      this.currentFrame = -1;
	      this._startCallbackFired = false;

	      return this;
	    }

	};


	var animation = function animation(name, spritesheet, options) {
		return new Animation(name, spritesheet, options);
	};


	return animation;

});