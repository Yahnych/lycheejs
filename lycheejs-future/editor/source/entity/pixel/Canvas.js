
lychee.define('game.entity.pixel.Canvas').includes([
	'lychee.ui.Layer'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		lychee.ui.Layer.call(this, settings);

		settings = null;

	};


	Class.prototype = {
	};


	return Class;

});

