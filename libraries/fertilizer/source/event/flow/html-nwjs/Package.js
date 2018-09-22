
lychee.define('fertilizer.event.flow.html-nwjs.Package').requires([
	'lychee.event.Queue'
]).includes([
	'fertilizer.event.Flow'
]).exports(function(lychee, global, attachments) {

	const _Flow   = lychee.import('fertilizer.event.Flow');
	const _Queue  = lychee.import('lychee.event.Queue');
	const _ASSETS = {
		linux: [
			'icudtl.dat',
			'natives_blob.bin',
			'nw',
			'nw_100_percent.pak',
			'nw_200_percent.pak',
			'resources.pak',
			'v8_context_snapshot.bin',
			'lib/libffmpeg.so',
			'lib/libnode.so',
			'lib/libnw.so',
			'locales/en-US.pak',
			'swiftshader/libEGL.so',
			'swiftshader/libGLESv2.so'
		]
	};



	/*
	 * HELPERS
	 */

	const _zip_assets = function(assets, oncomplete) {

		assets.forEach(asset => console.log(asset.url));

	};

	const _package_linux = function(arch, zip, oncomplete) {

		let project = this.project;
		let shell   = this.shell;
		let stash   = this.stash;
		let target  = this.target;

		if (project !== null && shell !== null && stash !== null && target !== null) {

			let prefix1 = project + '/build/' + target + '-linux-' + arch;
			let prefix2 = '/bin/runtime/html-nwjs/linux/' + arch;


			stash.bind('batch', function(type, binaries) {

				let files = binaries.concat(zip);
				let urls  = files.map(asset => {

					let url = asset.url;
					if (url.startsWith(prefix2)) {
						return prefix1 + url.substr(prefix2.length);
					} else if (url.startsWith('./')) {
						return prefix1 + url.substr(1);
					} else if (url.startsWith(project)) {
						return prefix1 + url.substr(project.length);
					}

					return url;

				});


				urls.forEach(url => console.log(url));

			}, this, true);

			stash.batch('read', _ASSETS.linux.map(file => {
				return prefix2 + '/' + file;
			}));




			// runtime.onload = function(result) {

			// 	if (result === true) {

			// 		stash.bind('batch', function(type, assets) {
			// 			oncomplete(true);
			// 		}, this, true);

			// 		stash.batch('write', urls, files);

			// 	} else {
			// 		oncomplete(false);
			// 	}

			// }.bind(this);

			// runtime.load();

		} else {
			oncomplete(false);
		}

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

		this.unbind('package-runtime');

		this.bind('package-runtime', function(oncomplete) {

			let action  = this.action;
			let project = this.project;
			let target  = this.target;

			if (action !== null && project !== null && target !== null) {

				console.log('fertilizer: ' + action + '/PACKAGE-RUNTIME "' + project + '"');


				let env = this.__environment;
				if (env !== null && env.variant === 'application') {

					let assets = this.assets.filter(asset => asset !== null && asset.buffer !== null);
					if (assets.length > 0) {

						_zip_assets.call(this, assets, function(zip) {

							let queue = new _Queue();

							queue.then({ name: 'Linux x86_64', method: _package_linux.bind(this, 'x86_64', zip) });
							// queue.then({ name: 'MacOS x86_64', method: _package.bind(this, 'macos', 'x86_64', zip) });

							queue.bind('update', function(entry, oncomplete) {

								entry.method(function(result) {

									if (result === true) {
										console.info('fertilizer: -> "' + entry.name + '" SUCCESS');
									} else {
										console.warn('fertilizer: -> "' + entry.name + '" FAILURE');
									}

									oncomplete(true);

								});

							}, this);

							queue.bind('complete', function() {
								oncomplete(true);
							}, this);

							queue.init();

						});

					}

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
			data['constructor'] = 'fertilizer.event.flow.html-nwjs.Package';


			return data;

		}

	};


	return Composite;

});

