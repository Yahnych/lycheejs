#!/usr/local/bin/lycheejs-helper env:node

const lychee = require('/opt/lycheejs/libraries/crux/build/node/dist.js')(__dirname);
require('/opt/lycheejs/libraries/lychee/build/node/dist/index.js');


(function(lychee, global) {

	lychee.init(null);
	lychee.inject(lychee.ENVIRONMENTS['/libraries/lychee/dist']);


	setTimeout(_ => {

		const Server = lychee.import('lychee.net.Server');
		const JSON   = lychee.import('lychee.codec.JSON');

		let server = new Server({
			codec: JSON,
			host:  'localhost',
			port:  1337,
			type:  Server.PROTOCOL.HTTP
		});

		server.bind('connect',    remote => console.log('REMOTE CONNECTED ' + remote.host + ':' + remote.port), this);
		server.bind('disconnect', remote => console.log('REMOTE DISCONNECTED ' + remote.host + ':' + remote.port), this);

		server.connect();

	}, 250);

})(lychee, typeof global !== 'undefined' ? global : this);

