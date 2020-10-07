#!/usr/local/bin/lycheejs-helper env:node

const lychee  = require('/opt/lycheejs/libraries/crux/build/node/dist.js')(__dirname);
const sandbox = {};

lychee.init(null);
lychee.assimilate('./DATA.mjs', sandbox);


let pkg = new lychee.Package({
	id:  'lychee',
	url: '/libraries/lychee/lychee.pkg'
});

setTimeout(_ => pkg.load('codec.BITON'), 250);

setTimeout(_ => {

	const BITON = lychee.export('lychee.codec.BITON', sandbox);
	const DATA  = sandbox.DATA;

	let blob  = BITON.encode(DATA);
	let check = BITON.decode(blob);

	console.info('BITON.encode()');
	let tmp1 = Array.from(blob).map(v => (v).toString(2)).map(v => v.length < 8 ? ('00000000'.substr(0, 8 - v.length) + v) : v);
	let tmp2 = [];

	for (let t = 0, tl = tmp1.length; t < tl; t += 4) {

		let byte1 = tmp1[t]     || '';
		let byte2 = tmp1[t + 1] || '';
		let byte3 = tmp1[t + 2] || '';
		let byte4 = tmp1[t + 3] || '';

		tmp2.push(byte1 + ' ' + byte2 + ' ' + byte3 + ' ' + byte4);

	}

	tmp2.forEach(bytes => console.log(bytes));

	console.info('BITON.decode()');
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

