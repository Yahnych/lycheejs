
lychee.define('game.state.Game').requires([
	'game.entity.ui.Bar'
]).includes([
	'lychee.game.State',
]).exports(function(lychee, global) {

	var _bar   = game.entity.ui.Bar;
	var _field = game.entity.ui.Field;

	var Class = function(game) {

		lychee.game.State.call(this, game, 'game');

		this.__data  = this.game.data;
		this.__input = this.game.input;
		this.__logic = this.game.logic;
		this.__ui    = this.game.ui;

		this.__loop     = this.game.loop;
		this.__renderer = this.game.renderer;
		this.__locked   = false;

	};


	Class.prototype = {

		__playMusic: function() {

			this.game.jukebox.playMusic();

			this.__input.unbind('touch', this.__playMusic);

		},

		reset: function() {
		},

		enter: function(level) {

			lychee.game.State.prototype.enter.call(this);

			var player = level.getPlayer();
			if (player !== null) {
				this.__ui.setColor(this.game.settings.palette[player.id]);
			}


			this.__logic.reset(level);


			this.__input.bind('touch', this.__playMusic, this);
			this.__input.bind('swipe', this.__ui.processSwipe, this.__ui);
			this.__renderer.start();

		},

		leave: function() {

			this.__renderer.stop();
			this.__input.unbind('swipe', this.__ui.processSwipe);
			this.__input.unbind('touch', this.__playMusic);

			this.game.jukebox.stopMusic();

			lychee.game.State.prototype.leave.call(this);

		},

		update: function(clock, delta) {

			this.__logic.update(clock, delta);
			this.__ui.update(clock, delta);

		},

		render: function(clock, delta) {

			this.__renderer.clear();

			this.__logic.render(clock, delta);

			if (lychee.debug === true) {

				var hitmap = this.__logic.__level.getHitmap('ground');
				if (hitmap !== null) {
					this.__renderer.renderHitmap(hitmap, '#ff0000');
				}

			}

			this.__ui.render(clock, delta);

			this.__renderer.flush();

		}

	};


	return Class;

});
