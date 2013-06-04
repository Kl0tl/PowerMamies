! define(function () {
	
	var ratio = {
			screenRef: {x: 960, y: 540}

		, x: function x(value, element) {
				if (element === undefined) element = window;
				if (x.exceptions.hasOwnProperty(value)) return x.exceptions[value];
				return Math.min(Math.max(element.innerWidth * (value / ratio.screenRef.x), x.min), x.max);
			}
		, y: function y(value, element) {
				if (element === undefined) element = window;
				if (y.exceptions.hasOwnProperty(value)) return y.exceptions[value];
				return Math.min(Math.max(element.innerHeight * (value / ratio.screenRef.y), y.min), x.max);
			}
	};

	ratio.x.exceptions = {};
	
	ratio.x.min = -Infinity;
	ratio.x.max = Infinity;

	ratio.y.exceptions = {};

	ratio.y.min = -Infinity;
	ratio.y.max = Infinity;


	return ratio;

});