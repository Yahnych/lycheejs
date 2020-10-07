
lychee.define('game.logic.UI').requires([
	'game.entity.ui.Bar',
	'game.entity.ui.Cursor'
]).exports(function(lychee, global) {

	var _cursor = game.entity.ui.Cursor;
	var _bar    = game.entity.ui.Bar;

	var Class = function(game) {

		this.game       = game;
		this.logic      = game.logic;

		this.__renderer = game.renderer;


		this.__color     = '#ffffff';
		this.__groups    = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };
		this.__tolerance = 24;

		this.bar    = new _bar(this.__onBarField, this);
		this.cursor = new _cursor(this.__onCursorField, this);

		this.__touch    = { startX: 0, startY: 0, offsetX: 0, offsetY: 0 };
		this.__poscache = { x: 0, y: 0 };


		this.__clock = null;

	};


	Class.GESTURE = {
		none:  0,
		up:    1,
		down:  2,
		left:  3,
		right: 4
	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__onBarField: function(field, id, label) {

			if (id === 0) {

				this.logic.select(null);
				this.cursor.hide(0);

			} else {

				var group       = this.getGroup(id);
				var selected    = this.logic.getSelected();
				var isIdentical = this.isIdenticalGroup(group, selected);

				// 1. No Group Set, Create Group
				if (group.length === 0 && selected.length !== 0) {

					this.setGroup(id, selected);

					group = this.getGroup(id);
					if (group !== null) {
						field.setLabel('' + group.length);
					}


					this.logic.select(null);
					this.logic.select(group);

				// 2. Group already selected, Remove Group
				} else if (group.length !== 0 && isIdentical === true) {

					this.removeGroup(id);
					field.setLabel('0');

				// 3. Different units are selected, Select Group
				} else if (group.length !== 0) {

					this.logic.select(null);
					this.logic.select(group);

				}

			}

		},

		__onCursorField: function(field, id, label) {

			var selected = this.logic.getSelected();
			if (selected.length === 0) {
				this.cursor.hide(100);
				return;
			}


			var position = this.cursor.getGridPosition();

			if (label === 'move') {

				this.logic.focus(position);
				this.logic.move(position);

			} else {

				console.log('CURSOR ACTION NOT SUPPORTED (YET).');

			}

			this.cursor.hide(100);

		},


		/*
		 * STATE INTEGRATION
		 */

		update: function(clock, delta) {

			this.cursor.update(clock, delta);

			this.__clock = clock;

		},

		render: function(clock, delta) {

			var color = this.__color;
			var f, fl, fields, offset;


			// Selected Entities in Game World
			var selected = this.logic.getSelected();
			for (var s = 0, sl = selected.length; s < sl; s++) {
				this.__renderer.renderEntityInfo(selected[s], color);
			}


			// Cursor in Game World
			if (this.cursor.isVisible() === true) {

				this.__renderer.renderUICursor(this.cursor, color);

				var scale = this.cursor.getScale();
				if (scale === 1) {

					offset = this.cursor.getPosition();
					fields = this.cursor.getFields();
					for (f = 0, fl = fields.length; f < fl; f++) {
						if (fields[f].getLabel() === null) continue;
						this.__renderer.renderUIField(fields[f], color, offset.x, offset.y);
					}

				}

			}


			// Fields in UI Bar
            offset = this.bar.getPosition();
			fields = this.bar.getFields();
			for (f = 0, fl = fields.length; f < fl; f++) {
				this.__renderer.renderUIField(fields[f], color, offset.x, offset.y);
			}

		},

		setColor: function(color) {

			if (typeof color === 'string') {
				this.__color = color;
			}

		},


		/*
		 * INTERACTION
		 */

		__detectGesture: function(startX, startY, currentX, currentY) {

			var radius = this.__tolerance;
			var diffX  = Math.abs(currentX - startX);
			var diffY  = Math.abs(currentY - startY);


			if (
				(diffX < radius && diffY < radius)
				|| diffX === diffY
			) {

				return Class.GESTURE.none;

			} else {

				if (diffX > diffY && diffY < radius) {

					if (currentX > startX) {
						return Class.GESTURE.right;
					} else if (currentX < startX) {
						return Class.GESTURE.left;
					}

				} else if (diffY > diffX && diffX < radius) {

					if (currentY > startY) {
						return Class.GESTURE.down;
					} else if (currentY < startY) {
						return Class.GESTURE.up;
					}

				} else {

					return null;

				}

			}

		},

		processSwipe: function(id, state, position, delta, swipe) {

			// TODO: Multi-Touch support
			if (id !== 0) return;

			var entity;


			this.game.offset(position);


			/*
			 * 1. UI Layer Interaction
			 */

			entity = this.getEntityByPosition(position);
			if (entity !== null) {

				if (state === 'start') {
					entity.trigger('touch');
				}

				return;

			}



			/*
			 * GAME Interaction
			 */

			var isVisible = this.cursor.isVisible();
			var touch     = this.__touch;

			if (state === 'start') {

				if (isVisible === true) {
					this.cursor.hide(50);
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


				var offset = this.__renderer.getOffset();

				touch.offsetX = offset.x;
				touch.offsetY = offset.y;

			} else if (state === 'move' && touch.clock !== null) {

				//var gesture = this.__detectGesture(touch.startX, touch.startY, position.x, position.y);

				var radius = this.__tolerance;
				var diffX  = Math.abs(position.x - touch.pixelX);
				var diffY  = Math.abs(position.y - touch.pixelY);

				if (diffX < radius && diffY < radius) {
					return;
				} else {

					this.cursor.hide(0);

					var level = this.logic.getLevel();
					var offsetX = (position.x - touch.pixelX) + touch.offsetX;
					var offsetY = (position.y - touch.pixelY) + touch.offsetY;


					this.__renderer.setOffset(
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
				this.cursor.setPosition(curpos.x, curpos.y);
				this.cursor.setGridPosition(touch.gridX, touch.gridY);


				var gridposition = this.cursor.getGridPosition();
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

								this.cursor.show(200);
								this.cursor.setMenu(this.logic.getMenu());

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

					this.cursor.show(200);
					this.cursor.setMenu(this.logic.getMenu());

				}

			}

		},



		/*
		 * PUBLIC API
		 */

		__isInHitBox: function(x, y, x1, y1, x2, y2) {

			return (
				x > x1
				&& x < x2
				&& y > y1
				&& y < y2
			);

		},

		getEntityByPosition: function(position) {

			var found = false;
			var x = position.x;
			var y = position.y;


			var f, fl, field, fields, offset;
			var hwidth, hheight, x1, y1, x2, y2;


			if (this.cursor.isVisible() === true) {

				offset = this.cursor.getPosition();
				fields = this.cursor.getFields();

				for (f = 0, fl = fields.length; f < fl; f++) {

					field = fields[f];

					if (field.getLabel() === null) continue;

					pos     = field.getPosition();
					hwidth  = field.getWidth() / 2;
					hheight = field.getHeight() / 2;

					found = this.__isInHitBox(
						x, y,
						offset.x + pos.x - hwidth, offset.y + pos.y - hheight,
						offset.x + pos.x + hwidth, offset.y + pos.y + hheight
					);

					if (found === true) return field;

				}

			}


			offset = this.bar.getPosition();
			fields = this.bar.getFields();

			for (f = 0, fl = fields.length; f < fl; f++) {

				field = fields[f];

				if (field.getLabel() === null) continue;

				pos     = field.getPosition();
				hwidth  = field.getWidth() / 2;
				hheight = field.getHeight() / 2;

				found = this.__isInHitBox(
					x, y,
					offset.x + pos.x - hwidth, offset.y + pos.y - hheight,
					offset.x + pos.x + hwidth, offset.y + pos.y + hheight
				);

				if (found === true) return field;

			}


			return null;

		},

		getGroup: function(id) {
			return this.__groups[id];
		},

		setGroup: function(id, group) {

			if (Object.prototype.toString.call(group) === '[object Array]') {
				this.__groups[id] = group;
			} else {
				this.__groups[id] = [];
			}

		},

		removeGroup: function(id) {
			this.__groups[id] = [];
		},

		isIdenticalGroup: function(groupa, groupb) {

			if (groupa.length !== groupb.length) {
				return false;
			}

			var diff = 0;
			for (var a = 0, al = groupa.length; a < al; a++) {

				var found = false;

				for (var b = 0, bl = groupb.length; b < bl; b++) {
					if (groupa[a] === groupb[b]) {
						found = true;
					}
				}

				if (found !== true) {
					diff++;
				}

			}


			return diff === 0;

		}

	};


	return Class;

});

