! define(function () {
	
	var Transition = function Transition() {};

	Transition.prototype = {

		constructor: Transition

	};


	var transition = function transition() {
		return new Transition();
	}

	return transition;

});