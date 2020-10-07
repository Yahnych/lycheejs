
lychee.define('game.model.Hitmap').requires([
	'game.model.Level'
]).exports(function(lychee, global) {

	var _terrain = game.model.Level.TERRAIN;

	var Class = function() {

		this.__map = [];

	};


	Class.prototype = {

		reset: function(sizex, sizey) {

			this.__map = null;
			this.__map = [];

			for (var x = 0; x <= sizex; x++) {

				this.__map[x] = [];

				for (var y = 0; y <= sizey; y++) {

					if (x === 0 || y === 0) {
						this.__map[x][y] = _terrain.blocking;
					} else {
						this.__map[x][y] = _terrain['default'];
					}

				}

			}

		},

		get: function(x, y) {

			if (this.__map[x][y] === undefined) {
				return _terrain.blocking;
			} else {
				return this.__map[x][y];
			}

		},

		set: function(x, y, value) {
			this.__map[x | 0][y | 0] = value;
		},

		getMap: function() {
			return this.__map;
		}

	};


	return Class;

});

