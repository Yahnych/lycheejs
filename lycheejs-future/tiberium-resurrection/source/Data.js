
lychee.define('game.Data').includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.event.Emitter.call(this, 'data');

		this.game = game;

		this.__data = {};

	};

	Class.prototype = {

		add: function(team, key, value) {
			this.__data[team][key] += value;
			this.trigger('update', [ team, this.__data[team] ]);
		},

		substract: function(team, key, value) {
			this.__data[team][key] -= value;
			this.trigger('update', [ team, this.__data[team] ]);
		},

		set: function(team, key, value) {

			if (this.__data[team] === undefined) {
				this.__data[team] = {};
			}

			this.__data[team][key] = value;
			this.trigger('update', [ team, this.__data[team] ]);

		}

	};


	return Class;

});

