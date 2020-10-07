
lychee.define('game.ui.UI').requires([
	'game.entity.ui.Cursor',
	'game.entity.ui.Dialog',
	'game.ui.GameCursor',
	'game.ui.GameBar',
	'game.ui.MusicBar'
]).exports(function(lychee, global) {

	var _cursor = game.entity.ui.Cursor;
	var _dialog = game.entity.ui.Dialog;


	var Class = function(data, game) {

		var settings = lychee.extend({}, data);


		this.game       = game;
		this.cursor     = null;
		this.dialog     = null;
		this.jukebox    = game.jukebox;
		this.logic      = game.logic;
		this.__renderer = game.renderer;


		this.__bars      = [];
		this.__color     = '#ffffff';
		this.__groups    = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
		this.__tolerance = this.game.settings.tile;


		if (settings.bars != null) {

			for (var b = 0, bl = settings.bars.length; b < bl; b++) {

				if (typeof settings.bars[b] !== 'function') continue;

				this.__bars.push(new settings.bars[b](
					this, this.game
				));

			}

		}

		if (typeof settings.color === 'string') {
			this.__color = settings.color;
			this.logic.setColor(settings.color);
		}


		if (typeof settings.cursor === 'function') {
			this.cursor = new _cursor(settings.cursor, this);
		}

		if (typeof settings.cursor === 'function') {
			this.dialog = new _dialog(settings.dialog, this);
		}


		settings = null;

	};


	Class.prototype = {

		/*
		 * STATE INTEGRATION
		 */

		update: function(clock, delta) {

			if (this.cursor !== null) {
				this.cursor.update(clock, delta);
			}


			for (var id in this.__groups) {

				for (var g = 0, l = this.__groups[id].length; g < l; g++) {
					if (this.__groups[id][g].getHealth() === 0) {
						this.__groups[id].splice(g, 1);
						l--;
					}
				}

			}


		},

		render: function(clock, delta) {

			var color = this.__color;
			var f, fl, fields;
			var offset, ox, oy;


			// Cursor in Game World
			if (
				this.cursor !== null
				&& this.cursor.isVisible() === true
			) {

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


			// UI Bars
			for (var b = 0, bl = this.__bars.length; b < bl; b++) {

				var bar = this.__bars[b];

				offset = bar.getPosition();
				fields = bar.getFields();

				ox = offset.x - bar.getWidth() / 2;
				oy = offset.y - bar.getHeight() / 2;

				for (f = 0, fl = fields.length; f < fl; f++) {
					this.__renderer.renderUIField(fields[f], color, ox, oy);
				}

			}


			// Player Statistics (Credits)
			var player = this.logic.getPlayer();
			if (player !== null) {

				var credits = player.getCredits();

				this.__renderer.drawText(
					0, 0,
					'' + credits,
					this.game.fonts.normal
				);

			}


			// Cursor in Game World
			if (
				this.dialog !== null
				&& this.dialog.isVisible() === true
			) {

				this.__renderer.renderUIDialog(this.dialog, color);

				var scale = this.cursor.getScale();
				if (scale === 1) {

					offset = this.dialog.getPosition();
					fields = this.dialog.getFields();

					for (f = 0, fl = fields.length; f < fl; f++) {
						if (fields[f].getLabel() === null) continue;
						this.__renderer.renderUIField(fields[f], color, offset.x, offset.y);
					}

				}

			}

		},



		/*
		 * HELPERS
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


			var f, fl, field, fields;
			var state, offset, pos, hwidth, hheight;


			if (
				this.cursor !== null
				&& this.cursor.isVisible() === true
			) {

				offset = this.cursor.getPosition();
				fields = this.cursor.getFields();

				for (f = 0, fl = fields.length; f < fl; f++) {

					field = fields[f];

					if (field.getLabel() === null) continue;

					pos     = field.getPosition();
					state   = field.getState();
					hwidth  = field.getMap(state).w / 2;
					hheight = field.getMap(state).h / 2;

					found = this.__isInHitBox(
						x, y,
						offset.x + pos.x - hwidth, offset.y + pos.y - hheight,
						offset.x + pos.x + hwidth, offset.y + pos.y + hheight
					);

					if (found === true) return field;

				}

			}


			for (var b = 0, bl = this.__bars.length; b < bl; b++) {

				var bar = this.__bars[b];

				offset = bar.getPosition();
				fields = bar.getFields();

				var ox = offset.x - bar.getWidth() / 2;
				var oy = offset.y - bar.getHeight() / 2;

				for (f = 0, fl = fields.length; f < fl; f++) {

					field = fields[f];

					if (field.getLabel() === null) continue;

					pos     = field.getPosition();
					state   = field.getState();
					hwidth  = field.getMap(state).w / 2;
					hheight = field.getMap(state).h / 2;

					found = this.__isInHitBox(
						x, y,
						ox + pos.x - hwidth, oy + pos.y - hheight,
						ox + pos.x + hwidth, oy + pos.y + hheight
					);

					if (found === true) return field;

				}

			}


			return null;

		},



		/*
		 * GROUP MANAGEMENT
		 */

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

