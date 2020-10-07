
lychee.define('game.entity.Level').requires([
	'game.model.Hitmap',
	'game.model.Level',
	'game.model.Player',
	'game.entity.building.Base',
	'game.entity.unit.Base',
	'game.entity.world.Base'
]).exports(function(lychee, global) {

	var _hitmap  = game.model.Hitmap;
	var _level   = game.model.Level;
	var _ground  = game.model.Level.GROUND;
	var _terrain = game.model.Level.TERRAIN;
	var _player  = game.model.Player;

	var Class = function(game, model) {

		this.game  = game;
		this.logic = game.logic;

		this.__model    = model;
		this.__player   = null;
		this.__players  = {};
		this.__playerId = 0;
		this.__layers   = {};
		this.__world    = this.game.getWorld(model.world);
		this.__width    = 0;
		this.__height   = 0;


		for (var lId in _level.LAYER) {

			this.__layers[lId] = {
				entities: [],
				hitmap:   new _hitmap()
			};

		}

		if (model != null && model instanceof _level) {
			this.__deserialize(model);
		}

	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__deserialize: function(model) {

			var settings = model.settings;

			var tilewidth  = model.size.x;
			var tileheight = model.size.y;


			for (var s = 0, sl = settings.length; s < sl; s++) {

				var raw = settings[s];

				var player = new _player(raw.id, {
					credits: raw.credits
				});


				for (var b = 0, bl = raw.buildings.length; b < bl; b++) {

					var braw   = raw.buildings[b];
					var bmodel = this.game.getBuilding(braw[0]);
					if (bmodel !== null) {

						var bconstr = game.entity.building[braw[0]] || game.entity.building.Base;
						var building = new bconstr(player.id, {
							model: bmodel,
							state: braw[3] || 'default',
							position: {
								x: braw[1],
								y: braw[2]
							}
						}, this.__layers[bmodel.layer], this.logic);


						tilewidth  = Math.max(tilewidth,  braw[1]);
						tileheight = Math.max(tileheight, braw[2]);

						player.addBuilding(building);
						this.__layers[bmodel.layer].entities.push(building);

					}

				}


				for (var u = 0, ul = raw.units.length; u < ul; u++) {

					var uraw   = raw.units[u];
					var umodel = this.game.getUnit(uraw[0]);
					if (umodel !== null) {

						var uconstr = game.entity.unit[uraw[0]] || game.entity.unit.Base;
						var unit = new uconstr(player.id, {
							model: umodel,
							state: uraw[3] || 'default',
							position: {
								x: uraw[1],
								y: uraw[2]
							}
						}, this.__layers[umodel.layer], this.logic);

						tilewidth  = Math.max(tilewidth,  uraw[1]);
						tileheight = Math.max(tileheight, uraw[2]);

						player.addUnit(unit);
						this.__layers[umodel.layer].entities.push(unit);

					}

				}


				this.__players[player.id] = player;

			}


			if (this.__world !== null) {

				var world   = this.__world;
				var terrain = model.terrain;

				for (var t = 0, tl = model.terrain.length; t < tl; t++) {

					var traw = model.terrain[t];
					var tmodel = world.getModel(traw[0]);
					if (tmodel !== null) {

						var tconstr = game.entity.world[tmodel.type] || game.entity.world.Base;
						var terrain = new tconstr('NEUTRAL', {
							model: tmodel,
							state: traw[3] || 'default',
							position: {
								x: traw[1],
								y: traw[2]
							}
						}, this.__layers['terrain'], this.logic);

						tilewidth  = Math.max(tilewidth,  traw[1]);
						tileheight = Math.max(tileheight, traw[2]);

						this.__layers['terrain'].entities.push(terrain);

					}

				}

			}


			// Enforced Player Selection (by Level Model)
			if (typeof model.player !== null) {
				this.__player = this.__players[model.player] || null;
			}


			// Automatized Player Selection, Multiplayer Map
			if (this.__player === null) {

				for (var pId in this.__players) {
					this.__player = this.__players[pId];
					break;
				}

			}


			this.__width  = Math.round(tilewidth + 1);
			this.__height = Math.round(tileheight + 1);


			for (var lId in this.__layers) {

				this.__layers[lId].hitmap.reset(this.__width, this.__height);

				if (this.__layers[lId].entities.length > 0) {

					for (var e = 0, el = this.__layers[lId].entities.length; e < el; e++) {
						this.__updateHitmap(lId, this.__layers[lId].entities[e]);
					}

				}

			}

		},

		__getHitmapValue: function(id, model) {

			var value = _terrain['default'];

			if (id === 'terrain') {

				if (model.id === 'Road') {
					value = _terrain.road;
				} else if (model.id === 'Crater') {
					value = _terrain.crater;
				} else if (model.id === 'Water') {
					value = _terrain.water;
				}

			} else if (id === 'ground') {

				if (model.type === 'Building') {
					value = _ground.building;
				} else if (model.type === 'Unit') {
					value = _ground.unit;
				}

			}


			return value;

		},

		__updateHitmap: function(id, entity) {

			var terrainHitmap = this.getHitmap('terrain');

			var layerHitmap = this.getHitmap(id);
			if (layerHitmap !== null) {

				var position = entity.getPosition();
				var model    = entity.getModel();
				var state    = entity.getState();

				var hitmap = model.getHitmap(state);
				if (hitmap !== null) {

					var value = this.__getHitmapValue(id, model);
					var size  = model.getSize(state);

					layerHitmap.setViaHitmap(
						position.x, position.y,
						hitmap, size,
						value
					);


					if (
						terrainHitmap !== null
						&& id === 'ground'
						&& model.type === 'Building'
					) {
						terrainHitmap.setViaHitmap(
							position.x, position.y,
							hitmap, size,
							_terrain.blocking
						);
					}


				} else {

					var value = this.__getHitmapValue(id, model);

					var x = position.x;
					var y = position.y;

					layerHitmap.set(x, y, value);

					if (
						terrainHitmap !== null
						&& id === 'ground'
						&& model.type === 'Building'
					) {
						terrainHitmap.set(x, y, _terrain.blocking);
					}

				}

			}

		},



		/*
		 * PUBLIC API
		 */

		getEntities: function(id) {

			if (this.__layers[id] !== undefined) {
				return this.__layers[id].entities;
			}


			return null;

		},

		getHitmap: function(id) {

			if (this.__layers[id] !== undefined) {
				return this.__layers[id].hitmap;
			}


			return null;

		},

		getLayers: function() {
			return this.__layers;
		},

		getModel: function() {
			return this.__model;
		},

		getPlayer: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id === null) {
				return this.__player;
			} else if (this.__players[id] !== undefined) {
				return this.__players[id];
			}


			return null;

		},

		getWidth: function() {
			return this.__width;
		},

		getHeight: function() {
			return this.__height;
		}

	};


	return Class;

});

