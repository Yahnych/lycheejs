
lychee.define('game.Main').requires([
	'lychee.Font',
	'lychee.Input',
	'lychee.Viewport',
	'game.Data',
	'game.Jukebox',
	'game.Parser',
	'game.Renderer',
	'game.state.Game',
	'game.logic.Logic',
	'game.logic.UI'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, global) {

	var Class = function(settings) {

		lychee.game.Main.call(this, settings);

		this.fonts = {};

		this.__worlds    = [];
		this.__levels    = [];
		this.__buildings = [];
		this.__units     = [];
		this.__offset    = { x: 0, y: 0 };

		this.load();

	};


	Class.prototype = {

		defaults: {
			base: './asset',
			sound: true,
			music: true,
			fullscreen: true,
			renderFps: 60,
			updateFps: 60,
			width: 1024,
			height: 640,
			tile: 24,
			palette: {

				// Singleplayer
				GDI: '#00b64f',
				NOD: '#ff3500',

				// Multiplayer
				GDI0: '#00b64f',
				GDI1: '#ff3500',
				GDI2: '#8f04a8',
				GDI3: '#98ed00',
				GDI4: '#d0006e',
				GDI5: '#a64e00'

			}
		},

		load: function() {

			var base = this.settings.base;

			var urls = [
				base + '/ui/font-small.png',
				base + '/ui/font-normal.png',
				base + '/model/Building.json',
				base + '/model/Unit.json',
				base + '/world/Desert.json',
				base + '/level/Debug.json'
			];


			var parser = new game.Parser();

			parser.bind('ready', this.init, this);


			this.preloader = new lychee.Preloader({
				timeout: Infinity
			});

			this.preloader.bind('ready', function(assets) {

				this.fonts.small = new lychee.Font(assets[urls[0]], {
					baseline: 4,
					charset:  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
					kerning:  0,
					spacing:  3,
					map:      [8,5,10,10,10,10,9,5,6,6,7,10,5,5,5,5,9,9,9,9,9,9,9,9,9,9,5,5,10,10,10,9,14,12,10,11,11,9,11,10,12,5,12,10,9,14,11,11,11,11,10,11,11,11,11,14,11,10,11,4,5,4,10,8,6,11,9,9,9,8,10,9,10,4,10,9,8,13,10,10,10,10,10,10,10,10,10,12,10,9,10,6,8,6,10]
				});

				this.fonts.normal = new lychee.Font(assets[urls[1]], {
					baseline: 7,
					charset:  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
					kerning:  0,
					spacing:  3,
					map:      [20,11,26,24,26,25,22,12,14,14,18,25,11,13,11,13,22,22,22,22,22,22,22,22,22,22,11,12,25,25,25,24,36,31,26,27,27,24,29,27,30,11,29,25,23,36,27,28,28,28,25,28,27,28,28,36,28,26,27,10,13,10,25,21,15,27,23,24,24,21,25,23,25,10,26,22,21,32,24,25,25,24,26,26,25,24,26,31,25,22,24,15,20,15,25]
				});


				var _types = game.Parser.TYPE;

				parser.run([
					assets[base + '/world/Desert.json'],
					assets[base + '/level/Debug.json'],
					assets[base + '/model/Building.json'],
					assets[base + '/model/Unit.json']
				], [
					_types.World,
					_types.Level,
					_types.Building,
					_types.Unit
				], [
					base + '/world/Desert',
					base + '/level/Debug',
					base + '/model/Building',
					base + '/model/Unit'
				]);

			}, this);

			this.preloader.bind('error', function(urls) {

				if (lychee.debug === true) {
					console.warn('Preloader error for these urls: ', urls);
				}

			}, this);

			this.preloader.load(urls);

		},

		reset: function() {

			var env = this.renderer.getEnvironment();

			if (
				typeof width === 'number'
				&& typeof height === 'number'
			) {
				env.screen.width  = width;
				env.screen.height = height;
			}


			if (this.settings.fullscreen === true) {
				this.settings.width  = env.screen.width;
				this.settings.height = env.screen.height;
			} else {
				this.settings.width  = this.defaults.width;
				this.settings.height = this.defaults.height;
			}



			this.renderer.reset(
				this.settings.width,
				this.settings.height,
				true
			);


			this.__offset = env.offset; // Linked

		},

		init: function(worlds, levels, buildings, units) {

			lychee.Preloader.prototype._progress(null, null);


			this.__worlds    = worlds;
			this.__levels    = levels;
			this.__buildings = buildings;
			this.__units     = units;


			lychee.game.Main.prototype.init.call(this);

			this.renderer = new game.Renderer(this, 'game');
			this.renderer.reset(
				this.settings.width,
				this.settings.height,
				true
			);
			this.renderer.setBackground('#222222');


			this.viewport = new lychee.Viewport();
			this.viewport.bind('reshape', function(orientation, rotation, width, height) {

				this.reset(width, height);

				for (var id in this.states) {
					this.states[id].reset();
				}


				var state = this.getState();
				if (state !== null) {

					if (state === this.states.game) {
						state.leave && state.leave();
						state.enter && state.enter(this.__level);
					} else {
						state.leave && state.leave();
						state.enter && state.enter();
					}

				}

			}, this);
			this.viewport.bind('hide', function() {
//				this.stop();
			}, this);
			this.viewport.bind('show', function() {
//				this.start();
			}, this);


			this.reset();


			this.data    = new game.Data(this);
			this.jukebox = new game.Jukebox(this);
			this.logic   = new game.logic.Logic(this);
			this.ui      = new game.logic.UI(this);

			this.input   = new lychee.Input({
				delay:        0,
				fireKey:      false, // change to true for NodeJS support
				fireModifier: false,
				fireTouch:    true,
				fireSwipe:    true
			});


			this.states.game = new game.state.Game(this);


			var levelmodel = this.getLevel('Debug');
			if (levelmodel !== null) {
				this.__level = new game.entity.Level(this, levelmodel, 'GDI0');
				this.setState('game', this.__level);
			}


			this.start();

		},


		getWorld: function(id) {

			for (var w = 0, wl = this.__worlds.length; w < wl; w++) {

				var world = this.__worlds[w];
				if (world.id === id) {
					return world;
				}

			}


			return null;

		},

		getLevel: function(id) {

			for (var l = 0, ll = this.__levels.length; l < ll; l++) {

				var level = this.__levels[l];
				if (level.id === id) {
					return level;
				}

			}


			return null;

		},

		getBuilding: function(id) {

			for (var b = 0, bl = this.__buildings.length; b < bl; b++) {

				var building = this.__buildings[b];
				if (building.id === id) {
					return building;
				}

			}


			return null;

		},

		getUnit: function(id) {

			for (var u = 0, ul = this.__units.length; u < ul; u++) {

				var unit = this.__units[u];
				if (unit.id === id) {
					return unit;
				}

			}


			return null;

		},

		offset: function(position) {

			var offset = this.__offset;

			position.x -= offset.x;
			position.y -= offset.y;

		}

	};


	return Class;

});

