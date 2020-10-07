
lychee.define('game.ai.AI').requires([
	'game.ai.Genome'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__threshold = {
			resource: 50,
			defense:  50,
			offense:  50,
			combat:   50
		};


		if (settings.threshold != null) {

			if (typeof settings.threshold.resource === 'number') {
				this.__threshold.resource = settings.threshold.resource;
			}

			this.__threshold.resource = 50 || settings.threshold.resource;
		}


		settings = null;

	};


	Class.prototype = {
	};


	return Class;

});

