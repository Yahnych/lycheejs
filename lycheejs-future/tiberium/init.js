
// Set this to true to see lychee debug messages
// lychee.debug = true;


lychee.rebase({
	lychee: '../external/lycheejs/lychee',
	game: "./source"
});


lychee.tag({
	platform: [ 'html' ]
});


lychee.build(function(lychee, global) {

	// This will allow you to use this URL schema:
	// /url/to/boilerplate/#music=true,sound=false

	var params = window.location.hash.split(/#/)[1];

	var settings = {
		base: './asset'
	};

	if (params) {

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

	this.GAME = new game.Main(settings);

}, this);

