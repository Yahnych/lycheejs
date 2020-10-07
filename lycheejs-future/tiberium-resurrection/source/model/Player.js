
lychee.define('game.model.Player').exports(function(lychee, global) {

	var Class = function(id, data) {

		this.id = id || 'Default';


		this.__credits   = data.credits || 0;
		this.__buildings = [];
		this.__units     = [];

	};


	Class.prototype = {

		addCredits: function(credits) {

			credits = typeof credits === 'number' ? credits : null;


			if (credits !== null) {

				this.__credits += credits;

				return true;

			}


			return false;

		},

		getCredits: function() {
			return this.__credits;
		},

		removeCredits: function(credits) {

			credits = typeof credits === 'number' ? credits : null;


			if (credits !== null && credits >= this.__credits) {

				this.__credits -= credits;

				return true;

			}


			return false;

		},

		addBuilding: function(building) {
			this.__buildings.push(building);
		},

		getBuildings: function() {
			return this.__buildings;
		},

		removeBuilding: function(building) {

			var found = false;

			for (var b = 0, bl = this.__buildings.length; b < bl; b++) {

				if (this.__buildings[b] === building) {
					found = true;
					this.__buildings.splice(b, 1);
					bl--;
				}

			}


			return found;

		},

		addUnit: function(unit) {
			this.__units.push(unit);
		},

		getUnits: function() {
			return this.__units;
		},

		removeUnit: function(unit) {

			var found = false;

			for (var u = 0, ul = this.__units.length; u < ul; u++) {

				if (this.__units[u] === unit) {
					found = true;
					this.__units.splice(u, 1);
					ul--;
				}

			}


			return found;

		}

	};


	return Class;

});

