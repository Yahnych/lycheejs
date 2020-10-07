
lychee.define('game.Fonts').exports(function(lychee, game, global, attachments) {

	var _fonts = {
		headline: attachments["headline.fnt"],
		label:    attachments["normal.fnt"],
		normal:   attachments["normal.fnt"]
	};

	var Class = function() {

		for (var id in _fonts) {
			this[id] = _fonts[id];
		}

	};


	Class.prototype = {
	};


	return Class;

});

