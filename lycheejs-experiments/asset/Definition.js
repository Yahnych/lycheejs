
lychee.define('my.Definition').exports((lychee, global, attachments) => {

	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({
			foo: null,
			bar: 'qux'
		}, data);


		this.foo = null;

		this.setFoo(states.foo);

		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let states = data['arguments'][0] || {};
			let blob   = data['blob'] || {};


			if (this.foo !== null) states.foo = this.foo;


			return {
				constructor: 'my.Definition',
				arguments:   [ states ],
				blob:        null
			};

		},



		/*
		 * CUSTOM API
		 */

		setFoo: function(foo) {

			foo = typeof foo === 'string' ? foo : null;


			if (foo !== null) {

				this.foo = foo;

				return true;

			}


			return false;

		}

	};


	return Composite;

});
