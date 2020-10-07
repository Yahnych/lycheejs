
// Set to true to see lychee debug messages
// lychee.debug = true;


// Rebase required namespaces for inclusion
lychee.rebase({
	lychee: "../../lychee",
	game: "./source"
});


lychee.tag({
	platform: [ 'webgl', 'html' ]
});

lychee.build(function(lychee, global) {

	var settings = {
		base: './asset',
		music: true,
		sound: true
	};

	new game.Main(settings);

}, typeof global !== 'undefined' ? global : this);

