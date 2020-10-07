#!/usr/local/bin/lycheejs-helper env:node

const lychee  = require('/opt/lycheejs/libraries/crux/build/node/dist.js')(__dirname);
const sandbox = {
	require: path => global.require(path)
};

lychee.init(null);
lychee.assimilate('./DATA.mjs', sandbox);


let pkg = new lychee.Package({
	id:  'lychee',
	url: '/libraries/lychee/lychee.pkg'
});

setTimeout(_ => pkg.load('crypto.CRC32'), 250);
setTimeout(_ => pkg.load('event.Emitter'), 250);
setTimeout(_ => pkg.load('Stash', { platform: 'node' }), 250);

setTimeout(_ => {

	const Stash = lychee.export('lychee.Stash', sandbox);
	const CRC32 = lychee.export('lychee.crypto.CRC32', sandbox);
	const DATA  = sandbox.DATA;

	let stash = new Stash();

	stash.read([
		'/libraries/crux/build/node/dist.js'
	], assets => {

		assets.forEach(asset => {

			let hash = new CRC32();
			hash.update(asset.buffer);

			let digest = hash.digest().toString('hex');

			console.log(asset.url, digest);

		});


		let result = true;

		DATA.entries.forEach(entry => {

			let input = entry.input;
			let check = entry.crc32;

			let hash = new CRC32();
			hash.update(input);

			let output = hash.digest().toString('hex');
			if (output === check) {
				console.info('"' + input + '" -> "' + output + '"');
			} else {
				console.error('"' + input + '" -> "' + output + '"');
				result = false;
			}

		});

		setTimeout(_ => {

			if (result === true) {

				console.info('CHECK okay');
				process.exit(0);

			} else {

				console.error('CHECK not okay');
				process.exit(1);

			}

		}, 1000);

	});

}, 750);

