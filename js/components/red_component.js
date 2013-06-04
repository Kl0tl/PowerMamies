! define(["assets", "keyboard", "mouse", "gameobject", "gamescene", "aabb_component", "collisions_component", "renderer_component", "animation_component", "dash_cloud_component", "ai_component", "spritesheet", "utils", "vec2", "math"], function (assets, keyboard, mouse, gameobject, gamescene, aabb_component, collisions_component, renderer_component, animation_component, dash_cloud_component, ai_component, spritesheet, utils, vec2, math) {

	var CANVAS = utils.$("screen")
		, WIDTH = CANVAS.width
		, HEIGHT = CANVAS.height;

	var red_spritesheet;

	assets.on("complete", function () {
		red_spritesheet = spritesheet(assets.get("@red.spritesheet.256x256.png"), 256, 256);
		hit_collider.addComponent(renderer_component, {source: assets.get("debug.hit_collider.red.png")});
	});

	var hit_collider = gameobject()
		.addComponent(aabb_component, {
				width: 120
			, height: 30
			, trigger: true
		});

	hit_collider.events.on("collision:enter, collision:stay", function (other) {
		if (other.parent.hasComponent("ai")) {
			other.parent.ai.hit(this.data("damages"));
		}
	}, hit_collider);

	/*
	hit_collider.events.on("render", function (ctx) {
		this.renderer.render(ctx);
	}, hit_collider);

	gameobject.add(hit_collider);//*/

	var Red = function Red(self, options) {
		var stored_depth = 0;

		var render_frame = function render_frame(frame) {
					var source = self.renderer.source
						, ctx = source.getContext("2d");

					ctx.clearRect(0, 0, source.width, source.height);
					this.spritesheet.render(ctx, this.frames[frame], this.paddingX, this.paddingY);
				}
			, onstop = function onstop() {
					if (self.red.left) self.animation.play("idle.left");
					else self.animation.play("idle.right");
				}
			, onstart_atk = function  onstart_atk() {
					stored_depth = self.transform.depth;
					self.transform.depth = -1;
				}
			, onstop_atk = function onstop_atk() {
					self.transform.depth = stored_depth;

					if (self.red.left) self.red.hit_collider_offset.x = -100;
					else self.red.hit_collider_offset.x = 100;

					hit_collider.transform.localPosition.copy(self.transform.localPosition).add(self.red.hit_collider_offset);
					hit_collider.data("damages", self.red.power);

					var others = gameobject.all;
					for (var i = 0, other; other = others[i]; i += 1) {
						if (other === self || !other.aabb) continue;
						hit_collider.aabb.collision(other.aabb);
					}

					if (self.red.left) self.animation.play("idle.left");
					else self.animation.play("idle.right");
			};


		self
			.addComponent(aabb_component, {
					width: 30
				, height: 45
				, offsetY: 20
			})
			.addComponent(collisions_component)
			.addComponent(renderer_component, {
				source: utils.canvas(256, 256)
			})
			.addComponent(animation_component)

		self.renderer.source.getContext("2d").translate(50, -25);

		self.animation.add({
				"idle.right": {
						spritesheet: red_spritesheet
					, frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
					, frameTime: 100
					, loop: true
					, onEachFrame: render_frame
				}
			
			, "idle.left": {
						spritesheet: red_spritesheet
					, frames: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
					, frameTime: 100
					, loop: true
					, onEachFrame: render_frame
				}

			, "run.right": {
						spritesheet: red_spritesheet
					, frames: [20, 21, 22, 23, 24, 25, 26, 27]
					, frameTime: 100
					, loop: true
					, onEachFrame: render_frame
					, onStop: onstop
				}

			, "run.left": {
						spritesheet: red_spritesheet
					, frames: [30, 31, 32, 33, 34, 35, 36, 37]
					, frameTime: 100
					, loop: true
					, onEachFrame: render_frame
					, onStop: onstop
				}

			, "run.right.up": {
						spritesheet: red_spritesheet
					, frames: [20, 21, 22, 23, 24, 25, 26, 27]
					, frameTime: 100
					, loop: true
					, onEachFrame: render_frame
					, onStop: onstop
				}

			, "run.right.bottom": {
						spritesheet: red_spritesheet
					, frames: [20, 21, 22, 23, 24, 25, 26, 27]
					, frameTime: 100
					, loop: true
					, onEachFrame: render_frame
					, onStop: onstop
				}

			, "run.left.up": {
						spritesheet: red_spritesheet
					, frames: [30, 31, 32, 33, 34, 35, 36, 37]
					, frameTime: 100
					, loop: true
					, onEachFrame: render_frame
					, onStop: onstop
				}

			, "run.left.bottom": {
						spritesheet: red_spritesheet
					, frames: [30, 31, 32, 33, 34, 35, 36, 37]
					, frameTime: 100
					, loop: true
					, onEachFrame: render_frame
					, onStop: onstop
				}

			, "atk.right": {
						spritesheet: red_spritesheet
					, frames: [40, 41, 42, 43]
					, frameTime: 75
					, onEachFrame: render_frame
					, onStart: onstart_atk
					, onStop: onstop_atk
				}

			, "atk.left": {
						spritesheet: red_spritesheet
					, frames: [47, 46, 45, 44]
					, frameTime: 75
					, onEachFrame: render_frame
					, onStart: onstart_atk
					, onStop: onstop_atk
				}

			, "damage.right": {
						spritesheet: red_spritesheet
					, frames: [28]
					, frameTime: 200
					, onEachFrame: render_frame
					, onStop: onstop
				}

			, "damage.left": {
						spritesheet: red_spritesheet
					, frames: [29]
					, frameTime: 200
					, onEachFrame: render_frame
					, onStop: onstop
				}
		});

		self.events.on("start", function () {
			this.animation.play("idle.right");
		}, self);

		self.events.on("update", function (now, dt) {
			if (assets.audio) {
				var a = assets.get("fx.ready.audio*");

				if (a.currentTime < a.duration) {
					this.animation.update();
					return this;
				}
			}

			var inputs = keyboard.inputs
				, speed = this.red.speed
				, velocity = this.red.velocity
				//, dblxkey = false
				, anim_direction = "right"
				, can_move = now >= this.red.can_move_time
				, can_dash = (1 === this.red.dash)
				, dashing = (0.5 === this.red.speed)
				, atking = this.animation.isPlaying("atk.left") || this.animation.isPlaying("atk.right")
				, x = 0, y = 0;

			if (can_move && !dashing && !atking && (inputs["37"] || inputs["81"])) {
				x -= speed * 0.9 * dt;
				if (velocity.x > 0) this.red.speed = 0.25;

				this.red.left = true;
				this.red.right = false;

				this.animation.play("run.left");
			} else if (!dashing) {
				this.animation.stop("run.left");
			}
			
			if (can_move && !dashing && !atking && (inputs["39"] || inputs["68"])) {
				x += speed * 0.9 * dt;
				if (velocity.x < 0) this.red.speed = 0.25;
				
				this.red.left = false;
				this.red.right = true;

				this.animation.play("run.right");
			} else if (!dashing) {
				this.animation.stop("run.right");
			}

			if (this.red.left) anim_direction = "left"; 

			if (can_move && !dashing && !atking && (inputs["38"] || inputs["90"])) {
				y -= speed * 1.0 * dt;
				if (!this.animation.isPlaying("run." + anim_direction)) {
					this.animation.play("run." + anim_direction + ".up");
				}
			} else {
				this.animation.stop("run." + anim_direction + ".up");
			}

			if (can_move && !dashing && !atking && (inputs["40"] || inputs["83"])) {
				y += speed * 1.0 * dt;
				if (!this.animation.isPlaying("run." + anim_direction)) {
					this.animation.play("run." + anim_direction + ".bottom");
				}
			} else {
				this.animation.stop("run." + anim_direction + ".bottom");
			}

			if (dashing) {
				x = this.red.speed * 0.9 * dt;
				if (this.red.left) x *= -1;
			}

			if (can_move && !atking && can_dash && inputs["32"]) {
				this.aabb.trigger = true;

				this.red.dash = 0;
				this.red.speed = 0.5;
				this.red.dash_timestamp = now;

				this.animation.play("run." + anim_direction); // dash.left

				/*
				var go = gameobject().addComponent(dash_cloud_component);

				go.transform.localPosition.x = this.transform.localPosition.x + 25;
				go.transform.localPosition.y = this.transform.localPosition.y + 25;
				go.dash_cloud.speed = 0.25;
				if (this.red.left) go.dash_cloud.speed *= -1;

				gameobject.add(go);//*/
			}

			this.aabb._position.copy(this.transform.localPosition);

			velocity.set(x, y);
			this.transform.localPosition.add(velocity);

			if (can_move && !dashing && (now - mouse.buttondowns["0"] < 20)) {
				this.animation.play("atk." + anim_direction);

				if (assets.audio) {
					var a = assets.get("fx.mamy.punch.audio*");
					//a.currentTime = 0;
					a.src = a.src;
					a.play();
				}
			}

			this.animation.update();

			if (this.red.dash < 1) {
				this.red.dash = math.min(this.red.dash + this.red.dash_regenrate * dt, 1);
			}

			if (now >= this.red.dash_timestamp + this.red.dash_duration) {
				this.aabb.trigger = false;
				this.red.speed = 0.25;
			}
		}, self);

		self.events.on("render", function (ctx) {
			var transform_position = this.transform.localPosition
				, aabb_position = this.aabb.position
				, w = this.aabb.extents.x
				, h = this.aabb.extents.y

			this.renderer.render(ctx);

			/*
			ctx.strokeStyle = "#f0f";
			ctx.strokeRect(aabb_position.x - w, aabb_position.y - h, w * 2, h * 2);//*/

			if (this.red.life > 75) ctx.fillStyle = "#0f0";
			else if (this.red.life > 50) ctx.fillStyle = "#ff0";
			else if (this.red.life > 25) ctx.fillStyle = "#f80";
			else ctx.fillStyle = "#f00";

			ctx.fillRect(transform_position.x - 25, transform_position.y - 82, this.red.life / 100 * 50, 5);

			ctx.fillStyle = "#fff";
			ctx.fillRect(transform_position.x - 25, transform_position.y - 75, this.red.dash * 50, 5);
		}, self);

		this.velocity = vec2()
		this.hit_collider_offset = vec2(100, 50)

		this.life = 100;
		this.power = 10;

		this.right = true;
		this.left = false;

		this.speed = 0.25;

		this.dash = 1;
		this.dash_regenrate = 0.0005;
		this.dash_timestamp = 0;
		this.dash_duration = 250;

		this.can_move_time = 0;

		this.score = 0;

		this.parent = self;
	};

	Red.prototype = {

			constructor: Red

		, hit: function hit(value) {
				this.life -= value;
				
				if (this.left) this.parent.animation.play("damage.left");
				else this.parent.animation.play("damage.right");

				if (this.life <= 0) {
					this.life = 0;
					
					if (assets.audio) {
						assets.get("fx.mamy.death.audio*").play();
					}

					gamescene.get("game_over").score = this.score;
					gamescene.active("game_over");
				}
			}

	};


	var red_component = function red_component(self, options) {
		return new Red(self, options);
	};

	red_component.exports = "red";


	return red_component;

});