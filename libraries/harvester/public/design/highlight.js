
(function(global, $) {

	const _LANGUAGES = {};

	_LANGUAGES['bash'] = _LANGUAGES['sh'] = {

		builtins: [

			'alias',
			'bind', 'break', 'builtin',
			'caller', 'cd', 'command', 'continue',
			'declare',
			'echo', 'enable', 'eval', 'exec', 'exit', 'export',
			'help',
			'getopts',
			'hash',
			'kill',
			'logout',
			'mapfile',
			'printf', 'pwd',
			'read', 'readarray', 'readonly',
			'shift', 'sleep', 'source', 'stat',
			'test', 'times', 'trap', 'type', 'typeset',
			'ulimit', 'umask', 'unalias', 'unset',
			'wait', 'which',

			'-a',
			'-d',
			'-e', '-eq',
			'-f',
			'-gt',
			'-l', '-lt',
			'-ne',
			'-s'

		],

		keywords: [
			'case',
			'do', 'done',
			'elif', 'else', 'esac',
			'fi', 'for', 'function',
			'if', 'in',
			'let', 'local',
			'return',
			'set', 'shopt',
			'then',
			'while'
		],

		literals: [
			'false',
			'true'
		],

		constants: {
			number: [
				new RegExp('((-?)(\\d+))', 'g')
			],
			string: [
				new RegExp('(\'(.*?)\')', 'g'),
				new RegExp('("([^"]+)")', 'g')
			]
		}

	};

	_LANGUAGES['ecmascript'] = _LANGUAGES['javascript'] = {

		builtins: [
			'Array', 'ArrayBuffer', 'arguments',
			'Boolean',
			'Date', 'DateView',
			'Error', 'EvalError', 'escape', 'eval',
			'Float32Array', 'Float64Array', 'Function',
			'Int8Array', 'Int16Array', 'Int32Array', 'InternalError', 'Intl', 'isFinite', 'isNaN',
			'JSON',
			'Map', 'Math',
			'Number',
			'Object',
			'Promise', 'Proxy', 'parseFloat', 'parseInt',
			'RangeError', 'Reflect', 'ReferenceError', 'RegExp',
			'Set', 'StopIteration', 'String', 'Symbol', 'SyntaxError',
			'TypeError',
			'Uint8Array', 'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'unescape',
			'WeakMap', 'WeakSet'
		],

		keywords: [
			'as', 'async', 'await',
			'break',
			'case', 'catch', 'const', 'continue',
			'debugger', 'default', 'delete', 'do',
			'else', 'export',
			'finally', 'for', 'from', 'function',
			'if', 'import', 'in', 'instanceof',
			'let',
			'new',
			'of',
			'return',
			'static', 'super', 'switch',
			'that', 'this', 'throw', 'try', 'typeof',
			'var', 'void',
			'while', 'with',
			'yield'
		],

		literals: [
			'false',
			'Infinity',
			'NaN', 'null',
			'true',
			'undefined'
		],

		constants: {
			number: [
				new RegExp('(0[bB][01]+?)', 'g'),
				new RegExp('(0[oO][0-7]+?)', 'g'),
				new RegExp('(0x[a-fA-F0-9]+)', 'g'),
				new RegExp('((-?)(\\d[eE][-+]?\\d+))', 'g'),
				new RegExp('((-?)(\\d.\\d+))', 'g'),
				new RegExp('((-?)(\\d+))', 'g')
			],
			string: [
				new RegExp('(\'(.*?)\')', 'g'),
				new RegExp('("([^"]+)")', 'g')
			]
		}

	};



	/*
	 * HELPERS
	 */

	const _replace_builtin = function(code, key) {

		let regexp = new RegExp('(\\s|\\(\\))(' + key + ')(\\s|\\(|\\)|,|;|\\.)', 'g');
		code = (' ' + code).replace(regexp, '$1<span class="ast-builtin ast-' + key.toLowerCase() + '">$2</span>$3');

		return code.substr(1);

	};

	const _replace_comment = function(code) {

		let i0 = code.indexOf('//');
		if (i0 === -1) i0 = code.indexOf('/*');
		if (i0 === -1) i0 = code.indexOf('*/');
		if (i0 === -1) i0 = code.indexOf('#');

		if (i0 !== -1) {
			code = code.substr(0, i0) + '<span class="ast-comment">' + code.substr(i0) + '</span>';
		} else if (code.trim().startsWith('* ') === true) {
			code = '<span class="ast-comment">' + code + '</span>';
		} else if (code.trim().startsWith('# ') === true) {
			code = '<span class="ast-comment">' + code + '</span>';
		}

		return code;

	};

	const _replace_literal = function(code, key) {

		let regexp = new RegExp('(\\s|\\(|\\))(' + key + ')(\\s|\\(|\\)|,|;|\\.)', 'g');
		code = (' ' + code + ' ').replace(regexp, '$1<span class="ast-literal ast-' + key.toLowerCase() + '">$2</span>$3');

		return code.substr(1, code.length - 2);

	};

	const _replace_keyword = function(code, key) {

		let regexp = new RegExp('(\\s|\\(|\\))(' + key + ')(\\s|\\(|\\)|,|;|\\.)', 'g');
		code = (' ' + code + ' ').replace(regexp, '$1<span class="ast-keyword ast-' + key.toLowerCase() + '">$2</span>$3');

		return code.substr(1, code.length - 2);

	};

	const _replace_constant = function(code, pattern, type) {

		let match = code.match(pattern);
		if (match !== null) {

			let tmp = match[0];
			if (tmp.includes('<') === false && tmp.includes('ast-') === false) {
				code = code.replace(pattern, '<span class="ast-constant ast-' + type + '">$1</span>');
			}

		}

		return code;

	};



	/*
	 * IMPLEMENTATION
	 */

	const highlight = function(code, lang) {

		let language = _LANGUAGES[lang] || null;
		if (language !== null) {

			Object.keys(language.constants).reverse().forEach(type => {

				language.constants[type].forEach(regexp => {
					code = _replace_constant(code, regexp, type);
				});

			});

			code = _replace_comment(code);

			language.builtins.forEach(builtin => {
				code = _replace_builtin(code, builtin);
			});

			language.literals.forEach(literal => {
				code = _replace_literal(code, literal);
			});

			language.keywords.forEach(keyword => {
				code = _replace_keyword(code, keyword);
			});

		}


		return code;

	};


	global.$highlight = highlight;

})(typeof window !== 'undefined' ? window : this, window.$);

