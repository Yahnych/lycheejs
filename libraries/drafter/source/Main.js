
lychee.define('drafter.Main').requires([
	'drafter.flow.Review',
	'drafter.flow.Source'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	const _lychee  = lychee.import('lychee');
	const _Emitter = lychee.import('lychee.event.Emitter');
	const _flow    = lychee.import('drafter.flow');



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(states) {

		this.settings = _lychee.assignunlink({
			action:     null,
			identifier: null,
			project:    null,
			pkg:        null,
			type:       null
		}, states);

		this.defaults = _lychee.assignunlink({
			action:     null,
			identifier: null,
			project:    null,
			pkg:        null,
			type:       null
		}, this.settings);


		_Emitter.call(this);

		states = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function() {

			let action     = this.settings.action     || null;
			let project    = this.settings.project    || null;
			let identifier = this.settings.identifier || null;


			if (project !== null && action !== null && identifier !== null) {

				lychee.ROOT.project                           = _lychee.ROOT.lychee + project;
				lychee.environment.global.lychee.ROOT.project = _lychee.ROOT.lychee + project;


				this.trigger('init', [ project, action, identifier ]);

			} else {

				console.error('drafter: FAILURE ("' + project + '") at "load" event');


				this.destroy(1);

			}

		}, this, true);

		this.bind('init', function(project, action, identifier) {

			let flow = null;
			let name = action.charAt(0).toUpperCase() + action.substr(1);

			if (_flow[name] !== undefined) {

				flow = new _flow[name]({
					sandbox:  project,
					settings: this.settings
				});

			}


			if (flow !== null) {

				flow.bind('complete', function() {

					console.info('drafter: SUCCESS ("' + project + '")');

					this.destroy(0);

				}, this);

				flow.bind('error', function(event) {

					console.error('drafter: FAILURE ("' + project + '") at "' + event + '" event');

					this.destroy(1);

				}, this);


				flow.init();

			}


			return true;

		}, this, true);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'drafter.Main';


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

			this.trigger('load');

			return true;

		},

		destroy: function(code) {

			code = typeof code === 'number' ? code : 0;


			this.trigger('destroy', [ code ]);

			return true;

		}

	};


	return Composite;

});

