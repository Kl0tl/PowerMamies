! define(function () {
	
	var OBJECT_PROTO = Object.prototype
		, ARRAY_PROTO = Array.prototype

		, HAS_OWN_PROPERTY = OBJECT_PROTO.hasOwnProperty
		, TO_STRING = OBJECT_PROTO.toString
		, SLICE = ARRAY_PROTO.slice;

	return {
			$: function $(selector) {
				return document.getElementById(selector);
			}

		, own: function own(o, key) {
				return HAS_OWN_PROPERTY.call(o, key);
			}

		, toString: function toString(o) {
				return TO_STRING.call(o);
			}

		, slice: function slice(o, start) {
				return SLICE.call(o, start);
			}

		, canvas: function canvas(width, height, then) {
				var c = document.createElement("canvas");

				c.width = width;
				c.height = height;

				then && then.call(c, c.getContext("2d"));

				return c;
			}
	};

});