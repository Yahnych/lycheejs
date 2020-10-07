
lychee.define('game.Main').requires([
	'game.Logic',
	'game.net.Client',
	'game.net.Server',
	'game.state.Game'
]).includes([
	'lychee.app.Main'
]).exports(function(lychee, global, attachments) {

	const _Game   = lychee.import('game.state.Game');
	const _Main   = lychee.import('lychee.app.Main');
	const _Client = lychee.import('game.net.Client');
	const _Server = lychee.import('game.net.Server');
	const _Logic  = lychee.import('game.Logic');



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let settings = lychee.extend({

			title: 'Blitzkrieg',

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
				id:     'blitzkrieg',
				width:  null,
				height: null
			},

			viewport: {
				fullscreen: false
			}

		}, data);


		_Main.call(this, settings);


		this.TILE = {
			width:  65,
			height: 90,
			offset: 90 - 36
		};



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function(oncomplete) {

			this.settings.gameclient = this.settings.client;
			this.settings.client     = null;

			this.settings.gameserver = this.settings.server;
			this.settings.server     = null;

			oncomplete(true);

		}, this, true);

		this.bind('init', function() {

			let gameclient = this.settings.gameclient || null;
			if (gameclient !== null) {

				this.client = new _Client(gameclient, this);
				this.client.bind('connect', function() {
					this.changeState('game');
				}, this);

			}

			let gameserver = this.settings.gameserver || null;
			if (gameserver !== null) {
				this.server = new _Server(gameserver, this);
			}


			this.logic = new _Logic(this);

			this.setState('game', new _Game(this));

		}, this, true);


		settings = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Main.prototype.serialize.call(this);
			data['constructor'] = 'game.Main';

			let settings = data['arguments'][0] || {};
			let blob     = data['blob'] || {};


			if (this.defaults.client !== null) {
				settings.client = this.defaults.client;
			}


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		}

	};


	return Composite;

});
