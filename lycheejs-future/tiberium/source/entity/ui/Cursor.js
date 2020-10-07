
lychee.define('game.entity.ui.Cursor').requires([
	'game.entity.ui.Field'
]).exports(function(lychee, global) {

	var _field = game.entity.ui.Field;

	var Class = function(callback, scope) {

		callback = callback instanceof Function ? callback : null;
		scope    = scope !== undefined ? scope : null;


		this.__callback     = callback;
		this.__scope        = scope;


		this.__position     = { x: 0, y: 0 };
		this.__gridposition = { x: 0, y: 0 };
		this.__radius       = 40;
		this.__rotation     = 0;
		this.__scale        = 0;
		this.__fields       = [];
		this.__menu         = [];

		this.__showDuration = 0;
		this.__showClock    = null;
		this.__hideDuration = 0;
		this.__hideClock    = null;

		this.__clock = null;


		var dist = this.__radius + 1;
		var fw   = 72;
		var fh   = 36;

		(function(positions, fields, callback, scope) {

			for (var p = 0, pl = positions.length; p < pl; p++) {

				var field = new _field({
					label:  null,
					width:  fw,
					height: fh,
					position: {
						x: positions[p].x,
						y: positions[p].y
					}
				});

				field.bind(callback, scope);

				fields.push(field);

			}

		})([
			{ x:        dist + fw / 2, y:                    0 },
			{ x:                    0, y:        dist + fh / 2 },
			{ x: -1 * (dist + fw / 2), y:                    0 },
			{ x:                    0, y: -1 * (dist + fh / 2) }
		], this.__fields, this.__callback, this.__scope);

	};


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		update: function(clock, delta) {

			var t;

			// Show Animation
			if (this.__showClock !== null) {

				t = (clock - this.__showClock) / this.__showDuration;

				if (t < 1) {
					this.__scale     = t * 1;
					this.__rotation  = t * 360;
				} else {
					this.__rotation  = 0;
					this.__scale     = 1;
					this.__showClock = null;
				}

			}

			if (this.__hideClock !== null) {

				t = (clock - this.__hideClock) / this.__hideDuration;

				if (t < 1) {
					this.__scale     = (1 - t) * 1;
					this.__rotation  = (1 - t) * 360;
				} else {
					this.__rotation  = 0;
					this.__scale     = 0;
					this.__hideClock = null;
				}

			}


			this.__clock = clock;

		},

		show: function(duration) {

			this.__scale    = 0;
			this.__rotation = 0;

			this.__showDuration = duration || 1000;
			this.__showClock    = this.__clock;

		},

		hide: function(duration) {

			if (duration === 0) {

				this.__scale     = 0;
				this.__rotation  = 0;
				this.__showClock = null;
				this.__hideClock = null;

			} else {

				this.__scale      = 1;
				this.__rotation   = 0;

				this.__hideClock    = this.__clock;
				this.__hideDuration = duration || 1000;

			}

		},

		isVisible: function() {
			return this.__scale !== 0;
		},

		getFields: function() {
			return this.__fields;
		},

		getGridPosition: function() {
			return this.__gridposition;
		},

		setGridPosition: function(x, y) {
			this.__gridposition.x = typeof x === 'number' ? x : this.__position.x;
			this.__gridposition.y = typeof y === 'number' ? y : this.__position.y;
		},

		setMenu: function(menu) {

			if (
				Object.prototype.toString.call(menu) === '[object Array]'
				&& menu.length === this.__fields.length
			) {

				for (var m = 0, ml = menu.length; m < ml; m++) {
					this.__fields[m].setLabel(menu[m]);
				}

			}

		},

		getPosition: function() {
			return this.__position;
		},

		setPosition: function(x, y) {
			this.__position.x = typeof x === 'number' ? x : this.__position.x;
			this.__position.y = typeof y === 'number' ? y : this.__position.y;
		},

		getRadius: function() {
			return this.__radius;
		},

		getRotation: function() {
			return this.__rotation;
		},

		getScale: function() {
			return this.__scale;
		}

	};


	return Class;

});

