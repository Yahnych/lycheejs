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
setTimeout(_ => pkg.load('event.Flow'), 250);

setTimeout(_ => {

	const DATA = { unique: 'object' };
	const Flow = lychee.export('lychee.event.Flow', sandbox);

	let count  = 0;
	let expect = 0;


	setTimeout(_ => {

		expect += 4;

		let flow = new Flow();

		flow.bind('step-1', (data, oncomplete) => {

			if (data === DATA) {
				count++;
			}

			oncomplete(true);

		}, this);

		flow.bind('step-2', oncomplete => {

			count++;

			oncomplete(true);

		}, this);

		flow.bind('step-3', (data, oncomplete) => {

			if (data === DATA) {
				count++;
			}

			oncomplete(false);

		}, this);

		flow.bind('step-4', _ => {
			// XXX: Nothing to do
		}, this);

		flow.bind('error', event => {

			if (event === 'step-3') {
				count++;
			}

		});

		flow.bind('complete', _ => {
			// XXX: Nothing to do
		});

		flow.then('step-1', [ DATA ]);
		flow.then('step-2');
		flow.then('step-3', [ DATA ]);
		flow.then('step-4');


		flow.init();

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

