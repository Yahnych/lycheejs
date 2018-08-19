
lychee.define('drafter.flow.Source').requires([
	'lychee.Definition',
	'lychee.Package',
	'lychee.Stash'
]).includes([
	'lychee.event.Flow'
]).exports(function(lychee, global, attachments) {

	const _Definition = lychee.import('lychee.Definition');
	const _Flow       = lychee.import('lychee.event.Flow');
	const _Package    = lychee.import('lychee.Package');
	const _Stash      = lychee.import('lychee.Stash');
	const _STASH      = new _Stash({
		type: _Stash.TYPE.persistent
	});



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.errors   = [];
		this.sandbox  = '';
		this.settings = {};
		this.stash    = new _Stash({
			type: _Stash.TYPE.persistent
		});

		this.__namespace = null;
		this.__packages  = {};


		this.setSandbox(states.sandbox);
		this.setSettings(states.settings);

		_Flow.call(this);

		states = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('read-package', function(oncomplete) {

			let sandbox = this.sandbox;
			if (sandbox !== '') {

				console.log('strainer: READ-PACKAGE ' + sandbox);

				if (sandbox !== '/libraries/lychee') {

					console.log('strainer: -> Mapping /libraries/lychee/lychee.pkg as "lychee"');

					this.__packages['lychee'] = new _Package({
						url:  '/libraries/lychee/lychee.pkg',
						type: 'source'
					});

				}


				let pkg = new _Package({
					url:  sandbox + '/lychee.pkg',
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

		this.bind('read-sources', function(oncomplete) {

			let identifier = this.settings.identifier || null;
			if (identifier !== null) {

				let tmp = identifier.split('.');
				let pkg = this.__packages[tmp[0]] || null;
				if (pkg !== null) {

					let id     = tmp.slice(1).join('.');
					let result = pkg.load(id);

					if (result === true) {

						setTimeout(function() {
							oncomplete(true);
						}, 100);

					} else {
						oncomplete(true);
					}

				} else {
					oncomplete(false);
				}

			} else {
				oncomplete(false);
			}

		}, this);

		this.bind('read-includes', function(oncomplete) {

			let identifier = this.settings.identifier || null;
			let definition = lychee.environment.definitions[identifier] || null;
			let stash      = this.stash;

			if (definition !== null && stash !== null) {

				let includes = definition._includes;
				if (includes.length > 0) {

					// includes.map(function(identifier) {

					// 	let tmp = identifier.split('.');

					// });



					// stash.bind('batch', function(type, assets) {

					// }, this, true);

					// stash.batch('read', definition._includes.map(function(value) {

					// }));

				} else {
					oncomplete(true);
				}

			} else if (identifier !== null && stash !== null) {

				let tmp        = identifier.split('.');
				let pkg_id     = tmp[0];
				let def_id     = tmp.pop();
				let candidates = [];

				let check = tmp[tmp.length - 1];
				if (check.charAt(0) !== check.charAt(0).toUpperCase()) {
					check = tmp[tmp.length - 1] = check.charAt(0).toUpperCase() + check.substr(1).toLowerCase();
				}

				if (pkg_id === 'app') {
					candidates.push('lychee.' + tmp.slice(0, tmp.length).join('.'));
				}

				if (tmp.length > 2) {
					candidates.push('lychee.' + tmp.slice(1, tmp.length).join('.'));
				}



				let pkg = this.__packages['lychee'] || null;
				if (pkg !== null) {

					let definitions = pkg.getDefinitions().map(function(id) {
						return 'lychee.' + id;
					});

					candidates = candidates.filter(function(id) {
						return definitions.includes(id);
					});


					let candidate = candidates[0] || null;
					if (candidate !== null) {

						// TODO: Create lychee.Definition instance
						// TODO: Set includes()
						// TODO: Write source from Definition afterwards
						console.log(candidate);

					} else {
						oncomplete(false);
					}

				} else {
					oncomplete(false);
				}

			} else {
				oncomplete(true);
			}

		}, this);

		this.bind('trace-includes', function(oncomplete) {
			// XXX: Trace API data of includes
			oncomplete(true);
		}, this);

		this.bind('write-source', function(oncomplete) {
			// XXX: Use strainer.transcribe(data)
			oncomplete(true);
		}, this);



		/*
		 * FLOW
		 */

		this.then('read-package');
		this.then('read-sources');

		this.then('read-includes');
		this.then('trace-includes');

		this.then('write-source');


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
			data['constructor'] = 'drafter.flow.Source';


			let states = data['arguments'][0] || {};
			let blob   = data['blob'] || {};


			if (this.sandbox !== '')                   states.sandbox  = this.sandbox;
			if (Object.keys(this.settings).length > 0) states.settings = this.settings;


			if (this.stash !== null) blob.stash = lychee.serialize(this.stash);


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

