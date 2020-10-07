
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

			if (this.__map[x] !== undefined) {

				if (this.__map[x][y] !== undefined) {
					this.__map[x][y] = value;
				}

			}

		},

		setViaHitmap: function(x, y, hitmap, size, value) {

			var x1 = Math.floor(x - size.x / 2);
			var y1 = Math.floor(y - size.y / 2);
			var x2 = Math.round(x + size.x / 2);
			var y2 = Math.round(y + size.y / 2);

			var index = 0;
			for (var x = x1 + 1; x < x2; x++) {
				for (var y = y1 + 1; y < y2; y++) {

					if (hitmap[index] === 1) {
						this.set(x, y, value);
					}

					index++;

				}
			}

		},

		getMap: function() {
			return this.__map;
		}

	};


	return Class;

});

