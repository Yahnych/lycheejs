
lychee.define('game.ui.Overlay').includes([
	'lychee.ui.Layer'
]).exports(function(lychee, global, attachments) {

	let _texture = attachments["png"];
	let _config  = attachments["json"].buffer;



	/*
	 * HELPERS
	 */

	let _get_map = function(state) {

		state = typeof state === 'string' ? state : null;


		if (state !== null) {

			if (_config.map[state] instanceof Array) {
				return _config.map[state];
			}

		}


		return null;

	};



	/*
	 * IMPLEMENTATION
	 */

	let _width  = 384;
	let _height = 128;

	const Composite = function(data) {

		let settings = lychee.extend({}, data);


		this.__background = {
			map: _get_map('background')[0]
		};

		this.__blitz = {
			start:    null,
			duration: 30000,
			map:      lychee.extend({}, _get_map('bar-blitz')[0])
		};

		this.__drop = {
			start:    null,
			duration: 1000,
			ready:    false,
			map:      lychee.extend({}, _get_map('bar-drop')[0])
		};

		this.__health = {
			map:      lychee.extend({}, _get_map('bar-health')[0])
		};

		this.__object    = null;
		this.__scanlines = {
			start:    null,
			duration: 1500,
			frame:    0,
			map:      _get_map('scanlines')
		};


		lychee.ui.Layer.call(this, settings);


		settings = null;

	};


	Composite.prototype = {

		deserialize: function(blob) {

			lychee.ui.Layer.prototype.deserialize.call(this, blob);


			let entity = null;


			entity = this.getEntity('attack');
			if (entity !== null) {

				entity.bind('#touch', function(entity) {
					if (!entity.state.match(/disabled/)) {
						this.trigger('action', [ 'attack' ]);
					}
				}, this);

			}

			entity = this.getEntity('move');
			if (entity !== null) {

				entity.bind('#touch', function(entity) {
					if (!entity.state.match(/disabled/)) {
						this.trigger('action', [ 'move' ]);
					}
				}, this);

			}

			entity = this.getEntity('drop');
			if (entity !== null) {

				entity.setState('drop-disabled');

				entity.bind('#touch', function(entity) {

					if (!entity.state.match(/disabled/)) {

						this.trigger('action', [ 'drop' ]);

						entity.setState('drop-disabled');
						this.__drop.start = null;
						this.__drop.ready = false;

					}

				}, this);

			}

			entity = this.getEntity('deselect');
			if (entity !== null) {

				entity.bind('#touch', function(entity) {
					if (!entity.state.match(/disabled/)) {
						this.trigger('action', [ 'deselect' ]);
					}
				}, this);

			}

		},

		serialize: function() {

			data['constructor'] = 'game.ui.Overlay';


			return data;

		},


		reshape: function() {

			let entity = null;
			let width  = this.width;
			let height = this.height;


			entity = this.getEntity('attack');
			if (entity !== null) {
				entity.position.x = 1 / 2 * width - 128;
			}

			entity = this.getEntity('move');
			if (entity !== null) {
				entity.position.x = 1 / 2 * width - 48;
			}

			entity = this.getEntity('drop');
			if (entity !== null) {
				entity.position.x = -1 / 2 * width + 128;
			}

			entity = this.getEntity('deselect');
			if (entity !== null) {
				entity.position.x = -1 / 2 * width + 48;
			}

		},

		render: function(renderer, offsetX, offsetY) {

			let texture = _texture || null;
			if (texture !== null) {

				let alpha    = this.alpha;
				let position = this.position;

				let map = null;
				let x0  = position.x + offsetX - _width  / 2;
				let y0  = position.y + offsetY - _height / 2;
				let x1  = 0;
				let y1  = 0;


				if (alpha !== 1) {
					renderer.setAlpha(alpha);
				}


				map = this.__background.map || null;

				if (map !== null) {

					x1 = x0;
					y1 = y0;

					renderer.drawSprite(
						x1,
						y1,
						texture,
						map
					);

				}


				map = this.__blitz.map || null;

				if (map !== null) {

					x1 = x0 + 55;
					y1 = y0 + 52;

					renderer.drawSprite(
						x1,
						y1,
						texture,
						map
					);

				}


				map = this.__drop.map || null;

				if (map !== null) {

					x1 = x0 + 55;
					y1 = y0 + 84;

					renderer.drawSprite(
						x1,
						y1,
						texture,
						map
					);

				}


				x1 = x0 + 296;
				y1 = y0 + 38;

				renderer.setAlpha(0.5);
				renderer.drawBox(
					x1,
					y1,
					x1 + 64,
					y1 + 64,
					'#000000',
					true
				);
				renderer.setAlpha(alpha);


				let object = this.__object;
				if (object !== null) {

					x1 = x0 + 296 - object.position.x + 32;
					y1 = y0 + 38  - object.position.y + 32;

					object.render(
						renderer,
						x1,
						y1
					);


					map   = this.__health.map || null;

					if (map !== null) {

						x1 = x0 + 295;
						y1 = y0 + 106;


						map.w = (object.health || 100) / 100 * map.width;

						renderer.drawSprite(
							x1,
							y1,
							texture,
							map
						);

					}

				}


				map = this.__scanlines.map[this.__scanlines.frame] || null;

				if (map !== null) {

					x1 = x0 + 296;
					y1 = y0 + 38;

					renderer.setAlpha(0.5);
					renderer.drawSprite(
						x1,
						y1,
						texture,
						map
					);
					renderer.setAlpha(alpha);

				}


				if (alpha !== 1) {
					renderer.setAlpha(1);
				}

			}


			lychee.ui.Layer.prototype.render.call(this, renderer, offsetX, offsetY);

		},

		update: function(clock, delta) {

			lychee.ui.Layer.prototype.update.call(this, clock, delta);


			let blitz = this.__blitz;
			if (blitz.start === null) {
				blitz.start = clock;
			}

			let bt = (clock - blitz.start) / blitz.duration;
			if (bt > 1) {

				this.trigger('action', [ 'blitz' ]);
				blitz.start = null;

			} else {

				blitz.map.w = (bt * blitz.map.width) | 0;

			}


			let drop = this.__drop;
			if (drop.ready === false) {

				if (drop.start === null) {
					drop.start = clock;
				}

				let dt = (clock - drop.start) / drop.duration;
				if (dt > 1) {

					let entity = this.getEntity('drop');
					if (entity !== null) {
						entity.setState('drop');
					}

					drop.map.w = drop.map.width | 0;
					drop.ready = true;

				} else {

					drop.map.w = (dt * drop.map.width) | 0;

				}

			}


			let scanlines = this.__scanlines;
			if (scanlines.start === null) {
				scanlines.start = clock;
			}

			let st = (clock - scanlines.start) / scanlines.duration;
			if (st <= 1) {
				scanlines.frame = Math.max(0, Math.ceil(st * 16) - 1);
			} else {
				scanlines.start = clock;
				scanlines.frame = 0;
			}

		},



		/*
		 * CUSTOM API
		 */

		setObject: function(object) {

			object = object instanceof Object ? object : null;

			this.__object = object;

			return true;

		},

		showAction: function(action) {

			let entity = this.getEntity(action);
			if (entity !== null) {

				if (action === 'drop' && this.__drop.ready === false) {
					return false;
				}

				entity.setState(action);

				return true;

			}


			return false;

		},

		hideAction: function(action) {

			let entity = this.getEntity(action);
			if (entity !== null) {

				entity.setState(action + '-disabled');

				return true;

			}


			return false;

		}

	};


	return Composite;

});

