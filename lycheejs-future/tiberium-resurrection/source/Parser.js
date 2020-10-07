
lychee.define('game.Parser').includes([
	'lychee.event.Emitter',
]).requires([
	'game.model.World',
	'game.model.Level',
	'game.model.Building',
	'game.model.Road',
	'game.model.Unit',
	'game.model.Vegetation'
]).exports(function(lychee, global) {

	var Class = function() {

		lychee.event.Emitter.call(this, 'parser');


		this.__worlds    = [];
		this.__levels    = [];
		this.__buildings = [];
		this.__units     = [];

		this.__remaining = 0;


		this.__canvas = document.createElement('canvas');
		this.__ctx    = this.__canvas.getContext('2d');


		this.__preloader = new lychee.Preloader({
			timeout: Infinity
		});

		this.__preloader.bind('ready', this.__load, this);
		this.__preloader.bind('error', this.__unload, this);

	};


	Class.TYPE = {
		World:    0,
		Level:    1,
		Building: 2,
		Unit:     3
	};



	Class.prototype = {

		/*
		 * PRIVATE LOADING API
		 */

		__convertImage: function(image, model, callback, scope) {

			var canvas = this.__canvas;
			var ctx    = this.__ctx;


			canvas.width  = image.width;
			canvas.height = image.height;

			ctx.drawImage(image, 0, 0, image.width, image.height);


			var imgData = ctx.getImageData(0, 0, image.width, image.height);

			for (var x = 0; x < image.width; x++) {
				for (var y = 0; y < image.height; y++) {

					var index = 4 * (x + y * image.width);

					if (
						imgData.data[index] === 0
						&& imgData.data[index + 1] === 0
						&& imgData.data[index + 2] === 0
						&& imgData.data[index + 3] === 255
					) {
						imgData.data[index + 3] = 0;
					} else if (
						imgData.data[index] === 85
						&& imgData.data[index + 1] === 255
						&& imgData.data[index + 2] === 85
					) {
						imgData.data[index] = 0;
						imgData.data[index + 1] = 0;
						imgData.data[index + 2] = 0;
						imgData.data[index + 3] = 254;
					}

				}
			}

			ctx.putImageData(imgData, 0, 0);


			var converted = new Image();

			converted.onload = function() {
				callback.call(scope, model, converted);
			};

			converted.src = canvas.toDataURL('image/png');

		},


		__load: function(assets, mappings) {

			for (var url in assets) {

				var ext = url.split('.');
				ext = ext[ext.length - 1];

				if (assets[url] !== null) {

					var model = mappings[url] || null;
					if (model !== null && ext === 'png') {

						this.__convertImage(assets[url], model, function(model, image) {
							model.setImage(image);
							this.__remaining--;
							this.__checkReady();
						}, this);

					} else if (model !== null && ext === 'json') {
						model.setMap(assets[url]);
						this.__remaining--;
						this.__checkReady();
					}

				}

			}

		},

		__unload: function(assets, mappings) {

			if (lychee.debug === true) {

				console.error('LOADING ERROR', assets, mappings);

				for (var url in assets) {
					this.__remaining--;
				}

			}

		},

		/*
		 * PRIVATE API
		 */

		__checkReady: function() {

			if (this.__remaining === 0) {

				this.trigger('ready', [
					this.__worlds,
					this.__levels,
					this.__buildings,
					this.__units
				]);

			}

		},

		__parseWorld: function(models, base) {

			var tmp   = base.split('/');
			var wdata = {
				id: tmp[tmp.length - 1],
				models: []
			};

			for (var m = 0, ml = models.length; m < ml; m++) {

				var data  = models[m];

				var model = null;
				if (data.model === 'Road') {
					model = new game.model.Road(data.id, data);
// TODO: Integrate Civilian Buildings here
//				} else if (data.model === 'CivilianBuilding') {
//					model = new game.model.CivilianBuilding(data);
				} else {
					model = new game.model.Vegetation(data.id, data);
				}

				var url;

				if (data.file != null) {
					url = base + '/' + data.file;
					this.__preloader.load(url, model);
					this.__remaining++;
				}

				if (data.id != null) {
					url = base + '/' + data.id + '.png';
					this.__preloader.load(url, model);
					this.__remaining++;
				}

				wdata.models.push(model);

			}


			this.__worlds.push(new game.model.World(
				wdata.id,
				wdata.models
			));


			// Index file is done, so count down
			this.__remaining--;

		},

		__parseLevel: function(data, base) {

			var level = new game.model.Level(data);

			this.__levels.push(level);
			this.__remaining--;

		},

		__parseBuilding: function(data, base) {

			for (var id in data) {

				var model = new game.model.Building(id, data[id]);
				var url   = base + '/' + id + '.png';

				this.__remaining++;
				this.__buildings.push(model);
				this.__preloader.load(url, model);

			}


			// Index file is done, so count down
			this.__remaining--;

		},

		__parseUnit: function(data, base) {

			for (var id in data) {

				var model = new game.model.Unit(id, data[id]);
				var url   = base + '/' + id + '.png';

				this.__remaining++;
				this.__units.push(model);
				this.__preloader.load(url, model);

			}


 			// Index file is done, so count down
			this.__remaining--;

		},



		/*
		 * PUBLIC API
		 */

		run: function(assets, types, bases) {

			if (
				assets.length === types.length
				&& assets.length === bases.length
			) {

				for (var i = 0, l = assets.length; i < l; i++) {

					var data = assets[i];
					var type = types[i];
					var base = bases[i] || './';

					if (type !== undefined) {

						if (type === Class.TYPE.World) {
							this.__remaining++;
							this.__parseWorld(data, base);
						} else if (type === Class.TYPE.Level) {
							this.__remaining++;
							this.__parseLevel(data, base);
						} else if (type === Class.TYPE.Building) {
							this.__remaining++;
							this.__parseBuilding(data, base);
						} else if (type === Class.TYPE.Unit) {
							this.__remaining++;
							this.__parseUnit(data, base);
						}

					}

				}

			}


			// In case no __parse method was asynchronous
			this.__checkReady();

		}

	};


	return Class;

});

