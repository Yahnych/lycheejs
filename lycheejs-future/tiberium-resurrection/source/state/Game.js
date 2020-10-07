
lychee.define('game.state.Game').requires([
	'game.ui.UI'
]).includes([
	'lychee.game.State',
]).exports(function(lychee, global) {

	var _ui    = game.ui.UI;

	var Class = function(game) {

		lychee.game.State.call(this, game, 'game');


		this.logic = this.game.logic;

		this.__poscache = { x: 0, y: 0 };
		this.__touch    = { startX: 0, startY: 0, offsetX: 0, offsetY: 0 };
		this.ui         = null;
		this.__clock    = null;
		this.__locked   = false;

	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__processSwipe: function(id, state, position, delta, swipe) {

			// TODO: Multi-Touch support
			if (id !== 0) return;


			if (this.renderer !== null) {

				var env = this.renderer.getEnvironment();

				position.x -= env.offset.x;
				position.y -= env.offset.y;

			}


			var entity;


			/*
			 * 1. UI Layer Interaction
			 */

			entity = this.ui.getEntityByPosition(position);
			if (entity !== null) {

				if (state === 'start') {
					entity.trigger('touch');
				}

				return;

			}



			/*
			 * GAME Interaction
			 */

			var isVisible = this.ui.cursor.isVisible();
			var touch     = this.__touch;

			if (state === 'start') {

				if (isVisible === true) {
					this.ui.cursor.hide(50);
				}

				var gridpos  = this.__poscache;

				gridpos.x = position.x;
				gridpos.y = position.y;

				this.logic.toGridPosition(gridpos, true);


				touch.clock  = this.__clock;
				touch.pixelX = position.x;
				touch.pixelY = position.y;
				touch.gridX  = gridpos.x;
				touch.gridY  = gridpos.y;


				var offset = this.renderer.getOffset();

				touch.offsetX = offset.x;
				touch.offsetY = offset.y;

			} else if (state === 'move' && touch.clock !== null) {

				var radius = this.__tolerance;
				var diffX  = Math.abs(position.x - touch.pixelX);
				var diffY  = Math.abs(position.y - touch.pixelY);

				if (diffX < radius && diffY < radius) {
					return;
				} else {

					this.ui.cursor.hide(0);

					var level = this.logic.getLevel();
					var offsetX = (position.x - touch.pixelX) + touch.offsetX;
					var offsetY = (position.y - touch.pixelY) + touch.offsetY;


					this.renderer.setOffset(
						offsetX, offsetY,
						level.getWidth(), level.getHeight()
					);

				}

			} else if (state === 'end' && touch.clock !== null) {

				touch.clock = null;


				var curpos = this.__poscache;

				curpos.x = touch.gridX;
				curpos.y = touch.gridY;

				this.logic.toPixelPosition(curpos, true);
				this.ui.cursor.setPosition(curpos.x, curpos.y);
				this.ui.cursor.setGridPosition(touch.gridX, touch.gridY);


				var gridposition = this.ui.cursor.getGridPosition();
				var entity       = this.logic.getEntityByPosition(gridposition);
				var entityTeam   = entity !== null ? entity.getTeam() : null;
				var entityType   = entity !== null ? entity.getType() : null;
				var selected     = this.logic.getSelected();
				var selectedType = selected.length > 0 ? selected[0].getType() : null;
				var playerTeam   = this.logic.getPlayerTeam();


				// Interaction with other Entity
				if (entity !== null) {

					// Interaction with friendly Entity
					if (entityTeam === playerTeam) {

						// Select Unit
						if (entityType === 'Unit' && (selectedType === 'Unit' || selectedType === null)) {

							if (this.logic.isSelected(entity) === false) {
								this.logic.select(entity);
							} else {
								this.logic.deselect(entity);
							}

						// Unselect Building / Select Unit
						} else if (entityType === 'Unit' && selectedType === 'Building') {

							this.logic.select(null);
							this.logic.select(entity);

						// Building may service our Unit
						} else if (entityType === 'Building') {

							if (selectedType === 'Unit' && entity.can('service', selected[0]) === true) {

								// TODO: Add more intelligence here,
								// The Units that can be repaired should move on the target Building,
								// Units that can't be repaired should move next to the target Building

								this.logic.move(entity.getPosition());

							} else {

								this.logic.select(null);
								this.logic.select(entity);

								this.ui.cursor.show(200);
								this.ui.cursor.setMenu(this.__logic.getMenu());

							}

						}


					// Interaction with unfriendly Entity
					} else if (selected.length > 0) {

						var leader = selected[0];
						if (leader.can('attack', entity) === true) {
							this.logic.attack(entity);
						}

					}

				// Interaction with position on Map
				} else {

					// TODO: Spawn Point interaction for Buildings

					// Deselect Building if they are selected
					if (selectedType === 'Building') {
						this.logic.select(null);
					}

					this.ui.cursor.show(200);
					this.ui.cursor.setMenu(this.logic.getMenu());

				}

			}

		},



		/*
		 * PUBLIC API
		 */

		enter: function(level) {

			lychee.game.State.prototype.enter.call(this);


			var color  = null;
			var player = level.getPlayer();
			if (player !== null) {
				color = this.game.settings.palette[player.id] || null;
			}


			var bars = [ game.ui.GameBar ];
			if (this.game.settings.music === true) {
				bars.push(game.ui.MusicBar);
			}

			this.ui = new _ui({
				bars:   bars,
				cursor: game.ui.GameCursor,
				color:  color
			}, this.game);

			this.logic.reset(level);

		},

		leave: function() {

			this.game.jukebox.stopMusic();

			lychee.game.State.prototype.leave.call(this);

		},

		update: function(clock, delta) {

			this.logic.update(clock, delta);
			this.ui.update(clock, delta);

			this.__clock = clock;

		},

		render: function(clock, delta) {

			var logic    = this.logic;
			var renderer = this.renderer;
			if (renderer !== null) {

				renderer.clear();

				if (logic !== null) {

					logic.render(clock, delta);

					if (lychee.debug === true) {

						var hitmap = this.logic.__level.getHitmap('ground');
						if (hitmap !== null) {
							renderer.renderHitmap(hitmap, '#ff0000');
						}

					}

				}

				if (this.ui !== null) {
					this.ui.render(clock, delta);
				}

				renderer.flush();

			}

		}

	};


	return Class;

});
