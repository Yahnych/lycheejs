
lychee.define('game.entity.unit.Tank').includes([
	'game.entity.unit.Base'
]).exports(function(lychee, global) {

	var Class = function(team, data, level) {

		game.entity.unit.Base.call(this, team, data, level);


console.log('TANK INSTANCE! YEAH');


	};


	Class.prototype = {

		can: function(action, entity) {

			var classification = entity.getClassification();
			if (classification !== null) {
				return true;
			}

		},

		attack: function(entity) {
		}

	};


	return Class;

});

