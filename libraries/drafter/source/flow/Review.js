
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

		deserialize: function(blob) {

			_Flow.prototype.deserialize.call(this, blob);

		},

		serialize: function() {

			let data = _Flow.prototype.serialize.call(this);
			data['constructor'] = 'drafter.flow.Review';


			return data;

		}

	};


	return Composite;

});

