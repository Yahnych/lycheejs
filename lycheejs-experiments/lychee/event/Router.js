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
setTimeout(_ => pkg.load('event.Router'), 250);

setTimeout(_ => {

	const DATA   = { unique: 'object' };
	const Router = lychee.export('lychee.event.Router', sandbox);

	let count  = 0;
	let expect = 0;


	setTimeout(_ => {

		expect += 3;

		let router = new Router();

		router.bind('/welcome', data => {

			if (data === DATA) {
				count++;
			}

		}, this);

		router.bind('/page/form', data => {

			if (data.secret === 'token2') {
				count++;
			}

		}, this);

		router.bind('/page/:id', data => {

			if (
				typeof data.id === 'number'
				&& data.secret === 'token1'
			) {
				count++;
			}

		}, this);

		router.trigger('/welcome',   [ DATA ]);
		router.trigger('/page/1',    [{ secret: 'token1' }]);
		router.trigger('/page/form', [{ secret: 'token2' }]);

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

