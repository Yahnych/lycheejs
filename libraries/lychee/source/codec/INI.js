
lychee.define('lychee.codec.INI').exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	const _CHARS_SEARCH = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	const _CHARS_META   = {
		'\r': '',    // FUCK YOU, Microsoft!
		'\b': '\\b',
		'\t': '\\t',
		'\f': '\\f',
		'"':  '\\"',
		'\\': '\\\\'
	};

	const _format_date = function(n) {
		return n < 10 ? '0' + n : '' + n;
	};

	const _decode_value = function(chunk) {

		let seek = chunk.substr(0, 1);

		if (chunk === 'null') {

			return null;

		} else if (chunk === 'undefined') {

			return undefined;

		} else if (chunk === 'false') {

			return false;

		} else if (chunk === 'true') {

			return true;

		} else if (chunk === 'Infinity') {

			return Infinity;

		} else if (chunk === '-Infinity') {

			return -Infinity;

		} else if (chunk === 'NaN') {

			return NaN;

		} else if (/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})?(Z|\.([0-9]{3})Z)$/g.test(chunk) === true) {

			return new Date(chunk);

		} else if (seek === '-' || isNaN(parseInt(seek, 10)) === false) {

			if (chunk.indexOf('.') !== -1) {

				let tmp = parseFloat(chunk, 10);
				if (isNaN(tmp) === false && (tmp).toString() === chunk) {
					return tmp;
				}

			} else {

				let tmp = parseInt(chunk, 10);
				if (isNaN(tmp) === false && (tmp).toString() === chunk) {
					return tmp;
				}

			}

		}

		return _desanitize_string(chunk);

	};

	const _set_value = function(root, reference, value) {

		let pointer = root;

		let tmp = reference.split('.');

		for (let t = 0, tl = tmp.length; t < tl; t++) {

			let name = tmp[t];
			let next = tmp[t + 1] || null;

			if (/^([0-9]+)/g.test(name) === true) {
				name = parseInt(name, 10);
			}

			if (next !== null) {

				if (/^([0-9]+)/g.test(next) === true) {

					if (typeof pointer[name] === 'undefined') {
						pointer = pointer[name] = [];
					} else {
						pointer = pointer[name];
					}

				} else {

					if (typeof pointer[name] === 'undefined') {
						pointer = pointer[name] = {};
					} else {
						pointer = pointer[name];
					}

				}

			} else {

				pointer[name] = value;

			}

		}

	};

	const _resolve_reference = function(identifier) {

		let pointer = this;

		let ns = identifier.split('/');
		for (let n = 0, l = ns.length; n < l; n++) {

			let name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = pointer[name] = {};
			}

		}

		return pointer;

	};

	const _desanitize_string = function(san) {

		let str = san;

		// str = str.replace(/\\b/g, '\b');
		// str = str.replace(/\\f/g, '\f');
		str = str.replace(/\\t/g, '\t');
		str = str.replace(/\\\\/g, '\\');

		return str;

	};

	const _sanitize_string = function(str) {

		let san = str;

		if (_CHARS_SEARCH.test(san)) {

			san = san.replace(_CHARS_SEARCH, function(char) {

				let meta = _CHARS_META[char];
				if (meta !== undefined) {
					return meta;
				} else {
					return '\\u' + (char.charCodeAt(0).toString(16)).slice(-4);
				}

			});

		}

		return san;

	};



	/*
	 * STRUCTS
	 */

	const _Stream = function(buffer) {

		this.__buffer = typeof buffer === 'string' ? buffer : '';
		this.__index  = 0;

	};


	_Stream.prototype = {

		toString: function() {
			return this.__buffer;
		},

		write: function(buffer) {

			this.__buffer += buffer;
			this.__index  += buffer.length;

		}

	};



	/*
	 * ENCODER and DECODER
	 */

	const _encode_object_inline = function(stream, data, indent) {

		let keys = Object.keys(data);

		for (let k = 0, kl = keys.length; k < kl; k++) {

			let key = keys[k];
			let val = data[key];

			if (val instanceof Object) {

				_encode_object_inline(stream, val, indent + '.' + key);

			} else {

				stream.write(indent + '.' + key + '=');

				_encode(stream, val, '');

				stream.write('\n');

			}

		}

	};

	const _encode = function(stream, data, indent) {

		indent = typeof indent === 'string' ? indent : '';


		if (
			typeof data === 'boolean'
			|| data === null
			|| data === undefined
			|| (
				typeof data === 'number'
				&& (
					data === Infinity
					|| data === -Infinity
					|| isNaN(data) === true
				)
			)
		) {

			if (data === null) {
				stream.write('null');
			} else if (data === undefined) {
				stream.write('undefined');
			} else if (data === false) {
				stream.write('false');
			} else if (data === true) {
				stream.write('true');
			} else if (data === Infinity) {
				stream.write('Infinity');
			} else if (data === -Infinity) {
				stream.write('-Infinity');
			} else if (isNaN(data) === true) {
				stream.write('NaN');
			}

		// 123, 12.3: Integer or Float
		} else if (typeof data === 'number') {

			let type = 1;
			if (data < 268435456 && data !== (data | 0)) {
				type = 2;
			}


			// Negative value
			let sign = 0;
			if (data < 0) {
				data = -data;
				sign = 1;
			}


			if (sign === 1) {
				stream.write('-');
			}


			if (type === 1) {
				stream.write('' + data.toString());
			} else {
				stream.write('' + data.toString());
			}

		// "": String
		} else if (typeof data === 'string') {

			data = _sanitize_string(data);

			stream.write(data);

		} else if (data instanceof Date) {

			let str = '';

			str += data.getUTCFullYear()                + '-';
			str += _format_date(data.getUTCMonth() + 1) + '-';
			str += _format_date(data.getUTCDate())      + 'T';
			str += _format_date(data.getUTCHours())     + ':';
			str += _format_date(data.getUTCMinutes())   + ':';
			str += _format_date(data.getUTCSeconds())   + 'Z';

			stream.write(str);

		} else if (data instanceof Array) {

			for (let d = 0, dl = data.length; d < dl; d++) {

				let val = data[d];

				if (val instanceof Object) {

					_encode_object_inline(stream, val, (indent !== '' ? (indent + '.') : '') + d);

				} else {

					stream.write((indent !== '' ? (indent + '.') : '') + d + '=');

					_encode(stream, val);

					stream.write('\n');

				}

			}

		} else if (data instanceof Object && typeof data.serialize !== 'function') {

			let keys = Object.keys(data);

			for (let k = 0, kl = keys.length; k < kl; k++) {

				let key = keys[k];
				let val = data[key];

				if (
					val instanceof Object
					&& !(val instanceof Array)
					&& !(val instanceof Date)
				) {

					stream.write('\n');
					stream.write('[' + (indent !== '' ? (indent + '/') : '') + key + ']');
					stream.write('\n');

					_encode(stream, val, (indent !== '' ? (indent + '/') : '') + key);

				} else if (val instanceof Array) {

					_encode(stream, val, key);

				} else {

					stream.write(key + '=');
					_encode(stream, val);
					stream.write('\n');

				}

			}

		} else if (data instanceof Object && typeof data.serialize === 'function') {

			// TODO: Figure out a deserialize/serialize way
			// which does not require a nested for loop

		}

	};

	const _decode = function(stream) {

		let lines = stream.toString().split('\n');
		if (lines.length > 0) {

			let root = [];

			let check = lines.find(function(line) {
				return line.startsWith('[');
			}) !== undefined;

			if (check === true) {
				root = {};
			}


			let pointer = root;

			for (let l = 0, ll = lines.length; l < ll; l++) {

				let line = lines[l];
				if (line.trim() !== '') {

					if (line.startsWith('[') && line.endsWith(']')) {

						pointer = _resolve_reference.call(root, line.substr(1, line.length - 2));

					} else if (line.includes('=')) {

						let tmp = line.split('=');
						if (/^([A-Za-z0-9-_.]+)$/g.test(tmp[0])) {

							let value = _decode_value(tmp.slice(1).join('='));

							_set_value(pointer, tmp[0], value);

						} else {

							console.warn('NOPE!', tmp);

						}

					}

				}

			}


			return root;

		}


		return undefined;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'lychee.codec.INI',
				'blob':      null
			};

		},



		/*
		 * CUSTOM API
		 */

		encode: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				let stream = new _Stream('');

				_encode(stream, data, '');

				stream.write('\n');

				return Buffer.from(stream.toString(), 'utf8');

			}


			return null;

		},

		decode: function(data) {

			data = data instanceof Buffer ? data : null;


			if (data !== null) {

				let stream = new _Stream(data.toString('utf8'));
				let object = _decode(stream);
				if (object !== undefined) {
					return object;
				}

			}


			return null;

		}

	};


	return Module;

});

