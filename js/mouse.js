! define(["vec2"], function (vec2) {
	
	var mouse = {
			position: vec2()
		, delta: vec2()

		, inputs: {}

		, buttondowns: {}
		, buttonups: {}

		, contextmenu: false

		, onmousemove: function onmousemove(e) {
				var x = e.clientX - (e.target && e.target.offsetLeft || 0)
					, y = e.clientY - (e.target && e.target.offsetTop || 0);

				mouse.delta.x = x - mouse.position.x;
				mouse.delta.y = y - mouse.position.y;

				mouse.position.set(x, y);
			}

		, onclick: function onmouseclick(e) {
				var code = e.button || (e.which - 1);
				mouse.buttondowns[code + ":click"] = Date.now();
			}

		, onmousedown: function onmousedown(e) {
				mouse.onmousemove(e);

				var code = e.button || (e.which - 1);

				mouse.inputs[code] = true;
				mouse.buttondowns[code] = Date.now();
			}

		, onmouseup: function onmouseup(e) {
				var code = e.button || (e.which - 1);

				mouse.inputs[code] = false;
				mouse.buttonups[code] = Date.now();
				
				mouse.buttonups[code + ":click"] = Date.now();
			}

		, oncontextmenu: function oncontextmenu(e) {
				if (!mouse.contextmenu) e.preventDefault();  
			}

		, listen: function listen(element) {
				if (element === undefined) element = document;
				
				element.addEventListener("click", mouse.onclick, false);
				element.addEventListener("mousemove", mouse.onmousemove, false);
				element.addEventListener("mousedown", mouse.onmousedown, false);
				element.addEventListener("mouseup", mouse.onmouseup, false);
				element.addEventListener("contextmenu", mouse.oncontextmenu, false);
			}
		, unlisten: function unlisten(element) {
				if (element === undefined) element = document;

				element.removeEventListener("click", mouse.onclick, false);
				element.removeEventListener("mousemove", mouse.onmousemove, false);
				element.removeEventListener("mousedown", mouse.onmousedown, false);
				element.removeEventListener("mouseup", mouse.onmouseup, false);
				element.removeEventListener("contextmenu", mouse.oncontextmenu, false);
			}
	};

	return mouse;

});