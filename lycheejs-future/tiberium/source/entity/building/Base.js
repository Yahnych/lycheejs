
lychee.define('game.entity.building.Base').exports(function(lychee, global) {

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
		this.__actions = [ null, null, null, null, null, null ];
		this.__health  = 0;

		if (this.__model !== null) {
			this.__health = this.__model.health;
		}


		// Animation
		this.__animationDuration = 0;
		this.__animationFrames   = 0;
		this.__animationFrame    = null;
		this.__animationLoop     = false;
		this.__animationClock    = null;


		this.setState(settings.state || 'default');

		if (settings.position !== undefined) {
			this.setPosition(settings.position.x || 0, settings.position.y || 0);
		}

		settings = null;

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



		/*
		 * HIGH LEVEL API
		 */

		can: function(action, entity) {

			if (action === 'service') {

				if (this.__model !== null) {

					var classification = entity.getClassification();
					var service  = this.__model.service;
					var interval = this.__model.interval;
					if (
						classification !== null
						&& interval !== null
						&& typeof service[classification] === 'number'
					) {
						return service[classification] > 0;
					}

				}

			}


			return false;

		},

		getActions: function() {
			return this.__actions;
		},



		/*
		 * LOW LEVEL API
		 */

		update: function(clock, delta) {

			// Animation
			if (this.__animationClock !== null) {

				var t = (clock - this.__animationClock) / this.__animationDuration;

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


			var map = this.__model.getMap(id, this.__animationFrame);

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

				this.__state = id;

			}

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

