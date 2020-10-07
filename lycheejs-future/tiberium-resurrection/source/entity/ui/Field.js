
lychee.define('game.entity.ui.Field').requires([
	'game.model.UI'
]).exports(function(lychee, global) {

	var _model = game.model.UI;

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.id = settings.id || 0;

		this.__label    = '';
		this.__map      = null;
		this.__model    = null;
		this.__position = { x: 0, y: 0 };
		this.__state    = null;
		this.__width    = null;
		this.__height   = null;

		this.__callback = null;
		this.__scope    = null;

		this.__map = {
			x: 0,
			y: 0,
			w: typeof settings.width === 'number' ? settings.width : 0,
			h: typeof settings.height === 'number' ? settings.height : 0
		};


		if (settings.model != null && settings.model instanceof _model) {
			this.__model = settings.model;
		}

		if (typeof settings.label === 'string') {
			this.__label = settings.label;
		}

		if (settings.position !== undefined) {
			this.setPosition(settings.position.x || 0, settings.position.y || 0);
		}

		if (typeof settings.state === 'string') {
			this.setState(settings.state);
		}


		settings = null;

	};


	Class.prototype = {

		/*
		 * PUBLIC API
		 */

		bind: function(callback, scope, parent) {

			callback = typeof callback === 'function' ? callback : null;
			scope    = scope !== undefined ? scope : null;
			parent   = parent !== undefined ? parent : null;

			if (callback !== null && scope !== null) {
				this.__callback = callback;
				this.__scope    = scope;
				this.__parent   = parent;
			}

		},

		trigger: function() {

			if (this.__callback !== null && this.__scope !== null) {
				this.__callback.call(this.__scope, this, this.id, this.__label, this.__parent);
			}

		},

		getLabel: function() {
			return this.__label;
		},

		setLabel: function(text) {

			text = typeof text === 'string' ? text : null;

			this.__label = text;

		},

		getMap: function(id) {

			if (this.__model === null) {
				return this.__map;
			}

			var map = this.__model.getMap(id);
			if (map !== null) {
				return map;
			}


			return this.__map;

		},

		getModel: function() {
			return this.__model;
		},

		getPosition: function() {
			return this.__position;
		},

		setPosition: function(x, y) {
			this.__position.x = typeof x === 'number' ? x : this.__position.x;
			this.__position.y = typeof y === 'number' ? y : this.__position.y;
		},

		getState: function() {
			return this.__state;
		},

		setState: function(id) {

			if (this.__model === null) return;


			this.__state = id;

		}

	};


	return Class;

});

