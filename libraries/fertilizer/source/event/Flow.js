
lychee.define('fertilizer.event.Flow').requires([
	'fertilizer.data.Shell',
	'lychee.Environment',
	'lychee.Package',
	'lychee.Stash'
]).includes([
	"lychee.event.Flow"
]).exports(function(lychee, global, attachments) {

	const _lychee      = lychee.import('lychee');
	const _Environment = lychee.import('lychee.Environment');
	const _Flow        = lychee.import('lychee.event.Flow');
	const _Package     = lychee.import('lychee.Package');
	const _Shell       = lychee.import('fertilizer.data.Shell');
	const _Stash       = lychee.import('lychee.Stash');
	const _ENVIRONMENT = lychee.environment;
	const _STASH       = new _Stash({
		type: _Stash.TYPE.persistent
	});



	/*
	 * HELPERS
	 */

	const _create_meta_manifest = function() {

		let project = this.project;
		if (project !== null) {

			let config  = new Config();
			let date    = new Date();
			let name    = project.split('/').pop();
			let today   = (date.getUTCMonth() + 1) + '/' + date.getUTCDate();
			let version = lychee.VERSION + '/' + today;

			config.url    = project + '/manifest.json';
			config.buffer = {
				background_color: '#405050',
				display:          'standalone',
				name:             name + ' (powered by lychee.js)',
				orientation:      'landscape',
				short_name:       name,
				start_url:        'index.html',
				theme_color:      '#2f3736',
				version:          version,
				icons: [{
					src:   'icon.png',
					sizes: '128x128',
					type:  'image/png'
				}]
			};

			return config;

		}


		return null;

	};

	const _create_meta_package = function() {

		let project = this.project;
		if (project !== null) {

			let config  = new Config();
			let debug   = this.debug;
			let date    = new Date();
			let name    = project.split('/').pop();
			let today   = (date.getUTCMonth() + 1) + '/' + date.getUTCDate();
			let version = lychee.VERSION + '/' + today;

			config.url    = project + '/package.json';
			config.buffer = {
				main:        './index.html',
				name:        name,
				description: name + ' (powered by lychee.js)',
				version:     version,
				webkit: {
					plugin: false
				},
				window: {
					title:    name + ' (powered by lychee.js)',
					icon:     './icon.png',
					toolbar:  debug === true,
					frame:    true,
					width:    640,
					height:   480,
					position: 'center'
				}
			};

			return config;

		}


		return null;

	};

	const _initialize_environment = function(settings, callback) {

		let environment    = new _Environment(settings);
		let pkg_fertilizer = environment.packages['fertilizer'] || null;
		if (pkg_fertilizer !== null) {

			for (let id in _ENVIRONMENT.definitions) {
				environment.define(_ENVIRONMENT.definitions[id]);
			}

		}


		_lychee.debug = false;
		_lychee.setEnvironment(environment);

		environment.init(sandbox => {

			_lychee.setEnvironment(_ENVIRONMENT);
			callback(environment);

		});

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.assets = [];

		this.action  = null;
		this.debug   = false;
		this.project = null;
		this.target  = null;
		this.shell   = new _Shell();
		this.stash   = new _Stash({
			type: _Stash.TYPE.persistent
		});

		this.__environment = null;
		this.__namespace   = null;
		this.__packages    = {};
		this.__profile     = null;


		this.setAction(states.action);
		this.setDebug(states.debug);
		this.setProject(states.project);
		this.setTarget(states.target);


		_Flow.call(this);

		states = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('read-package', function(oncomplete) {

			let action  = this.action;
			let project = this.project;

			if (action !== null && project !== null) {

				console.log('fertilizer: ' + action + '/READ-PACKAGE "' + project + '"');


				if (project !== '/libraries/lychee') {

					console.log('breeder: -> Mapping /libraries/lychee/lychee.pkg as "lychee"');

					this.__packages['lychee'] = new _Package({
						url:  '/libraries/lychee/lychee.pkg',
						type: 'source'
					});

				}


				let pkg = new _Package({
					url:  project + '/lychee.pkg',
					type: 'source'
				});

				console.log('breeder: -> Mapping ' + pkg.url + ' as "' + pkg.id + '"');

				setTimeout(function() {
					this.__namespace        = pkg.id;
					this.__packages[pkg.id] = pkg;
					oncomplete(true);
				}.bind(this), 200);

			} else {
				oncomplete(false);
			}

		}, this);

		this.bind('read-assets', function(oncomplete) {

			let action  = this.action;
			let project = this.project;
			let stash   = this.stash;

			if (action !== null && project !== null && stash !== null) {

				console.log('fertilizer: ' + action + '/READ-ASSETS "' + project + '"');


				stash.bind('batch', function(type, assets) {

					assets = assets.filter(asset => asset !== null);
					assets = assets.filter(asset => asset.buffer !== '' && asset.buffer !== null);

					this.assets = assets;


					let meta_manifest = this.assets.filter(asset => asset.url.endsWith('/manifest.json')) || null;
					if (meta_manifest === null) {
						meta_manifest = _create_meta_manifest.call(this);
						this.assets.push(meta_manifest);
					}

					let meta_package = this.assets.filter(asset => asset.url.endsWith('/package.json')) || null;
					if (meta_package === null) {
						meta_package = _create_meta_package.call(this);
						this.assets.push(meta_package);
					}

					oncomplete(true);

				}, this, true);

				stash.batch('read', [

					project + '/icon.png',
					project + '/manifest.json',
					project + '/package.json'

				]);

			} else {
				oncomplete(false);
			}

		}, this);

		this.bind('read-assets-crux', function(oncomplete) {

			let action  = this.action;
			let project = this.project;
			let stash   = this.stash;
			let target  = this.target;

			if (action !== null && project !== null && stash !== null && target !== null) {

				console.log('fertilizer: ' + action + '/READ-ASSETS-CRUX "' + project + '" "' + target + '"');


				let platform = target.split('/')[0] || null;
				if (platform !== null) {

					stash.bind('batch', function(type, assets) {

						let asset = assets.filter(asset => asset.url.endsWith('/dist.js'));
						if (asset !== null) {

							this.assets.push(asset);

							oncomplete(true);

						} else {
							oncomplete(false);
						}

					}, this, true);

					stash.batch('read', [

						'/libraries/crux/build/' + platform + '/dist.js'

					]);

				} else {
					oncomplete(false);
				}

			} else {
				oncomplete(false);
			}

		}, this);

		this.bind('serialize-environment', function(oncomplete) {

			let action  = this.action;
			let project = this.project;
			let target  = this.target;

			if (action !== null && project !== null && target !== null) {

				console.log('fertilizer: ' + action + '/SERIALIZE-ENVIRONMENT "' + project + '"');


				let pkg = this.__packages[this.__namespace] || null;
				if (pkg !== null) {

					pkg.setType('build');

					let platform = target.split('/')[0];
					let defaults = pkg.getEnvironments({
						platform: platform
					}).find(env => env.id === target) || null;

					if (defaults !== null) {

						let settings = _lychee.assignunlink({}, defaults, {
							id:      project + '/' + target.split('/').pop(),
							debug:   false,
							sandbox: true,
							timeout: 10000,
							type:    'export'
						});

						if (settings.packages instanceof Object) {

							for (let pid in settings.packages) {

								let url = settings.packages[pid];
								if (url.startsWith('./')) {
									settings.packages[pid] = project + '/' + url.substr(2);
								}

							}

						}

						if (settings.profile instanceof Object) {
							this.__profile = settings.profile;
							delete settings.profile;
						}


						let variant = settings.variant || null;
						if (variant === 'application') {

							_initialize_environment(settings, environment => {

								environment.debug    = defaults.debug;
								environment.sandbox  = defaults.sandbox;
								environment.packages = {};

								this.__environment = environment;
								oncomplete(true);

							});

						} else if (variant === 'library') {

							_initialize_environment(settings, environment => {

								environment.debug    = defaults.debug;
								environment.sandbox  = defaults.sandbox;
								environment.packages = {};

								this.__environment = environment;


								let dependencies = {};

								if (typeof environment.global.console.serialize === 'function') {

									let blob = environment.global.console.serialize().blob || null;
									if (blob !== null) {

										(blob.stderr || '').trim().split('\n').filter(function(line) {
											return line.includes('-') && line.includes('required by ');
										}).forEach(function(line) {

											let tmp = line.trim().split('-')[1];
											if (tmp.endsWith('.')) tmp = tmp.substr(0, tmp.length - 1);

											let dep = tmp.split('required by ')[0].trim();
											let req = tmp.split('required by ')[1].trim();

											if (dep.endsWith('(')) dep = dep.substr(0, dep.length - 1).trim();
											if (req.endsWith(')')) req = req.substr(0, req.length - 1).trim();

											dependencies[req] = dep;

										});

									}

								}


								let remaining = Object.keys(dependencies).length;
								if (remaining > 0) {

									console.warn('fertilizer: Fixing Dependencies');


									let target = environment.definitions[environment.target] || null;

									for (let req in dependencies) {

										let dependency = dependencies[req];
										let definition = environment.definitions[req] || null;
										if (definition !== null) {

											let i0 = definition._includes.indexOf(dependency);
											let i1 = definition._requires.indexOf(dependency);

											if (i0 !== -1 || i1 !== -1) {
												console.warn('fertilizer: -> Removing "' + dependency + '" from "' + definition.id + '".');
												remaining--;
											}

											if (i0 !== -1) {
												definition._includes.splice(i0, 1);
											}

											if (i1 !== -1) {
												definition._requires.splice(i1, 1);
											}

										}

										if (target !== null) {

											let i0 = target._includes.indexOf(req);
											let i1 = target._requires.indexOf(req);

											if (i0 !== -1 || i1 !== -1) {
												console.warn('fertilizer: -> Removing "' + req + '" from "' + target.id + '".');
											}

											if (i0 !== -1) {
												target._includes.splice(i0, 1);
											}

											if (i1 !== -1) {
												target._requires.splice(i1, 1);
											}

										}

									}

								}


								if (typeof environment.global.console.serialize === 'function') {

									let blob = environment.global.console.serialize().blob || null;
									if (blob !== null) {

										(blob.stderr || '').trim().split('\n').map(function(line) {
											return (line.indexOf(':') !== -1 ? line.split(':')[1].trim() : line.trim());
										}).forEach(function(line) {
											console.warn('fertilizer: ' + line);
										});

									}

								}


								if (remaining === 0) {
									oncomplete(true);
								} else {
									oncomplete(false);
								}

							});

						} else {
							oncomplete(false);
						}

					} else {
						oncomplete(false);
					}

					pkg.setType('source');

				}

			} else {
				oncomplete(false);
			}

		}, this);

		this.bind('write-assets', function(oncomplete) {

			let action  = this.action;
			let project = this.project;
			let stash   = this.stash;
			let target  = this.target;

			if (action !== null && project !== null && target !== null) {

				console.log('fertilizer: ' + action + '/WRITE-ASSETS "' + project + '"');


				let assets = this.assets;
				if (assets.length > 0) {

					stash.bind('batch', function(type, assets) {
						oncomplete(true);
					}, this, true);

					stash.batch('write', assets.map(asset => {

						let url = asset.url;
						if (url.startsWith(project)) {
							return project + '/build/' + target + url.substr(project.length);
						} else if (url.startsWith('./')) {
							return project + '/build/' + target + url.substr(1);
						}

					}), assets);

				} else {
					oncomplete(true);
				}

			} else {
				oncomplete(false);
			}

		}, this);



		/*
		 * FLOW
		 */

		// this.then('read-package');
		// this.then('read-assets');
		// this.then('read-assets-crux');

		// this.then('serialize-environment');

		// this.then('write-assets');

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Flow.prototype.serialize.call(this);
			data['constructor'] = 'fertilizer.event.Flow';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setAction: function(action) {

			action = typeof action === 'string' ? action : null;


			if (action !== null) {

				this.action = action;

				return true;

			}


			return false;

		},

		setDebug: function(debug) {

			debug = typeof debug === 'boolean' ? debug : null;


			if (debug !== null) {

				this.debug = debug;

				return true;

			}


			return false;

		},

		setProject: function(project) {

			project = typeof project === 'string' ? project : null;


			if (project !== null) {

				this.project = project;

				return true;

			}


			return false;

		},

		setTarget: function(target) {

			target = typeof target === 'string' ? target : null;


			if (target !== null) {

				this.target = target;

				return true;

			}


			return false;

		}

	};


	return Composite;

});

