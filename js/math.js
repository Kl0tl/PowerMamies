! define(function () {
	
	return {
			random: Math.random

		, cos: Math.cos
		, sin: Math.sin
		
		, abs: Math.abs
		
		, sqrt: Math.sqrt
		
		, round: Math.round
		
		, atan: Math.atan
		, atan2: Math.atan2

		, min: Math.min
		, max: Math.max

		, sign: function sign(x) {
				return x < 0 ? -1 : 1;
			}

		, pi: Math.PI
		, tau: Math.PI * 2
	};

});