
lychee.define('game.entity.ui.Bar').requires([
	'game.entity.ui.Field'
]).exports(function(lychee, global) {

	var _field = game.entity.ui.Field;

	var Class = function(callback, scope) {

		callback = callback instanceof Function ? callback : null;
		scope    = scope !== undefined ? scope : null;


		this.__callback = callback;
		this.__scope    = scope;


		this.__fields   = [];
		this.__position = { x: 0, y: 0 };


		this.__init();

	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__init: function() {

			var margin = 12;


			var deselect = new _field({
				id:       0,
				label:    'Deselect',
				width:    72,
				height:   36,
				position: {
					x: 72 / 2 + margin,
					y: 36 / 2 + margin + (48 - 36) / 2
				}
			});

			deselect.bind(this.__callback, this.__scope);

			this.__fields.push(deselect);



			var offset = 76 + 2 * margin;

			for (var f = 0; f < 6; f++) {

				var field = new _field({
					id:     f + 1,
					label:  '0',
					width:  64,
					height: 48,
					position: {
						x: offset + margin * f + 64 * f + 32,
						y: margin + 24
					}
				});

				field.bind(this.__callback, this.__scope);

				this.__fields.push(field);

			}

		},



		/*
		 * PUBLIC API
		 */

		update: function(clock, delta) {

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
		}

	};


	return Class;

});

