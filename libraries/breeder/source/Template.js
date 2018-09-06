
lychee.define('breeder.Template').requires([
	'lychee.Stash'
]).includes([
	'lychee.event.Flow'
]).exports(function(lychee, global, attachments) {

	const _Flow   = lychee.import('lychee.event.Flow');
	const _Stash  = lychee.import('lychee.Stash');
	const _CONFIG = attachments["json"];
	const _STASH  = new _Stash({
		type: _Stash.TYPE.persistent
	});



	/*
	 * HELPERS
	 */

	const _inject = function(buffer, injections) {

		let chunk = '';
		let code  = buffer.split('\n');
		let c     = 0;
		let cl    = code.length;
		let found = { include: false, inject: false };
		let index = { include: -1,    inject: -1    };
		let tmp   = '';
		let tmp_s = '';
		let tmp_c = '';
		let tmp_i = '';
		let tpl_s = '';
		let tpl_c = '';
		let tpl_i = '';


		for (c = 0; c < cl; c++) {

			chunk = code[c].trim();

			if (chunk.startsWith('<script')) {

				tpl_s = '\t<script src="/libraries/';
				tpl_c = '\t<script src="${injection}"></script>';
				tpl_i = '\t\t\t\tlychee.inject(lychee.ENVIRONMENTS[\'${identifier}\']);\n';

				injections = injections.filter(function(injection) {
					return injection.split('/')[4] === 'html';
				});

				break;

			} else if (chunk.startsWith('require(')) {

				tpl_s = 'require(_ROOT + \'/libraries/';
				tpl_c = 'require(_ROOT + \'${injection}\');';
				tpl_i = '\t\t\tlychee.inject(lychee.ENVIRONMENTS[\'${identifier}\']);\n';

				injections = injections.filter(function(injection) {
					return injection.split('/')[4] === 'node';
				});

				break;

			}

		}


		for (let i = 0, il = injections.length; i < il; i++) {

			let injection  = injections[i];
			let identifier = injection.split('/').slice(0, 3).join('/') + '/' + injection.split('/')[5];


			tmp_c = tpl_c.replaceObject({
				injection: injection
			});

			tmp_i = tpl_i.replaceObject({
				identifier: identifier
			});

			tmp_s = tpl_s;


			for (c = 0; c < cl; c++) {

				chunk = code[c].trim();
				tmp   = tmp_s.trim();


				if (chunk.startsWith(tmp)) {
					index.include = c;
				}

				if (chunk === tmp_c.trim()) {
					found.include = true;
				}

			}

			if (found.include === false && index.include >= 0) {
				code.splice(index.include + 1, 0, tmp_c);
				cl++;
			}


			for (c = 0; c < cl; c++) {

				chunk = code[c].trim();


				if (chunk.startsWith('lychee.inject(')) {
					index.inject = c;
				} else if (chunk.startsWith('lychee.init(') && index.inject === -1) {
					index.inject = c - 1;
				}

				if (chunk === tmp_i.trim()) {
					found.inject = true;
				}

			}


			if (found.inject === false && index.inject >= 0) {
				code.splice(index.inject + 1, 0, tmp_i);
				cl++;
			}

		}


		return code.join('\n');

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.sandbox = '';
		this.states  = {};
		this.stash   = new _Stash({
			type: _Stash.TYPE.persistent
		});


		this.__identifiers = [];
		this.__injections  = [];
		this.__main        = [];


		this.setSandbox(states.sandbox);
		this.setSettings(states.settings);


		_Flow.call(this);

		states = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('pull', function(oncomplete) {

			let library = this.settings.library;
			let stash   = this.stash;


			if (library !== null && stash !== null) {

				console.log('breeder: PULL ' + library);


				let sandbox = this.sandbox;


				_STASH.bind('batch', function(type, assets) {

					let main = assets.filter(function(asset) {
						return /index\.html|harvester\.js/g.test(asset.url);
					});
					let pkg  = assets.find(function(asset) {
						return /lychee\.pkg/g.test(asset.url);
					}) || null;

					if (main.length > 0 && pkg !== null && pkg.buffer !== null) {

						let platforms = [];

						Object.values(pkg.buffer.build.environments).forEach(function(environment) {

							let tags = environment.tags || null;
							if (tags instanceof Object) {

								if (tags.platform instanceof Array) {

									tags.platform.forEach(function(val) {

										if (platforms.indexOf(val) === -1) {
											platforms.push(val);
										}

									});

								}

							}

						});


						if (platforms.length > 0) {

							let injections = platforms.sort().map(function(platform) {
								return library + '/build/' + platform + '/dist/index.js';
							});
							let tmp_stash  = new _Stash({
								type: _Stash.TYPE.temporary
							});


							tmp_stash.bind('batch', function(type, assets) {

								for (let a = 0, al = assets.length; a < al; a++) {

									let asset = assets[a];
									if (asset.buffer !== null && asset.buffer !== '') {
										stash.write('.' + asset.url, asset);
									}

								}

							});

							tmp_stash.batch('read', injections);

							this.__injections = injections;

						}


						this.__main = main;

						setTimeout(function() {

							this.trigger('pull-inject', [ function(result) {
								oncomplete(result);
							} ]);

						}.bind(this), 500);

					} else {

						oncomplete(false);

					}

				}, this, true);


				_STASH.batch('read', [
					sandbox + '/harvester.js',
					sandbox + '/index.html',
					sandbox + '/lychee.pkg'
				]);

			} else {

				oncomplete(false);

			}

		});


		this.bind('pull-inject', function(oncomplete) {

			let injections = this.__injections;
			let main       = this.__main;
			let stash      = this.stash;


			if (injections.length > 0 && main.length > 0 && stash !== null) {

				for (let m = 0, ml = main.length; m < ml; m++) {

					let tmp = main[m];
					if (tmp.buffer !== null) {

						console.log('breeder: PULL-INJECT ' + tmp.url);

						tmp.buffer = _inject(tmp.buffer, injections);

						stash.write(tmp.url, tmp);

					}

				}


				setTimeout(function() {
					oncomplete(true);
				}, 500);

			} else {

				oncomplete(true);

			}

		}, this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			let stash = lychee.deserialize(blob.stash);
			if (stash !== null) {
				this.stash = stash;
			}

		},

		serialize: function() {

			let data = _Flow.prototype.serialize.call(this);
			data['constructor'] = 'breeder.Template';


			let settings = data['arguments'][0] || {};
			let blob     = data['blob'] || {};


			if (this.sandbox !== '') settings.sandbox = this.sandbox;


			if (this.stash !== null) blob.stash = lychee.serialize(this.stash);


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		}

	};


	return Composite;

});

