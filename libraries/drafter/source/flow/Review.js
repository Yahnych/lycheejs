
lychee.define('drafter.flow.Review').includes([
	'lychee.event.Flow'
]).exports(function(lychee, global, attachments) {

	const _Flow = lychee.import('lychee.event.Flow');



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		_Flow.call(this);

		states = null;



		/*
		 * INITIALIZATION
		 */

	};


	Composite.prototype = {

	};


	return Composite;

});

