
lychee.define('game.model.UI').exports(function(lychee, global, attachments) {

	var _image  = attachments['png'];
	var _config = attachments['json'];


	var Class = function(id) {

		this.id    = id;
		this.image = _image;

		this.__map    = {};
		this.__states = {};

		this.setMap(_config);

	};


	Class.prototype = {

		setMap: function(map) {

			if (Object.prototype.toString.call(map) !== '[object Object]') {
				return;
			}


			for (var sId in map) {

				if (this.__states[sId] === undefined) {
					this.__states[sId] = {};
				}


				var raw = map[sId];


				this.__map[sId] = {
					x: raw[0] || 0,
					y: raw[1] || 0,
					w: raw[2] || 0,
					h: raw[3] || 0
				};

			}

		},

		getMap: function(id) {

			var state = this.getState(id);
			if (state !== null) {
				return this.__map[id];
			}


			return null;

		},

		getState: function(id) {
			return this.__states[id] || null;
		},

		getWidth: function(id) {
			return this.__map[id].w;
		},

		getHeight: function(id) {
			return this.__map[id].h;
		}

	};


	return Class;

});

