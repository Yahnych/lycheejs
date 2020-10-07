
lychee.define('game.Main').requires([
	'lychee.Font',
	'lychee.Input',
	'game.Debugger',
	'game.Jukebox',
	'game.Level',
	'game.Renderer',
	'game.campaign.Immune1',
	'game.campaign.Immune2',
	'game.logic.Main',
	'game.skirmish.Roundabout',
	'game.state.Campaign',
	'game.state.Editor',
	'game.state.Game',
	'game.state.GameOver',
	'game.state.Menu',
//	'game.state.Skirmish',
	'game.DeviceSpecificHacks'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, global) {

	var Class = function(settings) {

		lychee.game.Main.call(this, settings);

		this.fonts = {};
		this.sprite = null;

		this.__offset = null;

		this.load();

	};


	Class.prototype = {

		defaults: {
			title: 'Immune Game',
			base: './asset',
			sound: true,
			music: true,
			fullscreen: false,
			renderFps: 60,
			updateFps: 60,
			width: 1280,
			height: 800,
			palette: {
				neutral: '#fff',
				immune: '#00f',
				virus: '#f00'
			},
			spawntimeout: 1000,
			team: 'immune'
		},

		load: function() {

			var base = this.settings.base;

			var urls = [
				base + '/img/font_64_white.png',
				base + '/img/font_48_white.png',
				base + '/img/font_18_white.png'
			];


			this.preloader = new lychee.Preloader({
				timeout: 3000
			});

			this.preloader.bind('ready', function(assets) {

				this.assets = assets;

				this.fonts.headline = new lychee.Font(assets[urls[0]], {
					kerning: -4,
					spacing: 8,
					map: [15,20,34,34,44,53,48,20,29,34,34,34,20,34,20,34,44,29,44,44,44,44,44,48,44,44,20,20,34,34,39,39,48,44,44,44,44,39,39,44,44,20,44,48,39,53,44,44,44,44,44,44,44,44,48,62,48,44,48,25,39,29,34,25,20,39,39,39,39,39,34,39,39,20,25,39,20,58,39,39,39,39,34,39,29,39,39,58,39,39,39,29,15,34,34]
				});


				this.fonts.normal = new lychee.Font(assets[urls[1]], {
					kerning: -6,
					spacing: 8,
					map: [13,17,27,27,34,41,38,17,24,27,27,27,17,27,17,27,34,24,34,34,34,34,34,38,34,34,17,17,27,27,31,31,38,34,34,34,34,31,31,34,34,17,34,38,31,41,34,34,34,34,34,34,34,34,38,48,38,34,38,20,31,24,27,20,17,31,31,31,31,31,27,31,31,17,20,31,17,45,31,31,31,31,27,31,24,31,31,45,31,31,31,24,13,27,27]
				});


				this.fonts.small = new lychee.Font(assets[urls[2]], {
					kerning: 0,
					spacing: 4,
					map: [3,4,8,8,11,14,12,4,7,8,8,8,4,8,4,8,11,7,11,11,11,11,11,12,11,11,4,4,8,8,10,10,12,11,11,11,11,10,10,11,11,4,11,12,10,14,11,11,11,11,11,11,11,11,12,16,12,11,12,6,10,7,8,6,4,10,10,10,10,10,8,10,10,4,6,10,4,15,10,10,10,10,8,10,7,10,10,15,10,10,10,7,3,8,8]
				});


				this.init();

			}, this);

			this.preloader.bind('error', function(urls) {
				if (lychee.debug === true) {
					console.warn('Preloader error for these urls: ', urls);
				}
			}, this);

			this.preloader.load(urls);

		},

		reset: function() {

			game.DeviceSpecificHacks.call(this);

			var env = this.renderer.getEnvironment();

			if (this.settings.fullscreen === true) {
				this.settings.width = env.screen.width;
				this.settings.height = env.screen.height;
			} else {
				this.settings.width = this.defaults.width;
				this.settings.height = this.defaults.height;
			}


			this.renderer.reset(this.settings.width, this.settings.height, true);


			var width = this.settings.width;
			var height = this.settings.height;

			this.layers = {
				game: {
					type: 'dynamic',
					width: width,
					height: height * 0.8,
					offset: {
						x: 0, y: 0
					}
				},
				statusbar: {
					type: 'static',
					width: width,
					height: height * 0.2,
					offset: {
						x: 0, y: height * 0.8
					}
				}
			};


			this.__rendererEnv = env;

			this.getOffset(true);

		},

		init: function() {

			lychee.game.Main.prototype.init.call(this);


			this.renderer = new game.Renderer('game', this);

			this.renderer.reset(
				this.settings.width,
				this.settings.height,
				true
			);

			this.renderer.setBackground("#222");


			this.reset();


			this.jukebox = new game.Jukebox(this);

			this.input = new lychee.Input({
				delay: 0,
				fireModifier: true,
				fireTouch:    true,
				fireSwipe:    true
			});

			this.logic = new game.logic.Main(this);


			this.states = {
				campaign: new game.state.Campaign(this),
				// skirmish: new game.state.Skirmish(this),
				editor:   new game.state.Editor(this),
				game:     new game.state.Game(this),
				gameover: new game.state.GameOver(this),
				menu:     new game.state.Menu(this)
			};


			if (lychee.debug === true) {
//				this.debugger = new game.Debugger(this);
			}


			this.setState('menu');

			this.start();

		},

		offset: function(position, layer) {

			layer = layer || null;

			position.x -= this.renderer.context.offsetLeft;
			position.y -= this.renderer.context.offsetTop;

			if (layer !== null) {
				position.x -= layer.offset.x;
				position.y -= layer.offset.y;
			}

		},

		getOffset: function(reset) {

			if (this.__offset === null || reset === true) {
				this.__offset = this.__rendererEnv.offset;
			}

			return this.__offset;

		},

		set: function(key, value) {

			if (this.settings[key] !== undefined) {

				if (value === null) {
					value = this.defaults[key];
				}

				this.settings[key] = value;

				return true;

			}

			return false;

		}

	};


	return Class;

});
