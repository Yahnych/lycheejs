#!/usr/local/bin/lycheejs-helper env:node

const lychee  = require('/opt/lycheejs/libraries/crux/build/node/dist.js')(__dirname);
const sandbox = {};

lychee.init(null);
lychee.assimilate('./DATA.mjs', sandbox);


let pkg = new lychee.Package({
	id:  'lychee',
	url: '/libraries/lychee/lychee.pkg'
});

setTimeout(_ => pkg.load('codec.DIXY'), 250);

setTimeout(_ => {

	const DATA = sandbox.DATA;
	const DIXY = lychee.export('lychee.codec.DIXY', sandbox);

	let blob  = DIXY.encode(DATA);
	let check = DIXY.decode(blob);

	console.info('DIXY.encode()');
	console.log(blob.toString('utf8'));

	console.info('DIXY.decode()');
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

