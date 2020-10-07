
lychee.define('game.model.Vegetation').exports(function(lychee, global) {

	var Class = function(id, data) {

		this.id    = id || 'Default';
		this.type  = 'Vegetation';
		this.image = null;

		this.health  = data.health || 0;
		this.layer   = data.layer || 'ground';
		this.size    = { x: 1, y: 1 };
		this.terrain = data.terrain || 0;


		this.__hitmap = null;
		this.__map    = { x: 0, y: 0, w: 0, h: 0 };
		this.__states = {};
		this.__index  = 0;
		this.__width  = null;
		this.__height = null;

		for (var sId in data.map) {

			if (this.__states[sId] === undefined) {
				this.__states[sId] = {};
			}


			var raw = data.map[sId];

			this.__states[sId] = {
				from:     raw[0] || 0,
				to:       raw[1] || 0,
				animated: raw[2] === 1,
				loop:     raw[3] === 1,
				duration: raw[4] || 1000
			};

			this.__index = Math.max(this.__index, raw[1] || 0);

		}

	};


	Class.prototype = {

		getHitmap: function(id) {
			return this.__hitmap;
		},

		getMap: function(id, frame) {

			var state = this.getState(id);
			if (state !== null) {

				var w   = this.__width;
				var map = this.__map;

				map.x = state.from * w;

				if (state.animated === true && frame !== null) {
					map.x += frame * w;
				}

				return map;

			}


			return null;

		},

		getState: function(id) {
			return this.__states[id] || null;
		},

		getWidth: function(state) {
			return this.__width;
		},

		getHeight: function(state) {
			return this.__height;
		},

		setImage: function(image) {

			this.image = image;

			var iw = image.width;
			var ih = image.height;

			this.__width  = iw / (this.__index + 1);
			this.__height = ih;

			this.__map.w = this.__width | 0;
			this.__map.h = this.__height | 0;


			if (this.__width % 1 !== 0) {
				console.error('defect spritemap', this.id, this.__width, this.__index + 1);
			}

		}

	};


	return Class;

});

