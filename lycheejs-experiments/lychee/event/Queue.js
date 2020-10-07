#!/usr/local/bin/lycheejs-helper env:node

const lychee  = require('/opt/lycheejs/libraries/crux/build/node/dist.js')(__dirname);
const sandbox = {
	require: path => global.require(path)
};

lychee.init(null);


let pkg = new lychee.Package({
	id:  'lychee',
	url: '/libraries/lychee/lychee.pkg'
});

setTimeout(_ => pkg.load('event.Emitter'), 250);
setTimeout(_ => pkg.load('event.Queue'), 250);

setTimeout(_ => {

	const DATA  = { unique: 'object' };
	const Queue = lychee.export('lychee.event.Queue', sandbox);

	let count  = 0;
	let expect = 0;


	setTimeout(_ => {

		expect += 4;

		let queue = new Queue();


		queue.bind('update', (data, oncomplete) => {

			if (data === DATA) {
				count++;
			}

			if (count === 3) {
				oncomplete(false);
			} else {
				oncomplete(true);
			}

		}, this);

		queue.bind('error', _ => {
			count++;
		});

		queue.bind('complete', _ => {
			// XXX: Nothing to do
		});

		queue.then(DATA);
		queue.then(DATA);
		queue.then(DATA);

		queue.init();

	}, 0);


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

	}, 250);

}, 500);

