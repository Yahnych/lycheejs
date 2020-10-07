
lychee.define('game.entity.ui.Bar').requires([
	'game.entity.ui.Field'
]).exports(function(lychee, global) {

	var _field = game.entity.ui.Field;

	var Class = function(fields, callback, scope) {

		fields   = Object.prototype.toString.call(fields) === '[object Array]' ? fields : null;
		callback = callback instanceof Function ? callback : null;
		scope    = scope !== undefined ? scope : null;


		this.__callback = callback;
		this.__scope    = scope;


		this.__fields   = [];
		this.__position = { x: 0, y: 0 };
		this.__width  = 0;
		this.__height = 0;


		if (fields !== null) {
			this.__deserialize(fields);
		}

	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */


		__deserialize: function(fields) {

			var minX = Infinity, maxX = 0;
			var minY = Infinity, maxY = 0;

			for (var f = 0, fl = fields.length; f < fl; f++) {

				var raw = fields[f];

				var field = new _field({
					id:     raw.id,
					label:  raw.label,
					model:  raw.model || null,
					state:  raw.state || null,
					width:  raw.width || null,
					height: raw.height || null,
					position: {
						x: raw.x || 0, y: raw.y || 0
					}
				});

				var state = field.getState();
				var pos   = field.getPosition();
				var map   = field.getMap(state);

				maxX = Math.max(maxX, pos.x + map.w / 2);
				maxY = Math.max(maxY, pos.y + map.h / 2);

				minX = Math.min(minX, pos.x - map.w / 2);
				minY = Math.min(minY, pos.y - map.h / 2);

				field.bind(this.__callback, this.__scope, this);

				this.__fields.push(field);

			}


			if (maxX > minX && maxY > minY) {
				this.__width  = maxX - minX;
				this.__height = maxY - minY;
			}

		},



		/*
		 * PUBLIC API
		 */

		update: function(clock, delta) {

		},

		getField: function(id) {

			for (var f = 0, fl = this.__fields.length; f < fl; f++) {
				if (this.__fields[f].id === id) {
					return this.__fields[f];
				}
			}


			return null;

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

		getWidth: function() {
			return this.__width;
		},

		getHeight: function() {
			return this.__height;
		}

	};


	return Class;

});

