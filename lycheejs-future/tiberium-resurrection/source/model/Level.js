
lychee.define('game.model.Level').exports(function(lychee, global) {

	var Class = function(data) {

		this.id         = data.id || 'Default';
		this.player     = data.player || null;
		this.settings   = [];
		this.size       = { x: 0, y: 0 };
		this.terrain    = data.terrain || [];
		this.vegetation = data.vegetation || [];
		this.world      = data.world || 'Desert';


		if (Object.prototype.toString.call(data.size) === '[object Array]') {
			this.size.x = data.size[0] || 0;
			this.size.y = data.size[1] || 0;
		}


		for (var id in data.players) {

			var player = data.players[id];

			this.settings.push({
				id:        id,
				credits:   player.credits || 0,
				buildings: player.buildings || [],
				units:     player.units || []
			});

		}

	};


	Class.GROUND = {
		'default':  0,
		'unit':     1,
		'building': 2
	};


	Class.TERRAIN = {
		'default':  0,
		'road':     1,
		'crater':   2,
		'water':    3,
		'blocking': 4
	};

	Class.LAYER = {
		terrain: 0,
		ground:  1,
		sky:     2
	};


	Class.prototype = {

	};


	return Class;

});

