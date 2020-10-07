
lychee.define('game.entity.Object').includes([
	'lychee.app.Sprite'
]).exports(function(lychee, game, global, attachments) {

	let _texture = attachments["png"];
	let _config  = attachments["json"].buffer;

	let _TYPES   = {
		 1: 'dirt-house',
		 2: 'grass-house',
		 3: 'lava-house',
		 4: 'rock-house',
		 5: 'sand-house',
		 6: 'snow-house',
		 7: 'stone-house',
		 8: 'water-house'
	};


	let Class = function(data) {

		let settings = lychee.extend({}, data);


		this.action = 'idle';
		this.color  = 'grey';
		this.health = 100;


		settings.texture = _texture;
		settings.map     = _config.map;
		settings.radius  = _config.radius;
		settings.shape   = _config.shape;
		settings.states  = _config.states;
		settings.state   = _TYPES[settings.type] || 'dirt-house';


		delete settings.type;


		lychee.app.Sprite.call(this, settings);

	};


	Class.prototype = {

		/*
		 * CUSTOM API
		 */

		canAction: function(action) {
			return false;
		},

		setAction: function(action) {
			return false;
		}

	};


	return Class;

});

