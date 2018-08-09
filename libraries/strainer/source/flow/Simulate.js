
lychee.define('strainer.flow.Simulate').requires([
	'lychee.Package',
	'lychee.Stash',
	'lychee.event.Queue'
]).includes([
	'lychee.event.Flow'
]).exports(function(lychee, global, attachments) {

	const _Flow    = lychee.import('lychee.event.Flow');
	const _Package = lychee.import('lychee.Package');
	const _Queue   = lychee.import('lychee.event.Queue');
	const _Stash   = lychee.import('lychee.Stash');



	/*
	 * HELPERS
	 */

	const _resolve = function(identifier) {

		let pointer   = this;
		let namespace = identifier.split('.');
		let id        = namespace.pop();

		for (let n = 0, nl = namespace.length; n < nl; n++) {

			let name = namespace[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		let check = id.toLowerCase();
		if (check === id) {

			if (pointer[id] === undefined) {
				pointer[id] = {};
			}

			return pointer[id];

		} else {

			if (pointer[id] !== undefined) {
				return pointer[id];
			}

		}


		return null;

	};

	const _render_statistics = function(id, statistics) {

		let types = Object.keys(statistics);
		if (types.length > 0) {

			let is_valid = false;

			types.forEach(function(type) {

				let names = Object.keys(statistics[type]);
				if (names.length > 0) {

					// XXX: This will log the headline only when
					// it contains an actual statistics report
					if (is_valid === false) {
						console.log('strainer: SIMULATE-REVIEWS of "' + id + '":');
						is_valid = true;
					}


					names.forEach(function(name) {

						let obj   = statistics[type][name];
						let title = name;
						if (type === 'enums') {
							title = '#' + name;
						} else if (type === 'events') {
							title = '@' + name;
						} else if (type === 'methods') {
							title = name + '()';
						}


						let info  = title + ': ' + obj.results.ok + '/' + obj.results.all;

						if (obj._expect > 0) {
							info += ' (' + obj._expect + ' incomplete)';
						}

						if (obj.results.ok < obj.results.all || obj._expect > 0) {
							console.error('strainer: \t' + info);
						} else {
							console.log('strainer: \t' + info);
						}

					});

				}

			});

		}

	};

	const _simulate = function(settings, oncomplete) {

		console.log('strainer: SIMULATE-REVIEWS "' + settings.id + '"');


		let simulation = new lychee.Simulation(settings);


		lychee.setEnvironment(settings.environment);
		lychee.setSimulation(simulation);


		lychee.init(simulation, {
		}, function(sandboxes) {

			let remaining      = 0;
			let specifications = Object.keys(simulation.specifications);
			if (specifications.length > 0) {

				specifications.map(function(sid) {

					return {
						id:      sid,
						sandbox: _resolve.call(sandboxes, sid)
					};

				}).filter(function(entry) {

					let sandbox = entry.sandbox || null;
					if (sandbox !== null && typeof sandbox.evaluate === 'function') {
						return true;
					}

					return false;

				}).forEach(function(entry) {

					remaining++;

					entry.sandbox.evaluate(function(statistics) {
						_render_statistics(entry.id, statistics);
						remaining--;
					});

				});

				setInterval(function() {

					if (remaining === 0) {
						oncomplete(true);
					}

				}, 250);

			} else {

				oncomplete(true);

			}

		});

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


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

			}

		}, this);

		this.bind('trace-simulations', function(oncomplete) {

			// TODO: Trace simulations from package instance

			oncomplete(true);

		}, this);

		this.bind('check-simulations', function(oncomplete) {

			let cache   = this.__simulations;
			let pkg     = this.__pkg;
			let sandbox = this.sandbox;

			if (pkg !== null && sandbox !== '') {

				console.log('strainer: CHECK-SIMULATIONS ' + sandbox);


				let simulations = pkg.buffer.review.simulations || null;
				if (simulations !== null) {

					for (let id in simulations) {

						let raw      = simulations[id];
						let settings = {
							id: id
						};


						let env = raw.environment || null;
						if (env !== null) {

							let pkgs = raw.environment.packages;
							if (pkgs instanceof Object) {

								for (let ns in pkgs) {

									let url = pkgs[ns];
									if (url === './lychee.pkg') {
										url = sandbox + '/lychee.pkg';
									}

									pkgs[ns] = url;

								}

							}


							settings.environment = new lychee.Environment(raw.environment);

							let target = raw.target || null;
							if (target !== null) {
								settings.target = target;
								cache.push(settings);
							}

						}

					}

				}

			}


			if (cache.length > 0) {

				let env   = lychee.environment;
				let queue = new _Queue();

				queue.bind('update', _simulate, this);

				queue.bind('complete', function() {

					lychee.setEnvironment(env);
					lychee.setSimulation(null);

					oncomplete(true);

				}, this);

				queue.bind('error', function() {

					lychee.setEnvironment(env);
					lychee.setSimulation(null);

					oncomplete(true);

				}, this);

				cache.forEach(function(entry) {
					queue.then(entry);
				});

				queue.init();

			} else {
				oncomplete(true);
			}

		}, this);



		/*
		 * FLOW
		 */

		this.then('read-package');

		this.then('trace-simulations');
		this.then('check-simulations');

	};


	Composite.prototype = {

		deserialize: function(blob) {

			if (blob.simulations instanceof Object) {
			}

			let stash = lychee.deserialize(blob.stash);
			if (stash !== null) {
				this.stash = stash;
			}

		},

		serialize: function() {

			let data = _Flow.prototype.serialize.call(this);
			data['constructor'] = 'strainer.flow.Simulate';


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

