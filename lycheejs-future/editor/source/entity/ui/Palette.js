
lychee.define('game.entity.ui.Palette').includes([
	'lychee.ui.Switch'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		lychee.ui.Switch.call(this, settings);


		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('change', function(value) {

console.log(value);

		}, this);

	};


	Class.prototype = {

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			var position = this.position;

			var x = position.x + offsetX;
			var y = position.y + offsetY;

			var color  = this.state === 'active' ? '#33b5e5' : '#0099cc';
			var color2 = this.state === 'active' ? '#0099cc' : '#575757';
			var alpha  = this.state === 'active' ? 0.6       : 0.3;


			var options = this.options;
			var hwidth  = this.width / 2;
			var hheight = this.height / 2;

			var x1 = x - hwidth;
			var y1 = y - hheight;
			var x2 = x + hwidth;
			var y2 = y + hheight;


			renderer.drawBox(
				x1,
				y1,
				x2,
				y2,
				color2,
				false,
				2
			);


			var pulse = this.__pulse;
			if (pulse.active === true) {

				renderer.setAlpha(pulse.alpha);

				renderer.drawBox(
					x1,
					y1,
					x2,
					y2,
					color,
					true
				);

				renderer.setAlpha(1.0);

			}


			var font = this.font;
			if (font !== null && options.length > 0) {

				var elw = this.width / options.length;


				for (var o = 0, ol = options.length; o < ol; o++) {

					var text = options[o];
					if (text === this.value) {

						renderer.setAlpha(alpha);

						renderer.drawBox(
							x1 + o * elw,
							y1,
							x1 + (o + 1) * elw,
							y2,
							color,
							true
						);

						renderer.setAlpha(1.0);

					}


					renderer.drawBox(
						x1 + o * elw,
						y1,
						x1 + (o + 1) * elw,
						y2,
						options[o],
						true
					);

				}

			}

		}

	};


	return Class;

});

