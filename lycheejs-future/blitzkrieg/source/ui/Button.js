
lychee.define('game.ui.Button').includes([
	'lychee.ui.Sprite'
]).exports(function(lychee, game, global, attachments) {

	let _texture = attachments["png"];
	let _config  = attachments["json"].buffer;


	let Class = function(data) {

		let settings = lychee.extend({}, data);


		settings.texture = _texture;
		settings.width   = _config.width;
		settings.height  = _config.height;
		settings.map     = _config.map;
		settings.states  = _config.states;


		lychee.ui.Sprite.call(this, settings);

	};


	Class.prototype = {

	};


	return Class;

});

