#!/usr/local/bin/lycheejs-helper env:node

const lychee = require('/opt/lycheejs/libraries/crux/build/node/dist.js')(__dirname);
require('/opt/lycheejs/libraries/lychee/build/node/dist/index.js');


(function(lychee, global) {

	lychee.init(null);
	lychee.inject(lychee.ENVIRONMENTS['/libraries/lychee/dist']);


	setTimeout(_ => {

		const Client = lychee.import('lychee.net.Client');
		const JSON   = lychee.import('lychee.codec.JSON');

		let client = new Client({
			codec: JSON,
			host:  'localhost',
			port:  1337,
			type:  Client.PROTOCOL.WS
		});

		client.bind('connect',    _ => console.log('CLIENT CONNECTED'), this);
		client.bind('disconnect', _ => console.log('CLIENT DISCONNECTED'), this);

		client.connect();

	}, 250);

})(lychee, typeof global !== 'undefined' ? global : this);

