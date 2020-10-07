
lychee.define('game.entity.world.Base').exports(function(lychee, global) {

	var Class = function(team, data, level) {

		var settings = lychee.extend({}, data);


		this.__team  = null || team; // Ensure that team=0 is a valid value
		this.__level = level || null;


		// Low Level API
		this.__model    = settings.model || null;
		this.__position = { x: 0, y: 0 };
		this.__state    = null;


		this.setState(settings.state || 'default');

		if (settings.position !== undefined) {
			this.setPosition(settings.position.x || 0, settings.position.y || 0);
		}

		settings = null;

	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */



		/*
		 * LOW LEVEL API
		 */

		update: function(clock, delta) {

		},

		getMap: function(id) {

			if (this.__model === null) return null;


			var map = this.__model.getMap(id, 0);

			return map;

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

			var state = this.__model.getState(id);
			if (state !== null) {
				this.__state = id;
			}

		},

		getTeam: function() {
			return this.__team;
		}

	};


	return Class;

});

