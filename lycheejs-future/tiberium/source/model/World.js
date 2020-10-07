
lychee.define('game.model.World').exports(function(lychee, global) {

	var Class = function(id, models) {

		this.id = id || 'Default';


		this.__models = {};

		for (var m = 0, ml = models.length; m < ml; m++) {

			var model = models[m];
			this.__models[model.id] = model;

		}

	};


	Class.prototype = {

		getModel: function(id) {

			for (var mId in this.__models) {

				var model = this.__models[mId];
				if (model.id === id) {
					return model;
				}

			}


			return null;

		}

	};


	return Class;

});

