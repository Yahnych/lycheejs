
lychee.define('fertilizer.Main').requires([
	'fertilizer.event.flow.Build',
	'fertilizer.event.flow.Configure',
	'fertilizer.event.flow.Fertilize',
	'fertilizer.event.flow.Package'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	const _flow      = lychee.import('fertilizer.event.flow');
	const _lychee    = lychee.import('lychee');
	const _Build     = lychee.import('fertilizer.event.flow.Build');
	const _Configure = lychee.import('fertilizer.event.flow.Configure');
	const _Emitter   = lychee.import('lychee.event.Emitter');
	const _Fertilize = lychee.import('fertilizer.event.flow.Fertilize');
	const _Package   = lychee.import('fertilizer.event.flow.Package');
	const _Queue     = lychee.import('lychee.event.Queue');



	/*
	 * HELPERS
	 */

	const _create_flows = function(data, queue) {

		queue = queue instanceof _Queue ? queue : new _Queue();



		let platform = data.target.split('/').shift() || null;
		if (platform !== null) {

			let action = data.action;
			if (action === 'fertilize') {

				if (_flow[platform] !== undefined && _flow[platform].Fertilize !== undefined) {
					queue.then(new _flow[platform].Fertilize(data));
				} else {
					queue.then(new _Fertilize(data));
				}

			} else if (action === 'configure') {

				if (_flow[platform] !== undefined && _flow[platform].Configure !== undefined) {
					queue.then(new _flow[platform].Configure(data));
				} else {
					queue.then(new _Configure(data));
				}

			} else if (action === 'build') {

				if (_flow[platform] !== undefined && _flow[platform].Build !== undefined) {
					queue.then(new _flow[platform].Build(data));
				} else {
					queue.then(new _Build(data));
				}

			} else if (action === 'package') {

				if (_flow[platform] !== undefined && _flow[platform].Package !== undefined) {
					queue.then(new _flow[platform].Package(data));
				} else {
					queue.then(new _Package(data));
				}

			}

		}


		return queue;

	};

	const _init_queue = function(queue) {

		queue.bind('update', function(flow) {

			console.log('fertilizer: FLOW');
			console.log(flow.project, flow.target);

		}, this);

		queue.bind('complete', function(flow) {

			console.log('fertilizer: ALL COMPLETE');

		}, this);

		queue.bind('error', function(event) {

			console.log('fertilizer: NAO ERROR ' + event);

		}, this);

		queue.init();

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(states) {

		this.settings = _lychee.assignunlink({
			action:  null,
			debug:   false,
			project: null,
			target:  null
		}, states);

		this.defaults = _lychee.assignunlink({
			action:  null,
			debug:   false,
			project: null,
			target:  null
		}, this.settings);


		let debug = this.settings.debug;
		if (debug === true) {
			console.log('fertilizer.Main: Parsed settings are ...');
			console.log(this.settings);
		}


		_Emitter.call(this);

		states = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function() {

			let project = this.settings.project || null;
			if (project !== null) {

				lychee.ROOT.project                           = _lychee.ROOT.lychee + project;
				lychee.environment.global.lychee.ROOT.project = _lychee.ROOT.lychee + project;

				this.trigger('init');

			} else {

				console.error('fertilizer: FAILURE ("' + project + '") at "load" event.');

				this.destroy(1);

			}

		}, this, true);

		this.bind('init', function() {

			let action  = this.settings.action  || null;
			let debug   = this.settings.debug   || false;
			let project = this.settings.project || null;
			let target  = this.settings.target  || null;

			if (action !== null && project !== null && target !== null) {

				let queue = _create_flows({
					action:  action,
					debug:   debug,
					project: project,
					target:  target
				});

				_init_queue.call(this, queue);

			} else if (action !== null && project !== null) {

				let pkg = new _Package({
					url:  project + '/lychee.pkg',
					type: 'build'
				});


				setTimeout(function() {

					let targets = pkg.getEnvironments().map(env => env.id);
					if (targets.length > 0) {

						let queue = new _Queue();

						targets.forEach(target => {

							_create_flows({
								action:  action,
								debug:   debug,
								project: project,
								target:  target
							}, queue);

						});

						_init_queue.call(this, queue);

					} else {

						this.destroy(0);

					}

				}.bind(this), 200);

			}

		}, this, true);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'fertilizer.Main';


			let states = _lychee.assignunlink({}, this.settings);
			let blob   = data['blob'] || {};


			data['arguments'][0] = states;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * MAIN API
		 */

		init: function() {

			let action  = this.settings.action  || null;
			let project = this.settings.project || null;
			let target  = this.settings.target  || null;

			if (action !== null && project !== null && target !== null) {

				this.trigger('load');

				return true;

			}


			return false;

		},

		destroy: function(code) {

			code = typeof code === 'number' ? code : 0;


			this.trigger('destroy', [ code ]);

			return true;

		}

	};


	return Composite;

});

