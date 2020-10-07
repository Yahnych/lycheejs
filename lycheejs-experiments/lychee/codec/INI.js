#!/usr/local/bin/lycheejs-helper env:node

const lychee  = require('/opt/lycheejs/libraries/crux/build/node/dist.js')(__dirname);
const sandbox = {};

lychee.init(null);
lychee.assimilate('./DATA.mjs', sandbox);


let pkg = new lychee.Package({
	id:  'lychee',
	url: '/libraries/lychee/lychee.pkg'
});

setTimeout(_ => pkg.load('codec.INI'), 250);

setTimeout(_ => {

	const DATA = sandbox.DATA;
	const INI  = lychee.export('lychee.codec.INI', sandbox);

	let blob  = INI.encode(DATA);
	let check = INI.decode(blob);

	console.info('INI.encode()');
	console.log(blob.toString('utf8'));

	console.info('INI.decode()');
	console.log(check);

	let diff = lychee.diff(DATA, check);
	if (diff === true) {

		console.error('CHECK not okay');

		console.warn('DATA');
		console.log(DATA);

		process.exit(1);

	} else {

		console.info('CHECK okay');

		process.exit(0);

	}

}, 500);

