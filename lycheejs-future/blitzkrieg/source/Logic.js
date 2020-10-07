
lychee.define('game.Logic').requires([
	'lychee.app.State',
	'lychee.effect.Alpha',
	'lychee.effect.Color',
	'lychee.effect.Lightning',
	'lychee.effect.Position',
	'lychee.effect.Shake',
	'game.entity.Tank',
	'game.logic.Level',
	'game.logic.Path'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	const _Emitter = lychee.import('lychee.event.Emitter');
	const _Tank    = lychee.import('game.entity.Tank');
	const _Level   = lychee.import('game.logic.Level');
	const _State   = lychee.import('lychee.app.State');


	let _music  = {
		battle:    attachments["battle.msc"],
		commando:  attachments["commando.msc"]
	};

	let _sounds = {

		select_tank:     attachments["select-tank.snd"],
		select_position: attachments["select-position.snd"],
		lightning:       attachments["lightning.snd"],

		voice_idle:      attachments["voice-idle.snd"],
		voice_move:      attachments["voice-move.snd"],
		voice_attack:    attachments["voice-attack.snd"]

	};



	/*
	 * HELPERS
	 */

	let _depth_sort = function() {

		let state = this.state;
		if (state !== null) {

			let terrain = state.queryLayer('game', 'terrain');
			if (terrain !== null) {

				terrain.entities.sort(function(a, b) {
					if (a.position.y < b.position.y) return -1;
					if (a.position.y > b.position.y) return  1;
					return 0;
				});

			}

		}

	};

	let _parse_layer = function(layer, layerid) {

		let tile       = this.TILE;
		let game_layer = this.state.queryLayer('game', layerid);

		if (game_layer !== null) {

			game_layer.width  = layer[0].length * tile.width  + (tile.width / 2);
			game_layer.height = layer.length    * tile.offset + (tile.height - tile.offset);


			for (let y = 0; y < layer.length; y++) {

				for (let x = 0; x < layer[y].length; x++) {

					let entity = layer[y][x];
					if (entity !== null) {

						let position = this.toScreenPosition(entity.position, layerid);
						if (position !== null) {

							entity.setPosition(position);
							this.set({ x: x, y: y }, entity, layerid);
							game_layer.addEntity(entity);

						}

					}

				}

			}

		}

	};

	let _enter = function(level) {

		_parse_layer.call(this, level.terrain, 'terrain');
		_parse_layer.call(this, level.objects, 'objects');


		for (let y = 0; y < level.blitzes.length; y++) {

			for (let x = 0; x < level.blitzes[y].length; x++) {

				let blitz = level.blitzes[y][x];
				if (blitz !== null) {

					let center = this.get({ x: x, y: y }, 'terrain');
					if (center !== null) {

						blitz.setCenter(center);
						blitz.setLogic(this);
						this.__blitzes.push(blitz);

					}

				}

			}

		}


		let ui_cursor = this.state.queryLayer('ui', 'game > cursor');
		if (ui_cursor !== null) {
			this.__ui.cursor = ui_cursor;
		}

		let ui_path = this.state.queryLayer('ui', 'game > path');
		if (ui_path !== null) {
			ui_path.setLogic(this);
			this.__ui.path = ui_path;
		}

		let ui_overlay = this.state.queryLayer('ui', 'overlay');
		if (ui_overlay !== null) {
			this.__ui.overlay = ui_overlay;
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(main) {

		this.main    = main         || null;
		this.jukebox = main.jukebox || null;
		this.loop    = main.loop    || null;
		this.TILE    = null;
		this.state   = null;

		this.__actions = [];
		this.__blitzes = [];
		this.__locked  = false;
		this.__ui      = {
			cursor:  null,
			overlay: null,
			path:    null
		};
		this.__focus   = {
			object:   null,
			position: { x: null, y: null }
		};
		this.__map     = {};
		this.__mode    = {
			action: null,
			object: null
		};


		_Emitter.call(this);



		/*
		 * INITIALIZATION
		 */

		this.bind('resort', function() {
			_depth_sort.call(this);
		}, this);

		this.bind('select', function(object, terrain, tileposition) {

			let cursor = this.__ui.cursor;
			if (cursor !== null) {

				let screenposition = this.toScreenPosition({
					x: tileposition.x,
					y: tileposition.y
				}, 'sky');


				if (screenposition.x !== cursor.position.x || screenposition.y !== cursor.position.y) {
					this.jukebox.play(_sounds.select_position);
				}


				if (object !== null) {

					if (object instanceof _Tank) {

						this.jukebox.play(_sounds.select_tank);

						if (object.action === 'idle') {
							this.jukebox.play(_sounds.voice_idle);
						}

					}

					cursor.setState('active');

				} else {

					cursor.setState('default');

				}

				cursor.setVisible(true);
				cursor.setLabel(tileposition.x + 'x' + tileposition.y);

				cursor.addEffect(new lychee.effect.Position({
					type:     lychee.effect.Position.TYPE.easeout,
					position: screenposition
				}));

				cursor.addEffect(new lychee.effect.Lightning({
					type:     lychee.effect.Lightning.TYPE.bounceeaseout,
					duration: 500,
					position: screenposition
				}));

			}


			this.__focus.object     = object;
			this.__focus.position.x = tileposition.x;
			this.__focus.position.y = tileposition.y;


			let path = this.__ui.path;
			if (path !== null) {

				let mode = this.__mode;
				if (mode.action === 'attack') {

					path.setPosition(tileposition);
					path.setVisible(true);

				} else if (mode.action === 'move') {

					path.setPosition(tileposition);
					path.setVisible(true);

				}

			}


			let overlay = this.__ui.overlay;
			let action  = this.__mode.action;
			if (overlay !== null) {

				if (action === null) {

					object = this.__mode.object || object;

					if (object === null) {

						overlay.setObject(null);

						overlay.hideAction('attack');
						overlay.hideAction('move');

						if (terrain !== null && terrain.isFree()) {
							overlay.showAction('drop');
						} else {
							overlay.hideAction('drop');
						}

					} else {

						overlay.setObject(object);

						if (object.canAction('attack')) {
							overlay.showAction('attack');
						} else {
							overlay.hideAction('attack');
						}

						if (object.canAction('move')) {
							overlay.showAction('move');
						} else {
							overlay.hideAction('move');
						}

					}

				}

			}

		}, this);

		this.bind('deselect', function() {

			this.__focus.object     = null;
			this.__focus.position.x = null;
			this.__focus.position.y = null;
			this.__mode.action      = null;
			this.__mode.object      = null;


			let cursor = this.__ui.cursor;
			if (cursor !== null) {
				cursor.setVisible(false);
			}

			let path = this.__ui.path;
			if (path !== null) {
				path.setVisible(false);
			}

			let overlay = this.__ui.overlay;
			if (overlay !== null) {
				overlay.hideAction('attack');
				overlay.hideAction('move');
			}

		}, this);


		this.bind('blitz', function() {

			if (this.__locked === false) {

				let delay = 0;

				let blitzes = this.__blitzes;
				for (let b = 0, bl = blitzes.length; b < bl; b++) {

					let blitz = blitzes[b];
					if (blitz.canAction('blitz') === true) {
						delay = Math.max(delay, blitz.duration);
						blitz.setAction('blitz');
					}

				}


				this.__locked = true;

				this.loop.setTimeout(delay, function() {
					this.trigger('resort', []);
					this.__locked = false;
				}, this);

			}

		}, this);

		this.bind('attack', function() {

			let focus   = this.__focus;
			let mode    = this.__mode;
			let overlay = this.__ui.overlay;

			if (mode.action !== 'attack') {

				if (focus.object !== null && focus.object.canAction('attack')) {

					mode.object = focus.object;
					mode.action = 'attack';

					if (overlay !== null) {
						overlay.hideAction('move');
					}

				}

			} else if (mode.action === 'attack') {

				if (focus.object !== null) {

					if (focus.object.color !== mode.object.color) {

						this.jukebox.play(_sounds.voice_attack);

						this.__actions.push({
							time:   null,
							type:   'attack',
							object: mode.object,
							target: focus.object
						});

						this.trigger('deselect', []);

					}

				}

			}

		}, this);

		this.bind('move', function() {

			let focus   = this.__focus;
			let mode    = this.__mode;
			let overlay = this.__ui.overlay;
			let path    = this.__ui.path;

			if (mode.action !== 'move') {

				if (focus.object !== null && focus.object.canAction('move')) {

					mode.object = focus.object;
					mode.action = 'move';

					if (path !== null) {
						path.setOrigin(this.toTilePosition(focus.object.position, 'objects'));
						path.setPosition(focus.position);
					}

					if (overlay !== null) {
						overlay.hideAction('attack');
					}

				}

			} else if (mode.action === 'move') {

				if (focus.position !== null) {

					let terrain = this.get(focus.position, 'terrain');
					if (terrain !== null && terrain.isFree()) {

						this.jukebox.play(_sounds.voice_move);

						this.__actions.push({
							time:   null,
							type:   'move',
							object: mode.object,
							path:   path.buffer,
							target: {
								x: focus.position.x,
								y: focus.position.y
							}
						});

						this.trigger('deselect', []);

					}

				}

			}

		}, this);

		this.bind('drop', function() {

			if (this.__locked === false) {

				let focus = this.__focus;

				if (focus.object === null && focus.position.x !== null && focus.position.y !== null) {

					let position = focus.position;
					let terrain  = this.get(position, 'terrain');
					let object   = this.get(position, 'objects');

					if (terrain !== null && object === null) {

						if (terrain.isFree()) {

							object = new _Tank({
								alpha:    0.1,
								color:    'red',
								position: this.toScreenPosition(position, 'objects')
							});

							object.addEffect(new lychee.effect.Alpha({
								type:     lychee.effect.Alpha.TYPE.easeout,
								delay:    500,
								duration: 500,
								alpha:    1
							}));

							object.addEffect(new lychee.effect.Shake({
								type:     lychee.effect.Shake.TYPE.linear,
								delay:    200,
								duration: 500,
								shake:    { y: 30 }
							}));


							this.strikeLightning(object);
							this.strikeEarthquake(this.get(position, 'terrain'));


							this.set(position, object, 'objects');
							this.state.queryLayer('game', 'objects').addEntity(object);

						}

					}

				}

			}

		}, this);

	};


	Composite.prototype = {

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'game.Logic';


			return data;

		},


		/*
		 * STATE API
		 */

		update: function(clock, delta) {

			let actions = this.__actions;
			for (let a = 0, al = actions.length; a < al; a++) {

				let action = actions[a];
				if (action.time === null) {

					action.time = clock;

				} else if (clock > action.time) {

					let type   = action.type;
					let object = action.object;
					let target = action.target;

					if (type === 'attack') {

						// TODO: Implement attack, needs explosion sprite & ui non-event layer

					} else if (type === 'move') {

						if (object.effects.length === 0) {

							target = action.path.splice(0, 1)[0] || null;

							if (target !== null) {

								let other = this.get(target, 'objects');
								if (other === null) {

									let tileposition = this.toTilePosition(object.position, 'objects');
									let screentarget = this.toScreenPosition(target,        'objects');

									this.set(tileposition, null,   'objects');
									this.set(target,       object, 'objects');

									object.setTarget(screentarget);
									object.addEffect(new lychee.effect.Position({
										type: lychee.effect.Position.TYPE.linear,
										delay:    250,
										duration: 500,
										position: {
											x: screentarget.x,
											y: screentarget.y
										}
									}));

									action.time = clock + 750;

								} else if (other !== object) {

									actions.splice(a, 1);
									al--;
									a--;

								}

							}

						}

					}

				}

			}

		},

		enter: function(state, level) {

			state = lychee.interfaceof(_State, state) ? state : null;
			level = level instanceof _Level ? level : null;


			if (state !== null && level !== null) {

				this.state = state;
				this.TILE  = state.main.TILE;

				this.jukebox.play(_music.commando);

				_enter.call(this, level);

				return true;

			}


			return false;

		},

		leave: function() {

			this.jukebox.stop(null);

			return true;

		},



		/*
		 * CUSTOM API
		 */

		set: function(position, entity, layerid) {

			let layer = this.state.queryLayer('game', layerid);
			if (layer !== null) {

				let map = this.__map[layerid] || null;
				if (map === null) {
					map = this.__map[layerid] = {};
				}


				let x = position.x || null;
				let y = position.y || null;
				if (x !== null && y !== null) {

					if (map[x] === undefined) {
						map[x] = {};
					}

					map[x][y] = entity;


					return true;

				}

			}


			return false;

		},

		get: function(position, layerid) {

			let map = this.__map[layerid] || null;
			if (map !== null) {

				let x = position.x || null;
				let y = position.y || null;

				if (x !== null && y !== null) {

					if (map[x] !== undefined) {

						if (map[x][y] !== undefined) {
							return map[x][y];
						}

					}

				}

			}


			return null;

		},

		getSurrounding: function(position, layerid) {

			let filtered = [];
			let entity   = null;

			let layer = this.state.queryLayer('game', layerid);
			if (layer !== null) {

				let coords = [];
				let x0     = position.x;
				let y0     = position.y;
				let x1     = position.x - 1;
				let y1     = position.y - 1;
				let x2     = position.x + 1;
				let y2     = position.y + 1;


				if (y0 % 2 === 1) {

					coords.push({ x: x2, y: y1 });
					coords.push({ x: x2, y: y0 });
					coords.push({ x: x2, y: y2 });
					coords.push({ x: x0, y: y2 });
					coords.push({ x: x1, y: y0 });
					coords.push({ x: x0, y: y1 });

				} else {

					coords.push({ x: x0, y: y1 });
					coords.push({ x: x2, y: y0 });
					coords.push({ x: x0, y: y2 });
					coords.push({ x: x1, y: y2 });
					coords.push({ x: x1, y: y0 });
					coords.push({ x: x1, y: y1 });

				}


				for (let c = 0, cl = coords.length; c < cl; c++) {
					filtered.push(this.get(coords[c], layerid));
				}

			}


			return filtered;

		},

		toScreenPosition: function(position, layerid) {

			layerid = typeof layerid === 'string' ? layerid : 'terrain';


			let tile = this.TILE;
			if (tile !== null) {

				let layer = this.state.queryLayer('game', 'terrain');
				if (layer !== null) {

					let bb = 0;
					let z  = 0;

					if (layerid === 'terrain') {
						z  = 0;
					} else if (layerid === 'objects') {
						bb = 64;
						z  = 1;
					} else if (layerid === 'sky') {
						bb = 64;
						z  = 2;
					} else {
						z  = position.z;
					}


					let screenposition = {
						x: position.x,
						y: position.y
					};

					if (screenposition.y % 2 === 1) {
						screenposition.x += 0.5;
					}

					screenposition.x *= tile.width;
					screenposition.y *= tile.offset;

					screenposition.x += -1 / 2 * layer.width;
					screenposition.x += tile.width / 2;

					screenposition.y += -1 / 2 * layer.height;
					screenposition.y += (tile.offset / 2) + (tile.height - tile.offset) / 2;


					if (z !== 0) {
						screenposition.y -= z * (tile.height - tile.offset);
					}

					if (bb !== 0) {
						screenposition.y += ((tile.height - tile.offset) - (bb - tile.offset));
					}


					screenposition.x |= 0;
					screenposition.y |= 0;


					return screenposition;

				}

			}


			return null;

		},

		toTilePosition: function(position, layerid) {

			layerid = typeof layerid === 'string' ? layerid : 'terrain';


			let tile  = this.TILE;
			if (tile !== null) {

				let layer = this.state.queryLayer('game', 'terrain');
				if (layer !== null) {

					let bb = 0;
					let z  = 0;

					if (layerid === 'terrain') {
						z  = 0;
					} else if (layerid === 'objects') {
						bb = 64;
						z  = 1;
					} else if (layerid === 'sky') {
						bb = 64;
						z  = 2;
					}


					let tileposition = {
						x: position.x,
						y: position.y,
						z: z
					};


					if (z !== 0) {
						tileposition.y += z * (tile.height - tile.offset);
					}

					if (bb !== 0) {
						tileposition.y -= ((tile.height - tile.offset) - (bb - tile.offset));
					}


					tileposition.x -= -1 / 2 * layer.width;
					tileposition.y -= -1 / 2 * layer.height;

					tileposition.x /= tile.width;
					tileposition.y /= tile.offset;


					tileposition.y |= 0;

					if (tileposition.y % 2 === 1) {
						tileposition.x -= 0.5;
					}

					tileposition.x |= 0;


					return tileposition;

				}

			}


			return null;

		},

		strikeEarthquake: function(entity) {

			if (entity === null) return false;


			if (this.__locked === false) {

				let position = this.toTilePosition(entity.position, 'terrain');

				entity.addEffect(new lychee.effect.Shake({
					type:     lychee.effect.Shake.TYPE.linear,
					delay:    500,
					duration: 500,
					shake:    { y: 20 }
				}));


				let sterrain = this.getSurrounding(position, 'terrain');
				for (let st = 0, stl = sterrain.length; st < stl; st++) {

					if (sterrain[st] !== null) {

						sterrain[st].addEffect(new lychee.effect.Shake({
							type:     lychee.effect.Shake.TYPE.linear,
							delay:    750,
							duration: 500,
							shake:    { y: 10 }
						}));

					}

				}

				let sobjects = this.getSurrounding(position, 'objects');
				for (let so = 0, sol = sobjects.length; so < sol; so++) {

					if (sobjects[so] !== null) {

						sobjects[so].addEffect(new lychee.effect.Shake({
							type:     lychee.effect.Shake.TYPE.linear,
							delay:    750,
							duration: 500,
							shake:    { y: 10 }
						}));

					}

				}


				this.__locked = true;
				this.loop.setTimeout(1250, function() {
					this.__locked = false;
				}, this);

			}


			return true;

		},

		strikeLightning: function(entity) {

			if (entity === null) return false;


			this.jukebox.play(_sounds.lightning);


			let ui = this.state.getLayer('ui');
			if (ui !== null && ui.effects.length === 0) {

				let background = ui.getEntity('background');
				if (background !== null && background.effects.length === 0) {

					background.alpha = 0;
					background.color = '#000000';

					background.addEffect(new lychee.effect.Color({
						type:     lychee.effect.Color.TYPE.bounceeaseout,
						duration: 250,
						color:    '#ffffff'
					}));

					background.addEffect(new lychee.effect.Alpha({
						type:     lychee.effect.Alpha.TYPE.bounceeaseout,
						duration: 250,
						alpha:    0.5
					}));

					background.addEffect(new lychee.effect.Alpha({
						type:     lychee.effect.Alpha.TYPE.bounceeaseout,
						delay:    250,
						duration: 250,
						alpha:    0
					}));

				}

				ui.addEffect(new lychee.effect.Shake({
					type:     lychee.effect.Shake.TYPE.bounceeaseout,
					duration: 1000,
					shake:    { y: -20 + Math.random() * -30 }
				}));

			}


			let position = this.toTilePosition(entity.position, 'objects');

			entity.addEffect(new lychee.effect.Lightning({
				type:     lychee.effect.Lightning.TYPE.bounceeaseout,
				duration: 1000,
				position: this.toScreenPosition({
					x: position.x,
					y: position.y,
					z: 30
				}, 'custom')
			}));


			return true;

		}

	};


	return Composite;

});

