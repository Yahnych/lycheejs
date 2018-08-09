
lychee.define('strainer.flow.Transcribe').requires([
	'lychee.Package',
	'lychee.Stash',
	'strainer.api.PARSER',
	'strainer.plugin.API'
]).includes([
	'lychee.event.Flow'
]).exports(function(lychee, global, attachments) {

	const _plugin  = {
		API: lychee.import('strainer.plugin.API')
	};
	const _Flow    = lychee.import('lychee.event.Flow');
	const _Package = lychee.import('lychee.Package');
	const _Stash   = lychee.import('lychee.Stash');
	const _PARSER  = lychee.import('strainer.api.PARSER');
	const _STASH   = new _Stash({
		type: _Stash.TYPE.persistent
	});



	/*
	 * IMPLEMENTATIONS
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.configs  = [];
		this.errors   = [];
		this.sources  = [];
		this.sandbox  = '';
		this.settings = {};
		this.stash    = new _Stash({
			type: _Stash.TYPE.persistent
		});

		this.__namespace = null;
		this.__packages  = {};


		this.setSandbox(states.sandbox);
		this.setSettings(states.settings);


		_Flow.call(this, states);

		states = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('read-package', function(oncomplete) {

			let library = this.settings.library || null;
			let sandbox = this.sandbox;
			let stash   = this.stash;

			if (library !== null && sandbox !== '' && stash !== null) {

				console.log('strainer: READ-PACKAGE ' + library);

				let pkg = new _Package({
					url:  library + '/lychee.pkg',
					type: 'source'
				});

				console.log('strainer: -> Mapping ' + pkg.url + ' as "' + pkg.id + '"');

				setTimeout(function() {
					this.__namespace        = pkg.id;
					this.__packages[pkg.id] = pkg;
					oncomplete(true);
				}.bind(this), 200);

			} else {
				oncomplete(false);
			}

		}, this);

		this.bind('read-configs', function(oncomplete) {

			let library   = this.settings.library || null;
			let namespace = this.__namespace;
			let sandbox   = this.sandbox;
			let stash     = this.stash;

			if (library !== null && namespace !== null && sandbox !== '' && stash !== null) {

				console.log('strainer: READ-CONFIGS ' + library);

				let pkg = this.__packages[namespace] || null;
				if (pkg !== null) {

					pkg.setType('api');

					let configs = pkg.getFiles().filter(function(url) {
						return url.endsWith('.json');
					});

					if (configs.length > 0) {

						stash.bind('batch', function(type, assets) {
							this.configs = assets.filter(asset => asset !== null);
							oncomplete(true);
						}, this, true);

						stash.batch('read', configs.map(url => library + '/api/' + url));

					} else {
						oncomplete(true);
					}

					pkg.setType('source');

				}

			} else {
				oncomplete(false);
			}

		}, this);

		this.bind('transcribe-configs', function(oncomplete) {

			let api     = _plugin.API;
			let configs = this.configs;
			let library = this.settings.library || null;
			let project = this.settings.project || null;

			if (configs.length > 0 && library !== null && project !== null) {

				console.log('strainer: TRANSCRIBE-CONFIGS ' + library + ' -> ' + project);

				this.sources = this.configs.map(asset => {

					let api_report = asset.buffer;

					if (api_report !== null) {

						if (asset.url.includes('/api/')) {

							let config = new lychee.Asset(asset.url, 'json', true);
							if (config !== null) {

								config.buffer = {
									header: api_report.source.header,
									memory: api_report.source.memory,
									result: api_report.source.result
								};

							}

							let url = asset.url.replace('/api/', '/source/').replace(/\.json$/, '.js');
							if (url.startsWith(library) === true) {
								url = project + url.substr(library.length);
							}

							let buffer = api.transcribe(config);
							if (buffer !== null) {

								let source = new Stuff(url, true);

								source.buffer = buffer;

								return source;

							}

						}

					}


					return null;

				});

				oncomplete(true);

			} else {
				oncomplete(false);
			}

		}, this);

		this.bind('write-sources', function(oncomplete) {

			let sandbox = this.sandbox;
			let stash   = this.stash;

			if (sandbox !== '' && stash !== null) {

				console.log('strainer: WRITE-SOURCES ' + sandbox);


				let sources = this.sources.filter(function(code, c) {
					return code !== null;
				});

				if (sources.length > 0) {

					stash.bind('batch', function(type, assets) {

						if (assets.length === sources.length) {
							oncomplete(true);
						} else {
							oncomplete(false);
						}

					}, this, true);

					stash.batch('write', sources.map(asset => asset.url), sources);

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

		this.then('read-package');
		this.then('read-configs');

		this.then('transcribe-configs');

		this.then('write-sources');

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.sources instanceof Array) {

				let sources = [];

				for (let bs = 0, bsl = blob.sources.length; bs < bsl; bs++) {
					sources.push(lychee.deserialize(blob.sources[bs]));
				}

				if (sources.length > 0) {
					this.sources = sources.filter(asset => asset !== null);
				}

			}

			if (blob.configs instanceof Array) {

				let configs = [];

				for (let bc = 0, bcl = blob.configs.length; bc < bcl; bc++) {
					configs.push(lychee.deserialize(blob.configs[bc]));
				}

				if (configs.length > 0) {
					this.configs = configs.filter(asset => asset !== null);
				}

			}


			let stash = lychee.deserialize(blob.stash);
			if (stash !== null) {
				this.stash = stash;
			}

		},

		serialize: function() {

			let data = _Flow.prototype.serialize.call(this);
			data['constructor'] = 'strainer.flow.Transcribe';


			let states = data['arguments'][0] || {};
			let blob   = data['blob'] || {};


			if (this.sandbox !== '')                   states.sandbox  = this.sandbox;
			if (Object.keys(this.settings).length > 0) states.settings = this.settings;


			if (this.stash !== null)     blob.stash   = lychee.serialize(this.stash);
			if (this.configs.length > 0) blob.configs = this.configs.map(lychee.serialize);
			if (this.sources.length > 0) blob.sources = this.sources.map(lychee.serialize);


			data['arguments'][0] = states;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setSandbox: function(sandbox) {

			sandbox = typeof sandbox === 'string' ? sandbox : null;


			if (sandbox !== null) {

				this.sandbox = sandbox;

				return true;

			}


			return false;

		},

		setSettings: function(settings) {

			settings = settings instanceof Object ? settings : null;


			if (settings !== null) {

				this.settings = settings;

				return true;

			}


			return false;

		}

	};


	return Composite;

});

