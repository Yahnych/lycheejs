
lychee.define('game.model.Unit').requires([
	'game.model.Level'
]).exports(function(lychee, global) {

	var Class = function(id, data) {

		this.id    = id || 'Default';
		this.type  = 'Unit';
		this.image = null;
		this.tile  = null;

		this.classification = data.classification || null;
		this.cost           = data.cost || 0;
		this.damage         = data.damage || [ 0, 0, 0, 0, 0 ];
		this.health         = data.health || 0;
		this.interval       = data.interval || null;
		this.layer          = data.layer || 'ground';
		this.range          = data.range || 0;

		this.__hitmap = null;
		this.__map    = { x: 0, y: 0, w: 0, h: 0 };
		this.__size   = { x: 1, y: 1 }; // TODO: Support bigger unit tilesizes
		this.__states = {};
		this.__speed  = {};


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

		}


		if (
			data.speed
			&& data.terrain
			&& data.speed.length === data.terrain.length
		) {

			var _types = game.model.Level.TERRAIN;

			for (var i = 0, l = data.speed.length; i < l; i++) {

				var terrain = data.terrain[i];
				var speed   = data.speed[i];

				var valid = false;
				for (var tId in _types) {

					if (_types[tId] === terrain) {
						valid = true;
						break;
					}

				}


				if (valid === true) {
					this.__speed[terrain] = speed;
				}

			}

		}

	};


	Class.CLASSIFICATION = {
		infantry: 0,
		vehicle:  1,
		tank:     2,
		building: 3,
		plane:    4
	};


	Class.prototype = {

		getHitmap: function(id) {
			return this.__hitmap;
		},

		getMap: function(id, rotation, frame) {

			var tile  = this.tile;
			var state = this.getState(id);

			if (
				tile !== null
				&& state !== null
			) {

				var map  = this.__map;

				map.x = state.from * tile;

				if (rotation !== null) {
					map.x += Math.floor(32 * rotation / 360) * tile;
				} else if (state.animated === true && frame !== null) {
					map.x += frame * tile;
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

		getSpeed: function(terrain) {

			if (this.__speed[terrain] !== undefined) {
				return this.__speed[terrain];
			}


			return 0;

		},

		getWidth: function() {
			return this.tile;
		},

		getHeight: function() {
			return this.tile;
		},

		setImage: function(image) {

			this.image = image;
			this.tile  = image.height;

			this.__map.w = this.tile;
			this.__map.h = this.tile;

		}

	};


	return Class;

});

