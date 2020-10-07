
lychee.define('game.entity.ui.Dialog').requires([
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
		this.__scale        = 0;
		this.__fields       = [];

		this.__showDuration = 0;
		this.__showClock    = null;
		this.__hideDuration = 0;
		this.__hideClock    = null;

		this.__clock = null;

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

			this.__showDuration = duration || 1000;
			this.__showClock    = this.__clock;

		},

		hide: function(duration) {

			if (duration === 0) {

				this.__scale     = 0;

				this.__showClock = null;
				this.__hideClock = null;

			} else {

				this.__scale      = 1;

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

		getPosition: function() {
			return this.__position;
		},

		setPosition: function(x, y) {
			this.__position.x = typeof x === 'number' ? x : this.__position.x;
			this.__position.y = typeof y === 'number' ? y : this.__position.y;
		},

		getScale: function() {
			return this.__scale;
		}

	};


	return Class;

});

