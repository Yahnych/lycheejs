
lychee.define('game.model.Building').exports(function(lychee, global) {

	var Class = function(id, data) {

		this.id    = id || 'Default';
		this.type  = 'Building';
		this.image = null;

		this.classification = data.classification || 3;
		this.cost           = data.cost || 0;
		this.health         = data.health || 0;
		this.layer          = 'ground';

		this.power          = data.power || 0;
		this.range          = data.range || 0;
		this.service        = data.service || [ 0, 0, 0, 0, 0 ];
		this.weapon         = data.weapon || null;

		this.servicedelay   = data.servicedelay || null;

		this.__size = {
			x: data.size[0] || 0,
			y: data.size[1] || 0
		};


		if (data.hitmap == null) {

			this.__hitmap = [];

			for (var x = 0; x < this.__size.x; x++) {
				for (var y = 0; y < this.__size.y; y++) {
					this.__hitmap.push(1);
				}
			}

		} else {

			this.__hitmap = data.hitmap;

		}


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

		getService: function(classification) {

			var service = this.service;
			if (typeof service[classification] === 'number') {
				return service[classification];
			}


			return null;

		},

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

		getSize: function(id) {
			return this.__size;
		},

		getState: function(id) {
			return this.__states[id] || null;
		},

		getWidth: function(id) {
			return this.__width;
		},

		getHeight: function(id) {
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

