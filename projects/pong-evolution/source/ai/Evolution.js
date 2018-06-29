
lychee.define('game.ai.Evolution').requires([
	'game.ai.Agent'
]).exports(function(lychee, global, attachments) {

	const _Agent       = lychee.import('game.ai.Agent');
	const _GENERATIONS = [];



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.history    = 4;
		this.population = 16;


		this.setHistory(states.history);
		this.setPopulation(states.population);

		states = null;

	};


	Composite.prototype = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'constructor': 'game.ai.Evolution',
				'arguments': []
			};

		},



		/*
		 * CUSTOM API
		 */

		cycle: function() {

			let population   = [];
			let s_history    = this.history;
			let s_population = this.population;


			// No Generations available
			// - fast route, just generate a new plain one

			if (_GENERATIONS.length === 0) {

				for (let p = 0; p < s_population; p++) {

					// New Population
					// - each Agent's brain is random by default

					population.push(new _Agent());

				}

			} else {

				// Sort the current Population
				// - Higher fitness first (to 0)
				// - Lower fitness last (to length - 1)

				let current        = _GENERATIONS[_GENERATIONS.length - 1];
				let old_population = current.sort(function(agent_a, agent_b) {
					if (agent_a.fitness > agent_b.fitness) return -1;
					if (agent_a.fitness < agent_b.fitness) return  1;
					return 0;
				});


				let amount = (0.25 * s_population);

				// 25% Mutant Population
				// - new Agent() leads to randomized Brain
				for (let m = 0; m < amount; m++) {
					population.push(new _Agent());
				}


				// 25% Survivor Population
				// - Agent.clone() leads to unlinked clone
				// - this avoids coincidence of 1 Agent leading to multiple Entities

				for (let s = 0; s < amount; s++) {

					let agent = current[s];
					let clone = agent.clone();

					population.push(clone);

				}


				// 50% Breed Population
				// - best Agent by fitness can now breed
				// - Babies are the ones from dominant population

				for (let b = 0; b < amount; b++) {

					let mum = old_population[b];
					let dad = old_population[b + 1];


					let babies = mum.crossover(dad);

					population.push(babies[0]);
					population.push(babies[1]);

				}

			}


			// Track the Population
			// - just for the sake of Debugging, tbh.

			_GENERATIONS.push(population);


			// Optionally track more Generations
			// - in case something goes wrong
			// - set settings.history to higher value

			if (_GENERATIONS.length > s_history) {
				_GENERATIONS.splice(0, _GENERATIONS.length - s_history);
			}


			return population;

		},

		setHistory: function(history) {

			history = typeof history === 'number' ? history : null;


			if (history !== null) {

				this.history = history;

				return true;

			}


			return false;

		},

		setPopulation: function(population) {

			population = typeof population === 'number' ? population : null;


			if (population !== null) {

				this.population = population;

				return true;

			}


			return false;

		}

	};


	return Composite;

});

