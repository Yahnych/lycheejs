
const _console = {

	log: function() {

		let str = '';

		for (let a = 0, al = arguments.length; a < al; a++) {

			let data = arguments[a];
			if (data instanceof Array) {
				str += JSON.stringify(data, null, '\t');
			} else if (data instanceof Object) {
				str += JSON.stringify(data, null, '\t');
			} else if (data !== undefined) {
				str += (data).toString();
			}

			str += ' ';

		}


		global.log.call(global, str);

	}
};



/*
 * EXPORTS
 */

var console = _console;

