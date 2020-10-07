
lychee.define('game.entity.Emblem').includes([
	'lychee.app.Sprite'
]).exports(function(lychee, game, global, attachments) {

	let _texture = attachments["png"];
	let _config  = {
		width:  256,
		height: 64
	};


	let Class = function(data) {

		let settings = lychee.extend({}, data);


		settings.texture = _texture;
		settings.width   = _config.width;
		settings.height  = _config.height;


		lychee.app.Sprite.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		serialize: function() {

			let data = lychee.app.Sprite.prototype.serialize.call(this);
			data['constructor'] = 'game.entity.Emblem';


			return data;

		}

	};


	return Class;

});

