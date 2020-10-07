
lychee.define('game.entity.Font').requires([
	'lychee.Font'
]).exports(function(lychee, global, attachments) {

	var _font   = lychee.Font;
	var _images = {};
	var _settings = {};


	for (var file in attachments) {

		var tmp = file.split('.');
		var id  = tmp[0];
		var ext = tmp[1];

		if (ext === 'png') {
			_images[id] = attachments[file];
		} else if (ext === 'json') {
			_settings[id] = attachments[file];
		}

	}


	var Callback = function(id) {

		if (
			_images[id] !== undefined
			&& _settings[id] !== undefined
		) {

			return new _font(_images[id], _settings[id]);

		}

	};


	return Callback;

});

