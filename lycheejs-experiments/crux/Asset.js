#!/usr/local/bin/lycheejs-helper env:node

const lychee = require('/opt/lycheejs/libraries/crux/build/node/dist.js')(__dirname);

lychee.init(null);


let count    = 0;
let expect   = 0;
const ROOT   = lychee.environment.resolve(__dirname + '/..');
const ASSETS = [
	{ url: ROOT + '/asset/Config.json', type: Config  },
	{ url: ROOT + '/asset/Config.pkg',  type: Config  },
	{ url: ROOT + '/asset/Font.fnt',    type: Font    },
	{ url: ROOT + '/asset/Music.msc',   type: Music   },
	{ url: ROOT + '/asset/Sound.snd',   type: Sound   },
	{ url: ROOT + '/asset/Texture.png', type: Texture }
];


setTimeout(_ => {

	expect += ASSETS.length;

	ASSETS.forEach(raw => {

		let asset = new lychee.Asset(raw.url);
		let Type  = raw.type;

		if (asset instanceof Type) {
			count++;
		}

	});

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

