
lychee.define('fertilizer.event.flow.node.Package').includes([
	'fertilizer.event.Flow'
]).exports(function(lychee, global, attachments) {


	const _Flow  = lychee.import('fertilizer.event.Flow');
	const _INDEX = {
		linux:   attachments['index.sh'],
		macos:   attachments['index.sh'],
		windows: attachments['index.cmd']
	};



	/*
	 * HELPERS
	 */

	const _package_linux = function(arch) {

		let project = this.project;
		let shell   = this.shell;
		let target  = this.target;

		if (project !== null && shell !== null && target !== null) {

			shell.mkdir(project + '/build/' + target + '-linux');

			// TODO: Does it make sense to build this here via shell.copy()
			// ... wouldn't it be better to just write the asset to disk via stash.write()?

		}

	};

	const _package_macos = function(arch) {
	};

	const _package_windows = function(arch) {
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

		this.bind('package-runtime', function(oncomplete) {

			let action  = this.action;
			let project = this.project;
			let target  = this.target;

			if (action !== null && project !== null && target !== null) {

				console.log('fertilizer: ' + action + '/PACKAGE-RUNTIME "' + project + '"');


				let env = this.__environment;
				if (env !== null && env.variant === 'application') {

					// TODO: Figure out smarter way to write binaries to folder
					// using the lychee.Stash API + Stuff data type
					// also, binary concat via Shell possible!?

					let assets = this.assets.filter(asset => {
						console.log(asset.url);
						return false;
					});


					// _package_linux.call(this, 'arm');
					// _package_linux.call(this, 'x86_64');
					// _package_macos.call(this, 'x86_64');
					// _package_windows.call(this, 'x86_64');

					oncomplete(true);

				} else {
					console.log('fertilizer: -> Skipping "' + target + '".');
					oncomplete(true);
				}

			} else {
				oncomplete(false);
			}

		}, this);



		/*
		 * FLOW
		 */

		// this.then('configure-project');

		// this.then('read-package');
		// this.then('read-assets');
		// this.then('read-assets-crux');

		// this.then('build-environment');
		// this.then('build-assets');
		// this.then('write-assets');
		// this.then('build-project');

		this.then('package-runtime');
		this.then('package-project');

	};


	Composite.prototype = {

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Flow.prototype.serialize.call(this);
			data['constructor'] = 'fertilizer.event.flow.node.Package';


			return data;

		}

	};


	return Composite;

});

