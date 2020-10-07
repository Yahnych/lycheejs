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

setTimeout(_ => {

	const DATA    = { unique: 'object' };
	const Emitter = lychee.export('lychee.event.Emitter', sandbox);

	let count  = 0;
	let expect = 0;


	setTimeout(_ => {

		expect += 5;

		let emitter = new Emitter();

		emitter.bind('simple', data => {

			if (data === DATA) {
				count++;
			}

			emitter.unbind('simple');

			let check1 = emitter.has('simple');
			if (check1 === false) {
				count++;
			}

			let check2 = emitter.has('simple', null, null);
			if (check2 === false) {
				count++;
			}


		}, this);

		let check1 = emitter.has('simple');
		if (check1 === false) {
			count++;
		}

		let check2 = emitter.has('simple', null, null);
		if (check2 === true) {
			count++;
		}


		emitter.trigger('simple', [ DATA ]);

	}, 0);


	setTimeout(_ => {

		expect += 6;

		let emitter_foo = new Emitter();
		let emitter_bar = new Emitter();

		emitter_foo.bind('advanced', data => {

			if (data === DATA) {
				count++;
			}

		}, this);


		let check1 = emitter_foo.has('advanced');
		if (check1 === false) {
			count++;
		}

		let check2 = emitter_foo.has('advanced', null, null);
		if (check2 === true) {
			count++;
		}


		emitter_foo.transfer('advanced', emitter_bar);


		let check3 = emitter_bar.has('advanced');
		if (check3 === true) {
			count++;
		}

		let check4 = emitter_bar.has('advanced', null, null);
		if (check4 === true) {
			count++;
		}


		emitter_foo.trigger('advanced', [ DATA ]);
		emitter_bar.trigger('advanced', [ DATA ]);

	}, 250);


	setTimeout(_ => {

		expect += 6;

		let emitter_qux = new Emitter();
		let emitter_doo = new Emitter();


		emitter_qux.bind('publish', data => {

			if (data === DATA) {
				count++;
			}

		}, this);


		let check1 = emitter_qux.has('publish');
		if (check1 === false) {
			count++;
		}

		let check2 = emitter_qux.has('publish', null, null);
		if (check2 === true) {
			count++;
		}


		emitter_doo.publish('publish', emitter_qux);


		let check3 = emitter_doo.has('publish');
		if (check3 === false) {
			count++;
		}

		let check4 = emitter_doo.has('publish', null, null);
		if (check4 === true) {
			count++;
		}


		emitter_qux.trigger('publish', [ DATA ]);
		emitter_doo.trigger('publish', [ DATA ]);

	}, 500);


	setTimeout(_ => {

		expect += 6;

		let emitter_qux = new Emitter();
		let emitter_doo = new Emitter();


		emitter_qux.bind('subscribe', data => {

			if (data === DATA) {
				count++;
			}

		}, this);


		let check1 = emitter_qux.has('subscribe');
		if (check1 === false) {
			count++;
		}

		let check2 = emitter_qux.has('subscribe', null, null);
		if (check2 === true) {
			count++;
		}


		emitter_qux.subscribe('subscribe', emitter_doo);


		let check3 = emitter_doo.has('subscribe');
		if (check3 === false) {
			count++;
		}

		let check4 = emitter_doo.has('subscribe', null, null);
		if (check4 === true) {
			count++;
		}


		emitter_qux.trigger('subscribe', [ DATA ]);
		emitter_doo.trigger('subscribe', [ DATA ]);

	}, 750);


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

	}, 1000);

}, 500);

