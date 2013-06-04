! define(["assets", "gameobject", "aabb_component", "collisions_component", "renderer_component", "animation_component", "spritesheet", "utils", "vec2", "math", "hit_depth"], function (assets, gameobject, aabb_component, collisions_component, renderer_component, animation_component, spritesheet, utils, vec2, math, HIT_DEPTH) {

	var hit_collider = gameobject()
		.addComponent(aabb_component, {
				width: 20
			, height: 20
			, trigger: true
		});

		hit_collider.events.on("collision:enter, collision:stay", function (other) {
			if (other.parent === gameobject.$(22)) {
				other.parent.red.hit(this.data("damages"));
			}
		}, hit_collider);

		/*
		hit_collider.events.on("render", function (ctx) {
			this.renderer.render(ctx);
		}, hit_collider);

		gameobject.add(hit_collider);

		assets.on("complete", function () {
			hit_collider.addComponent(renderer_component, {source: assets.get("debug.hit_collider.ai.png")});
		});//*/

	var Ai = function Ai(self, options) {
		var ai_spritesheet = spritesheet(assets.get("@" + options.spritesheet + ".spritesheet.256x256.png"), 256, 256)
			, render_frame = function render_frame(frame) {
					var source = self.renderer.source
						, ctx = source.getContext("2d");

					ctx.clearRect(0, 0, source.width, source.height);
					this.spritesheet.render(ctx, this.frames[frame], this.paddingX, this.paddingY);
				}
			, onstop = function onstop() {
					if (self.ai.left) self.animation.play("idle.left");
					else self.animation.play("idle.right");
				}
			, onstop_atk = function onstop_atk() {
					if (self.ai.left) self.ai.hit_collider_offset.x = -65;
					else self.ai.hit_collider_offset.x = 65;

					hit_collider.transform.localPosition.copy(self.transform.localPosition).add(self.ai.hit_collider_offset);
					hit_collider.data("damages", self.ai.power);
					hit_collider.aabb.collision(gameobject.$(22).aabb);

					if (self.ai.left) self.animation.play("idle.left");
					else self.animation.play("idle.right");
			};

		self
			.addComponent(aabb_component, {
					width: 50
				, height: 70
				, offsetY: 10
			})
			//.addComponent(collisions_component)
			.addComponent(renderer_component, {
				source: utils.canvas(256, 256)
			})
			.addComponent(animation_component)

		self.animation.add({
				"idle.right": {
						spritesheet: ai_spritesheet
					, frames: [0, 1, 2, 3, 4, 5, 6, 7]
					, frameTime: 150
					, loop: true
					, onEachFrame: render_frame
				}

			, "idle.left": {
						spritesheet: ai_spritesheet
					, frames: [8, 9, 10, 11, 12, 13, 14, 15]
					, frameTime: 150
					, loop: true
					, onEachFrame: render_frame
				}

			, "run.right": {
						spritesheet: ai_spritesheet
					, frames: [16, 17, 18, 19, 20, 21]
					, frameTime: 100
					, loop: true
					, onEachFrame: render_frame
					, onStop: onstop
				}

			, "run.left": {
						spritesheet: ai_spritesheet
					, frames: [24, 25, 26, 27, 28, 29]
					, frameTime: 100
					, loop: true
					, onEachFrame: render_frame
					, onStop: onstop
				}

			, "atk.right": {
						spritesheet: ai_spritesheet
					, frames: [37, 36, 35]
					, frameTime: 100
					, onEachFrame: render_frame
					, onStop: onstop_atk
				}

			, "atk.left": {
						spritesheet: ai_spritesheet
					, frames: [32, 33, 34]
					, frameTime: 100
					, onEachFrame: render_frame
					, onStop: onstop_atk
				}

			, "damage.right": {
						spritesheet: ai_spritesheet
					, frames: [23]
					, frameTime: 200
					, cancelable: false
					, onEachFrame: render_frame
					, onStop: onstop
				}

			, "damage.left": {
						spritesheet: ai_spritesheet
					, frames: [22]
					, frameTime: 200
					, cancelable: false
					, onEachFrame: render_frame
					, onStop: onstop
				}

			, "death": {
						spritesheet: ai_spritesheet
					, frames: [30]
					, frameTime: 500
					, onEachFrame: render_frame
					, onStart: function () {
							self.aabb.enabled = false;
						}
					, onStop: function () {
							gameobject.remove(self);	
						}
				}
		});

		self.events.on("collision:enter, collision:stay", function (other, normal, depth) {
			this.transform.localPosition.add(normal.scale(depth));
		}, self);

		self.events.on("start", function () {
			this.animation.play("idle.left");
			this.ai.start_position.copy(this.transform.localPosition);
		}, self);

		self.events.on("update", function (now, dt) {
			var red = gameobject.$(22)
				, sqr_distance_to_red = red.transform.localPosition.sqrDistanceTo(this.transform.localPosition)
				, anim_dir = this.ai.left ? "left" : "right";

			if (this.animation.isPlaying("damage." + anim_dir) || this.animation.isPlaying("death")) {
				this.animation.update();
				return this;
			}

			this.ai.velocity.set(0, 0);

			if (this.ai.is_chasing) {
				if (sqr_distance_to_red < this.ai.atk_range * this.ai.atk_range) {
					var depth_delta = this.transform.localPosition.y - red.transform.localPosition.y;
					if (depth_delta < 5) {
						this.ai.velocity.set(0, this.ai.speed * dt);
					} else if (depth_delta > HIT_DEPTH) {
						this.ai.velocity.set(0, this.ai.speed * dt * -1);
					} else {
						var x_delta = red.transform.localPosition.x - this.transform.localPosition.x;

						if (x_delta > 0) {
							this.ai.left = false;
							this.ai.right = true;
						} else {
							this.ai.left = true;
							this.ai.right = false;
						}

						if (now >= this.ai.next_atk) {
							this.animation.play("atk." + anim_dir);
							this.ai.next_atk = now + this.ai.atk_rate;

							if (assets.audio) {
								var a = assets.get("fx.punch" + (math.random() * 4 | 0) + ".audio*");
								//a.currentTime = 0;
								a.src = a.src;
								a.play();
							}
						}
					}
				} else {
					this.ai.velocity.copy(red.transform.localPosition)
						.sub(this.transform.localPosition)
						.normalize()
						.scale(this.ai.speed * dt);

					if (sqr_distance_to_red >= this.ai.detect_range * this.ai.detect_range) {
						if (!this.ai.is_target_out_of_range) {
							this.ai.target_out_of_range_at = now;
							this.ai.is_target_out_of_range = true;
						}
					} else {
						this.ai.is_target_out_of_range = false;
					}
				}
			} else if (sqr_distance_to_red < this.ai.detect_range * this.ai.detect_range) {
				this.ai.is_chasing = true;
				this.ai.is_going_back = false;
				this.ai.is_target_out_of_range = false;
			}

			if (this.ai.is_target_out_of_range && now >= this.ai.target_out_of_range_at + this.ai.time_before_forget) {
				if (this.ai.is_chasing) {
					this.ai.forget_at = now;
					this.ai.velocity.set(0, 0);
					this.ai.is_chasing = false;
					this.animation.play("idle." + anim_dir);
				} else if (!this.ai.chasing && this.ai.is_target_out_of_range && now >= this.ai.forget_at + this.ai.time_before_going_back) {
					this.ai.is_going_back = true;
				}
			}

			if (this.ai.is_going_back) {
				this.ai.velocity.copy(this.ai.start_position)
					.sub(this.transform.localPosition);
					
				if (this.ai.velocity.sqrMagnitude() > 1) {
					this.ai.velocity
						.normalize()
						.scale(this.ai.speed * dt);
				} else {
					this.ai.is_going_back = false;
					this.animation.play("idle." + anim_dir);
 				}
			}

			if (this.ai.velocity.x > 0) {
				this.ai.left = false;
				this.ai.right = true;
				this.animation.play("run.right");
			} else if (this.ai.velocity.x < 0) {
				this.ai.left = true;
				this.ai.right = false;
				this.animation.play("run.left");
			}

			this.transform.localPosition.add(this.ai.velocity);
			this.animation.update();
		}, self);

		self.events.on("render", function (ctx) {
			var transform_position = this.transform.localPosition
				, aabb_position = this.aabb.position
				, w = this.aabb.extents.x
				, h = this.aabb.extents.y

			this.renderer.render(ctx);

			/*
			ctx.strokeStyle = "#f0f";
			ctx.strokeRect(aabb_position.x - w, aabb_position.y - h, w * 2, h * 2);

			/*
			ctx.beginPath();
			ctx.arc(transform_position.x, transform_position.y, this.ai.atk_range, 0, math.tau);
			ctx.stroke();

			ctx.strokeStyle = "#fff"
			ctx.beginPath();
			ctx.arc(transform_position.x, transform_position.y, this.ai.detect_range, 0, math.tau);
			ctx.stroke();//*/

			if (this.ai.life > this.ai.base_life * 0.75) ctx.fillStyle = "#0f0";
			else if (this.ai.life > this.ai.base_life *  0.50) ctx.fillStyle = "#ff0";
			else if (this.ai.life > this.ai.base_life * 0.25) ctx.fillStyle = "#f80";
			else ctx.fillStyle = "#f00";

			ctx.fillRect(transform_position.x - 25, transform_position.y - 75, (this.ai.life / this.ai.base_life) * 50, 5);
		}, self);


		this.velocity = vec2();
		this.start_position = vec2();
		this.hit_collider_offset = vec2(51, -11);

		this.life = options.life || 100;
		this.base_life = options.life || 100;
		this.power = options.power || 10;
		
		this.right = false;
		this.left = true;

		this.speed = options.speed || 0.1;

		this.detect_range = options.detect_range || 200;
		this.atk_range = options.atk_range || 90;

		this.atk_rate = options.atk_rate || 750;
		this.next_atk = 0;

		this.is_chasing = false;
		this.is_going_back = false;
		this.is_target_out_of_range = false;

		this.forget_at = 0;
		this.target_out_of_range_at = 0;

		this.time_before_forget = options.time_before_forget || 2000;
		this.time_before_going_back = options.time_before_going_back || 5000;

		this.parent = self;
	};


	Ai.prototype = {

		constructor: Ai

		, hit: function hit(value) {
				this.life -= value;

				if (this.left) this.parent.animation.play("damage.left");
				else this.parent.animation.play("damage.right");

				if (this.life <= 0) {
					this.life = 0;
					gameobject.$(22).red.score += 100
					this.parent.animation.currentAnimation.cancelable = true;
					this.parent.animation.stop();
					this.parent.animation.play("death");
				}	
			}

	};


	var ai_component = function ai_component(self, options) {
		return new Ai(self, options);
	};

	ai_component.exports = "ai";

	return ai_component;

});