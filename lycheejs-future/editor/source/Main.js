
lychee.define('game.Main').requires([
	'game.net.Client',
	'game.Fonts',
	'game.State'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({

			title: 'Game Boilerplate',

			// Is configured by sorbet/module/Server
			client: '/api/Server?identifier=editor',

			input: {
				delay:       0,
				key:         false,
				keymodifier: false,
				touch:       true,
				swipe:       true
			},

			jukebox: {
				music: true,
				sound: true
			},

			renderer: {
				id:     'game',
				width:  null,
				height: null
			},

			viewport: {
				fullscreen: false
			}

		}, data);


		lychee.game.Main.call(this, settings);

	};


	Class.prototype = {

		init: function() {

			// Overwrite client with game.net.Client
			var clientsettings   = this.settings.client;
			this.settings.client = null;

			lychee.game.Main.prototype.init.call(this);


			if (clientsettings !== null) {
				this.client = new game.net.Client(clientsettings, this);
			}


			this.fonts = new game.Fonts(this);


			this.setState('state', new game.State(this));
			this.changeState('state', {
				module: 'pixel'
			});

		}

	};


	return Class;

});
