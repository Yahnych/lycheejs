
lychee.define('game.entity.unit.Base').requires([
	'game.model.Level'
]).exports(function(lychee, global) {

	var _ground = game.model.Level.GROUND;

	var Class = function(team, data, layer, logic) {

		var settings = lychee.extend({}, data);


		this.__team  = null || team; // Ensure that team=0 is a valid value
		this.__layer = layer;
		this.__logic = logic;


		// Low Level API
		this.__model    = settings.model || null;
		this.__position = { x: 0, y: 0 };
		this.__state    = null;
		this.__clock    = null;

		this.__rotation       = 0;
		this.__cannonRotation = 0;
		this.__actions        = [ 'attack', 'defend', 'move', 'patrol' ];
		this.__ammo           = 0;
		this.__health         = 0;

		if (this.__model !== null) {
			this.__ammo   = this.__model.ammo;
			this.__health = this.__model.health;
		}


		// Attack
		this.__attackEntity = null;
		this.__attackDamage = 0;
		this.__attackDelay  = 0;
		this.__attackClock  = null;

		// Focus
		this.__focusX = null;
		this.__focusY = null;

		// Animation
		this.__animationDuration = 0;
		this.__animationFrames   = 0;
		this.__animationFrame    = null;
		this.__animationLoop     = false;
		this.__animationClock    = null;

		// Move
		this.__moveDuration = 0;
		this.__moveStartX   = 0;
		this.__moveStartY   = 0;
		this.__moveEndX     = 0;
		this.__moveEndY     = 0;
		this.__moveClock    = null;

		// Move / Path
		this.__path          = [];
		this.__pathDuration  = 0;
		this.__pathIndex     = 0;
		this.__pathLoop      = 0;
		this.__pathClock     = null;

		// Wait (used by Move and Path)
		this.__waitDuration  = 0;
		this.__waitIndex     = 0;
		this.__waitClock     = null;


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

			if (this.__moveClock !== null) {

				if (noPositionUpdate === false) {
					this.__position.x = this.__moveEndX;
					this.__position.y = this.__moveEndY;
				}

				this.__moveClock = null;

			}

		},

		__setTween: function(duration, x1, y1, x2, y2) {

			this.__moveDuration = duration;
			this.__moveStartX   = x1;
			this.__moveStartY   = y1;
			this.__moveEndX     = x2;
			this.__moveEndY     = y2;
			this.__moveClock    = this.__clock;

		},

		__clearAttack: function() {

			this.__attackEntity   = null;
			this.__attackDamage   = 0;
			this.__attackDelay    = 0;
			this.__attackClock    = null;

		},

		__clearFocus: function() {

			this.__focusX = null;
			this.__focusY = null;

		},

		__clearPath: function() {

			var currentX = Math.round(this.__position.x);
			var currentY = Math.round(this.__position.y);
			var futureX  = this.__moveEndX;
			var futureY  = this.__moveEndY;


			var hitmap = this.__layer.hitmap;

			hitmap.set(futureX, futureY, _ground['default']);
			hitmap.set(currentX, currentY, _ground.unit);


			if (this.__pathClock !== null) {
				this.__path         = [];
				this.__pathDuration = 0;
				this.__pathIndex    = 0;
				this.__pathLoop     = 0;
				this.__pathClock    = null;
			}

		},

		__clearWait: function() {

			this.__waitDuration = 0;
			this.__waitClock    = null;

		},

		__focusCannonTo: function(x, y) {

			var ownPosition = this.getPosition();

			var deltaX = x - ownPosition.x;
			var deltaY = y - ownPosition.y;

			if (deltaX !== 0 || deltaY !== 0) {

				var angle  = (Math.atan2(deltaX, deltaY) / Math.PI * 180) + 180;

				this.__cannonRotation = angle % 360;

				this.__focusX = x;
				this.__focusY = y;

			}

		},



		/*
		 * HIGH LEVEL API
		 */

		can: function(action, entity) {

			if (action === 'attack') {

				if (this.__model !== null) {
					return this.__model.getDamage(entity.getClassification()) > 0;
				}

			}


			return false;

		},

		isAttacking: function(entity) {

			if (
				(entity === undefined && this.__attackEntity !== null)
				|| entity === this.__attackEntity
			){
				return true;
			}


			return false;

		},

		attack: function(entity) {

			if (entity === null) {

				this.__clearAttack();

			} else if (this.__model !== null) {

				var damage = this.__model.getDamage(entity.getClassification());
				if (damage !== null) {

					this.__attackEntity   = entity;
					this.__attackDamage   = damage;
					this.__attackDelay    = this.__ammo > 0 ? 0 : this.__model.reloaddelay;
					this.__attackClock    = this.__clock;

				}

			}

		},

		damage: function(health, active) {

			if (
				active !== undefined
				&& this.isAttacking() === false
			) {

				var apos = active.getPosition();
				this.focus(apos.x, apos.y);
				this.attack(active);

			}


			this.__health -= health;

			if (this.__health < 0) {
				this.__health = 0;
			}

		},

		service: function(health, active) {

			this.__health += health;

			if (this.__health > this.__model.health) {
				this.__health = Math.max(this.__health, this.__model.health);
			}

		},

		isFocusing: function() {
			return (this.__focusX !== null || this.__focusY !== null);
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
			return this.__moveClock !== null;
		},

		move: function(x, y, terrain, focus) {

			x = Math.round(x);
			y = Math.round(y);
			focus = focus === true;


			if (this.__model === null) return null;

			var hitmap = this.__layer.hitmap;

			if (
				x % 1 === 0
				&& y % 1 === 0
				&& hitmap.get(x, y) !== _ground['default']
			) {

				// Wait for tile to be free for a second
				return -1000;

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

						var currentX = Math.round(ownPosition.x);
						var currentY = Math.round(ownPosition.y);

						hitmap.set(currentX, currentY, _ground['default']);
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

		moveAlongPath: function(path, loop) {

			loop = loop === true;


			if (path !== undefined && path.length) {

				this.__clearPath();


				var position = path[0];

				var duration = this.move(position.x, position.y, position.terrain);
				if (duration === null) {
					this.__clearPath();
				} else {
					this.__path         = path;
					this.__pathDuration = duration;
					this.__pathIndex    = 0;
					this.__pathLoop     = loop === true ? 1 : 0;
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

		getWeapon: function() {

			if (this.__model !== null) {
				return this.__model.weapon;
			}


			return null;

		},



		/*
		 * LOW LEVEL API
		 */

		update: function(clock, delta) {

			var t, position;

			// Move
			if (this.__moveClock !== null) {

				t = (clock - this.__moveClock) / this.__moveDuration;

				if (t < 1) {
					this.__position.x = this.__moveStartX + t * (this.__moveEndX - this.__moveStartX);
					this.__position.y = this.__moveStartY + t * (this.__moveEndY - this.__moveStartY);
				} else {
					this.__clearTween();
				}

			}


			// Move / Path - First Try
			if (
				this.__waitClock === null
				&& this.__pathClock !== null
			) {

				if (this.__pathClock + this.__pathDuration < clock) {

					var nextIndex;

					if (this.__pathLoop === 0) {
						nextIndex = this.__pathIndex + 1;
					} else {
						nextIndex = this.__pathIndex + this.__pathLoop;
					}


					position = this.__path[nextIndex];


					if (position !== undefined) {

						var duration = this.move(position.x, position.y, position.terrain);
						if (duration === null) {

							this.__clearPath();

						} else if (duration > 0) {

							this.__pathDuration = duration;
							this.__pathIndex    = nextIndex;
							this.__pathClock    = clock;

						} else if (duration < 0) {

							if (this.__waitIndex > 3) {
								this.__waitIndex = 0;
								this.__clearWait();
								this.__clearPath();
							} else {
								this.__waitDuration = -1 * duration;
								this.__waitIndex++;
								this.__waitClock    = clock;
							}

						}

					} else {

						if (this.__pathLoop !== 0) {

							this.__pathLoop = -1 * this.__pathLoop;

							var focuspos = this.__pathLoop > 0 ? this.__path[this.__path.length - 1] : this.__path[0];
							this.focus(focuspos.x, focuspos.y);

						} else {
							this.__clearPath();
						}

					}

				}


			// Move / Path - Second try after waiting
			} else if (
				this.__waitClock !== null
				&& this.__waitClock + this.__waitDuration < clock
			) {

				this.__clearWait();

			}


			// Focus
			if (this.__focusX !== null && this.__focusY !== null) {
				this.__focusCannonTo(this.__focusX, this.__focusY);
			}


			if (this.__attackEntity !== null && this.__attackClock !== null) {

				position = this.__attackEntity.getPosition();

				var ammo      = this.__ammo;
				var health    = this.__attackEntity.getHealth();
				var isInRange = this.isInRange(this.__attackEntity.getPosition());
				if (health > 0 && isInRange === true) {

					// Fire
					if (ammo > 0) {

						t = (clock - this.__attackClock) / this.__attackDelay;

						if (t > 1) {

							this.__attackClock = clock;
							this.__attackDelay = this.__model.attackdelay;
							this.__ammo--;

							this.__logic.process('attack', this.__attackDamage, this, this.__attackEntity);
							this.focus(position.x, position.y);

						}

					// Reload
					} else {

						this.__attackClock = clock;
						this.__attackDelay = this.__model.reloaddelay;
						this.__ammo        = this.__model.ammo;

					}

				} else if (health === 0) {
					this.__clearAttack();
				} else {
					this.focus(position.x, position.y);
				}

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

		getAmmo: function() {
			return this.__ammo;
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

