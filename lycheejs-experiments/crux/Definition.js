#!/usr/local/bin/lycheejs-helper env:node

const lychee  = require('/opt/lycheejs/libraries/crux/build/node/dist.js')(__dirname);
const sandbox = {
	require: path => global.require(path)
};

lychee.init(null);


let count  = 0;
let expect = 0;
const ROOT = lychee.environment.resolve(__dirname + '/..');


setTimeout(_ => {
	lychee.assimilate(ROOT + '/asset/Definition.js', sandbox);
}, 0);

setTimeout(_ => {

	expect += 2;

	let check1 = lychee.environment.definitions['my.Definition'];
	if (check1 instanceof lychee.Definition) {
		count++;
	}

	let Definition = lychee.export('my.Definition', sandbox);
	if (Definition !== null) {

		let instance = new Definition();
		if (instance instanceof Definition) {
			count++;
		}

	}

}, 250);

setTimeout(_ => {

	let result = count === expect;
	if (result === true) {

		console.info('CHECK okay');
		process.exit(0);

	} else {

		console.error('CHECK not okay');
		console.warn('-> ' + count + '/' + expect + ' okay.');
		process.exit(1);

	}

}, 500);

