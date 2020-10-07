
// Set this to true to see lychee debug messages
lychee.debug = true;


lychee.rebase({
	lychee: '../../lychee',
	game: "./source"
});


lychee.tag({
	platform: [ 'html' ]
});


lychee.build(function(lychee, global) {

	var settings = {
	};


	var params = null;
	if (global.location && global.location.hash && global.location.hash.match(/#!/)) {
		params = window.location.hash.split(/#!/)[1];
	}

	if (params !== null) {

		params = params.split(',');

		for (var p = 0, l = params.length; p < l; p++) {

			var tmp = params[p].split('=');
			settings[tmp[0]] = !isNaN(parseInt(tmp[1], 10)) ? parseInt(tmp[1], 10) : tmp[1];

			if (settings[tmp[0]] === 'true') {
				settings[tmp[0]] = true;
			} else if (settings[tmp[0]] === 'false') {
				settings[tmp[0]] = false;
			}

		}

	}


	if (settings.debug === true) {
		lychee.debug = true;
	}


	new game.Main(settings);

}, this);

