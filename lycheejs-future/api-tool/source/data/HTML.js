
lychee.define('tool.data.HTML').exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	const _Stream = function(buffer, mode) {

		this.__buffer = typeof buffer === 'string'        ? buffer : '';
		this.__mode   = lychee.enumof(_Stream.MODE, mode) ? mode   : 0;

		this.__index  = 0;

	};

	_Stream.MODE = {
		read:  0,
		write: 1
	};

	_Stream.prototype = {

		toString: function() {
			return this.__buffer;
		},

		pointer: function() {
			return this.__index;
		},

		length: function() {
			return this.__buffer.length;
		},

		read: function(bytes) {

			let buffer = '';

			buffer       += this.__buffer.substr(this.__index, bytes);
			this.__index += bytes;

			return buffer;

		},

		search: function(array) {

			let bytes = Infinity;

			for (let a = 0, al = array.length; a < al; a++) {

				let token = array[a];
				let size  = this.__buffer.indexOf(token, this.__index + 1) - this.__index;
				if (size > -1 && size < bytes) {
					bytes = size;
				}

			}


			if (bytes === Infinity) {
				return -1;
			}


			return bytes;

		},

		seek: function(bytes) {
			return this.__buffer.substr(this.__index, bytes);
		},

		write: function(buffer) {

			this.__buffer += buffer;
			this.__index  += buffer.length;

		}

	};



	/*
	 * ENCODER and DECODER
	 */

	const _encode_inline = function(entities) {

		let text = '';


		entities.forEach(function(entity) {

			if (entity.token === 'Code') {

				text += ' <code>' + entity.value + '</code> ';

			} else if (entity.token === 'Text') {

				if (entity.value.match(/\.|,|\?|!/g)) {

					text += entity.value;

				} else {

					if (entity.type === 'bold') {
						text += ' <b>' + entity.value + '</b> ';
					} else if (entity.type === 'italic') {
						text += ' <i>'  + entity.value + '</i> ';
					} else {
						text += ' ' + entity.value;
					}

				}

			} else if (entity.token === 'Image') {

				text += ' <img src="' + entity.value + '" alt="' + entity.type + '"> ';

			} else if (entity.token === 'Link') {

				text += ' <a href="' + entity.value + '">' + entity.type + '</a> ';

			}

		});


		return text.trim();

	};

	const _encode = function(stream, data) {

		let open = false;


		for (let d = 0, dl = data.length; d < dl; d++) {

			let entity = data[d];

			if (entity.token === 'Article') {

				if (open === true) {
					stream.write('</article>');
				}


				stream.write('\n');
				stream.write('<article id="' + entity.value + '">');
				stream.write('\n\n');

				open = true;

			} else if (entity.token === 'Headline') {

				stream.write('<h' + entity.type + '>');
				stream.write(entity.value);
				stream.write('</h' + entity.type + '>');
				stream.write('\n\n');

			} else if (entity.token === 'Code') {

				stream.write('<pre>\n');
				stream.write('<code class="' + entity.type + '">\n');
				stream.write(entity.value);
				stream.write('\n');
				stream.write('</code>\n');
				stream.write('</pre>');
				stream.write('\n\n');

			} else if (entity.token === 'List') {

				stream.write('<ul>\n');
				stream.write(entity.value.map(function(val) {
					return '\t<li>' + _encode_inline(val) + '</li>\n';
				}).join(''));
				stream.write('</ul>');
				stream.write('\n\n');

			} else if (entity.token === 'Paragraph') {

				stream.write('<p>');
				stream.write(_encode_inline(entity.value));
				stream.write('</p>');
				stream.write('\n\n');

			}

		}


		if (open === true) {
			stream.write('</article>\n');
		}


	};

	const _decode_inline = function(text) {

		console.info(text);

		return text;

	};

	const _decode = function(stream) {

		let value  = undefined;
		let seek   = '';
		let size   = 0;
		let tmp    = 0;
		let errors = 0;
		let check  = null;


		let entity = {
			token: null,
			type:  null,
			value: null
		};


		let count = 0;

		while (errors === 0 && stream.pointer() < stream.length()) {

			size = stream.search('<');

			if (size !== -1) {

				// content of last entity
				tmp = stream.read(size);

				if (entity.token !== null) {
					entity.value = tmp.trim();
				}


				size = stream.search('>');
				stream.read(1);
				tmp  = stream.read(size - 1);
				stream.read(1);


				check = tmp.substr(0, 1);

				if (check !== '/') {

					seek = tmp.split(' ')[0];

					if (seek === 'article') {

						entity.token = 'Article';
						entity.value = tmp.split('id=')[1].replace(/"/g, '');

						// console.log(entity);

					} else if (seek === 'pre') {

						console.log(seek);

					} else {

						console.log(seek);

					}



					// TODO: Read entity token and type

				} else {

					// TODO: Close last entity

				}


				// console.log(tmp);


			}

			count++;

			if (count > 200) break;

		}


		return value;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'tool.data.HTML',
				'blob':      null
			};

		},

		encode: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				let stream = new _Stream('', _Stream.MODE.write);

				_encode(stream, data);

				return stream.toString();

			}


			return null;

		},

		decode: function(data) {

			data = typeof data === 'string' ? data : null;


			if (data !== null) {

				let stream = new _Stream(data, _Stream.MODE.read);
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

