
lychee.define('fertilizer.event.flow.html.Build').includes([
	'fertilizer.event.Flow'
]).exports(function(lychee, global, attachments) {

	const _Flow     = lychee.import('fertilizer.event.Flow');
	const _APPCACHE = attachments['appcache'];
	const _HTML     = attachments['html'];



	/*
	 * HELPERS
	 */

	const _build_index = function(stuff) {

		let buffer = stuff.buffer;
		if (buffer === '') {
			buffer = '' + _HTML.buffer;
		}


		let url = stuff.url;
		if (url === './index.html') {

			let env     = this.__environment;
			let profile = this.__profile;

			if (env !== null && profile !== null) {
				stuff.buffer = buffer.replaceObject({
					blob:    env.serialize(),
					id:      env.id,
					profile: profile
				});
			}

		} else {

			// TODO: Search intelligently somehow!?!?

		}

	};

	const _create_meta_appcache = function() {

		let stuff = lychee.deserialize(lychee.serialize(_APPCACHE));
		if (stuff !== null) {
			stuff.url = './index.appcache';
		}

		return stuff;

	};

	const _create_meta_index = function() {

		let stuff = lychee.deserialize(lychee.serialize(_HTML));
		if (stuff !== null) {
			stuff.url = './index.html';
		}

		return stuff;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		_Flow.call(this, states);

		states = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('build-assets', function(oncomplete) {

			let action  = this.action;
			let project = this.project;

			if (action !== null && project !== null) {

				console.log('fertilizer: ' + action + '/BUILD-ASSETS "' + project + '"');


				let meta_appcache = this.assets.filter(asset => asset.url.endsWith('/index.appcache')) || null;
				if (meta_appcache !== null) {
					meta_appcache = _create_meta_appcache.call(this);
					this.assets.push(meta_appcache);
				}

				let meta_index = this.assets.filter(asset => asset.url.endsWith('/index.html')) || null;
				if (meta_index !== null) {
					meta_index = _create_meta_index.call(this);
					_build_index.call(this, meta_index);
					this.assets.push(meta_index);
				} else {
					_build_index.call(this, meta_index);
				}

				oncomplete(true);

			} else {
				oncomplete(true);
			}

		}, this);



		/*
		 * FLOW
		 */

		// this.then('configure-project');

		this.then('read-package');
		this.then('read-assets');
		this.then('read-assets-crux');

		this.then('build-environment');
		this.then('build-assets');
		this.then('write-assets');
		this.then('build-project');

		// this.then('package-runtime');
		// this.then('package-project');

	};


	Composite.prototype = {

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Flow.prototype.serialize.call(this);
			data['constructor'] = 'fertilizer.event.flow.html.Build';


			return data;

		}


	};


	return Composite;

});

