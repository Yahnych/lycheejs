
lychee.define('game.net.client.Multiplayer').requires([
	'lychee.Storage'
]).includes([
	'lychee.net.Service'
]).exports(function(lychee, game, global, attachments) {

	/*
	 * HELPERS
	 */

	let _model = {
		id:       '127.0.0.1:1337',
		entities: [],
		time:     Date.now()
	};


	let _on_sync = function(data) {

	};

	let _on_multicast = function(data) {

	};



	/*
	 * IMPLEMENTATION
	 */

	let Class = function(client) {

		lychee.net.Service.call(this, 'highscore', client, lychee.net.Service.TYPE.client);


		this.storage = new lychee.Storage({
			id:    'blitzkrieg-multiplayer',
			model: _model
		});


		this.bind('sync',      _on_sync,      this);
		this.bind('multicast', _on_multicast, this);

	};


	Class.prototype = {

	};


	return Class;

});

