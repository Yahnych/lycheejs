
lychee.define('game.entity.unit.Base').requires([
	'game.model.Level'
]).exports(function(lychee, global) {

	var _ground = game.model.Level.GROUND;

	var Class = function(team, data, layer) {

		var settings = lychee.extend({}, data);


		this.__team  = null || team; // Ensure that team=0 is a valid value
		this.__layer = layer || null;


		// Low Level API
		this.__model    = settings.model || null;
		this.__position = { x: 0, y: 0 };
		this.__state    = null;
		this.__clock    = null;

		// High Level API
		this.__focus          = { x: null, y: null };
		this.__rotation       = 0;
		this.__cannonRotation = 0;
		this.__actions        = [ 'attack', 'defend', 'move', 'patrol' ];
		this.__health         = 0;

		if (this.__model !== null) {
			this.__health = this.__model.health;
		}


		// Path
		this.__path          = null;
		this.__pathDuration  = 0;
		this.__pathIndex     = 0;
		this.__pathClock     = null;

		// Animation
		this.__animationDuration = 0;
		this.__animationFrames   = 0;
		this.__animationFrame    = null;
		this.__animationLoop     = false;
		this.__animationClock    = null;

		// Tween
		this.__tweenDuration = 0;
		this.__tweenStartX   = 0;
		this.__tweenStartY   = 0;
		this.__tweenEndX     = 0;
		this.__tweenEndY     = 0;
		this.__tweenClock    = null;


		this.setState(settings.state || 'default');

		if (settings.position !== undefined) {
			this.setPosition(settings.position.x || 0, settings.position.y || 0);
		}


		settings = null;

	};


	Class.CLASSIFICATION = {
		infantry: 0,
		vehicle:  1,
		tank:     2,
		plane:    3,
		building: 4
	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__clearAnimation: function() {

			if (this.__animationClock !== null) {
				this.__animationFrame = null;
				this.__animationClock = null;
			}

		},

		__setAnimation: function(duration, frames, loop) {

			this.__animationDuration = duration;
			this.__animationFrames   = frames;
			this.__animationFrame    = 0;
			this.__animationLoop     = loop;
			this.__animationClock    = this.__clock || 0;

		},

		__clearTween: function(noPositionUpdate) {

			noPositionUpdate = noPositionUpdate === true;

			if (this.__tweenClock !== null) {

				if (noPositionUpdate === false) {
					this.__position.x = this.__tweenEndX;
					this.__position.y = this.__tweenEndY;
				}

				this.__tweenClock = null;

			}

		},

		__setTween: function(duration, x1, y1, x2, y2) {

			this.__tweenDuration = duration;
			this.__tweenStartX   = x1;
			this.__tweenStartY   = y1;
			this.__tweenEndX     = x2;
			this.__tweenEndY     = y2;
			this.__tweenClock    = this.__clock;

		},

		__clearFocus: function() {

			this.__focus.x = null;
			this.__focus.y = null;

		},

		__clearPath: function() {

			if (this.__pathClock !== null) {
				this.__path      = null;
				this.__pathIndex = 0;
				this.__pathClock = null;
			}

		},

		__setPath: function(path) {

			this.__path      = path;
			this.__pathIndex = 0;
			this.__pathClock = this.__clock;

		},

		__focusCannonTo: function(x, y) {

			var ownPosition = this.getPosition();

			var deltaX = x - ownPosition.x;
			var deltaY = y - ownPosition.y;

			if (deltaX !== 0 || deltaY !== 0) {

				var angle  = (Math.atan2(deltaX, deltaY) / Math.PI * 180) + 180;

				this.__cannonRotation = angle % 360;

				this.__focus.x = x;
				this.__focus.y = y;

			}

		},



		/*
		 * HIGH LEVEL API
		 */

		can: function(action, entity) {

			if (action === 'attack') {

				if (this.__model !== null) {

					var classification = entity.getClassification();
					var damage   = this.__model.damage;
					var interval = this.__model.interval;
					if (
						classification !== null
						&& interval !== null
						&& typeof damage[classification] === 'number'
					) {
						return damage[classification] > 0;
					}

				}

			}


			return false;

		},

		isFocusing: function() {
			return (this.__focus.x !== null || this.__focus.y !== null);
		},

		focus: function(x, y) {

			if (this.__model === null) return;


			if (this.__model.getState('cannon') !== null) {
				this.__focusCannonTo(x, y);
			}

		},

		isInRange: function(position) {

			var range = 0;
			if (this.__model !== null) {
				range = this.__model.range;
			}

			var pos = this.__position;
			var distance = Math.sqrt(Math.pow(position.x - pos.x, 2) + Math.pow(position.y - pos.y, 2));

			return (distance < range);

		},

		isMoving: function() {
			return this.__tweenClock !== null;
		},

		move: function(x, y, terrain, focus) {

			focus = focus === true;


			if (this.__model === null) return null;

			var hitmap = null;
			if (this.__layer !== null) {

				hitmap = this.__layer.hitmap;

				if (hitmap.get(x, y) !== _ground['default']) {

// TODO: Implement a waiting logic here.
console.error('ALREADY BLOCKED BY OTHER ENTITY');

					return null;

				}

			}


			var speed = this.getSpeed(terrain);
			if (speed !== 0) {

				if (focus === true) {
					this.__clearFocus();
					this.focus(x, y);
				}

				this.__clearTween();

				var ownPosition = this.getPosition();

				var deltaX = x - ownPosition.x;
				var deltaY = y - ownPosition.y;
				var angle  = (Math.atan2(deltaX, deltaY) / Math.PI * 180) + 180;

				this.__rotation = angle % 360;


				var distance = Math.sqrt( Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2) );
				var time     = 1000 * distance / speed;

				if (time === Infinity) {

					return null;

				} else {

					if (hitmap !== null) {
						hitmap.set(ownPosition.x, ownPosition.y, _ground['default']);
						hitmap.set(x, y, _ground.unit);
					}

					this.__setTween(
						time,
						ownPosition.x, ownPosition.y,
						x, y
					);

					return time;

				}

			}


			return null;

		},

		moveAlongPath: function(path) {

			if (path !== undefined && path.length) {

				this.__clearPath();
				this.__setPath(path);

				var position = this.__path[++this.__pathIndex];

				var duration = this.move(position.x, position.y, position.terrain);
				if (duration === null) {
					this.__clearPath();
				} else {
					this.__pathDuration = duration;
					this.__pathClock    = this.__clock;
				}

			}

		},

		stop: function() {

			if (this.__pathClock !== null) {
				this.__clearPath();
			}

			this.__clearTween(true);

		},

		getActions: function() {
			return this.__actions;
		},

		getRange: function() {

			if (this.__model !== null) {
				return this.__model.range;
			}


			return 0;

		},

		/*
		 * LOW LEVEL API
		 */

		update: function(clock, delta) {

			var t;

			// Tweening
			if (this.__tweenClock !== null) {

				t = (clock - this.__tweenClock) / this.__tweenDuration;

				if (t < 1) {
					this.__position.x = this.__tweenStartX + t * (this.__tweenEndX - this.__tweenStartX);
					this.__position.y = this.__tweenStartY + t * (this.__tweenEndY - this.__tweenStartY);
				} else {
					this.__clearTween();
				}

			}


			// Path Tweening
			if (this.__pathClock !== null) {

				if (this.__pathClock + this.__pathDuration < clock) {

					var position = this.__path[++this.__pathIndex] || null;
					if (position === null) {

						this.__clearPath();

					} else {

						var duration = this.move(position.x, position.y, position.terrain);
						if (duration === null) {
							this.__clearPath();
						} else {
							this.__pathDuration = duration;
							this.__pathClock    = clock;
						}

					}

				}

			}


			// Focus
			var focus = this.__focus;
			if (focus.x !== null && focus.y !== null) {
				this.__focusCannonTo(focus.x, focus.y);
			}


			// Animation
			if (this.__animationClock !== null) {

				t = (clock - this.__animationClock) / this.__animationDuration;

				if (t < 1) {
					// Note: Math.floor approach doesn't work for last frame index x.6-x.9
					this.__animationFrame = Math.max(0, Math.ceil(t * this.__animationFrames) - 1);
				} else if (this.__animationLoop === true) {
					this.__animationClock = clock;
				} else {
					this.__clearAnimation();
	   			}

			}


			this.__clock = clock;

		},

		getClassification: function() {

			if (this.__model !== null) {
				return this.__model.classification;
			}


			return null;

		},

		getHealth: function() {
			return this.__health;
		},

		getLayer: function() {
			return this.__layer;
		},

		getMap: function(id) {

			if (this.__model === null) return null;

			var map   = null;
			var model = this.__model;

			if (id === 'default') {

				map = model.getMap('default', this.__rotation, null);

			} else if (id === 'cannon') {

				map = model.getMap('cannon', this.__cannonRotation, null);

			} else {

				map = model.getMap(id, null, this.__animationFrame);

			}


			return map;

		},

		getModel: function() {
			return this.__model;
		},

		getPosition: function() {
			return this.__position;
		},

		setPosition: function(x, y) {
			this.__position.x = typeof x === 'number' ? x : this.__position.x;
			this.__position.y = typeof y === 'number' ? y : this.__position.y;
		},

		getSpeed: function(terrain) {

			if (this.__model !== null) {
				return this.__model.getSpeed(terrain || 0);
			} else {
				return 0;
			}

		},

		getState: function() {
			return this.__state;
		},

		setState: function(id) {

			if (this.__model === null) return;


			var state = this.__model.getState(id);
			if (state !== null) {

				if (state.animated === true) {

					this.__setAnimation(
						state.duration,
						state.to - state.from,
						state.loop === true
					);

				} else {

					this.__clearAnimation();

				}

			}


			this.__state = id;

		},

		getTeam: function() {
			return this.__team;
		},

		getType: function() {

			if (this.__model !== null) {
				return this.__model.type;
			}

			return null;

		}

	};


	return Class;

});

