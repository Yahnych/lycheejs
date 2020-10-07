
lychee.define('game.logic.Pathfinder').requires([
	'game.model.Hitmap',
	'game.model.Level'
]).exports(function(lychee, global) {

	var _terrain  = game.model.Level.TERRAIN;
	var _default  = game.model.Level.GROUND['default'];
	var _blocking = game.model.Level.TERRAIN['blocking'];

	var Class = function(logic) {

		this.__ground  = null;
		this.__terrain = null;

		this.__sizeX = 0;
		this.__sizeY = 0;

	};


	Class.prototype = {

		reset: function(terrain, ground, sizeX, sizeY) {

			sizeX = typeof sizeX === 'number' ? sizeX : 0;
			sizeY = typeof sizeY === 'number' ? sizeY : 0;


			if (
				ground instanceof game.model.Hitmap
				&& terrain instanceof game.model.Hitmap
			) {

				this.__ground  = ground;
				this.__terrain = terrain;

			} else {
				throw "Pathfinder needs two valid game.model.Hitmap instances";
			}


			this.__cache = { x: 0, y: 0 };

			this.__sizeX = sizeX;
			this.__sizeY = sizeY;

		},

		getNearestPosition: function(from, to, hitmap) {

			if (hitmap == null || !hitmap instanceof game.model.Hitmap) {
				hitmap = this.__terrain;
			}


			var position = this.__cache;

			var x1, y1, x2, y2;

			x2 = Math.round(to.x);
			y2 = Math.round(to.y);

			if (hitmap.get(x2, y2) === _terrain['default']) {

				position.x = x2;
				position.y = y2;

			} else {

				x1 = Math.round(from.x);
				y1 = Math.round(from.y);


				var xInvert = x1 > x2;
				var yInvert = y1 > y2;
				var found   = false;

				for (
					var x = x2;
					xInvert === true ? x <= x1 : x >= x1;
					xInvert === true ? x++     : x--
				) {

					if (found === true) break;

					for (
						var y = y2;
						yInvert === true ? y <= y1 : y >= y1;
						yInvert === true ? y++     : y--
					) {

						if (hitmap.get(x, y) === _terrain['default']) {
							position.x = x;
							position.y = y;
							found = true;
							break;
						}

					}

				}

			}


			return position;

		},

		getPath: function(entity, from, to) {

			var start = this.__createNode(null, from);
			var goal  = this.__createNode(null, to);

			var distanceX = to.x - from.x;
			var distanceY = to.y - from.y;

			if (distanceX === 0 && distanceY === 0) {
				return null;
			}


			var limit = this.__sizeX * this.__sizeY;

			var alreadyVisited = {};
			var _open = [ start ];
			var _closed = [];

			var result = [];

			while(length = _open.length) {

				max = limit;
				min = -1;

				for (var o = 0; o < length; o++) {

					if (_open[o].f < max) {
						max = _open[o].f;
						min = o;
					}

				}


				var path;
				var node = _open.splice(min, 1)[0];

				if (node.value === goal.value) {

					_closed.push(node);
					path = _closed[_closed.length - 1];

					do {

						result.push({
							x:       path.x,
							y:       path.y,
							terrain: path.terrain
						});

					} while( path = path.parent );

					alreadyVisited = {};
					_open = [];
					_closed = [];

					result.reverse();

				} else {

					var successors = this.__successors(node.x, node.y);

					for (var s = 0, l = successors.length; s < l; s++) {

						path = this.__createNode(node, successors[s]);

						if (alreadyVisited[path.value] !== true) {

							path.g = node.g + this.__realDistance(successors[s], node, entity.getSpeed(successors[s].terrain));
							path.f = path.g + this.__approximateDistance(successors[s], goal);

							_open.push(path);

							alreadyVisited[path.value] = true;

						}


					}

					_closed.push(node);

				}

			}


			if (result.length) {
				return result;
			}


			return null;

		},


		__createNode: function(parent, point) {

			var sizeX = this.__sizeX;
			var sizeY = this.__sizeY;

			var value = 0;

			// horizontally valued search
			if (sizeX >= sizeY) {
				value = point.x + point.y * sizeX;

			// vertically valued search
			} else {
				value = point.y + point.x * sizeY;
			}


			return {
				parent:  parent,
				value:   value,
				terrain: this.__terrain.get(point.x, point.y),
				x:       point.x,
				y:       point.y,
				f:       0,
				g:       0
			};

		},

		__realDistance: function(from, to, speed) {

			if (speed === 0) {

				return Infinity;

			} else {

				var distX = to.x - from.x;
				var distY = to.y - from.y;

				return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2)) / speed;

			}

		},

		__approximateDistance: function(from, to) {

			var distX = to.x - from.x;
			var distY = to.y - from.y;

			return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2)) / 10;

		},

		__successors: function(x, y) {

			var N = y - 1;
			var S = y + 1;
			var W = x - 1;
			var E = x + 1;

			var terrain = this.__terrain;
			var ground  = this.__ground;
			var sizeX   = this.__sizeX;
			var sizeY   = this.__sizeY;

			var checkNorth = N > 0     && ground.get(x, N) === _default && terrain.get(x, N) !== _blocking;
			var checkSouth = S < sizeY && ground.get(x, S) === _default && terrain.get(x, S) !== _blocking;
			var checkWest  = W > 0     && ground.get(W, y) === _default && terrain.get(W, y) !== _blocking;
			var checkEast  = E < sizeX && ground.get(E, y) === _default && terrain.get(E, y) !== _blocking;


			var successors = [];

			checkNorth && successors.push({x: x, y: N });
			checkSouth && successors.push({x: x, y: S });
			checkWest && successors.push({x: W, y: y });
			checkEast && successors.push({x: E, y: y });

			this.__diagonalSuccessors(N, S, W, E, successors);

			return successors;

		},

		__diagonalSuccessors: function(N, S, W, E, successors) {

			var terrain = this.__terrain;
			var ground  = this.__ground;
			var sizeX   = this.__sizeX;
			var sizeY   = this.__sizeY;

			var checkNorth = N > 0;
			var checkSouth = S < sizeY;
			var checkWest  = W > 0;
			var checkEast  = E < sizeX;


			if (checkEast) {

				if (
					checkNorth
					&& ground.get(E, N) === _default
					&& terrain.get(E, N) !== _blocking
				) {
					successors.push({x: E, y: N });
				}

				if (
					checkSouth
					&& ground.get(E, S) === _default
					&& terrain.get(E, S) !== _blocking
				) {
					successors.push({x: E, y: S });
				}

			}

			if (checkWest) {

				if (
					checkNorth
					&& ground.get(W, N) === _default
					&& terrain.get(W, N) !== _blocking
				) {
					successors.push({x: W, y: N });
				}

				if (
					checkSouth
					&& ground.get(W, S) === _default
					&& terrain.get(W, S) !== _blocking
				) {
					successors.push({x: W, y: S });
				}

			}

		}

	};


	return Class;

});

