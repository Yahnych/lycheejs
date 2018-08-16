
lychee.define('harvester.mod.Server').tags({
	platform: 'html'
}).requires([
	'harvester.data.Project'
]).supports(function(lychee, global) {

	return true;

}).exports(function(lychee, global, attachments) {

	const _Project = lychee.import('harvester.data.Project');



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'harvester.mod.Server',
				'arguments': []
			};

		},



		/*
		 * CUSTOM API
		 */

		can: function(project) {

			project = project instanceof _Project ? project : null;


			if (project !== null) {
				return false;
			}


			return false;

		},

		process: function(project) {

			project = project instanceof _Project ? project : null;


			if (project !== null) {
				return false;
			}


			return false;

		}

	};


	return Module;

});

