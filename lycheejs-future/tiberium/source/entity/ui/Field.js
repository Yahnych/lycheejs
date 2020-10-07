
lychee.define('game.entity.ui.Field').exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.id = settings.id || 0;

		this.__position = { x: 0, y: 0 };
		this.__width    = 100;
		this.__height   = 100;
		this.__label    = '';

		this.__callback = null;
		this.__scope    = null;


		if (typeof settings.width === 'number') {
			this.__width = settings.width;
		}

		if (typeof settings.height === 'number') {
			this.__height = settings.height;
		}

		if (typeof settings.label === 'string') {
			this.__label = settings.label;
		}

		if (settings.position !== undefined) {
			this.setPosition(settings.position.x || 0, settings.position.y || 0);
		}


		settings = null;

	};


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		bind: function(callback, scope) {

			callback = typeof callback === 'function' ? callback : null;
			scope    = scope !== undefined ? scope : null;

			if (callback !== null && scope !== null) {
				this.__callback = callback;
				this.__scope    = scope;
			}

		},

		trigger: function() {

			if (this.__callback !== null && this.__scope !== null) {
				this.__callback.call(this.__scope, this, this.id, this.__label);
			}

		},

		getLabel: function() {
			return this.__label;
		},

		setLabel: function(text) {

			text = typeof text === 'string' ? text : null;

			this.__label = text;

		},

		getPosition: function() {
			return this.__position;
		},

		setPosition: function(x, y) {
			this.__position.x = typeof x === 'number' ? x : this.__position.x;
			this.__position.y = typeof y === 'number' ? y : this.__position.y;
		},

		getWidth: function() {
			return this.__width;
		},

		getHeight: function() {
			return this.__height;
		}

	};


	return Class;

});

