
lychee.define('game.state.Game').requires([
	'lychee.app.Layer',
	'lychee.effect.Offset',
	'lychee.ui.Background',
	'game.ui.Button',
	'game.ui.Cursor',
	'game.ui.Overlay',
	'game.ui.Path',
	'game.entity.Emblem'
]).includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _Offset = lychee.import('lychee.effect.Offset');
	const _State  = lychee.import('lychee.app.State');
	const _BLOB   = attachments["json"].buffer;


	let _fonts = {
		headline: attachments["headline.fnt"],
		normal:   attachments["normal.fnt"]
	};

	let _levels = {
		debug: attachments["debug.json"].buffer
	};



	/*
	 * HELPERS
	 */

	let _process_touch = function(id, position, delta, swipe) {

		this.loop.setTimeout(200, function() {

			if (this.__swiping === false) {

				let logic        = this.logic;
				let game_terrain = this.query('game > terrain');
				let ui_overlay   = this.query('ui > overlay');

				if (logic !== null && game_terrain !== null && ui_overlay !== null) {

					position.x -= game_terrain.offset.x;
					position.y -= game_terrain.offset.y;


					let tileposition = logic.toTilePosition(position, 'terrain');
					let object       = logic.get(tileposition, 'objects');
					let terrain      = logic.get(tileposition, 'terrain');

					logic.trigger('select', [ object, terrain, tileposition ]);

				}

			}

		}, this);

	};

	let _process_swipe = function(id, state, position, delta, swipe) {

		let terrain = this.query('game > terrain');
		let objects = this.query('game > objects');
		let ui      = this.query('ui > game');

		if (this.__scrolling === false && state === 'move') {
			this.__swiping = true;
		}

		if (this.__scrolling === false && state === 'end') {

			let tile = this.main.TILE;
			if (Math.abs(swipe.x) < tile.width && Math.abs(swipe.y) < tile.offset) {
				this.__swiping = false;
				return;
			}


			let ox = terrain.offset.x;
			let oy = terrain.offset.y;
			let tx = ox + swipe.x;
			let ty = oy + swipe.y;
			let dx = this.renderer.width  - terrain.width;
			let dy = this.renderer.height - terrain.height;


			let bx1 = -1 / 2 * Math.abs(dx);
			let bx2 =  1 / 2 * Math.abs(dx);
			let by1 = -1 / 2 * Math.abs(dy);
			let by2 =  1 / 2 * Math.abs(dy);
			let tx2 = Math.min(Math.max(tx, bx1), bx2);
			let ty2 = Math.min(Math.max(ty, by1), by2);


			let type = _Offset.TYPE.easeout;
			if ((tx !== tx2 && Math.abs(ty) > Math.abs(tx)) || (ty !== ty2 && Math.abs(tx) > Math.abs(ty))) {
				type = _Offset.TYPE.bounceeaseout;
			}


			terrain.addEffect(new _Offset({
				type:     type,
				duration: 500,
				offset:   {
					x: tx2,
					y: ty2
				}
			}));

			objects.addEffect(new _Offset({
				type:     type,
				duration: 500,
				offset:   {
					x: tx2,
					y: ty2
				}
			}));

			ui.addEffect(new _Offset({
				type:     type,
				duration: 500,
				offset:   {
					x: tx2,
					y: ty2
				}
			}));


			this.__scrolling = true;

			this.loop.setTimeout(500, function() {
				this.__swiping   = false;
				this.__scrolling = false;
			}, this);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(main) {

		_State.call(this, main);


		this.logic = main.logic || null;

		this.__swiping   = false;
		this.__scrolling = false;


		this.deserialize(_BLOB);



		/*
		 * INITIALIZATION
		 */

		let viewport = this.viewport;
		if (viewport !== null) {

			viewport.bind('reshape', function(orientation, rotation) {

				let renderer = this.renderer;
				if (renderer !== null) {

					let entity = null;
					let width  = renderer.width;
					let height = renderer.height;


					entity = this.query('background');
					entity.width  = width;
					entity.height = height;

					entity = this.query('background > background');
					entity.width  = width;
					entity.height = height;

					entity = this.query('ui');
					entity.width  = width;
					entity.height = height;

					entity = this.query('ui > background');
					entity.width  = width;
					entity.height = height;

					entity = this.query('ui > emblem');
					entity.position.x = 1 / 2 * width - 128;
					entity.position.y = 1 / 2 * height - 32;

					entity = this.query('ui > overlay');
					entity.width      = width;
					entity.height     = 128;
					entity.position.y = height / 2 - 64;
					entity.reshape();

				}

			}, this);

		}

	};


	Composite.prototype = {

		deserialize: function(blob) {

			_State.prototype.deserialize.call(this, blob);

		},

		serialize: function() {

			let data = _State.prototype.serialize.call(this);
			data['constructor'] = 'game.state.Game';


			return data;

		},

		enter: function(oncomplete, data) {

			oncomplete = oncomplete instanceof Function ? oncomplete : null;
			data       = data !== undefined             ? data       : {};


			let settings = lychee.extend({
				level: 'debug'
			}, data);


			_State.prototype.enter.call(this, oncomplete);


			let logic = this.logic;
			if (logic !== null) {

				let level = lychee.deserialize(_levels[settings.level] || null);
				if (level !== null) {

					logic.enter(this, level);


					let game_terrain = this.query('game > terrain');
					let ui_game      = this.query('ui > game');
					let ui_overlay   = this.query('ui > overlay');

					if (game_terrain !== null && ui_game !== null) {

						ui_game.width  = game_terrain.width;
						ui_game.height = game_terrain.height;
						ui_game.bind('touch', _process_touch, this);

					}

					if (ui_overlay !== null) {

						ui_overlay.bind('#action', function(overlay, action) {
							this.trigger(action, []);
						}, logic);

					}

				}

			}


			this.input.bind('swipe', _process_swipe, this);


			return true;

		},

		leave: function(oncomplete) {

			oncomplete = oncomplete instanceof Function ? oncomplete : null;


			let ui_game = this.query('ui > game');
			if (ui_game !== null) {
				ui_game.unbind('touch', _process_touch, this);
			}


			let logic = this.logic;
			if (logic !== null) {
				logic.leave();
			}

			this.input.unbind('swipe', _process_swipe, this);


			return _State.prototype.leave.call(this, oncomplete);

		},

		update: function(clock, delta) {

			this.logic.update(clock, delta);

			return _State.prototype.update.call(this, clock, delta);

		}

	};


	return Composite;

});
