#!/usr/local/bin/lycheejs-helper env:node

const lychee = require('/opt/lycheejs/libraries/crux/build/node/dist.js')(__dirname);

lychee.init(null);


let count  = 0;
let expect = 0;
let pkg    = new lychee.Package({
	url: '/libraries/lychee/lychee.pkg'
});


setTimeout(_ => {

	expect += 5;

	let check1 = pkg.id;
	if (check1 === 'lychee') {
		count++;
	}

	let check2 = pkg.resolve('app.Layer');
	if (check2[0] === 'app/Layer') {
		count++;
	}

	let check3 = pkg.resolve('Renderer', { platform: [ 'html', 'node' ] });
	if (check3.includes('platform/html/Renderer') && check3.includes('platform/node/Renderer')) {
		count++;
	}

	let check4 = pkg.getNamespaces();
	if (check4.includes('app.entity') && check4.includes('net.socket')) {
		count++;
	}

	let check5 = pkg.getNamespaces({ platform: [ 'html', 'node' ] });
	if (check5.includes('ui.entity') && check5.includes('net.socket')) {
		count++;
	}


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

