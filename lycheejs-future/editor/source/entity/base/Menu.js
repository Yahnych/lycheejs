
lychee.define('game.entity.base.Menu').includes([
	'lychee.ui.Layer'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data, main) {

		var settings = lychee.extend({}, data);


		this.main = main || null;


		lychee.ui.Layer.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		deserialize: function(blob) {

			lychee.ui.Layer.prototype.deserialize.call(this, blob);


			var entity = null;


			entity = this.getEntity('module');
			entity.bind('change', function(value) {

				var state = this.main.getState();
				if (state !== null) {
					state.changeModule(value.toLowerCase());
				}

			}, this);

		}

	};


	return Class;

});

