
lychee.define('game.Main').requires([
	'game.Data',
	'game.Jukebox',
	'game.Parser',
	'game.Renderer',
	'game.entity.Font',
	'game.state.Game',
	'game.logic.Logic'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({

			base: './asset',

			fullscreen: true,

			input: {
				fireKey:   false,
				fireTouch: true,
				fireSwipe: true
			},

			renderer: null, // Disable renderer

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

		}, data);


		lychee.game.Main.call(this, settings);


		this.__worlds    = [];
		this.__levels    = [];
		this.__buildings = [];
		this.__units     = [];

		this.load();

	};


	Class.prototype = {

		load: function() {

			var base = this.settings.base;

			var urls = [
				base + '/model/Building.json',
				base + '/model/Unit.json',
				base + '/world/Desert.json',
				base + '/level/Debug.json',
				base + '/level/AI-Combat.json'
			];


			var parser = new game.Parser();

			parser.bind('ready', this.init, this);


			this.preloader = new lychee.Preloader({
				timeout: Infinity
			});

			this.preloader.bind('ready', function(assets) {

				var _types = game.Parser.TYPE;

				parser.run([
					assets[base + '/world/Desert.json'],
					assets[base + '/level/Debug.json'],
					assets[base + '/level/AI-Combat.json'],
					assets[base + '/model/Building.json'],
					assets[base + '/model/Unit.json']
				], [
					_types.World,
					_types.Level,
					_types.Level,
					_types.Building,
					_types.Unit
				], [
					base + '/world/Desert',
					base + '/level/Debug',
					base + '/level/AI-Combat',
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

		reset: function(state) {

			this.reshape();


			if (state === true) {
				this.resetState(null, this.__level);
			}

		},

		init: function(worlds, levels, buildings, units) {

			lychee.Preloader.prototype._progress(null, null);


			this.__worlds    = worlds;
			this.__levels    = levels;
			this.__buildings = buildings;
			this.__units     = units;


			lychee.game.Main.prototype.init.call(this);


			this.renderer = new game.Renderer(this);
			this.renderer.setBackground('#222222');
			this.reset(false);


			this.fonts = {};
			this.fonts.normal = new game.entity.Font('normal');
			this.fonts.small  = new game.entity.Font('small');
			this.uimodel      = new game.model.UI('UI');

			this.data    = new game.Data(this);
			this.jukebox = new game.Jukebox(this);
			this.logic   = new game.logic.Logic(this);

			this.setState('game', new game.state.Game(this));


			var levelmodel = this.getLevel('AI-Combat');
			if (levelmodel !== null) {
				this.__level = new game.entity.Level(this, levelmodel, 'GDI0');
				this.changeState('game', this.__level);
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

		}

	};


	return Class;

});

