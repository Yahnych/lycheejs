
lychee.define('game.ui.GameCursor').exports(function(lychee, global) {

	var Cursor = function(field, id, label) {

		var selected = this.logic.getSelected();
		if (selected.length === 0) {
			this.cursor.hide(100);
			return;
		}


		var position = this.cursor.getGridPosition();


		switch(label) {

			case 'attack':

			break;
			case 'defend':

				this.logic.defend(position);

			break;
			case 'move':

				this.logic.focus(position);
				this.logic.move(position, false);

			break;

			case 'patrol':

				this.logic.focus(position);
				this.logic.move(position, true);

			break;

			case 'sell':

				this.logic.sell(selected);

			break;

			case 'repair':

				this.logic.repair(selected);

			break;

			default:
				console.log('CURSOR ACTION NOT SUPPORTED (YET).');
			break;


		}

		this.cursor.hide(100);

	};


	return Cursor;

});

