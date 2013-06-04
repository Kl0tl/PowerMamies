! define(function () {
	
	var keyboard = {
			inputs: {}

		, keydowns: {}
		, keyups: {}

		, onkeydown: function onkeydown(e) {
				var code = e.keyCode || e.which;
				keyboard.inputs[code] = true;

				keyboard.keydowns[code] = e.timeStamp;
			}
		, onkeyup: function onkeyup(e) {
				var code = e.keyCode || e.which;
				keyboard.inputs[code] = false;

				keyboard.keyups[code] = e.timeStamp;
			}

		, listen: function listen() {
				document.addEventListener("keydown", keyboard.onkeydown, false);
				document.addEventListener("keyup", keyboard.onkeyup, false);
			}
		, unlisten: function unlisten() {
				document.removeEventListener("keydown", keyboard.onkeydown, false);
				document.removeEventListener("keyup", keyboard.onkeyup, false);
			}
	};

	return keyboard;

});