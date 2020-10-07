
lychee.define('game.Renderer').requires([
	'game.entity.Text',
	'game.entity.building.Base',
	'game.entity.unit.Base',
	'game.entity.world.Base'
]).includes([
	'lychee.Renderer'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.Renderer.call(this, 'game');


		this.game = game;

		this.__tile = game.settings.tile || 1;

		this.__terrain = null;
		this.__offset = {
			x: 0, y: 0
		};

	};


	Class.prototype = {

		setTerrain: function(model) {

			this.__terrain = model;

		},

		setOffset: function(offX, offY, boundX, boundY) {

			// Hint: Level starts at 1/1, so there's half
			// a tile visible without a grid in each direction.
			var tile = this.__tile;
			var maxX = boundX * tile - this.__width + tile;
			var maxY = boundY * tile - this.__height + tile;

			offX = Math.min(Math.max(offX, -1 * maxX), 0);
			offY = Math.min(Math.max(offY, -1 * maxY), 0);

			this.__offset.x = offX | 0;
			this.__offset.y = offY | 0;

		},

		getOffset: function() {
			return this.__offset;
		},



		/*
		 * UI RENDERING API
		 */

		renderUICursor: function(entity, color) {

			var pos      = entity.getPosition();
			var radius   = entity.getRadius();
			var scale    = entity.getScale();
			var rotation = entity.getRotation();
			var offset   = (rotation / 360) % 1;


			this.setAlpha(0.9);

			var from, to;

			from = offset;
			to   = (offset + 0.25) % 1;

			this.drawArc(
				pos.x, pos.y,
				from, to,
				scale * radius,
				color,
				false,
				2
			);

			from = (offset + 0.5) % 1;
			to   = (offset + 0.75) % 1;

			this.drawArc(
				pos.x, pos.y,
				from, to,
				scale * radius,
				color,
				false,
				2
			);

			this.setAlpha(0.5);

			from = (1 - offset + 0.02) % 1;
			to   = (1 - offset - 0.02 + 0.25) % 1;

			this.drawArc(
				pos.x, pos.y,
				from, to,
				scale * radius * 0.8,
				color,
				false,
				6
			);

			from = (1 - offset + 0.02 + 0.5) % 1;
			to   = (1 - offset - 0.02 + 0.75) % 1;

			this.drawArc(
				pos.x, pos.y,
				from, to,
				scale * radius * 0.8,
				color,
				false,
				6
			);

			this.setAlpha(0.25);

			from = (offset + 0.04) % 1;
			to   = (offset - 0.04 + 0.25) % 1;

			this.drawArc(
				pos.x, pos.y,
				from, to,
				scale * radius * 0.5,
				color,
				false,
				6
			);

			from = (offset + 0.04 + 0.5) % 1;
			to   = (offset - 0.04 + 0.75) % 1;

			this.drawArc(
				pos.x, pos.y,
				from, to,
				scale * radius * 0.5,
				color,
				false,
				6
			);

			this.setAlpha(1);

		},

		renderUIField: function(entity, color, offsetX, offsetY) {

			offsetX = offsetX || 0;
			offsetY = offsetY || 0;


			var pos   = entity.getPosition();
			var state = entity.getState();

			var model = entity.getModel();
			var map   = entity.getMap(state);

			var hw = map.w / 2;
			var hh = map.h / 2;


			this.setAlpha(0.5);

			this.drawBox(
				offsetX + pos.x - hw,
				offsetY + pos.y - hh,
				offsetX + pos.x + hw,
				offsetY + pos.y + hh,
				color,
				true
			);

			this.setAlpha(1);


			if (
				model !== null
				&& state !== null
				&& map !== null
			) {

				this.drawSprite(
					offsetX + pos.x - hw,
					offsetY + pos.y - hh,
					model.image,
					map
				);

			}


			var label = entity.getLabel();
			if (label !== null && label !== '') {

				this.drawText(
					offsetX + pos.x,
					offsetY + pos.y,
					label,
					this.game.fonts.small,
					true
				);

			}


			this.setAlpha(1);

			this.drawBox(
				offsetX + pos.x - hw + 1,
				offsetY + pos.y - hh + 1,
				offsetX + pos.x + hw - 1,
				offsetY + pos.y + hh - 1,
				color,
				false,
				2
			);

		},



		/*
		 * ENTITY RENDERING API
		 */

		renderHitmap: function(hitmap, color) {

			var tile   = this.__tile
			var offset = this.__offset;

			var map = hitmap.getMap();


			this.setAlpha(0.5);


			for (var x = 1, xl = map.length; x < xl; x++) {

				for (var y = 1, yl = map[0].length; y < yl; y++) {

					if (map[x][y] !== 0) {

						this.drawBox(
							offset.x + x * tile - tile / 2,
							offset.y + y * tile - tile / 2,
							offset.x + x * tile + tile / 2,
							offset.y + y * tile + tile / 2,
							color,
							true
						);

					}

				}

			}


			this.setAlpha(1);

		},

		renderTerrain: function(sizex, sizey) {

			if (this.__terrain !== null) {

				var image = this.__terrain.image;
				if (image !== null) {

					var tile   = this.__tile;
					var offset = this.__offset;
					var width  = this.__terrain.getWidth();
					var height = this.__terrain.getHeight();

					sizex = Math.min(offset.x + sizex * tile, this.__width);
					sizey = Math.min(offset.y + sizey * tile, this.__height);

					for (var x = tile + offset.x; x < sizex; x += width) {
						for (var y = tile + offset.y; y < sizey; y += width) {

							this.drawSprite(
								x - tile / 2,
								y - tile / 2,
								image,
								null
							);

							this.drawBox(
								x - tile / 2,
								y - tile / 2,
								x + tile / 2,
								y + tile / 2,
								'#ff0000',
								false,
								1
							);

						}
					}

				}

			}

		},

		renderEntity: function(entity) {

			if (entity instanceof game.entity.building.Base) {
				this.renderBuilding(entity);
			} else if (entity instanceof game.entity.unit.Base) {
				this.renderUnit(entity);
			} else if (entity instanceof game.entity.world.Base) {
				this.renderWorld(entity);
			}

		},

		renderEntityAura: function(entity, color) {

			var pos    = entity.getPosition();
			var offset = this.__offset;
			var tile   = this.__tile;

			var realX = pos.x * tile + offset.x;
			var realY = pos.y * tile + offset.y;

			if (
				realX > 0 && realX < this.__width
				&& realY > 0 && realY < this.__height
			) {


				var model = entity.getModel();
				if (model !== null && model.type === 'Unit') {

					var radius = tile;
					var ammo   = entity.getAmmo() / model.ammo;
					var health = entity.getHealth() / model.health;

					this.setAlpha(0.2);

					this.drawArc(
						realX, realY,
						0, 1,
						radius - 8,
						color,
						true
					);

					this.setAlpha(0.8);

					this.drawArc(
						realX, realY,
						0, health * 0.5,
						radius - 4,
						color,
						false,
						4
					);

					this.drawArc(
						realX, realY,
						0.5, 0.5 + ammo * 0.5,
						radius - 4,
						color,
						false,
						4
					);

					this.setAlpha(1);


					var range = entity.getRange();
					if (range > 0) {

						this.setAlpha(0.5);

						this.drawCircle(
							realX, realY,
							range * tile,
							color,
							false,
							1
						);

						this.setAlpha(1);

					}

				} else if (model !== null && model.type === 'Building') {

					var size   = model.getSize();
					var radius = ((Math.max(size.x, size.y) / 2) * tile) | 0;
					var health = entity.getHealth() / model.health;

					this.setAlpha(0.2);

					this.drawArc(
						realX, realY,
						0, 1,
						radius,
						color,
						true
					);

					this.setAlpha(0.8);

					this.drawArc(
						realX, realY,
						0, health,
						radius + 4,
						color,
						false,
						4
					);

					this.setAlpha(1);

				}

			}

		},

		renderBuilding: function(entity) {

			var pos    = entity.getPosition();
			var offset = this.__offset;
			var tile   = this.__tile;

			var realX = pos.x * tile + offset.x;
			var realY = pos.y * tile + offset.y;

			if (
				realX > 0 && realX < this.__width
				&& realY > 0 && realY < this.__height
			) {

				var state = entity.getState();
				var model = entity.getModel();
				var map   = entity.getMap(state);

				if (
					model !== null
					&& map !== null
				) {

					var sw = model.getWidth();
					var sh = model.getHeight();

					this.drawSprite(
						realX - sw / 2,
						realY - sh / 2,
						model.image,
						map
					);

				}

			}

		},

		renderUnit: function(entity) {

			var pos    = entity.getPosition();
			var offset = this.__offset;
			var tile   = this.__tile;

			var realX = pos.x * tile + offset.x;
			var realY = pos.y * tile + offset.y;

			if (
				realX > 0 && realX < this.__width
				&& realY > 0 && realY < this.__height
			) {

				var model = entity.getModel();
				var map   = entity.getMap('default');

				if (
					model !== null
					&& map !== null
				) {

					var sw = model.getWidth();
					var sh = model.getHeight();

					this.drawSprite(
						realX - sw / 2,
						realY - sh / 2,
						model.image,
						map
					);


					var cannon = entity.getMap('cannon');
					if (cannon !== null) {

						this.drawSprite(
							realX - sw / 2,
							realY - sh / 2,
							model.image,
							cannon
						);

					}

				}

			}

		},

		renderWorld: function(entity) {

			var pos    = entity.getPosition();
			var offset = this.__offset;
			var tile   = this.__tile;

			var realX = pos.x * tile + offset.x;
			var realY = pos.y * tile + offset.y;

			if (
				realX > 0 && realY < this.__width
				&& realY > 0 && realY < this.__height
			) {

				var state = entity.getState();
				var model = entity.getModel();
				var map   = entity.getMap(state);

				if (
					model !== null
					&& map !== null
				) {

					var sw = model.getWidth(state);
					var sh = model.getHeight(state);

					this.drawSprite(
						realX - sw / 2,
						realY - sh / 2,
						model.image,
						map
					);

				}


			}

		}

	};


	return Class;

});

