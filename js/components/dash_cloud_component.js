! define(["gameobject", "assets", "transition", "renderer_component"], function (gameobject, assets, transition, renderer_component) {
	
	var DashCloud = function DashCloud(self, options) {
		// var alpha = transition();

		self.addComponent(renderer_component, {
			source: assets.get("dash_cloud.png")
		});

		self.events
			.on("start", function () {
				this.dash_cloud.start_time = Date.now();
				// alpha.from(0).to(1);
			}, self)
			.on("render", function (ctx) {
				self.renderer.render(ctx);
			}, self)
			.on("update", function (now, dt) {
				// this.renderer.alpha = alpha.update().value;

				this.transform.localPosition.x -= this.dash_cloud.speed * dt;

				if (now >= this.dash_cloud.start_time + this.dash_cloud.lifespan) {
					// alpha.from(1).to(0).then(function () {
					 	gameobject.remove(this);
					// });
				}
			}, self);

		this.start_time = 0;
		this.lifespan = 250;
		this.speed = 0;
	};


	var dash_cloud_component = function dash_cloud_component(self, options) {
		return new DashCloud(self, options);
	};

	dash_cloud_component.exports = "dash_cloud"

	return dash_cloud_component;

}); //*/