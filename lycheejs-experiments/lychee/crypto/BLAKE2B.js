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

setTimeout(_ => pkg.load('crypto.BLAKE2B'), 250);

setTimeout(_ => {

	const BLAKE2B = lychee.export('lychee.crypto.BLAKE2B', sandbox);
	const DATA    = sandbox.DATA;

	let result = true;

	DATA.entries.forEach(entry => {

		let input = entry.input;
		let check = entry.blake2b;

		let hash = new BLAKE2B();
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

}, 500);

