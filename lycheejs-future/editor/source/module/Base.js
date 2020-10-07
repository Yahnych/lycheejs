
lychee.define('game.module.Base').requires([
	'game.entity.base.Menu',
	'game.entity.base.Sidebar',
	'lychee.ui.Label',
	'lychee.ui.Button',
	'lychee.ui.Select',
	'lychee.ui.Slider',
	'lychee.ui.Switch'
]).exports(function(lychee, game, global, attachments) {

	var _blob = attachments["json"].buffer;


	var _id = 0;
	var _sharedlayers = null;

	var Class = function(id, state) {

		this.id       = id                  || ('Unknown' + _id++);
		this.state    = state               || null;
		this.main     = state.main          || null;
		this.renderer = state.main.renderer || null;


		this.layers = {};


		if (_sharedlayers === null) {

			_sharedlayers = {};

			for (var id in _blob.layers) {
				_sharedlayers[id] = lychee.deserialize(_blob.layers[id]);
			}

		}


		if (_sharedlayers !== null) {

			for (var id in _sharedlayers) {
				this.layers[id] = _sharedlayers[id];
			}

		}

	};


	Class.prototype = {

		/*
		 * STATE API
		 */

		deserialize: function(blob) {

			for (var id in blob.layers) {
				this.setLayer(id, lychee.deserialize(blob.layers[id]));
			}

		},

		serialize: function() {

			var blob = {};


			blob.layers = {};

			for (var id in this.layers) {
				blob.layers[id] = this.layers[id].serialize();
			}


			var state = null;
			if (this.state !== null) {
				state = '#MAIN.state';
			}


			return {
				'constructor': 'game.module.Base',
				'arguments':   [ state ],
				'blob':        blob
			};

		},

		enter: function() {

			var state = this.state;
			if (state !== null) {

				for (var id in this.layers) {
					state.setLayer(id, this.layers[id]);
				}

			}

		},

		leave: function() {

			var state = this.state;
			if (state !== null) {

				for (var id in this.layers) {
					state.removeLayer(id);
				}

			}

		},

		show: function() {

		},

		reshape: function(orientation, rotation) {

			var renderer = this.renderer;
			if (renderer !== null) {

				var entity = null;
				var layer  = null;
				var width  = renderer.width;
				var height = renderer.height;


				var canvas  = this.getLayer('ui-canvas');
				var menu    = this.getLayer('ui-menu');
				var sidebar = this.getLayer('ui-sidebar');


				menu.width         = width;
				menu.position.x    = 1/2 * menu.width;
				menu.position.y    = 1/2 * menu.height;
				menu.reshape();

				sidebar.width      = 256;
				sidebar.height     = height - menu.height;
				sidebar.position.x = 1/2 * sidebar.width;
				sidebar.position.y = 1/2 * sidebar.height + menu.height;
				sidebar.reshape();

				canvas.width       = width - sidebar.width;
				canvas.height      = height - menu.height;
				canvas.position.x  = 1/2 * canvas.width + sidebar.width;
				canvas.position.y  = 1/2 * canvas.height + menu.height;
				canvas.reshape();

			}

		},

		hide: function() {

		},



		/*
		 * LAYER API
		 */

		setLayer: function(id, layer) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				if (
					   lychee.interfaceof(lychee.game.Layer, layer) === true
					|| lychee.interfaceof(lychee.ui.Layer, layer) === true
				) {

					this.layers[id] = layer;

					return true;

				}

			}


			return false;

		},

		getLayer: function(id) {

			id = typeof id === 'string' ? id : null;


			if (
				   id !== null
				&& this.layers[id] !== undefined
			) {

				return this.layers[id];

			}


			return null;

		},

		queryLayer: function(id, query) {

			id    = typeof id === 'string'    ? id    : null;
			query = typeof query === 'string' ? query : null;


			if (
				   id !== null
				&& query !== null
			) {

				var layer = this.getLayer(id);
				if (layer !== null) {

					var entity = layer;
					var ids    = query.split(' > ');

					for (var i = 0, il = ids.length; i < il; i++) {

						entity = entity.getEntity(ids[i]);

						if (entity === null) {
							break;
						}

					}


					return entity;

				}

			}


			return null;

		},

		removeLayer: function(id) {

			id = typeof id === 'string' ? id : null;


			if (
				   id !== null
				&& this.layers[id] !== undefined
			) {

				delete this.layers[id];

				return true;

			}


			return false;

		}

	};


	return Class;

});

