
lychee.define('game.ui.GameBar').includes([
	'game.entity.ui.Bar'
]).exports(function(lychee, global) {

	var _bar = game.entity.ui.Bar;

	var Class = function(ui, game) {

		this.ui   = ui;
		this.game = game;


		var model  = game.uimodel;
		var fields = [];


		fields.push({
			id:    0,
			label: null,
			model: model,
			state: 'interaction-build',
			x: 0, y: 0
		});


		var margin = 128 + 12;

		fields.push({
			id:    1,
			label: null,
			model: model,
			state: 'interaction-deselect',
			x: margin, y: 0
		});


		for (var i = 1; i <= 5; i++) {

			fields.push({
				id: i + 1,
				label: '0',
				model: model,
				width: 128,
				height: 80,
				x: margin + i * 12 + i * 128,
				y: 0
			});

		}


		_bar.call(this, fields, this.__onField, this.ui);


		var env = this.game.renderer.getEnvironment();

		var x = env.width / 2;
		var y = 80 + 12;

		this.setPosition(x, y);

	};


	Class.prototype = {

		__onField: function(field, id, label) {

			if (id === 0) {

				this.dialog.show(500);

			} else if (id === 1) {

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

						var model = group[0].getModel();
						if (model !== null) {
							field.setState(model.type.toLowerCase() + '-' + model.id);
						}

					}


					this.logic.select(null);
					this.logic.select(group);

				// 2. Group already selected, Remove Group
				} else if (group.length !== 0 && isIdentical === true) {

					this.removeGroup(id);
					field.setLabel('0');
					field.setState(null);

				// 3. Different units are selected, Select Group
				} else if (group.length !== 0) {

					this.logic.select(null);
					this.logic.select(group);

				}

			}

		}

	};


	return Class;

});

