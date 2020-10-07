#!/usr/local/bin/lycheejs-helper env:node

const lychee  = require('/opt/lycheejs/libraries/crux/build/node/dist.js')(__dirname);
const sandbox = {};

lychee.init(null);
lychee.assimilate('./DATA.mjs', sandbox);


let pkg = new lychee.Package({
	id:  'lychee',
	url: '/libraries/lychee/lychee.pkg'
});

setTimeout(_ => pkg.load('codec.BENCODE'), 250);

setTimeout(_ => {

	const BENCODE = lychee.export('lychee.codec.BENCODE', sandbox);
	const DATA    = sandbox.DATA;

	let blob  = BENCODE.encode(DATA);
	let check = BENCODE.decode(blob);

	console.info('BENCODE.encode()');
	console.log(blob.toString('utf8'));

	console.info('BENCODE.decode()');
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

