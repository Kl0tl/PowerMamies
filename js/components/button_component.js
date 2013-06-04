! define(["assets", "mouse", "gameobject", "renderer_component", "aabb_component"], function (assets, mouse, gameobject, renderer_component, aabb_component) {

	var Button = function Button(self, options) {
		self
			.addComponent(renderer_component)
			.addComponent(aabb_component, {
					width: options.width
				, height: options.height
			});

		self.events.on("update", function (now, dt) {
			var mouse_position = mouse.position;

				if (!this.button.active) {
					this.renderer.source = this.button.disabled_sprite || this.button.normal_sprite;
				} else if (this.aabb.contains(mouse_position.x, mouse_position.y)) {
					this.renderer.source = this.button.hover_sprite || this.button.normal_sprite;
					if (this.button.onclick && (now - mouse.buttondowns["0:click"]) < 16) {
						this.button.onclick();
					}
				} else {
					this.renderer.source = this.button.normal_sprite;
				}
		}, self);

		self.events.on("render", function (ctx) {
			this.renderer.render(ctx);
		}, self);

		this.active = (options.active === undefined ? true : options.active);
			
		this.normal_sprite = options.normal_sprite;
		this.hover_sprite = options.hover_sprite;
		this.disabled_sprite = options.disabled_sprite;
		
		this.onclick = options.onclick;

		this.parent = self;
	};

	Button.prototype = {

		constructor: Button

	};


	var button_component = function button_component(self, options) {
		return new Button(self, options);
	};

	button_component.exports = "button";


	return button_component;

});