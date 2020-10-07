
lychee.define('game.ui.MusicBar').includes([
	'game.entity.ui.Bar'
]).exports(function(lychee, global) {

	var _bar = game.entity.ui.Bar;

	var Class = function(ui, game) {

		this.ui   = ui;
		this.game = game;


		var fields = [];

		fields.push({
			id:     0,
			label:  '< Prev',
			width:  72,
			height: 36,
			x:      0,
			y:      0
		});

		fields.push({
			id:     1,
			label:  'No Music Playback',
			width:  256,
			height: 36,
			x:      36 + 12 + 128,
			y:      0
		});

		fields.push({
			id:     2,
			label:  'Next >',
			width:  72,
			height: 36,
			x:      36 + 12 + 256 + 12 + 36,
			y:      0
		});


		_bar.call(this, fields, this.__onField, this.ui);


		var env = this.game.renderer.getEnvironment();

		var x = env.width / 2;
		var y = env.height - 12;

		this.setPosition(x, y);

	};


	Class.prototype = {

		__onField: function(field, id, label, bar) {


			var title = bar.getField(1);

			// Previous Track
			if (id === 0) {

				this.jukebox.playMusic(true);


			// Next Track
			} else if (id === 2) {

				this.jukebox.playMusic(false);


			// Toggle Music
			} else if (id === 1) {

				if (this.jukebox.isPlayingMusic() === true) {
					this.jukebox.stopMusic();
				} else {
					this.jukebox.playMusic(false);
				}

			}


			if (title !== null) {

				var info = this.jukebox.getMusicInfo();
				if (info !== null) {
					title.setLabel(info);
				} else {
					title.setLabel('No Music Playing');
				}

			}

		}

	};


	return Class;

});

