
lychee.define('game.entity.base.Sidebar').includes([
	'lychee.ui.Layer'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		lychee.ui.Layer.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * LAYER API
		 */

		reshape: function() {

console.log('RESHAPE SIDEBAR');

			var boundw = this.width - 64;
			var boundy = -1/2 * this.height + 32;

			for (var e = 0, el = this.entities.length; e < el; e++) {

				var entity   = this.entities[e];
				var hoffsety = (entity.radius * 2) || (entity.height / 2);

				entity.width      = boundw;
				entity.position.y = boundy + hoffsety;

				if (entity.shape === lychee.ui.Entity.SHAPE.circle) {
					boundy += entity.radius * 2;
				} else if (entity.shape === lychee.ui.Entity.SHAPE.rectangle) {
					boundy += entity.height;
				}

				boundy += 32;

			}


			lychee.ui.Layer.prototype.reshape.call(this);

		}

	};


	return Class;

});

