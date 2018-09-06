
lychee.define('breeder.Main').requires([
	'breeder.event.flow.Init',
	'breeder.Template'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	const _lychee   = lychee.import('lychee');
	const _Emitter  = lychee.import('lychee.event.Emitter');
	const _Init     = lychee.import('breeder.event.flow.Init');
	const _Template = lychee.import('breeder.Template');



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(states) {

		this.settings = _lychee.assignunlink({
			action:     null,
			debug:      false,
			identifier: null,
			project:    null,
			library:    null
		}, states);

		this.defaults = _lychee.assignunlink({
			action:     null,
			debug:      false,
			identifier: null,
			project:    null,
			library:    null
		}, this.settings);


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

				console.error('breeder: FAILURE ("' + project + '") at "load" event');

				this.destroy(1);

			}

		}, this, true);

		this.bind('init', function() {

			let debug      = this.settings.debug      || false;
			let action     = this.settings.action     || null;
			let library    = this.settings.library    || null;
			let project    = this.settings.project    || null;
			let identifier = this.settings.identifier || null;

			if (action !== null && project !== null) {

				let flow = null;

				if (action === 'init') {

					flow = new _Init({
						debug:      debug,
						identifier: identifier,
						project:    project
					});

				} else if (action === 'fork') {

					flow = new _Fork({
						debug:   debug,
						library: library,
						project: project
					});

				} else if (action === 'pull') {
				} else if (action === 'push') {
				}


				if (flow !== null) {

					flow.bind('complete', function() {

						if (lychee.debug === true) {
							console.info('breeder: SUCCESS ("' + project + '")');
						}

						this.destroy(0);

					}, this);

					flow.bind('error', function(event) {

						if (lychee.debug === true) {
							console.error('breeder: FAILURE ("' + project + '") at "' + event + '" template event');
						}

						this.destroy(1);

					}, this);

					flow.init();

				}

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
			data['constructor'] = 'breeder.Main';


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

			if (action !== null && project !== null) {

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

