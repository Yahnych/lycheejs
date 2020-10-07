
lychee.define('game.logic.Logic').requires([
	'game.entity.Level',
	'game.logic.Pathfinder'
]).exports(function(lychee, global) {

	var _logic = game.logic;

	var Class = function(game) {

		this.game = game;

		this.__jukebox  = game.jukebox;
		this.__loop     = game.loop;
		this.__renderer = game.renderer;
		this.__clock = null;

		this.__menu = [ null, null, null, null ];
		this.__selected = [];
		this.__selectedUnits = null;

		this.__cache = {
			position: { x: 0, y: 0 }
		};

		this.pathfinder = new _logic.Pathfinder(this);

	};


	Class.prototype = {

		/*
		 * STATE INTEGRATION
		 */

		reset: function(level) {

			if (
				level != null
				&& level instanceof game.entity.Level
			) {

				var world = this.game.getWorld(level.getModel().world);
				if (world !== null) {

					var terrain = world.getModel('Terrain');
					if (terrain !== null) {
						this.__renderer.setTerrain(terrain);
					} else {
						this.__renderer.setTerrain(null);
					}

				}


				this.__level = level;

				this.pathfinder.reset(
					level.getHitmap('terrain'),
					level.getHitmap('ground'),
					level.getWidth(),
					level.getHeight()
				);

			}

		},

		__updateEntities: function(layer, clock, delta) {

			if (layer === null) return;


			for (var l = 0, ll = layer.length; l < ll; l++) {
				layer[l].update(clock, delta);
			}

		},

		update: function(clock, delta) {

			var layer;
			var level = this.__level;


			layer = level.getEntities('terrain');
			this.__updateEntities(layer, clock, delta);

			layer = level.getEntities('ground');
			this.__updateEntities(layer, clock, delta);

			layer = level.getEntities('sky');
			this.__updateEntities(layer, clock, delta);

		},

		__renderEntities: function(layer) {

			if (layer === null) return;


			for (var l = 0, ll = layer.length; l < ll; l++) {
				this.__renderer.renderEntity(layer[l]);
			}

		},

		render: function() {

			var layer;
			var level = this.__level;


			this.__renderer.renderTerrain(
				level.getWidth(),
				level.getHeight()
			);


			layer = level.getEntities('terrain');
			this.__renderEntities(layer);

			layer = level.getEntities('ground');
			this.__renderEntities(layer);

			layer = level.getEntities('sky');
			this.__renderEntities(layer);

		},



		/*
		 * PUBLIC HELPERS
		 */

		toGridPosition: function(position, offset) {

			offset = offset === true;

			var tile   = this.game.settings.tile;

			var tileX = position.x;
			var tileY = position.y;

			if (offset === true) {

				var off = this.__renderer.getOffset();
				tileX -= off.x;
				tileY -= off.y;

			}

			tileX /= tile;
			tileY /= tile;

			tileX = Math.round(tileX);
			tileY = Math.round(tileY);

			position.x = tileX;
			position.y = tileY;

		},

		toPixelPosition: function(position, offset) {

			offset = offset === true;

			var tile   = this.game.settings.tile;

			var pixelX = position.x;
			var pixelY = position.y;

			pixelX *= tile;
			pixelY *= tile;

			pixelX = Math.round(pixelX);
			pixelY = Math.round(pixelY);

			if (offset === true) {

				var off = this.__renderer.getOffset();
				pixelX += off.x;
				pixelY += off.y;

			}

			position.x = pixelX;
			position.y = pixelY;

		},

		isEntityAtPosition: function(entity, position) {

			var model = entity.getModel();
			if (model !== null) {

				var tile = this.game.settings.tile;

				var pos = entity.getPosition();
				var pxw = model.getWidth();
				var pxh = model.getHeight();

				var x1 = pos.x - (pxw / 2) / tile;
				var y1 = pos.y - (pxh / 2) / tile;
				var x2 = pos.x + (pxw / 2) / tile;
				var y2 = pos.y + (pxh / 2) / tile;

				if (
					position.x > x1
					&& position.x < x2
					&& position.y > y1
					&& position.y < y2
				) {
					return true;
				}

			}


			return false;

		},

		getEntityByPosition: function(position) {

			var layers = Object.keys(game.model.Level.LAYER).reverse();
			for (var l = 0, ll = layers.length; l < ll; l++) {

				var entities = this.__level.getEntities(layers[l]);
				if (entities !== null) {

					for (var e = 0, el = entities.length; e < el; e++) {

						var entity = entities[e];
						if (this.isEntityAtPosition(entity, position) === true) {
							return entity;
						}

					}

				}

			}


			return null;

		},

		getLevel: function() {
			return this.__level;
		},

		getMenu: function() {

			if (this.__selected.length) {

				var leader  = this.__selected[0];
				var actions = leader.getActions();

				for (var m = 0, ml = this.__menu.length; m < ml; m++) {
					this.__menu[m] = actions[m] || null;
				}

			} else {

				for (var m = 0, ml = this.__menu.length; m < ml; m++) {
					this.__menu[m] = null;
				}

			}


			return this.__menu;

		},

		getPlayerTeam: function() {
			return this.__level.getPlayer().id;
		},

		getSelected: function() {
			return this.__selected;
		},

		isSelected: function(entity) {

			if (
				entity === undefined
				&& this.__selected.length
			) {
				return true;
			}


			for (var s = 0, l = this.__selected.length; s < l; s++) {

				if (this.__selected[s] === entity) {
					return true;
				}
			}


			return false;

		},

		select: function(data) {

			if (data === null) {
				this.__selected = [];
				return;
			}


			var validSelection = false;
			var selectedType   = this.__selected.length > 0 ? this.__selected[0].getType() : null;


			if (Object.prototype.toString.call(data) === '[object Array]') {

				for (var d = 0, dl = data.length; d < dl; d++) {

					var entity     = data[d];
					var entityType = entity.getType();

					if (
						this.isSelected(entity) === false
						&& (entityType === selectedType || selectedType === null)
					) {
						validSelection = true;
						this.__selected.push(entity);
					}

				}

			} else if (data !== null) {

				var entity     = data;
				var entityType = entity.getType();

				if (
					this.isSelected(entity) === false
					&& (entityType === selectedType || selectedType === null)
				) {
					validSelection = true;
					this.__selected.push(entity);
				}

			}

			if (validSelection === true) {

				if (entityType === 'Unit') {
					this.__jukebox.playUnitReadySound();
				}

			}

		},

		deselect: function(entity) {

			if (entity === null) return;

			for (var s = 0, l = this.__selected.length; s < l; s++) {
				if (this.__selected[s] === entity) {
					this.__selected.splice(s, 1);
					l--;
				}
			}

		},

		focus: function(position) {

			if (this.__selected.length > 0) {

				for (var s = 0, l = this.__selected.length; s < l; s++) {

					if (typeof this.__selected[s].focus === 'function') {
						this.__selected[s].focus(position.x, position.y);
					}

				}

			}

		},

		attack: function(enemy) {

			var success = false;

			for (var s = 0, l = this.__selected.length; s < l; s++) {

				var entity   = this.__selected[s];
				if (entity.getType() !== 'Unit') continue;

				var position = this.pathfinder.getNearestPosition(entity.getPosition(), enemy.getPosition(), entity.getLayer().hitmap);

				if (entity.isInRange(position) === true) {
					entity.attack(enemy);
					success = true;
				} else {
					entity.focus(position.x, position.y);

					if (this.__moveEntity(entity, position.x, position.y) === true) {
						success = true;
					}

				}

			}


			if (success === true) {

				var leader = this.__selected[0];

				var entityType = leader.getType();
				if (entityType === 'Unit') {
					this.__jukebox.playUnitOkaySound();
				}

			}

		},

		__moveEntity: function(entity, x, y) {

			if (entity.isMoving() === true) {
				entity.stop();
			}

			if (entity.isFocusing() === false) {
				entity.focus(x, y);
			}


			var from = entity.getPosition();
			var to   = { x: Math.round(x), y: Math.round(y) };
			var path = null;

			// Modify from position to next tile grid position (pathfinder is grid based)
			if (from.x % 1 !== 0 || from.y % 1 !== 0) {

				from = {
					x: Math.round(from.x),
					y: Math.round(from.y)
				};

				path = this.pathfinder.getPath(entity, from, to);

				// Set the nearest tile grid position as start point
				path.reverse();
				path.push(from);
				path.reverse();

			} else {

				path = this.pathfinder.getPath(entity, from, to);

			}


			if (path !== null) {
				entity.moveAlongPath(path);
				return true;
			} else {
				return false;
			}

		},

		move: function(position) {

			if (this.__selected.length === 0) return;


			var success = false;

			for (var s = 0, l = this.__selected.length; s < l; s++) {

				var entity = this.__selected[s];
				if (this.__moveEntity(entity, position.x, position.y) === true) {
					success = true;
				}

			}


			if (success === true) {

				var leader = this.__selected[0];

				var entityType = leader.getType();
				if (entityType === 'Unit') {
					this.__jukebox.playUnitOkaySound();
				}

			}

		}

	};


	return Class;

});

