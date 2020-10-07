
lychee.define('game.State').requires([
	'game.module.Pixel'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, game, global, attachments) {

	var _modules = game.module;

	var Class = function(main) {

		lychee.game.State.call(this, main);


		this.modules  = {
			pixel: new game.module.Pixel(this)
		};

		this.__module = null;

	};


	Class.prototype = {

		/*
		 * STATE API
		 */

		reshape: function(orientation, rotation) {

console.log('RESHAPE STATE');

//			lychee.game.State.prototype.reshape.call(this, orientation, rotation);


			var renderer = this.renderer;
			if (renderer !== null) {

				var entity = null;
				var width  = renderer.width;
				var height = renderer.height;


				var module = this.__module;
				if (module !== null) {
					module.reshape(orientation, rotation);
				}

			}

		},

		enter: function(data) {

			lychee.game.State.prototype.enter.call(this);


			this.changeModule(data.module);
			this.reshape();

		},

		leave: function() {

			this.changeModule(null);
			this.reshape();


			lychee.game.State.prototype.leave.call(this);

		},



		/*
		 * CUSTOM API
		 */

		changeModule: function(id) {

			id = typeof id === 'string' ? id : null;


			var oldmodule = this.__module;
			var newmodule = this.modules[id] || null;

			if (newmodule !== null) {

				if (oldmodule !== null) {
					oldmodule.leave();
				}

				if (newmodule !== null) {
					newmodule.enter();
				}

				this.__module = newmodule;

			} else {

				if (oldmodule !== null) {
					oldmodule.leave();
				}

				this.__module = null;

			}


			return true;

		}

	};


	return Class;

});
