
lychee.define('game.model.Road').exports(function(lychee, global) {

	var Class = function(id, data) {

		this.id    = id || 'Default';
		this.type  = 'Terrain';
		this.image = null;

		this.__defaultSize = { x: 0, y: 0 };
		this.__hitmap = {};
		this.__map    = {};
		this.__sizes  = {};
		this.__states = {};
		this.__tile   = data.tile || 0;


		if (data.map !== undefined) {
			this.setMap(data.map || null);
		}

	};


	Class.prototype = {

		getHitmap: function(id) {
			return this.__hitmap[id] || null;
		},

		setMap: function(map) {

			if (Object.prototype.toString.call(map) !== '[object Object]') {
				return;
			}


			var tile = this.__tile;

			for (var sId in map) {

				if (this.__states[sId] === undefined) {
					this.__states[sId] = {};
				}


				var sizex = 0;
				var sizey = 0;
				var raw = map[sId];


				if (typeof raw[0] === 'number' && typeof raw[2] === 'number') {
					sizex = ((raw[2] + 1) - raw[0]);
				}

				if (typeof raw[1] === 'number' && typeof raw[3] === 'number') {
					sizey = ((raw[3] + 1) - raw[1]);
				}


				this.__map[sId] = {
					x: (raw[0] || 0) * tile,
					y: (raw[1] || 0) * tile,
					w: sizex * tile,
					h: sizey * tile
				};


				this.__sizes[sId] = { x: sizex, y: sizey };


				if (Object.prototype.toString.call(raw[4]) === '[object Array]') {
					this.__hitmap[sId] = raw[4];
				}

			}

		},

		getMap: function(id) {
			return this.__map[id] || null;
		},

		getSize: function(id) {
			return this.__sizes[id] || this.__defaultSize;
		},

		getState: function(id) {
			return this.__states[id] || null;
		},

		getWidth: function(id) {

			if (this.__map[id] !== undefined) {
				return this.__map[id].w;
			} else {
				return 0;
			}

		},

		getHeight: function(id) {

			if (this.__map[id] !== undefined) {
				return this.__map[id].h;
			} else {
				return 0;
			}

		},

		setImage: function(image) {
			this.image = image;
		}

	};


	return Class;

});

