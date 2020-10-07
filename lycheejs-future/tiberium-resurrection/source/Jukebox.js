
lychee.define('game.Jukebox').includes([
	'lychee.Jukebox'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.Jukebox.call(this, 20);

		this.game = game;


		this.__music    = null;
		this.__index    = 0;
		this.__playlist = [
			'music/cc-thang',
			'music/act-on-instinct',
			'music/heavy-g',
			'music/industrial-1',
			'music/industrial-2',
			'music/just-do-it',
			'music/radio',
			'music/target',
			'music/warfare'
		];
		this.__playlistinfo = [
			'CnC Thang',
			'Act On Instinct',
			'Heavy G',
			'Industrial #1',
			'Industrial #2',
			'Just Do It Up',
			'Radio',
			'Target',
			'Warfare'
		];


		this.__sounds = {

			unit: {

				ready: [
					'sound/unit/awaiting-orders',
					'sound/unit/ready-and-waiting',
					'sound/unit/reporting'
				],

				okay: [
					'sound/unit/acknowledged',
					'sound/unit/affirmative',
					'sound/unit/moving-out',
					'sound/unit/not-a-problem',
					'sound/unit/right-away-sir',
					'sound/unit/roger',
					'sound/unit/yes-sir',
					'sound/unit/you-got-it'
				]

			},

			weapon: [
				'sound/weapon/cannon-light',
				'sound/weapon/cannon-heavy',
				'sound/weapon/cannon-mammoth',
				'sound/weapon/minigun-light',
				'sound/weapon/minigun-heavy'
			]

		};


		if (this.game.settings.music === true) {

			var base = game.settings.base;
			var formats = [ 'ogg', 'mp3', 'wav' ];
			var addTracks = function(tracks, that) {

				for (var t = 0, l = tracks.length; t < l; t++) {

					that.add(new lychee.Track(tracks[t], {
						base:    base + '/' + tracks[t],
						formats: formats
					}));

				}

			};


			addTracks(this.__sounds.unit.ready, this);
			addTracks(this.__sounds.unit.okay,  this);
			addTracks(this.__sounds.weapon,     this);
			addTracks(this.__playlist,          this);

		}

	};

	Class.prototype = {

		playUnitReadySound: function() {

			if (this.game.settings.sound === true) {

				var list = this.__sounds.unit.ready;
				var rand = Math.round(Math.random() * (list.length - 1));
				this.play(list[rand]);

			}

		},

		playUnitOkaySound: function() {

			if (this.game.settings.sound === true) {

				var list = this.__sounds.unit.okay;
				var rand = Math.round(Math.random() * (list.length - 1));
				this.play(list[rand]);

			}

		},

		playWeaponSound: function(weapon) {

			if (this.game.settings.sound === true) {
				var id = 'sound/weapon/' + weapon;
				this.play(id);
			}

		},



		/*
		 * UI and Music Playlist Interaction
		 */

		getMusicInfo: function() {

			if (this.__music !== null) {
				return this.__playlistinfo[this.__index] || null;
			}


			return null;

		},

		isPlayingMusic: function() {
			return this.__music !== null;
		},

		playMusic: function(invert) {

			invert = invert === true;


			if (this.game.settings.music === true) {

				if (this.__music !== null) {
					this.stop(this.__music);
				}


				if (invert === true) {
					this.__index--;
					if (this.__index < 0) this.__index = this.__playlist.length - 1;
				} else {
					this.__index++;
					this.__index %= this.__playlist.length;
				}


	   			this.__music = this.__playlist[this.__index];
				this.play(this.__music, true);

				return true;

			}


			return false;

		},

		stopMusic: function() {

			if (this.__music !== null) {

				this.stop(this.__music);
				this.__music = null;

				return true;

			}


			return false;

		}

	};


	return Class;

});

