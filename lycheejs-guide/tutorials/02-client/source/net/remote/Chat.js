
lychee.define('app.net.remote.Chat').includes([
	'lychee.net.remote.Chat'
]).exports(function(lychee, global, attachments) {

	const _Chat = lychee.import('lychee.net.remote.Chat');



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(remote) {

		_Chat.call(this, 'chat', remote, {
			limit: 1337 // allows 1337 users
		});

	};


	Composite.prototype = {

	};


	return Composite;

});

