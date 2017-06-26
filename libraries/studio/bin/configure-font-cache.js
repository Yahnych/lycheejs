#!/usr/local/bin/lycheejs-helper env:node

const _fs   = require('fs');
const _path = require('path');
const _ROOT = process.env.LYCHEEJS_ROOT || '/opt/lycheejs';

require(_ROOT + '/libraries/lychee/build/node/core.js')(_path.resolve(__dirname, '..'));



/*
 * HELPERS
 */

const _merge_font = function(family, styles) {

	let object = this[family] || null;
	if (object === null) {

		object = this[family] = {
			family: family,
			styles: styles
		};

	} else {

		styles.forEach(function(style) {

			if (object.styles.includes(style) === false) {
				object.styles.push(style);
			}

		});

	}

};



/*
 * IMPLEMENTATION
 */


if (_fs.existsSync(lychee.ROOT.project + '/.fc-cache') === true) {

	let buffer = null;

	try {
		buffer = _fs.readFileSync(lychee.ROOT.project + '/.fc-cache', 'utf8');
	} catch (err) {
	}


	if (buffer !== null) {

		let data = {};

		buffer.trim().split('\n').map(function(val) {
			return val.trim();
		}).filter(function(val) {
			return val !== '';
		}).forEach(function(line) {

			let tmp1   = line.split(':');
			let family = tmp1[0].trim() || null;
			let styles = [ 'normal' ];


			// XXX: This filters all foreign character sets
			if (family !== null && /^([A-Za-z0-9,\s]+)$/g.test(family) === false) {

				if (family.includes(',')) {

					family = family.split(',').filter(function(val) {
						return /^([A-Za-z0-9,\s]+)$/g.test(val);
					}).join(',');

					if (family === '') {
						family = null;
					}

				} else {

					family = null;

				}

			}


			if (family !== null) {

				if (tmp1.length >= 2) {

					let tmp2 = tmp1[1];
					if (tmp2.startsWith('style=')) {

						let check = tmp2.split('=')[1];
						if (/^Bold$/g.test(check)) {
							styles.push('bold');
						}

						if (/^Italic$/g.test(check)) {
							styles.push('italic');
						}

					}

				}


				if (family.includes(',')) {

					family.split(',').map(function(val) {
						return val.trim();
					}).forEach(function(family) {
						_merge_font.call(data, family, styles);
					});

				} else {

					_merge_font.call(data, family, styles);

				}

			}

		});


		data = Object.values(data).sort(function(a, b) {
			return a.family.localeCompare(b.family);
		});


		_fs.writeFileSync(
			lychee.ROOT.project + '/source/ui/entity/input/Font.json',
			JSON.stringify(data, null, '\t'),
			'utf8'
		);

	}

}


console.log(lychee.ROOT.project);

