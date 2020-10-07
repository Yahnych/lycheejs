
lychee.define('game.module.Pixel').includes([
	'game.module.Base'
]).requires([
	'game.entity.pixel.Canvas',
	'game.entity.ui.Palette'
]).exports(function(lychee, game, global, attachments) {

	var _blob = attachments["json"].buffer;


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		game.module.Base.call(this, 'Pixel', settings);

		settings = null;


		this.deserialize(_blob);

	};


	Class.prototype = {

		deserialize: function(blob) {

			game.module.Base.prototype.deserialize.call(this, blob);

		},

		enter: function(data) {

			game.module.Base.prototype.enter.call(this);

		},

		leave: function() {

			game.module.Base.prototype.leave.call(this);

		}

	};


	return Class;

});

