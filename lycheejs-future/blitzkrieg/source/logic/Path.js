
lychee.define('game.logic.Path').exports(function(lychee, game, global, attachments) {

	/*
	 * HELPERS
	 */

	let _MAX_SPEED = 10;
	let _MIN_SPEED = 1 / _MAX_SPEED;

	let _approximate_distance = function(suggestion, node) {

		let sx = suggestion.x;
		let sy = suggestion.y;

		let px = node.position.x;
		let py = node.position.y;

		if (sy % 2 === 1) {
			sx += 0.5;
		}

		if (py % 2 === 1) {
			px += 0.5;
		}


		let dx = px - sx;
		let dy = py - sy;


		return Math.sqrt(dx * dx + dy * dy);

	};

	let _real_distance = function(suggestion, node) {

		// TODO: speed integration
		let speed = 1;


		if (speed < _MIN_SPEED) {

			return Infinity;

		} else {

			let sx = suggestion.x;
			let sy = suggestion.y;

			let px = node.position.x;
			let py = node.position.y;

			if (sy % 2 === 1) {
				sx += 0.5;
			}

			if (py % 2 === 1) {
				px += 0.5;
			}


			let dx = px - sx;
			let dy = py - sy;


			return Math.sqrt(dx * dx + dy * dy) / speed;

		}

	};

	let _node = function(parent, position) {

		this.id       = position.x + 'x' + position.y;
		this.f        = 0;
		this.g        = 0;

		this.parent   = parent;
		this.position = position;

	};

	let _get_suggestions = function(position) {

		let suggestions = [];
		let logic       = this.logic;

		if (logic !== null) {

			let objects  = logic.getSurrounding(position, 'objects');
			let terrains = logic.getSurrounding(position, 'terrain');

			for (let i = 0, l = terrains.length; i < l; i++) {

				let object  = objects[i];
				let terrain = terrains[i];

				if (object === null) {

					if (terrain !== null && terrain.isFree()) {

						let tileposition = logic.toTilePosition(terrain.position, 'terrain');

						suggestions.push({
							x: tileposition.x,
							y: tileposition.y
						});

					}

				}

			}

		}


		return suggestions;

	};

	let _refresh_path = function() {

		let result = [];
		let logic  = this.logic;

		if (logic !== null) {

			let start = new _node(null, this.origin,   logic.get(this.origin,   'terrain'));
			let stop  = new _node(null, this.position, logic.get(this.position, 'terrain'));

			let dx = Math.abs(this.position.x - this.origin.x);
			let dy = Math.abs(this.position.y - this.origin.y);
			if (dx === 0 && dy === 0) {
				return result;
			}


			// This is enough for performance reasons, can be width * height of map
			let limit   = 200 * 200;
			let visited = {};
			let open    = [ start ];
			let closed  = [];


			let length = 0;

			while ((length = open.length)) {

				let max = limit;
				let min = -1;


				for (let o = 0; o < length; o++) {

					if (open[o].f < max) {
						max = open[o].f;
						min = o;
					}

				}


				var tmp;
				let node = open.splice(min, 1)[0];
				if (node.id === stop.id) {

					closed.push(node);
					tmp = node;


					while (tmp !== null) {

						result.push({
							x: tmp.position.x,
							y: tmp.position.y
						});

						tmp = tmp.parent;

					}


					visited = {};
					open    = [];
					closed  = [];

					result.reverse();

				} else {

					let suggestions = _get_suggestions.call(this, node.position);
					for (let s = 0, sl = suggestions.length; s < sl; s++) {

						tmp = new _node(node, suggestions[s]);

						if (visited[tmp.id] !== 1) {

							tmp.g = node.g + _real_distance(suggestions[s], node);
							tmp.f = tmp.g  + _approximate_distance(suggestions[s], stop);

							visited[tmp.id] = 1;
							open.push(tmp);

						}

					}

					closed.push(node);

				}

			}

		}


		return result;

	};



	/*
	 * IMPLEMENTATION
	 */

	let Class = function(data) {

		let settings = lychee.extend({}, data);

		this.logic    = null;

		this.buffer   = [];
		this.origin   = { x: 0, y: 0 };
		this.position = { x: 0, y: 0 };


		this.setLogic(settings.logic);
		this.setOrigin(settings.origin);
		this.setPosition(settings.position);


		settings = null;

	};


	Class.prototype = {

		setLogic: function(logic) {
			this.logic = logic;
			return true;
		},

		setOrigin: function(origin) {

			origin = origin instanceof Object ? origin : null;


			if (origin !== null) {

				this.origin.x = typeof origin.x === 'number' ? origin.x : this.origin.x;
				this.origin.y = typeof origin.y === 'number' ? origin.y : this.origin.y;

				return true;

			}


			return false;

		},

		setPosition: function(position) {

			position = position instanceof Object ? position : null;


			if (position !== null) {

				this.position.x = typeof position.x === 'number' ? position.x : this.position.x;
				this.position.y = typeof position.y === 'number' ? position.y : this.position.y;

				this.buffer = _refresh_path.call(this);


				return true;

			}


			return false;

		}

	};


	return Class;

});

