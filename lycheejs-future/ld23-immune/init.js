
// Set to true to see lychee debug messages
// lychee.debug = true;


// Rebase required namespaces for inclusion
lychee.rebase({
	lychee: "../external/lycheejs/lychee",
	game: "./source"
});

lychee.tag({
	platform: [ 'html' ]
});

lychee.build(function(lychee, global) {

	var settings = {
		base: './asset',
		music: true,
		sound: true
	};

	global.MAIN = new game.Main(settings);

}, this);

