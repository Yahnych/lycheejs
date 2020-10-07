
lychee.define('tool.Main').requires([
	'tool.data.HTML',
	'tool.data.MD',
	'tool.API'
]).includes([
	'lychee.app.Main'
]).tags({
	platform: 'html'
}).supports(function(lychee, global) {

	if (global.location instanceof Object && typeof global.location.hash === 'string') {

		if (typeof global.onhashchange !== 'undefined') {
			return true;
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	let _API_CACHE       = {};
	let _SRC_CACHE       = {};
	let _DATA            = {};
	const _api           = lychee.import('tool.API');
	const _ui            = global.ui;
	const _Main          = lychee.import('lychee.app.Main');
	const _API           = lychee.import('tool.API');
	const _HTML          = lychee.import('tool.data.HTML');
	const _MD            = lychee.import('tool.data.MD');



	/*
	 * HACKS BECAUSE FUCKING JAVASCRIPT IDIOTS
	 */

	(function(global) {

		global.onhashchange = function() {

			let elements  = [].slice.call(document.querySelectorAll('article:nth-of-type(1) table a'));
			let reference = global.location.hash.split('!')[1].split('#');

			elements.forEach(function(element) {
				element.classList.remove('active');
			});


			// Example: #!lychee.Debugger#methods-expose
			// reference[0] = 'lychee.Debugger';
			// reference[1] = 'methods-expose';


			_DATA.reference[0] = reference[0];
			_DATA.reference[1] = reference[1];


			_render_view('api', reference[0], reference[1]);

		};

	})(global);



	/*
	 * HELPERS
	 */

	const _load_documents = function() {

		_DATA.api.forEach(function(path) {

			let identifier = 'lychee.' + path.split('/').join('.');
			if (path.substr(0, 4) === 'core') {
				identifier = path === 'core/lychee' ? 'lychee' : 'lychee.' + path.split('/').pop();
			}

			let stuff = new Stuff('./lychee_api_docs/' + path + '.md');

			stuff.onload = function(result) {
				_API_CACHE[identifier] = this.buffer;
			};

			stuff.load();

		});


		_DATA.src.filter(function(path) {

			if (path.substr(0, 8) === 'platform') {
				return path.substr(0, 13) === 'platform/html';
			}

			return true;

		}).forEach(function(path) {

			let identifier = 'lychee.' + path.split('/').join('.');
			if (path.substr(0, 8) === 'platform') {
				identifier = 'lychee.' + path.split('/').slice(2).join('.');
			} else if (path.substr(0, 4) === 'core') {
				identifier = path === 'core/lychee' ? 'lychee' : 'lychee.' + path.split('/').pop();
			}


			let stuff = new Stuff('/libraries/lychee/source/' + path + '.js', true);

			stuff.onload = function(result) {
				_SRC_CACHE[identifier] = this.buffer;
			};

			stuff.load();

		});

	};

	const _walk_directory = function(files, node, path) {

		if (node instanceof Array) {

			if (node.indexOf('js') !== -1 || node.indexOf('md') !== -1) {
				files.push(path);
			}

		} else if (node instanceof Object) {

			Object.keys(node).forEach(function(child) {
				_walk_directory(files, node[child], path + '/' + child);
			});

		}

	};

	const _package_definitions = function(json) {

		let files = [];

		if (json !== null) {
			_walk_directory(files, json, '');
		}

		return files.map(function(value) {
			return value.substr(1);
		}).sort(function(a, b) {
			if (a > b) return  1;
			if (a < b) return -1;
			return 0;
		});

	};

	const _render_navi = function(data) {

		let code       = '';
		let documented = data.api.map(function(path) {

			if (path.substr(0, 4) === 'core') {
				return path === 'core/lychee' ? 'lychee' : 'lychee.' + path.split('/').pop();
			} else {
				return 'lychee.' + path.split('/').join('.');
			}

		});
		let definitions = data.src.map(function(path) {

			if (path.substr(0, 8) === 'platform') {
				return 'lychee.' + path.split('/').slice(2).join('.');
			} else if (path.substr(0, 4) === 'core') {
				return path === 'core/lychee' ? 'lychee' : 'lychee.' + path.split('/').pop();
			} else {
				return 'lychee.' + path.split('/').join('.');
			}

		}).unique().sort(function(a, b) {
			if (a > b) return  1;
			if (a < b) return -1;
			return 0;
		});


		code += '<tr><td>';
		code += '<ul class="select">';
		code += definitions.filter(function(id) {
			return documented.indexOf(id) !== -1;
		}).map(function(id) {
			return '<li><input type="radio" name="reference" value="' + id + '"><span>' + id + '</span></li>';
		}).join('');
		code += '</ul>';
		code += '</td></tr>';


		_ui.render(code, 'article:nth-of-type(1) table');
		_ui.render('Definitions (' + documented.length + '/' + definitions.length + ')', 'article:nth-of-type(1) h3');


		setTimeout(function() {

			let elements = [].slice.call(document.querySelectorAll('article:nth-of-type(1) table a'));
			let hash     = (location.hash.split('!')[1] || 'lychee').split('#')[0];
			let index    = elements.map(function(element) {
				return element.innerHTML;
			}).indexOf(hash);


			if (index !== -1) {
				elements[index].classList.add('active');
			}

		}, 200);

	};

	const _render_view = function(view, identifier, reference) {

		let code      = '';
		let markdown  = _API_CACHE[identifier] || '';
		let generated = new _API(identifier, _SRC_CACHE[identifier] || '').toMD();


		if (view === 'code') {
			markdown = _SRC_CACHE[identifier] || '';
		}


		if (markdown === '') {

			if (view === 'api') {

				code += '<article id="constructor">';
				code += '<pre><code class="javascript">' + identifier + ';</code></pre>';
				code += '<textarea>' + generated + '</textarea>';
				code += '</article>';


				_ui.render(code, 'article:nth-of-type(2) div');

			} else if (view === 'code') {

				code += '<pre><code class="javascript">\n\nconsole.log(\'No source code available.\');\n\n</code></pre>';


				_ui.render(code, 'article:nth-of-type(2) div');


			} else if (view === 'edit') {

				code += '<article id="constructor">';
				code += '<pre><code class="javascript">' + identifier + ';</code></pre>';
				code += '<textarea>' + (markdown || generated) + '</textarea>';
				code += '</article>';


				_ui.render(code, 'article:nth-of-type(2) div');

			}

		} else {

			if (view === 'api') {

				code += _HTML.encode(_MD.decode(markdown));


				_ui.render(code, 'article:nth-of-type(2) div');


				setTimeout(function() {

					let element = global.document.querySelector('#' + reference);
					if (element !== null) {

						element.scrollIntoView({
							block:     'start',
							behaviour: 'smooth'
						});

					}

				}, 200);

			} else if (view === 'code') {

				code += '<pre><code class="javascript">';
				code += markdown;
				code += '</pre></code>';


				_ui.render(code, 'article:nth-of-type(2) div');

			} else if (view === 'edit') {

				code += '<article id="constructor">';
				code += '<pre><code class="javascript">' + identifier + ';</code></pre>';
				code += '<textarea>' + (markdown || generated) + '</textarea>';
				code += '</article>';


				_ui.render(code, 'article:nth-of-type(2) div');

			}


			setTimeout(function() {

				let links = [].slice.call(global.document.querySelectorAll('a'));
				if (links.length > 0) {

					links.forEach(function(link) {

						let hash = (global.location.hash.split('!')[1] || 'lychee').split('#')[0];
						let href = link.getAttribute('href');
						if (href.substr(0, 1) !== '#') {
							href = '#!' + href;
						} else {
							href = '#!' + hash + href;
						}

						link.setAttribute('href', href);

					});

				}

			}, 0);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let settings = Object.assign({

			client:   null,
			input:    null,
			jukebox:  null,
			renderer: null,
			server:   null,

			viewport: {
				fullscreen: false
			}

		}, data);


		_Main.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function(oncomplete) {

			let config = new Config('/libraries/lychee/lychee.pkg');

			config.onload = function(result) {

				if (result === true) {

					_DATA = {
						api:       _package_definitions(this.buffer.api.files    || null),
						src:       _package_definitions(this.buffer.source.files || null),
						reference: (location.hash.split('!')[1] || 'lychee').split('#'),
						view:      'api'
					};


					oncomplete(true);

				} else {

					oncomplete(false);

				}

			};

			config.load();

		}, this);

		this.bind('init', function() {

			_render_navi(_DATA);
			_load_documents();

			setTimeout(function() {
				_render_view('api', _DATA.reference[0], _DATA.reference[1] || null);
			}, 1000);

		}, this, true);

		this.bind('api', function() {
			_render_view('api', _DATA.reference[0], _DATA.reference[1] || null);
		}, this);

		this.bind('code', function() {
			_render_view('code', _DATA.reference[0], _DATA.reference[1] || null);
		}, this);

		this.bind('edit', function() {
			_render_view('edit', _DATA.reference[0], _DATA.reference[1] || null);
		}, this);

		this.bind('download', function() {

			let id   = _DATA.reference[0] || '';
			let blob = _API_CACHE[id] || null;

			if (blob === null) {

				let textarea = document.querySelector('textarea');
				if (textarea !== null) {
					blob = _API_CACHE[id] = '\n' + textarea.value.trim() + '\n\n';
				}

			}


			let filename = id.split('.').pop() + '.md';
			let buffer   = new Buffer(blob, 'utf8');

			_API_CACHE[id] = blob;

			_ui.download(filename, buffer);

		}, this);

		this.bind('submit', function(id, settings) {

			if (id === 'settings') {

				let reference = settings.reference || null;
				if (reference !== null) {
					global.location.hash = '!' + reference;
				}

			}

		}, this);


		settings = null;

	};


	Composite.prototype = {

		deserialize: function(blob) {

			_Main.prototype.deserialize.call(this, blob);

		},

		serialize: function() {

			let data = _Main.prototype.serialize.call(this);
			data['constructor'] = 'tool.Main';


			return data;

		}


	};


	return Composite;

});
