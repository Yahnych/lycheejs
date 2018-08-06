#!/usr/local/bin/lycheejs-helper env:node


const _fs    = require('fs');
const _path  = require('path');
const _ROOT  = process.env.LYCHEEJS_ROOT || '/opt/lycheejs';
const lychee = require(_ROOT + '/libraries/crux/build/node/dist.js')(_ROOT);



/*
 * PRELOAD
 */

const _PROJECT_ROOT = (function(project_flag) {

	let root = null;

	if (project_flag.startsWith('--project=')) {

		let path = project_flag.substr(10);
		if (path.startsWith('/libraries')) {

			let tmp = path.split('/');
			if (tmp.length >= 3) {
				root = tmp.slice(0, 3).join('/');
			}

		} else if (path.startsWith('/projects')) {

			let tmp = path.split('/');
			if (tmp.length >= 3) {
				root = tmp.slice(0, 3).join('/');
			}

		}

	}

	return root;

})(process.argv[2] || '--project=/.');



/*
 * USAGE
 */

const _print_autocomplete = function(action, identifier, type, flag) {

	let actions = [ 'review', 'source' ];
	let flags   = [ '--debug'          ];
	let types   = [ '--type=Callback', '--type=Composite', '--type=Module' ];

	let tmp            = (identifier || '').split('.');
	let suggestions    = [];
	let has_action     = actions.find(a => a === action);
	let has_identifier = (tmp.length > 0 && /[A-Z]/g.test(tmp[tmp.length - 1].charAt(0))) ? identifier : undefined;
	let has_flag       = flags.find(f => f === flag);
	let has_type       = types.find(t => t === type);

	if (has_action && has_identifier && has_type && has_flag) {
		// Nothing to suggest
	} else if (has_action && has_identifier && has_type && flag) {
		suggestions = flags.filter(f => f.startsWith(flag));
	} else if (has_action && has_identifier && has_type) {
		suggestions = flags;
	} else if (has_action && has_identifier && type) {
		suggestions = types.filter(t => t.startsWith(type));
	} else if (has_action && has_identifier) {
		suggestions = types;
	} else if (has_action && identifier) {

		let pkg = _SETTINGS.pkg || null;
		if (pkg !== null) {

			let definitions = pkg.getDefinitions();
			let identifier  = tmp.slice(1).join('.');

			if (definitions.length > 0) {
				suggestions.push.apply(suggestions, definitions.filter(d => d.startsWith(identifier)).map(id => pkg.id + '.' + id));
			}

		}

	} else if (has_action) {

		let pkg  = _SETTINGS.pkg || null;
		let root = _PROJECT_ROOT;

		if (pkg !== null && root !== null) {

			let definitions = pkg.getDefinitions();
			if (definitions.length > 0) {
				suggestions.push.apply(suggestions, definitions.map(id => pkg.id + '.' + id));
			}

		}

	} else if (action) {
		suggestions = actions.filter(a => a.startsWith(action));
	} else {
		suggestions = actions;
	}

	return suggestions.sort();

};

const _print_help = function() {

	console.log('                                                                 ');
	console.info('lychee.js ' + lychee.VERSION + ' Drafter');
	console.log('                                                                 ');
	console.log('Usage: lycheejs-drafter [Action] [Identifier] [Flag]             ');
	console.log('                                                                 ');
	console.log('                                                                 ');
	console.log('Available Actions:                                               ');
	console.log('                                                                 ');
	console.log('    review, source                                               ');
	console.log('                                                                 ');
	console.log('Available Flags:                                                 ');
	console.log('                                                                 ');
	console.log('    --debug    Enable debug messages.                            ');
	console.log('    --type     Callback, Composite or Module.                    ');
	console.log('                                                                 ');
	console.log('Examples:                                                        ');
	console.log('                                                                 ');
	console.log('    cd /projects/my-project;                                     ');
	console.log('                                                                 ');
	console.log('    # Automatically inherit type from namespace                  ');
	console.log('    lycheejs-drafter source app.ui.entity.Example;               ');
	console.log('                                                                 ');
	console.log('    # Override type (drops support for lychee.js Studio)         ');
	console.log('    lycheejs-drafter source app.ui.entity.Example --type=Module; ');
	console.log('                                                                 ');
	console.log('    # Automatically inherit type from namespace                  ');
	console.log('    lycheejs-drafter review app.ui.entity.Example;               ');
	console.log('                                                                 ');
	console.log('    # Override type (drops support for lychee.js Studio)         ');
	console.log('    lycheejs-drafter review app.ui.entity.Example --type=Module; ');
	console.log('                                                                 ');

};

const _bootup = function(settings) {

	console.info('BOOTUP (' + process.pid + ')');


	lychee.ROOT.project = lychee.ROOT.lychee + '/libraries/drafter';

	lychee.init(null);
	lychee.pkg('build', 'node/main', function(environment) {

		lychee.init(environment, {
			debug:   settings.debug === true,
			sandbox: settings.debug === true ? false : true
		}, function(sandbox) {

			if (sandbox !== null) {

				let lychee  = sandbox.lychee;
				let drafter = sandbox.drafter;


				// Show less debug messages
				lychee.debug = true;


				// This allows using #MAIN in JSON files
				sandbox.MAIN = new drafter.Main(settings);

				sandbox.MAIN.bind('destroy', function() {
					process.exit(0);
				});

				sandbox.MAIN.init();


				const _on_process_error = function() {
					sandbox.MAIN.destroy();
					process.exit(1);
				};

				process.on('SIGHUP',  _on_process_error);
				process.on('SIGINT',  _on_process_error);
				process.on('SIGQUIT', _on_process_error);
				process.on('SIGABRT', _on_process_error);
				process.on('SIGTERM', _on_process_error);
				process.on('error',   _on_process_error);
				process.on('exit',    function() {});

			} else {

				console.error('BOOTUP FAILURE');

				process.exit(1);

			}

		});

	});

};

const _SETTINGS = (function() {

	let args     = process.argv.slice(2).filter(val => val !== '');
	let settings = {
		action:  null,
		debug:   false,
		pkg:     null,
		project: null,
		type:    null
	};


	let action     = args.find(val => /^(review|source)$/g.test(val));
	let identifier = args.find(val => val.includes('.') && /^([A-Za-z0-9.]+)$/g.test(val));
	let debug_flag = args.find(val => /--([debug]{5})/g.test(val));
	let type_flag  = args.find(val => /--([type]{4})/g.test(val));


	if (action === 'review' || action === 'source') {

		if (_PROJECT_ROOT !== null) {

			settings.action     = action;
			settings.identifier = identifier;


			try {

				let stat1 = _fs.lstatSync(_ROOT + _PROJECT_ROOT);
				let stat2 = _fs.lstatSync(_ROOT + _PROJECT_ROOT + '/lychee.pkg');

				if (stat1.isSymbolicLink()) {

					let tmp   = _fs.realpathSync(_ROOT + _PROJECT_ROOT);
					let stat3 = _fs.lstatSync(tmp);
					let stat4 = _fs.lstatSync(tmp + '/lychee.pkg');

					if (stat3.isDirectory() && stat4.isFile()) {

						lychee.init(null);

						settings.pkg = new lychee.Package({
							url:  _PROJECT_ROOT + '/lychee.pkg',
							type: 'source'
						});

					}

				} else if (stat1.isDirectory()) {

					if (stat2.isFile()) {

						lychee.init(null);

						settings.pkg = new lychee.Package({
							url:  _PROJECT_ROOT + '/lychee.pkg',
							type: 'source'
						});

					}

				}

			} catch (err) {
			}

		}

	}


	if (_PROJECT_ROOT !== null) {
		settings.project = _PROJECT_ROOT;
	}


	if (debug_flag !== undefined) {
		settings.debug = true;
	}

	if (type_flag !== undefined) {

		if (type_flag.startsWith('--type=')) {

			let tmp = type_flag.substr(7);
			if (tmp.startsWith('"')) {
				tmp = tmp.substr(1);
			}

			if (tmp.endsWith('"')) {
				tmp = tmp.substr(0, tmp.length - 1);
			}

			settings.type = tmp;

		}

	}


	return settings;

})();


setTimeout(_ => {

	if (process.argv.includes('--autocomplete')) {

		let tmp1   = process.argv.indexOf('--autocomplete');
		let words  = process.argv.slice(tmp1 + 1);
		let result = _print_autocomplete.apply(null, words);

		process.stdout.write(result.join(' '));

		process.exit(0);
		return;

	}


	(function(settings) {

		/*
		 * IMPLEMENTATION
		 */

		let action     = settings.action     || null;
		let identifier = settings.identifier || null;
		let project    = settings.project    || null;
		let type       = settings.type       || null;

		if (action !== null && project !== null) {

			_bootup({
				action:     action,
				identifier: identifier,
				debug:      settings.debug === true,
				project:    project,
				type:       type
			});

		} else {

			console.error('PARAMETERS FAILURE');

			_print_help();

			process.exit(1);

		}

	})(_SETTINGS);

}, 200);

