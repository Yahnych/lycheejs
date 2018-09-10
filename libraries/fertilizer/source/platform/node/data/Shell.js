
lychee.define('fertilizer.data.Shell').tags({
	platform: 'node'
}).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			global.require('child_process');
			global.require('fs');
			global.require('path');

			return true;

		} catch (err) {
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _child_process = require('child_process');
	const _fs            = require('fs');
	const _path          = require('path');
	const _ROOT          = lychee.ROOT.lychee;



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.root = typeof states.root === 'string' ? states.root : null;

		this.__root  = _ROOT;
		this.__stack = [];



		/*
		 * INITIALIZATION
		 */

		if (this.root !== null) {

			let tmp1 = _path.normalize(this.root);
			let tmp2 = _ROOT;
			if (tmp1.startsWith('/')) {
				tmp2 = _ROOT + tmp1;
			} else if (tmp1.startsWith('./')) {
				tmp2 = _ROOT + tmp1.substr(1);
			}

			if (tmp2.endsWith('/')) {
				tmp2 = tmp2.substr(0, tmp2.length - 1);
			}

			this.__root = tmp2;

		}

		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.stack instanceof Array) {

				for (let s = 0, sl = blob.stack.length; s < sl; s++) {
					this.__stack.push(blob.stack[s]);
				}

			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.root !== null) states.root = this.root.substr(_ROOT.length);


			if (this.__stack.length > 0) {
				blob.stack = this.__stack.map(lychee.serialize);
			}


			return {
				'constructor': 'fertilizer.data.Shell',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		info: function(path) {

			path = typeof path === 'string' ? path : null;


			if (path === null) {
				return null;
			} else if (path.charAt(0) !== '/') {
				path = '/' + path;
			}


			let resolved = _path.normalize(this.__root + path);
			if (resolved !== null) {

				try {

					let stat1 = _fs.lstatSync(resolved);
					if (stat1.isSymbolicLink()) {

						let tmp   = _fs.realpathSync(resolved);
						let stat2 = _fs.lstatSync(tmp);

						return {
							type:  stat2.isFile() ? 'file' : 'directory',
							mtime: new Date(stat2.mtime.toUTCString())
						};

					} else {

						return {
							type:  stat1.isFile() ? 'file' : 'directory',
							mtime: new Date(stat1.mtime.toUTCString())
						};

					}

				} catch (err) {
				}

			}


			return null;

		},

		exec: function(command, callback, scope) {

			command  = typeof command === 'string'  ? command  : null;
			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			if (command !== null) {

				let args  = command.split(' ').slice(1);
				let cmd   = command.split(' ')[0];
				let file  = _ROOT + (cmd.charAt(0) !== '/' ? '/' : '') + cmd;
				let stack = this.__stack;

				let path = file.split('/').slice(0, -1).join('/');
				if (path.endsWith('/bin')) {
					path = path.split('/').slice(0, -1).join('/');
				}


				if (file.endsWith('.js')) {

					args.reverse();
					args.push(file);
					args.push('env:node');
					args.reverse();

					file = _ROOT + '/bin/helper.sh';

				}


				if (callback !== null) {

					try {

						_child_process.execFile(file, args, {
							cwd: path
						}, function(error, stdout, stderr) {

							stack.push({
								args:   args,
								file:   file,
								path:   path,
								stdout: stdout.toString(),
								stderr: stderr.toString()
							});


							if (error) {
								callback.call(scope, false);
							} else {
								callback.call(scope, true);
							}

						});

					} catch (err) {

						callback.call(scope, false);

					}


					return true;

				}

			}


			return false;

		},

		trace: function(limit, callback) {

			limit    = typeof limit === 'number'    ? (limit | 0) : null;
			callback = callback instanceof Function ? callback    : null;


			let stack = this.__stack;
			if (limit !== null) {
				stack = stack.reverse().slice(0, limit).reverse();
			} else {
				stack = stack.slice(0);
			}


			if (callback !== null) {
				callback(stack);
			} else {
				return stack;
			}

		}

	};


	return Composite;

});

