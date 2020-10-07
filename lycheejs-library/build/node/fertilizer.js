
lychee = (function(global) {

	if (typeof lychee !== 'undefined') {
		return lychee;
	}



	const _BLOBOF_CACHE      = {};
	const _INTERFACEOF_CACHE = {};



	/*
	 * POLYFILLS
	 */

	if (typeof Array.from !== 'function') {

		Array.from = function(alike/*, predicate, thisArg */) {

			if (alike === null || alike === undefined) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}


			let construct = this;
			let list      = Object(alike);
			let predicate = arguments.length > 1 ? arguments[1] : void 0;
			let thisArg   = arguments.length > 2 ? arguments[2] : void 0;

			if (typeof predicate !== 'undefined') {

				if (typeof predicate !== 'function') {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}

			}

			let length = list.length >>> 0;
			let array  = typeof construct === 'function' ? Object(new construct(length)) : new Array(length);

			for (let i = 0; i < length; i++) {

				let value = list[i];

				if (predicate !== undefined) {

					if (thisArg === undefined) {
						array[i] = predicate(value, i);
					} else {
						array[i] = predicate.call(thisArg, value, i);
					}

				} else {
					array[i] = value;
				}

			}

			array.length = length;

			return array;

		};

	}

	if (typeof Array.prototype.find !== 'function') {

		Array.prototype.find = function(predicate/*, thisArg */) {

			if (this === null || this === undefined) {
				throw new TypeError('Array.prototype.find called on null or undefined');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			let list    = Object(this);
			let length  = list.length >>> 0;
			let thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			let value;

			for (let i = 0; i < length; i++) {

				if (i in list) {

					value = list[i];

					if (predicate.call(thisArg, value, i, list)) {
						return value;
					}

				}

			}


			return undefined;

		};

	}

	if (typeof Array.prototype.includes !== 'function') {

		Array.prototype.includes = function(search/*, from */) {

			if (this === null || this === undefined) {
				throw new TypeError('Array.prototype.includes called on null or undefined');
			}


			let list   = Object(this);
			let length = list.length >>> 0;
			let from   = arguments.length >= 2 ? arguments[1] : 0;
			let value;


			if (length === 0 || from >= length) {
				return false;
			}


			let start = Math.max(from >= 0 ? from : (length - Math.abs(from)), 0);

			for (let i = start; i < length; i++) {

				if (i in list) {

					value = list[i];

					if (value === search || (isNaN(value) && isNaN(search))) {
						return true;
					}

				}

			}


			return false;

		};

	}

	if (typeof Array.prototype.unique !== 'function') {

		Array.prototype.unique = function() {

			if (this === null || this === undefined) {
				throw new TypeError('Array.prototype.unique called on null or undefined');
			}


			let clone  = [];
			let list   = Object(this);
			let length = this.length >>> 0;
			let value;

			for (let i = 0; i < length; i++) {

				value = list[i];

				if (clone.indexOf(value) === -1) {
					clone.push(value);
				}
			}

			return clone;

		};

	}

	if (typeof Boolean.prototype.toJSON !== 'function') {

		Boolean.prototype.toJSON = function() {
			return this.valueOf();
		};

	}

	if (typeof Date.prototype.toJSON !== 'function') {

		let _format_date = function(n) {
			return n < 10 ? '0' + n : '' + n;
		};

		Date.prototype.toJSON = function() {

			if (isFinite(this.valueOf()) === true) {

				let str = '';

				str += this.getUTCFullYear()                + '-';
				str += _format_date(this.getUTCMonth() + 1) + '-';
				str += _format_date(this.getUTCDate())      + 'T';
				str += _format_date(this.getUTCHours())     + ':';
				str += _format_date(this.getUTCMinutes())   + ':';
				str += _format_date(this.getUTCSeconds())   + 'Z';

				return str;

			}


			return null;

		};

	}

	if (typeof Number.prototype.toJSON !== 'function') {

		Number.prototype.toJSON = function() {
			return this.valueOf();
		};

	}

	if (typeof Object.assign !== 'function') {

		Object.assign = function(object /*, ... sources */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.assign called on a non-object');
			}


			for (let a = 1, al = arguments.length; a < al; a++) {

				let source = arguments[a];
				if (source !== undefined && source !== null) {

					for (let key in source) {

						if (Object.prototype.hasOwnProperty.call(source, key) === true) {
							object[key] = source[key];
						}

					}

				}

			}


			return object;

		};

	}

	if (typeof Object.entries !== 'function') {

		Object.entries = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.entries called on a non-object');
			}


			let values = [];

			for (let prop in object) {

				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					values.push([ prop, object[prop] ]);
				}

			}

			return values;

		};

	}

	if (typeof Object.filter !== 'function') {

		Object.filter = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.filter called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			let props   = [];
			let values  = [];
			let thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (let prop in object) {

				let value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						props.push(prop);
						values.push(value);
					}

				}

			}


			let filtered = {};

			for (let i = 0; i < props.length; i++) {
				filtered[props[i]] = values[i];
			}

			return filtered;

		};

	}

	if (typeof Object.find !== 'function') {

		Object.find = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.find called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			let thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (let prop in object) {

				let value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						return value;
					}

				}

			}

			return undefined;

		};

	}

	if (typeof Object.map !== 'function') {

		Object.map = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.map called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			let clone   = {};
			let keys    = Object.keys(object).sort();
			let length  = keys.length >>> 0;
			let thisArg = arguments.length >= 3 ? arguments[2] : void 0;
			let key;
			let value;
			let tmp;


			for (let k = 0; k < length; k++) {

				key   = keys[k];
				value = object[key];
				tmp   = predicate.call(thisArg, value, key);

				if (tmp !== undefined) {
					clone[key] = tmp;
				}

			}


			return clone;

		};

	}

	if (typeof Object.sort !== 'function') {

		Object.sort = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.sort called on a non-object');
			}


			let clone  = {};
			let keys   = Object.keys(object).sort();
			let length = keys.length >>> 0;
			let key;
			let value;

			for (let k = 0; k < length; k++) {

				key   = keys[k];
				value = object[key];

				if (value instanceof Array) {

					clone[key] = value.map(element => {

						if (element instanceof Array) {
							return element;
						} else if (element instanceof Object) {
							return Object.sort(element);
						} else {
							return element;
						}

					});

				} else if (value instanceof Object) {

					clone[key] = Object.sort(value);

				} else {

					clone[key] = value;

				}

			}

			return clone;

		};

	}

	if (typeof Object.values !== 'function') {

		Object.values = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.values called on a non-object');
			}


			let values = [];

			for (let prop in object) {

				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					values.push(object[prop]);
				}

			}

			return values;

		};

	}

	if (typeof String.prototype.endsWith !== 'function') {

		String.prototype.endsWith = function(search/*, from */) {

			if (this === null || this === undefined) {
				throw new TypeError('String.prototype.endsWith called on null or undefined');
			}


			let value  = (this).toString();
			let from   = arguments.length >= 2 ? (arguments[1] | 0) : value.length;
			let tmp    = String(search);
			let length = tmp.length >>> 0;


			let chunk = value.substr(from - length);
			if (chunk === tmp) {
				return true;
			}


			return false;

		};

	}

	if (typeof String.prototype.includes !== 'function') {

		String.prototype.includes = function(search/*, from */) {

			if (this === null || this === undefined) {
				throw new TypeError('String.prototype.includes called on null or undefined');
			}


			let value  = String(this);
			let from   = arguments.length >= 2 ? (arguments[1] | 0) : 0;
			let tmp    = String(search);
			let length = tmp.length >>> 0;

			if (from + length > value.length) {
				return false;
			}


			return value.indexOf(search, from) !== -1;

		};

	}

	if (typeof String.prototype.replaceObject !== 'function') {

		String.prototype.replaceObject = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('String.prototype.replaceObject called on a non-object');
			}


			let clone  = '' + this;
			let keys   = Object.keys(object);
			let values = Object.values(object);


			for (let k = 0, kl = keys.length; k < kl; k++) {

				let key   = keys[k];
				let value = values[k];

				if (value instanceof Array) {
					value = JSON.stringify(value, null, '\t');
				} else if (value instanceof Object) {
					value = JSON.stringify(value, null, '\t');
				} else if (typeof value !== 'string') {
					value = '' + value;
				}


				let pointers = [];
				let pointer  = clone.indexOf('${' + key + '}');

				while (pointer !== -1) {
					pointers.push(pointer);
					pointer = clone.indexOf('${' + key + '}', pointer + 1);
				}


				let offset = 0;

				for (let p = 0, pl = pointers.length; p < pl; p++) {

					let index = pointers[p];

					clone   = clone.substr(0, index + offset) + value + clone.substr(index + offset + key.length + 3);
					offset += (value.length - (key.length + 3));

				}

			}


			return clone;

		};

	}

	if (typeof String.prototype.startsWith !== 'function') {

		String.prototype.startsWith = function(search/*, from */) {

			if (this === null || this === undefined) {
				throw new TypeError('String.prototype.startsWith called on null or undefined');
			}


			let value  = (this).toString();
			let from   = arguments.length >= 2 ? (arguments[1] | 0) : 0;
			let tmp    = String(search);
			let length = tmp.length >>> 0;


			let chunk = value.substr(from, length);
			if (chunk === tmp) {
				return true;
			}


			return false;

		};

	}

	if (typeof String.prototype.toJSON !== 'function') {

		String.prototype.toJSON = function() {
			return this.valueOf();
		};

	}



	/*
	 * HELPERS
	 */

	let _environment = null;
	let _simulation  = null;

	const _bootstrap_environment = function() {

		if (_environment === null) {

			_environment = new lychee.Environment({
				debug: false
			});

		}


		if (this.environment === null) {
			this.setEnvironment(_environment);
		}

	};

	const _bootstrap_simulation = function() {

		_bootstrap_environment.call(this);


		if (_simulation === null) {

			_simulation = new lychee.Simulation({
				environment: this.environment
			});

		}


		if (this.simulation === null) {
			this.setSimulation(_simulation);
		}

	};

	const _validate_environment = function(environment) {

		if (environment instanceof lychee.Environment) {
			return true;
		} else if (environment instanceof lychee.Simulation) {
			return true;
		}


		return false;

	};

	const _resolve_reference = function(identifier) {

		let pointer = this;

		let ns = identifier.split('.');
		for (let n = 0, l = ns.length; n < l; n++) {

			let name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}

		return pointer;

	};

	const _decycle = function(target, object, path) {

		let check = this.has(object);
		if (check === false) {

			this.set(object, path);

			for (let prop in object) {

				if (object.hasOwnProperty(prop) === true) {

					let ovalue = object[prop];
					if (ovalue instanceof Array) {

						target[prop] = [];

						let ref = _decycle.call(this, target[prop], object[prop], path + '.' + prop);
						if (ref !== null) {
							target[prop] = ref;
						}

					} else if (ovalue instanceof Object) {

						target[prop] = {};

						let ref = _decycle.call(this, target[prop], object[prop], path + '.' + prop);
						if (ref !== null) {
							target[prop] = ref;
						}

					} else {

						target[prop] = object[prop];

					}

				}

			}

			return null;

		} else {

			return {
				'reference': this.get(object),
				'arguments': []
			};

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		debug: true,

		environment: _environment,
		simulation:  _simulation,

		ENVIRONMENTS: {},
		FEATURES:     {},
		FILENAME:     null,
		PLATFORMS:    [],
		SIMULATIONS:  {},

		ROOT: {
			lychee:  '/opt/lycheejs',
			project: null
		},

		VERSION: '2018-Q3',



		/*
		 * LIBRARY API
		 */

		assignsafe: function(target) {

			target = target instanceof Object ? target : {};


			for (let a = 1, al = arguments.length; a < al; a++) {

				let object = arguments[a];
				if (object) {

					for (let prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							let tvalue = target[prop];
							let ovalue = object[prop];
							if (tvalue instanceof Array && ovalue instanceof Array) {

								Module.assignsafe(target[prop], object[prop]);

							} else if (tvalue instanceof Object && ovalue instanceof Object) {

								Module.assignsafe(target[prop], object[prop]);

							} else if (tvalue === null && ovalue !== null) {

								target[prop] = object[prop];

							} else if (typeof tvalue === typeof ovalue) {

								target[prop] = object[prop];

							}

						}

					}

				}

			}


			return target;

		},

		assignunlink: function(target) {

			target = target instanceof Object ? target : {};


			for (let a = 1, al = arguments.length; a < al; a++) {

				let object = arguments[a];
				if (object) {

					for (let prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							let ovalue = object[prop];
							if (ovalue instanceof Array) {

								target[prop] = [];
								Module.assignunlink(target[prop], object[prop]);

							} else if (ovalue instanceof Object) {

								target[prop] = {};
								Module.assignunlink(target[prop], object[prop]);

							} else {

								target[prop] = object[prop];

							}

						}

					}

				}

			}


			return target;

		},

		blobof: function(template, blob) {

			template = template !== undefined ? template : null;
			blob     = blob instanceof Object ? blob     : null;


			if (template !== null && blob !== null) {

				let tname    = template.displayName;
				let bname    = blob.reference || blob.constructor || null;
				let hashable = typeof tname === 'string' && typeof bname === 'string';
				let hashmap  = _BLOBOF_CACHE;


				// 0. Quick validation for identical constructors
				if (hashable === true) {

					if (hashmap[tname] !== undefined && hashmap[tname][bname] !== undefined) {

						return hashmap[tname][bname];

					} else if (tname === bname) {

						if (hashmap[tname] === undefined) {
							hashmap[tname] = {};
						}

						hashmap[tname][bname] = true;

						return hashmap[tname][bname];

					} else if (tname !== bname) {

						let instance = lychee.deserialize(blob);
						if (lychee.interfaceof(template, instance) === true) {

							if (hashmap[tname] === undefined) {
								hashmap[tname] = {};
							}

							hashmap[tname][bname] = true;

							return hashmap[tname][bname];

						}

					}

				}

			}


			return false;

		},

		decycle: function(target, object, path) {

			target = target instanceof Object ? target : {};
			object = object instanceof Object ? object : null;
			path   = typeof path === 'string' ? path   : '';


			if (object !== null) {
				_decycle.call(new WeakMap(), target, object, path);
			}

			return target;

		},

		diff: function(aobject, bobject) {

			aobject = aobject !== undefined ? aobject : undefined;
			bobject = bobject !== undefined ? bobject : undefined;


			if (aobject === bobject) {

				return false;

			} else if (aobject instanceof Array && bobject instanceof Array) {

				for (let a = 0, al = aobject.length; a < al; a++) {

					if (bobject[a] !== undefined) {

						if (aobject[a] !== null && bobject[a] !== null) {

							if (aobject[a] instanceof Object && bobject[a] instanceof Object) {

								if (Module.diff(aobject[a], bobject[a]) === true) {

									// Allows aobject[a].builds = {} and bobject[a].builds = { stuff: {}}
									if (Object.keys(aobject[a]).length > 0) {
										return true;
									}

								}

							} else if (typeof aobject[a] !== typeof bobject[a]) {
								return true;
							} else if (aobject[a] !== bobject[a]) {
								return true;
							}

						}

					} else {
						return true;
					}

				}

			} else if (aobject instanceof Date && bobject instanceof Date) {

				let astr = aobject.toString();
				let bstr = bobject.toString();

				if (astr !== bstr) {
					return true;
				}

			} else if (aobject instanceof RegExp && bobject instanceof RegExp) {

				let astr = aobject.toString();
				let bstr = bobject.toString();

				if (astr !== bstr) {
					return true;
				}

			} else if (aobject instanceof Object && bobject instanceof Object) {

				let akeys = Object.keys(aobject);
				let bkeys = Object.keys(bobject);

				if (akeys.length !== bkeys.length) {
					return true;
				}


				for (let a = 0, al = akeys.length; a < al; a++) {

					let key = akeys[a];

					if (bobject[key] !== undefined) {

						if (aobject[key] !== null && bobject[key] !== null) {

							if (aobject[key] instanceof Object && bobject[key] instanceof Object) {

								if (Module.diff(aobject[key], bobject[key]) === true) {

									// Allows aobject[key].builds = {} and bobject[key].builds = { stuff: {}}
									if (Object.keys(aobject[key]).length > 0) {
										return true;
									}

								}

							} else if (typeof aobject[key] !== typeof bobject[key]) {
								return true;
							} else if (aobject[key] !== bobject[key]) {
								return true;
							}

						}

					} else {
						return true;
					}

				}

			} else if (aobject !== bobject) {

				return true;

			}


			return false;

		},

		enumof: function(template, value) {

			template = template instanceof Object ? template : null;
			value    = typeof value === 'number'  ? value    : null;


			if (template !== null && value !== null) {

				let valid = false;

				for (let val in template) {

					if (value === template[val]) {
						valid = true;
						break;
					}

				}

				return valid;

			}


			return false;

		},

		interfaceof: function(template, instance) {

			template = template !== undefined ? template : null;
			instance = instance !== undefined ? instance : null;


			if (template !== null && instance !== null) {

				let tname    = template.displayName;
				let iname    = instance.displayName;
				let hashable = typeof tname === 'string' && typeof iname === 'string';
				let hashmap  = _INTERFACEOF_CACHE;
				let valid    = false;


				// 0. Quick validation for identical constructors
				if (hashable === true) {

					if (hashmap[tname] !== undefined && hashmap[tname][iname] !== undefined) {

						return hashmap[tname][iname];

					} else if (tname === iname) {

						if (hashmap[tname] === undefined) {
							hashmap[tname] = {};
						}

						hashmap[tname][iname] = true;

						return hashmap[tname][iname];

					}

				}


				// 1. Interface validation on Template
				if (template instanceof Function && template.prototype instanceof Object && instance instanceof Function && instance.prototype instanceof Object) {

					valid = true;

					for (let method in template.prototype) {

						if (typeof template.prototype[method] !== typeof instance.prototype[method]) {
							valid = false;
							break;
						}

					}


				// 2. Interface validation on Instance
				} else if (template instanceof Function && template.prototype instanceof Object && instance instanceof Object) {

					valid = true;

					for (let method in template.prototype) {

						if (typeof template.prototype[method] !== typeof instance[method]) {
							valid = false;
							break;
						}

					}


				// 3. Interface validation on Struct
				} else if (template instanceof Object && instance instanceof Object) {

					valid = true;

					for (let property in template) {

						if (template.hasOwnProperty(property) && instance.hasOwnProperty(property)) {

							if (typeof template[property] !== typeof instance[property]) {
								valid = false;
								break;
							}

						}

					}

				}


				if (hashable === true) {

					if (hashmap[tname] === undefined) {
						hashmap[tname] = {};
					}

					hashmap[tname][iname] = valid;

				}


				return valid;

			}


			return false;

		},



		/*
		 * ENTITY API
		 */

		deserialize: function(data) {

			data = data instanceof Object ? data : null;


			try {
				data = JSON.parse(JSON.stringify(data));
			} catch (err) {
				data = null;
			}


			if (data !== null) {

				let instance = null;
				let scope    = (this.environment !== null ? this.environment.global : global);


				if (typeof data.reference === 'string') {

					let resolved_module = _resolve_reference.call(scope, data.reference);
					if (typeof resolved_module === 'object') {
						instance = resolved_module;
					}

				} else if (typeof data.constructor === 'string' && data.arguments instanceof Array) {

					let resolved_composite = _resolve_reference.call(scope, data.constructor);
					if (typeof resolved_composite === 'function') {

						let bindargs = Array.from(data.arguments).map(value => {

							if (typeof value === 'string' && value.charAt(0) === '#') {

								if (lychee.debug === true) {
									console.log('lychee.deserialize: Injecting "' + value + '" from global');
								}

								let resolved = _resolve_reference.call(scope, value.substr(1));
								if (resolved !== null) {
									value = resolved;
								}

							}

							return value;

						});


						bindargs.reverse();
						bindargs.push(resolved_composite);
						bindargs.reverse();


						instance = new (
							resolved_composite.bind.apply(
								resolved_composite,
								bindargs
							)
						)();

					}

				} else if (data instanceof Object) {

					instance = data;

				}


				if (instance !== null) {

					// High-Level ENTITY API
					if (typeof instance.deserialize === 'function') {

						let blob = data.blob || null;
						if (blob !== null) {
							instance.deserialize(blob);
						}

					// Low-Level ASSET API
					} else if (typeof instance.load === 'function') {
						instance.load();
					}


					return instance;

				} else {

					console.info('lychee.deserialize: Require ' + (data.reference || data.constructor) + ' to deserialize it.');

				}

			}


			return null;

		},

		serialize: function(definition) {

			definition = definition !== undefined ? definition : null;


			let data = null;

			if (definition !== null) {

				if (typeof definition === 'object') {

					if (typeof definition.serialize === 'function') {

						data = definition.serialize();

					} else if (typeof definition.displayName !== 'undefined') {

						if (definition.prototype instanceof Object) {
							console.info('lychee.serialize: Define ' + (definition.displayName) + '.prototype.serialize() to serialize it.');
						} else {
							console.info('lychee.serialize: Define ' + (definition.displayName) + '.serialize() to serialize it.');
						}

					} else {

						try {
							data = JSON.parse(JSON.stringify(definition));
						} catch (err) {
							data = null;
						}

					}

				} else if (typeof definition === 'function') {

					data = definition.toString();

				}

			}


			return data;

		},



		/*
		 * CUSTOM API
		 */

		assimilate: function(target) {

			target = typeof target === 'string' ? target : null;


			if (target !== null) {

				_bootstrap_environment.call(this);


				let asset = new lychee.Asset(target, null, false);
				if (asset !== null) {
					asset.load();
				}


				return asset;

			} else {

				console.warn('lychee.assimilate: Invalid target.');
				console.info('lychee.assimilate: Use lychee.assimilate(target).');
				console.info('lychee.assimilate: target is a URL to an Asset.');

			}


			return null;

		},

		define: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				_bootstrap_environment.call(this);


				let definition = new lychee.Definition({
					id:  identifier,
					url: lychee.FILENAME || null
				});


				let count   = 0;
				let sandbox = this;

				while (count < 64 && sandbox.environment.sandbox === true) {
					sandbox = sandbox.environment.global.lychee;
					count++;
				}

				definition.exports = function(callback) {
					lychee.Definition.prototype.exports.call(this, callback);
					sandbox.environment.define(this, false);
				};


				return definition;

			} else {

				console.warn('lychee.define: Invalid identifier.');
				console.info('lychee.define: Use lychee.define(id).exports(function(lychee, global, attachments) {}).');
				console.info('lychee.define: identifier is a dot-separated notation, e.g. "app.entity.Example".');
				console.info('lychee.define: The "lycheejs-breeder init <identifier>" command may help you.');

			}


			return null;

		},

		export: function(reference, sandbox) {

			reference = typeof reference === 'string' ? reference : null;
			sandbox   = sandbox !== undefined         ? sandbox   : global;


			if (reference !== null && sandbox !== null) {

				_bootstrap_environment.call(this);


				let definition = this.environment.definitions[reference] || null;
				if (definition !== null) {

					let result = definition.export(sandbox);
					if (result === true) {

						let instance = _resolve_reference.call(sandbox, reference);
						if (instance !== null) {
							return instance;
						}

					}

				}

			} else {

				console.warn('lychee.export: Invalid reference.');
				console.info('lychee.export: Use lychee.export(reference, sandbox).');
				console.info('lychee.export: reference is a Definition identifier.');

			}


			return null;

		},

		import: function(reference) {

			reference = typeof reference === 'string' ? reference : null;


			if (reference !== null) {

				_bootstrap_environment.call(this);


				let count    = 0;
				let instance = null;
				let sandbox  = this;

				while (count < 64 && sandbox.environment.sandbox === true) {
					sandbox = sandbox.environment.global.lychee;
					count++;
				}

				let resolved_module = _resolve_reference.call(sandbox.environment.global, reference);
				if (resolved_module !== null) {
					instance = resolved_module;
				}


				if (instance === null) {
					console.info('lychee.import: Require "' + reference + '" to import it.');
				}


				return instance;

			} else {

				console.warn('lychee.import: Invalid reference.');
				console.info('lychee.import: Use lychee.import(reference).');
				console.info('lychee.import: reference is a Definition identifier.');

			}


			return null;

		},

		init: function(environment, settings, callback) {

			let message = environment !== null;

			environment = _validate_environment(environment) === true ? environment : null;
			settings    = settings instanceof Object                  ? settings    : null;
			callback    = callback instanceof Function                ? callback    : null;


			_bootstrap_environment.call(this);
			_bootstrap_simulation.call(this);


			if (environment !== null && settings !== null) {

				if (_environment !== null) {

					if (environment instanceof lychee.Environment) {

						Object.values(_environment.definitions).forEach(definition => {
							environment.define(definition, true);
						});

					} else if (environment instanceof lychee.Simulation) {

						Object.values(_environment.definitions).forEach(definition => {
							environment.environment.define(definition, true);
						});

					}

				}


				if (environment.id.startsWith('lychee-Environment-')) {
					environment.setId((lychee.ROOT.project || '').substr((lychee.ROOT.lychee || '').length) + '/custom');
				}

				for (let id in settings) {

					let method = 'set' + id.charAt(0).toUpperCase() + id.substr(1);
					if (typeof environment[method] === 'function') {
						environment[method](settings[id]);
					}

				}


				if (environment instanceof lychee.Environment) {

					if (callback === null) {

						let code    = '';
						let profile = settings.profile || {};

						code += '\n\n';
						code += 'if (sandbox === null) {\n';
						code += '\tconsole.error(\'lychee: environment.init() failed.\');\n';
						code += '\treturn;\n';
						code += '}\n';
						code += '\n\n';
						code += 'let lychee = sandbox.lychee;\n';

						let packages = environment.packages;
						if (packages instanceof Object && Array.isArray(packages) === false) {

							for (let pid in packages) {

								if (pid !== 'lychee' && /$([a-z]+)/g.test(pid)) {
									code += 'let ' + pid + ' = sandbox.' + pid + ';\n';
								}

							}

						}

						code += '\n\n';
						code += 'sandbox.MAIN = new ' + environment.target + '(' + JSON.stringify(profile) + ');\n';
						code += '\n\n';
						code += 'if (typeof sandbox.MAIN.init === \'function\') {\n';
						code += '\tsandbox.MAIN.init();\n';
						code += '}\n';

						callback = new Function('sandbox', code);

					}


					lychee.setEnvironment(environment);
					environment.init(callback);

				} else if (environment instanceof lychee.Simulation) {

					let simulation = environment;

					environment = simulation.environment;


					if (callback === null) {

						let code = '';

						code += '\n\n';
						code += 'if (sandbox_sim === null) {\n';
						code += '\tconsole.error(\'lychee: simulation.init() failed.\');\n';
						code += '\treturn;\n';
						code += '}\n';
						code += '\n\n';
						code += 'console.info(\'lychee: simulation.init() succeeded.\');\n';

						callback = new Function('sandbox_sim', code);

					}


					lychee.setEnvironment(environment);

					environment.init(sandbox => {

						if (sandbox === null) {
							console.error('lychee: environment.init() failed.');
							return;
						}


						console.info('lychee: environment.init() succeeded.');

						lychee.setSimulation(simulation);
						simulation.init(callback);

					});

				}


				return true;

			} else if (message === true) {

				console.warn('lychee.init: Invalid environment.');
				console.info('lychee.init: Use lychee.init(environment, settings, callback).');
				console.info('lychee.init: environment is either a lychee.Environment or lychee.Simulation instance.');

			}


			return false;

		},

		inject: function(environment) {

			let message = environment !== null;

			environment = environment instanceof lychee.Environment ? environment : null;


			_bootstrap_environment.call(this);


			if (environment !== null) {

				if (this.environment !== null) {

					Object.values(environment.definitions).forEach(definition => {
						this.environment.define(definition, true);
					});

					let build_old = this.environment.definitions[this.environment.target] || null;
					let build_new = environment.definitions[environment.target]           || null;

					if (build_old === null && build_new !== null) {
						this.environment.target = environment.target;
						this.environment.type   = environment.type;
					}


					return true;

				} else {

					console.warn('lychee.inject: Invalid default environment for injection.');
					console.info('lychee.inject: Use lychee.setEnvironment(environment) before using lychee.inject(other).');

				}

			} else if (message === true) {

				console.warn('lychee.inject: Invalid environment.');
				console.info('lychee.inject: Use lychee.inject(environment).');
				console.info('lychee.inject: environment is a lychee.Environment instance.');

			}


			return false;

		},

		pkg: function(type, id, callback) {

			type     = typeof type === 'string'     ? type       : null;
			id       = typeof id === 'string'       ? id         : null;
			callback = callback instanceof Function ? callback   : null;


			if (id !== null && type !== null && callback !== null) {

				if (/^(build|review|source)$/g.test(type)) {

					let config = new Config('./lychee.pkg');

					config.onload = function() {

						let buffer = this.buffer || null;
						if (buffer instanceof Object) {

							let settings = buffer[type].environments[id] || null;
							if (settings instanceof Object) {

								let environment = null;
								let profile     = settings.profile || null;

								if (profile !== null) {
									delete settings.profile;
								}

								if (type === 'build' || type === 'source') {
									environment = new lychee.Environment(JSON.parse(JSON.stringify(settings)));
								} else if (type === 'review') {
									environment = new lychee.Simulation(JSON.parse(JSON.stringify(settings)));
								}

								callback(environment, profile);

							} else {

								console.warn('lychee.pkg: Invalid Settings for "' + id + '" in "' + this.url + '".');
								console.info('lychee.pkg: Verify Settings at "/' + type + '/environments/' + id + '" in lychee.pkg.');

								callback(null, null);

							}

						} else {

							console.warn('lychee.pkg: Invalid Package at "' + this.url + '".');
							console.info('lychee.pkg: Replace lychee.pkg with the one from "/projects/boilerplate".');
							console.info('lychee.pkg: The "lycheejs-harvester start" command may help you.');

							callback(null, null);

						}

					};

					config.load();

					return true;

				}

			}


			return false;

		},

		specify: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				_bootstrap_simulation.call(this);


				let sandbox       = this;
				let specification = new lychee.Specification({
					id:  identifier,
					url: lychee.FILENAME || null
				});

				specification.exports = function(callback) {
					lychee.Specification.prototype.exports.call(this, callback);
					sandbox.simulation.specify(this, false);
				};


				return specification;

			} else {

				console.warn('lychee.specify: Invalid identifier.');
				console.info('lychee.specify: Use lychee.specify(id).exports(function(lychee, sandbox) {}).');
				console.info('lychee.specify: identifier is a dot-separated notation, e.g. "app.entity.Example".');
				console.info('lychee.specify: The "lycheejs-breeder init <identifier>" command may help you.');

			}


			return null;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;
				this.debug       = this.environment.debug;

				return true;

			} else {

				this.environment = _environment;
				this.debug       = this.environment.debug;

			}


			return false;

		},

		setSimulation: function(simulation) {

			simulation = simulation instanceof lychee.Simulation ? simulation : null;


			if (simulation !== null) {

				this.simulation = simulation;

				return true;

			} else {

				this.simulation = _simulation;

			}


			return false;

		}

	};


	if (typeof lychee === 'undefined') {
		lychee = global.lychee = Object.assign({}, Module);
	}


	return Module;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Asset = typeof lychee.Asset !== 'undefined' ? lychee.Asset : (function(global) {

	/*
	 * HELPERS
	 */

	const _resolve_constructor = function(type) {

		let construct = null;


		if (type === 'fnt')   construct = global.Font;
		if (type === 'json')  construct = global.Config;
		if (type === 'msc')   construct = global.Music;
		if (type === 'pkg')   construct = global.Config;
		if (type === 'png')   construct = global.Texture;
		if (type === 'snd')   construct = global.Sound;
		if (type === 'store') construct = global.Config;


		if (construct === null) {
			construct = global.Stuff || null;
		}


		return construct;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Callback = function(url, type, ignore) {

		url    = typeof url === 'string'  ? url  : null;
		type   = typeof type === 'string' ? type : null;
		ignore = ignore === true;


		let asset = null;

		if (url !== null) {

			if (type === null) {

				if (url.startsWith('data:')) {
					type = url.split(';')[0].split('/').pop();
				} else {
					type = url.split('/').pop().split('.').pop();
				}

			}


			let construct = _resolve_constructor(type);
			if (construct !== null) {

				if (url.startsWith('data:')) {

					asset = new construct('/tmp/Asset.' + type, ignore);
					asset.deserialize({
						buffer: url
					});

				} else {

					asset = new construct(url, ignore);

				}

			}

		}


		return asset;

	};


	Callback.displayName = 'lychee.Asset';


	return Callback;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Debugger = typeof lychee.Debugger !== 'undefined' ? lychee.Debugger : (function(global) {

	/*
	 * HELPERS
	 */

	let _client      = null;
	let _environment = null;
	let _error_trace = Error.prepareStackTrace;


	const _bootstrap_environment = function() {

		if (_environment === null) {

			let currentenv = lychee.environment;
			lychee.setEnvironment(null);

			let defaultenv = lychee.environment;
			lychee.setEnvironment(currentenv);

			_environment = defaultenv;

		}

	};

	const _diff_environment = function(environment) {

		let cache1 = {};
		let cache2 = {};

		let global1 = _environment.global;
		let global2 = environment.global;

		for (let prop1 in global1) {

			if (global1[prop1] === global2[prop1]) continue;

			if (typeof global1[prop1] !== typeof global2[prop1]) {
				cache1[prop1] = global1[prop1];
			}

		}

		for (let prop2 in global2) {

			if (global2[prop2] === global1[prop2]) continue;

			if (typeof global2[prop2] !== typeof global1[prop2]) {
				cache2[prop2] = global2[prop2];
			}

		}


		let diff = Object.assign({}, cache1, cache2);
		if (Object.keys(diff).length > 0) {
			return diff;
		}


		return null;

	};

	const _report_error = function(environment, data) {

		let info1 = 'Report from ' + data.file + '#L' + data.line + ' in ' + data.method;
		let info2 = data.message.trim();
		let info3 = data.stacktrace.map(callsite => callsite.file + '#L' + callsite.line + ' in ' + callsite.method).join('\n');


		let main = environment.global.MAIN || null;
		if (main !== null) {

			let client = main.client || null;
			if (client !== null) {

				let service = client.getService('debugger');
				if (service !== null) {
					service.report('lychee.Debugger: ' + info1, data);
				}

			}

		}


		console.error('lychee.Debugger: ' + info1);

		if (info2.length > 0) {
			console.error('lychee.Debugger: ' + info2);
		}

		if (info3.length > 0) {

			info3.split('\n').forEach(line => {
				console.error('lychee.Debugger: ' + line);
			});

		}
	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'lychee.Debugger',
				'blob':      null
			};

		},

		expose: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : lychee.environment;


			_bootstrap_environment();


			if (environment !== null && environment !== _environment) {

				let project = environment.id;
				if (project !== null) {

					if (lychee.diff(environment.global, _environment.global) === true) {

						let diff = _diff_environment(environment);
						if (diff !== null) {
							return diff;
						}

					}

				}

			}


			return null;

		},

		report: function(environment, error, referer) {

			_bootstrap_environment();


			environment = environment instanceof lychee.Environment ? environment : null;
			error       = error instanceof Error                    ? error       : null;
			referer     = referer instanceof Object                 ? referer     : null;


			if (environment !== null && error !== null) {

				let definition = null;

				if (referer !== null) {

					if (referer instanceof Stuff) {
						definition = referer.url;
					} else if (referer instanceof lychee.Definition) {
						definition = referer.id;
					}

				}


				let data = {
					project:     environment.id,
					definition:  definition,
					environment: environment.serialize(),
					file:        null,
					line:        null,
					method:      null,
					type:        null,
					message:     error.message || '',
					stacktrace:  []
				};


				if (typeof error.stack === 'string') {

					let header = error.stack.trim().split('\n')[0].trim();
					let check1 = header.split(':')[0].trim();
					let check2 = header.split(':').slice(1).join(':').trim();

					if (/^(ReferenceError|SyntaxError)$/g.test(check1)) {
						data.type    = check1;
						data.message = check2;
					}


					let stacktrace = error.stack.trim().split('\n').map(raw => {

						let file   = null;
						let line   = null;
						let method = null;

						let chunk = raw.trim();
						if (chunk.startsWith('at')) {

							let tmp1 = chunk.substr(2).trim().split(' ');
							if (tmp1.length === 2) {

								method = tmp1[0].trim();

								if (tmp1[1].startsWith('(')) tmp1[1] = tmp1[1].substr(1).trim();
								if (tmp1[1].endsWith(')'))   tmp1[1] = tmp1[1].substr(0, tmp1[1].length - 1).trim();

								let check = tmp1[1];
								if (check.startsWith('http://') || check.startsWith('https://')) {
									tmp1[1] = '/' + check.split('/').slice(3).join('/');
								} else if (check.startsWith('file://')) {
									tmp1[1] = tmp1[1].substr(7);
								}


								let tmp2 = tmp1[1].split(':');
								if (tmp2.length === 3) {
									file = tmp2[0];
									line = tmp2[1];
								} else if (tmp2.length === 2) {
									file = tmp2[0];
									line = tmp2[1];
								} else if (tmp2.length === 1) {
									file = tmp2[0];
								}

							}

						} else if (chunk.includes('@')) {

							let tmp1 = chunk.split('@');
							if (tmp1.length === 2) {

								if (tmp1[0] !== '') {
									method = tmp1[0];
								}

								let check = tmp1[1];
								if (check.startsWith('http://') || check.startsWith('https://')) {
									tmp1[1] = '/' + check.split('/').slice(3).join('/');
								} else if (check.startsWith('file://')) {
									tmp1[1] = tmp1[1].substr(7);
								}


								let tmp2 = tmp1[1].split(':');
								if (tmp2.length === 3) {
									file = tmp2[0];
									line = tmp2[1];
								} else if (tmp2.length === 2) {
									file = tmp2[0];
									line = tmp2[1];
								} else if (tmp2.length === 1) {
									file = tmp2[0];
								}

							}

						}


						if (file !== null) {

							if (file.startsWith('/opt/lycheejs')) {
								file = file.substr(13);
							}

						}

						if (line !== null) {

							let num = parseInt(line, 10);
							if (!isNaN(num)) {
								line = num;
							}

						}


						return {
							method: method,
							file:   file,
							line:   line
						};

					}).filter(callsite => {

						if (
							callsite.method === null
							&& callsite.file === null
							&& callsite.line === null
						) {
							return false;
						}

						return true;

					});


					if (stacktrace.length > 0) {

						let callsite = stacktrace[0];

						data.method     = callsite.method;
						data.file       = callsite.file;
						data.line       = callsite.line;
						data.stacktrace = stacktrace;

					}

				} else if (typeof Error.captureStackTrace === 'function') {

					Error.prepareStackTrace = function(err, stack) {
						return stack;
					};
					Error.captureStackTrace(error);
					Error.prepareStackTrace = _error_trace;


					let stacktrace = Array.from(error.stack).map(frame => {

						let file   = frame.getFileName()     || null;
						let line   = frame.getLineNumber()   || null;
						let method = frame.getFunctionName() || frame.getMethodName() || null;

						if (method !== null) {

							let type = frame.getTypeName() || null;
							if (type !== null) {
								method = type + '.' + method;
							}

						}

						if (file !== null && file.startsWith('/opt/lycheejs')) {
							file = file.substr(13);
						}


						return {
							file:   file,
							line:   line,
							method: method
						};

					}).filter(callsite => {

						if (
							callsite.method === null
							&& callsite.file === null
							&& callsite.line === null
						) {
							return false;
						}

						return true;

					});


					if (stacktrace.length > 0) {

						let callsite = stacktrace[0];

						data.file       = callsite.file;
						data.line       = callsite.line;
						data.method     = callsite.method;
						data.stacktrace = stacktrace;

					}

				}


				_report_error(environment, data);


				return true;

			} else if (error !== null) {

				console.error(error);

			}


			return false;

		}

	};


	Module.displayName = 'lychee.Debugger';


	return Module;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Definition = typeof lychee.Definition !== 'undefined' ? lychee.Definition : (function(global) {

	const lychee = global.lychee;



	/*
	 * HELPERS
	 */

	const _DETECTOR_CACHE = {};
	const _WARNING_CACHE  = {};

	const _create_detector = function(platform) {

		platform = typeof platform === 'string' ? platform : null;


		if (platform !== null) {

			let sandbox = _DETECTOR_CACHE[platform] || null;
			if (sandbox === null) {

				if (platform.includes('-') === true) {

					let major = platform.split('-')[0];
					let minor = platform.split('-')[1];
					let clone = Object.assign({}, lychee.FEATURES[major], lychee.FEATURES[major + '-' + minor]);
					let proxy = _create_proxy(clone);
					if (proxy !== null) {
						sandbox = proxy;
					}

				} else {

					let clone = lychee.FEATURES[platform] || null;
					let proxy = _create_proxy(clone);
					if (proxy !== null) {
						sandbox = proxy;
					}

				}


				_DETECTOR_CACHE[platform] = sandbox;

			}


			return sandbox;

		}


		return null;

	};

	const _create_proxy = function(source, path) {

		path = typeof path === 'string' ? path : 'global';


		if (source === null) {
			return source;
		}


		if (typeof Proxy !== 'undefined') {

			let clone = {};
			let proxy = new Proxy(clone, {

				get: function(target, name) {

					// XXX: Remove this and console will crash the program
					if (name === 'splice') return undefined;


					if (target[name] === undefined) {

						let type = typeof source[name];
						if (/boolean|number|string|function/g.test(type)) {
							target[name] = source[name];
						} else if (/object/g.test(type)) {
							target[name] = _create_proxy(source[name], path + '.' + name);
						} else if (/undefined/g.test(type)) {
							target[name] = undefined;
						}


						if (target[name] === undefined) {

							let warned = _WARNING_CACHE[path + '.' + name] || false;
							if (warned === false) {
								_WARNING_CACHE[path + '.' + name] = true;
								console.warn('lychee.Definition: Unknown feature (data type) "' + path + '.' + name + '" in FEATURES.js');
							}

						}

					}


					return target[name];

				}

			});


			proxy.toJSON = function() {

				let data = {};

				Object.keys(clone).forEach(key => {

					if (/toJSON/g.test(key) === false) {

						let type = typeof clone[key];
						if (/boolean|number|string|function/g.test(type)) {
							data[key] = type;
						} else if (/object/g.test(type)) {
							data[key] = clone[key];
						}

					}

				});

				return data;

			};


			return proxy;

		}


		return source;

	};

	const _fuzz_asset = function(type) {

		let asset = {
			url:       '/tmp/Dummy.' + type,
			_is_dummy: true,
			serialize: function() {
				return null;
			}
		};


		let url = this.url;
		if (url !== null) {
			asset.url = url.split('.').slice(0, -1).join('.') + '.' + type;
		}


		Object.defineProperty(asset, 'buffer', {
			get: function() {
				return null;
			},
			set: function() {
				return false;
			},
			enumerable:   true,
			configurable: false
		});


		return asset;

	};

	const _fuzz_id = function() {

		let found = null;

		if (this.url !== null) {

			let namespace = null;

			for (let pid in lychee.environment.packages) {

				let pkg  = lychee.environment.packages[pid];
				let base = pkg.url.split('/').slice(0, -1).join('/');

				if (this.url.startsWith(base)) {
					namespace = pkg.id;
				}

			}


			if (namespace !== null) {

				let id    = '';
				let ns    = this.url.split('/');
				let tmp_i = ns.indexOf('source');
				let tmp_s = ns[ns.length - 1];

				if (/\.js$/g.test(tmp_s)) {
					ns[ns.length - 1] = tmp_s.split('.').slice(0, -1).join('.');
				}

				if (tmp_i !== -1 && ns[tmp_i + 1] === 'core') {

					if (ns[tmp_i + 2] === 'lychee') {
						ns.splice(tmp_i + 1, 2);
					} else {
						ns.splice(tmp_i + 1, 1);
					}

				}

				if (tmp_i !== -1) {
					id = ns.slice(tmp_i + 1).join('.');
				}

				if (id !== '') {
					found = namespace + '.' + id;
				} else {
					found = namespace;
				}

			}

		}

		return found;

	};

	const _resolve = function(identifier) {

		let pointer   = this;
		let namespace = identifier.split('.');
		let id        = namespace.pop();

		for (let n = 0, nl = namespace.length; n < nl; n++) {

			let name = namespace[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		let check = id.toLowerCase();
		if (check === id) {

			if (pointer[id] === undefined) {
				pointer[id] = {};
			}

			return pointer[id];

		} else {

			if (pointer[id] !== undefined) {
				return pointer[id];
			}

		}


		return null;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id  = '';
		this.url = lychee.FILENAME || null;

		this._attaches = {
			'json':  _fuzz_asset.call(this, 'json'),
			'fnt':   _fuzz_asset.call(this, 'fnt'),
			'msc':   _fuzz_asset.call(this, 'msc'),
			'pkg':   _fuzz_asset.call(this, 'pkg'),
			'png':   _fuzz_asset.call(this, 'png'),
			'snd':   _fuzz_asset.call(this, 'snd'),
			'store': _fuzz_asset.call(this, 'store')
		};
		this._tags     = {};
		this._requires = [];
		this._includes = [];
		this._exports  = null;
		this._supports = null;


		// XXX: url has to be set first for fuzzing
		this.setUrl(states.url);
		this.setId(states.id);


		this.tags(states.tags);
		this.requires(states.requires);
		this.includes(states.includes);
		this.supports(states.supports);
		this.exports(states.exports);


		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.attaches instanceof Object) {

				let attachesmap = {};

				for (let aid in blob.attaches) {
					attachesmap[aid] = lychee.deserialize(blob.attaches[aid]);
				}

				this.attaches(attachesmap);

			}

			if (blob.tags instanceof Object) {
				this.tags(blob.tags);
			}

			if (blob.requires instanceof Array) {
				this.requires(blob.requires);
			}

			if (blob.includes instanceof Array) {
				this.includes(blob.includes);
			}


			if (typeof blob.supports === 'string') {

				// Function head
				let tmp = blob.exports.split('{')[0].trim();
				if (tmp.startsWith('function')) {
					tmp = tmp.substr('function'.length).trim();
				}

				if (tmp.startsWith('anonymous')) tmp = tmp.substr('anonymous'.length).trim();
				if (tmp.startsWith('('))         tmp = tmp.substr(1).trim();
				if (tmp.endsWith(')'))           tmp = tmp.substr(0, tmp.length - 1).trim();

				let bindargs = tmp.split(',').map(name => name.trim());
				let check    = bindargs[bindargs.length - 1];
				if (check.includes('\n')) {
					bindargs[bindargs.length - 1] = check.split('\n')[0];
				}


				// Function body
				let i1 = blob.supports.indexOf('{') + 1;
				let i2 = blob.supports.lastIndexOf('}') - 1;
				bindargs.push(blob.supports.substr(i1, i2 - i1));

				this.supports(Function.apply(Function, bindargs));

			}

			if (typeof blob.exports === 'string') {

				// Function head
				let tmp = blob.exports.split('{')[0].trim();
				if (tmp.startsWith('function')) {
					tmp = tmp.substr('function'.length).trim();
				}

				if (tmp.startsWith('anonymous')) tmp = tmp.substr('anonymous'.length).trim();
				if (tmp.startsWith('('))         tmp = tmp.substr(1).trim();
				if (tmp.endsWith(')'))           tmp = tmp.substr(0, tmp.length - 1).trim();

				let bindargs = tmp.split(',').map(name => name.trim());
				let check    = bindargs[bindargs.length - 1];
				if (check.includes('\n')) {
					bindargs[bindargs.length - 1] = check.split('\n')[0];
				}


				// Function body
				let i1 = blob.exports.indexOf('{') + 1;
				let i2 = blob.exports.lastIndexOf('}') - 1;
				bindargs.push(blob.exports.substr(i1, i2 - i1));

				this.exports(Function.apply(Function, bindargs));

			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')  states.id  = this.id;
			if (this.url !== '') states.url = this.url;


			if (Object.keys(this._attaches).length > 0) {

				blob.attaches = {};

				for (let aid in this._attaches) {

					let asset = this._attaches[aid];
					if (asset.url.startsWith('/tmp/Dummy') === false) {

						let data = lychee.serialize(asset);
						if (data !== null) {
							blob.attaches[aid] = data;
						}

					}

				}

			}

			if (Object.keys(this._tags).length > 0) {

				blob.tags = {};

				for (let tid in this._tags) {
					blob.tags[tid] = this._tags[tid];
				}

			}

			if (this._requires.length > 0)          blob.requires = this._requires.slice(0);
			if (this._includes.length > 0)          blob.includes = this._includes.slice(0);
			if (this._supports instanceof Function) blob.supports = this._supports.toString();
			if (this._exports instanceof Function)  blob.exports  = this._exports.toString();


			return {
				'constructor': 'lychee.Definition',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				if (id.includes('.') && /^([A-Za-z0-9-.]+)$/g.test(id)) {

					this.id = id;

					return true;

				} else {

					let fuzzed = _fuzz_id.call(this);
					if (fuzzed !== null) {

						this.id = fuzzed;

						console.warn('lychee.Definition: Injecting Identifier "' + fuzzed + '" ("' + this.url + '").');

						return true;

					} else {

						console.error('lychee.Definition: Invalid Identifier "' + id + '" ("' + this.url + '").');

					}

				}

			}


			return false;

		},

		setUrl: function(url) {

			url = typeof url === 'string' ? url : null;


			if (url !== null) {

				this.url = url;

				return true;

			}


			return false;

		},

		attaches: function(map) {

			map = map instanceof Object ? map : null;


			if (map !== null) {

				for (let id in map) {

					let value = map[id];
					if (value !== undefined) {
						this._attaches[id] = map[id];
					}

				}

			}


			return this;

		},

		check: function(target) {

			target = target instanceof Object ? target : {};


			let features  = null;
			let supported = true;
			let tagged    = true;


			for (let key in this._tags) {

				let tag = this._tags[key];
				let val = target[key] || null;
				if (val instanceof Array) {

					if (val.includes(tag) === false) {
						tagged = false;
						break;
					}

				} else if (typeof val === 'string') {

					if (val !== tag) {
						tagged = false;
						break;
					}

				}

			}


			if (this._supports !== null) {

				supported = false;


				let platform = this._tags.platform || null;
				if (platform !== null) {

					let detector = _create_detector(platform);
					if (detector !== null) {
						supported = this._supports.call(detector, lychee, detector);
						features  = JSON.parse(JSON.stringify(detector));
						detector  = null;
					} else {
						supported = this._supports.call(global, lychee, global);
					}

				} else {

					supported = this._supports.call(global, lychee, global);

				}

			}


			return {
				features:  features,
				supported: supported,
				tagged:    tagged
			};

		},

		export: function(sandbox) {

			sandbox = sandbox !== undefined ? sandbox : global;


			let check = _resolve.call(sandbox, this.id);
			if (check === null) {

				let console   = sandbox.console || global.console;
				let id        = this.id;
				let namespace = _resolve.call(sandbox, id.split('.').slice(0, -1).join('.'));
				let name      = id.split('.').pop();

				if (this._exports !== null) {

					let includes = this._includes.map(id => _resolve.call(sandbox, id));
					let requires = this._requires.map(id => _resolve.call(sandbox, id));

					if (includes.includes(null) === false && requires.includes(null) === false) {

						let template = null;

						try {

							template = this._exports.call(
								this._exports,
								sandbox.lychee,
								sandbox,
								this._attaches
							) || null;

						} catch (err) {
							lychee.Debugger.report(lychee.environment, err, this);
						}


						if (template !== null) {

							if (includes.length > 0) {

								let own_enums   = null;
								let own_methods = null;
								let own_keys    = Object.keys(template);
								let own_proto   = template.prototype;


								if (own_keys.length > 0) {

									own_enums = {};

									for (let ok = 0, okl = own_keys.length; ok < okl; ok++) {

										let own_key = own_keys[ok];
										if (own_key === own_key.toUpperCase()) {
											own_enums[own_key] = template[own_key];
										}

									}

									if (Object.keys(own_enums).length === 0) {
										own_enums = null;
									}

								}


								if (own_proto instanceof Object) {

									own_methods = {};

									for (let own_method in own_proto) {
										own_methods[own_method] = own_proto[own_method];
									}

									if (Object.keys(own_methods).length === 0) {
										own_methods = null;
									}

								}


								Object.defineProperty(namespace, name, {
									value:        template,
									writable:     false,
									enumerable:   true,
									configurable: false
								});

								namespace[name].displayName = id;
								namespace[name].prototype   = {};


								let tpl_enums   = {};
								let tpl_methods = [ namespace[name].prototype ];


								for (let i = 0, il = includes.length; i < il; i++) {

									let include  = includes[i];
									let inc_keys = Object.keys(include);
									if (inc_keys.length > 0) {

										for (let ik = 0, ikl = inc_keys.length; ik < ikl; ik++) {

											let inc_key = inc_keys[ik];
											if (inc_key === inc_key.toUpperCase()) {
												tpl_enums[inc_key] = include[inc_key];
											}

										}

									}

									tpl_methods.push(include.prototype);

								}


								if (own_enums !== null) {

									for (let e in own_enums) {
										tpl_enums[e] = own_enums[e];
									}

								}

								if (own_methods !== null) {
									tpl_methods.push(own_methods);
								}

								for (let e in tpl_enums) {
									namespace[name][e] = tpl_enums[e];
								}


								Object.assign.apply(lychee, tpl_methods);
								namespace[name].prototype.displayName = id;

								Object.freeze(namespace[name].prototype);


								return true;

							} else {

								namespace[name]             = template;
								namespace[name].displayName = id;


								if (template instanceof Object) {
									Object.freeze(namespace[name]);
								}

								if (namespace[name].prototype instanceof Object) {
									namespace[name].prototype.displayName = id;
									Object.freeze(namespace[name].prototype);
								}


								return true;

							}

						} else {

							namespace[name]                       = function() {
								console.warn('Dummy Composite: Replace me with a real Definition!');
							};
							namespace[name].displayName           = id;
							namespace[name].prototype             = {};
							namespace[name].prototype.displayName = id;

							Object.freeze(namespace[name].prototype);

							console.warn('lychee.Definition ("' + id + '"): Invalid Definition, replaced with Dummy Composite.');


							return true;

						}

					} else {

						let invalid_includes = this._includes.filter((id, i) => includes[i] === null);
						if (invalid_includes.length > 0) {

							for (let i = 0, il = invalid_includes.length; i < il; i++) {
								let tmp = invalid_includes[i];
								console.error('lychee.Definition ("' + id + '"): Invalid Inclusion of "' + tmp + '".');
							}

						}


						let invalid_requires = this._requires.filter((id, r) => requires[r] === null);
						if (invalid_requires.length > 0) {

							for (let i = 0, il = invalid_requires.length; i < il; i++) {
								let tmp = invalid_requires[i];
								console.error('lychee.Definition ("' + id + '"): Invalid Requirement of "' + tmp + '".');
							}

						}

					}

				}


				return false;

			}


			return true;

		},

		exports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {

				let check = (callback).toString().split('{')[0];
				if (check.includes('\n')) {
					check = check.split('\n').join('');
				}

				if (check.includes('(lychee, global, attachments)') || check.includes('(lychee,global,attachments)')) {
					this._exports = callback;
				} else {
					console.error('lychee.Definition ("' + this.id + '"): Invalid exports callback.');
					console.info('lychee.Definition ("' + this.id + '"): Use lychee.define(id).exports(function(lychee, global, attachments) {}).');
				}

			}


			return this;

		},

		includes: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (let d = 0, dl = definitions.length; d < dl; d++) {

					let definition = definitions[d];
					if (typeof definition === 'string') {

						let is_definition = definition.includes('.');
						if (is_definition === true) {

							if (this._includes.includes(definition) === false) {
								this._includes.push(definition);
							}

						}

					} else {
						console.warn('lychee.Definition ("' + this.id + '"): Invalid Inclusion #' + d + '.');
					}

				}

			}


			return this;

		},

		requires: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (let d = 0, dl = definitions.length; d < dl; d++) {

					let definition = definitions[d];
					if (typeof definition === 'string') {

						let is_definition = definition.includes('.');
						if (is_definition === true) {

							if (this._requires.includes(definition) === false) {
								this._requires.push(definition);
							}

						}

					} else {
						console.warn('lychee.Definition ("' + this.id + '"): Invalid Requirement #' + d + '.');
					}

				}

			}


			return this;

		},

		supports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {

				let check = (callback).toString().split('{')[0];
				if (check.includes('\n')) {
					check = check.split('\n').join('');
				}

				if (check.includes('(lychee, global)') || check.includes('(lychee,global')) {
					this._supports = callback;
				} else {
					console.error('lychee.Definition ("' + this.id + '"): Invalid supports callback.');
					console.info('lychee.Definition ("' + this.id + '"): Use lychee.specify(id).supports(function(lychee, global) {}).');
				}

			}


			return this;

		},

		tags: function(map) {

			map = map instanceof Object ? map : null;


			if (map !== null) {

				for (let tag in map) {

					let val = map[tag];
					if (typeof val === 'string') {
						this._tags[tag] = val;
					} else {
						console.warn('lychee.Definition ("' + this.id + '"): Invalid Tag "' + tag + '".');
					}

				}

			}


			return this;

		}

	};


	Composite.displayName           = 'lychee.Definition';
	Composite.prototype.displayName = 'lychee.Definition';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Environment = typeof lychee.Environment !== 'undefined' ? lychee.Environment : (function(global) {

	let   _id      = 0;
	const _console = global.console;
	const _lychee  = global.lychee;



	/*
	 * EVENTS
	 */

	const _build_loop = function(cache) {

		let load        = cache.load;
		let required_by = cache.required_by;
		let trace       = cache.trace;


		for (let l = 0, ll = load.length; l < ll; l++) {

			let identifier = load[l];
			let definition = this.definitions[identifier] || null;
			if (definition !== null) {

				if (trace.indexOf(identifier) === -1) {
					trace.push(identifier);
				}

				required_by.splice(l, 1);
				load.splice(l, 1);

				ll--;
				l--;

			}

		}


		for (let t = 0, tl = trace.length; t < tl; t++) {

			let identifier = trace[t];
			let definition = this.definitions[identifier] || null;
			if (definition !== null) {

				let dependencies = _resolve_dependencies.call(this, definition);
				if (dependencies.length > 0) {

					for (let d = 0, dl = dependencies.length; d < dl; d++) {

						let dependency = dependencies[d];
						if (load.indexOf(dependency) === -1 && trace.indexOf(dependency) === -1) {

							let result = this.load(dependency);
							if (result === true) {
								required_by.push(identifier);
								load.push(dependency);
							}

						}

					}

				} else {

					definition.export(this.global);

					trace.splice(t, 1);
					tl--;
					t--;

				}

			}

		}


		if (load.length === 0 && trace.length === 0) {

			cache.active = false;

		} else {

			if (Date.now() > cache.timeout) {
				cache.active = false;
			}

		}

	};

	const _on_build_success = function(cache, callback) {

		if (this.debug === true) {
			this.global.console.info('lychee.Environment ("' + this.id + '"): BUILD END (' + (cache.end - cache.start) + 'ms).');
		}


		try {
			callback.call(this.global, this.global);
		} catch (err) {
			_lychee.Debugger.report(this, err, null);
		}

	};

	const _on_build_timeout = function(cache, callback) {

		if (this.debug === true) {
			this.global.console.warn('lychee.Environment ("' + this.id + '"): BUILD TIMEOUT (' + (cache.end - cache.start) + 'ms).');
		}


		// XXX: Always show Dependency Errors
		if (cache.load.length > 0) {

			let variant = this.variant;
			if (variant === 'library') {

				this.global.console.warn('lychee.Environment ("' + this.id + '"): Invalid Dependencies\n' + cache.load.map((dependency, index) => {

					let requiree = cache.required_by[index] || null;
					if (requiree === null) {
						requiree = this.target;
					}

					return '\t - ' + dependency + ' (required by ' + requiree + ')';

				}).join('\n'));

				cache.load.forEach((dependency, index) => {

					let requiree = cache.required_by[index] || null;
					if (requiree === null) {
						requiree = this.target;
					}

					let definition = this.definitions[requiree] || null;
					if (definition !== null) {

						let i0 = definition._includes.indexOf(dependency);
						let i1 = definition._requires.indexOf(dependency);

						if (i0 !== -1 || i1 !== -1) {
							this.global.console.warn('lychee.Environment ("' + this.id + '"): -> Removing "' + dependency + '" from "' + definition.id + '".');
						}

						if (i0 !== -1) {
							definition._includes.splice(i0, 1);
						}

						if (i1 !== -1) {
							definition._requires.splice(i1, 1);
						}

					}


					let target = this.definitions[this.target] || null;
					if (target !== null) {

						let i0 = target._includes.indexOf(dependency);
						let i1 = target._requires.indexOf(dependency);

						if (i0 !== -1 || i1 !== -1) {
							this.global.console.warn('lychee.Environment ("' + this.id + '"): -> Removing "' + dependency + '" from "' + target.id + '".');
						}

						if (i0 !== -1) {
							target._includes.splice(i0, 1);
						}

						if (i1 !== -1) {
							target._requires.splice(i1, 1);
						}

					}

				});

			} else {

				this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Dependencies\n' + cache.load.map((dependency, index) => {

					let requiree = cache.required_by[index] || null;
					if (requiree === null) {
						requiree = this.target;
					}

					return '\t - ' + dependency + ' (required by ' + requiree + ')';

				}).join('\n'));

			}

		}


		// XXX: Always show Cyclic Dependencies
		if (cache.trace.length > 0) {

			let cyclic_dependencies = {};

			cache.trace.forEach(id => {

				let definition = this.definitions[id] || null;
				if (definition !== null) {

					for (let i = 0, il = definition._requires.length; i < il; i++) {

						let require = definition._requires[i];
						if (cache.trace.includes(require)) {

							let entry = cyclic_dependencies[id] || null;
							if (entry === null) {
								entry = cyclic_dependencies[id] = [];
							}

							entry.push(require);

						}

					}

					for (let i = 0, il = definition._includes.length; i < il; i++) {

						let include = definition._includes[i];
						if (cache.trace.includes(include)) {

							let entry = cyclic_dependencies[id] || null;
							if (entry === null) {
								entry = cyclic_dependencies[id] = [];
							}

							entry.push(include);

						}

					}

				}

			});


			for (let id in cyclic_dependencies) {

				let entry = cyclic_dependencies[id];

				for (let e = 0, el = entry.length; e < el; e++) {

					let other = cyclic_dependencies[entry[e]] || [];
					if (other.includes(id) === false) {
						delete cyclic_dependencies[id];
						break;
					}

				}

			}


			let entries = Object.values(cyclic_dependencies);
			if (entries.length > 0) {

				let requirees = Object.keys(cyclic_dependencies);

				this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Dependencies\n' + entries.map((dependencies, index) => {
					return dependencies.map(dependency => '\t - ' + dependency + ' (required by ' + requirees[index] + ')').join('\n');
				}).join('\n'));

			}

		}


		try {
			callback.call(this.global, null);
		} catch (err) {
			_lychee.Debugger.report(this, err, null);
		}

	};



	/*
	 * HELPERS
	 */

	const _inject_features = function(source, features) {

		Object.keys(features).forEach(key => {

			let type = features[key];
			if (/boolean|number|string|function/g.test(type)) {

				this[key] = source[key];

			} else if (typeof type === 'object') {

				if (typeof source[key] === 'object') {

					this[key] = source[key];

					_inject_features.call(this[key], source[key], type);

				}

			}

		});

	};

	const _validate_definition = function(definition) {

		if (definition instanceof _lychee.Definition) {

			let check = definition.check(this.tags);
			let type  = this.type;


			if (check.features !== null) {

				if (type === 'source' || type === 'export') {
					this.__features = _lychee.assignunlink(this.__features, check.features);
				}

				let sandbox = this.sandbox;
				if (sandbox === true) {
					_inject_features.call(this.global, global, check.features);
				}

			}


			if (type === 'build') {

				if (check.tagged === false) {
					let info = Object.keys(this.tags).length > 0 ? (' (missing tags(' + JSON.stringify(this.tags) + ')).') : '.';
					this.global.console.warn('lychee.Environment ("' + this.id + '"): Untagged Definition "' + definition.id + '"' + info);
				}

				return check.tagged;

			} else if (type === 'export') {

				if (check.tagged === false) {
					let info = Object.keys(this.tags).length > 0 ? (' (missing tags(' + JSON.stringify(this.tags) + ')).') : '.';
					this.global.console.warn('lychee.Environment ("' + this.id + '"): Untagged Definition "' + definition.id + '"' + info);
				}

				return check.tagged;

			} else if (type === 'source') {

				if (check.supported === false) {

					let platforms = this.tags.platform || [];
					if (platforms.length > 0) {
						let info = platforms.map(val => 'lychee.FEATURES[\'' + val + '\']').join(' or ');
						this.global.console.warn('lychee.Environment ("' + this.id + '"): Unsupported Definition "' + definition.id + '" (missing ' + info + ' entry).');
					}

				}

				if (check.tagged === false) {
					let info = Object.keys(this.tags).length > 0 ? (' (missing tags(' + JSON.stringify(this.tags) + ')).') : '.';
					this.global.console.warn('lychee.Environment ("' + this.id + '"): Untagged Definition "' + definition.id + '"' + info);
				}

				return check.supported && check.tagged;

			}

		}


		return false;

	};

	const _resolve = function(identifier) {

		let pointer = this;
		let path    = identifier.split('.');

		for (let p = 0, pl = path.length; p < pl; p++) {

			let name = path[p];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else if (pointer[name] === undefined) {
				pointer = null;
				break;
			}

		}

		return pointer;

	};

	const _resolve_dependencies = function(definition) {

		let dependencies = [];

		if (definition instanceof _lychee.Definition) {

			for (let i = 0, il = definition._includes.length; i < il; i++) {

				let inc   = definition._includes[i];
				let check = _resolve.call(this.global, inc);
				if (check === null) {
					dependencies.push(inc);
				}

			}

			for (let r = 0, rl = definition._requires.length; r < rl; r++) {

				let req   = definition._requires[r];
				let check = _resolve.call(this.global, req);
				if (check === null) {
					dependencies.push(req);
				}

			}

		}

		return dependencies;

	};



	/*
	 * STRUCTS
	 */

	const _CRUX_CORE = [
		'assignsafe',
		'assignunlink',
		'blobof',
		'diff',
		'enumof',
		'interfaceof',
		'deserialize',
		'serialize',
		'assimilate',
		'define',
		'export',
		'import',
		'init',
		'inject',
		'pkg',
		'specify',
		'setEnvironment',
		'setSimulation'
	];

	const _CRUX_DEFINITIONS = [
		'Asset',
		'Debugger',
		'Definition',
		'Environment',
		'Package',
		'Simulation',
		'Specification'
	];

	const _Sandbox = function(settings, platforms) {

		settings  = settings instanceof Object ? settings  : null;
		platforms = platforms instanceof Array ? platforms : [];


		let _std_err = '';
		let _std_out = '';


		this.console = {};
		this.console.log = function() {

			let str = '\n';

			for (let a = 0, al = arguments.length; a < al; a++) {

				let arg = arguments[a];
				if (arg instanceof Object) {
					str += JSON.stringify(arg, null, '\t');
				} else if (typeof arg.toString === 'function') {
					str += arg.toString();
				} else {
					str += arg;
				}

				if (a < al - 1) {
					str += '\t';
				}

			}


			if (str.startsWith('\n(E)\t')) {
				_std_err += str;
			} else {
				_std_out += str;
			}

		};

		this.console.info = function() {

			let args = [ '(I)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.warn = function() {

			let args = [ '(W)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.error = function() {

			let args = [ '(E)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.deserialize = function(blob) {

			if (typeof blob.stdout === 'string') {
				_std_out = blob.stdout;
			}

			if (typeof blob.stderr === 'string') {
				_std_err = blob.stderr;
			}

		};

		this.console.serialize = function() {

			let blob = {};


			if (_std_out.length > 0) blob.stdout = _std_out;
			if (_std_err.length > 0) blob.stderr = _std_err;


			return {
				'reference': 'console',
				'blob':      Object.keys(blob).length > 0 ? blob : null
			};

		};


		this.Buffer  = global.Buffer;
		this.Config  = global.Config;
		this.Font    = global.Font;
		this.Music   = global.Music;
		this.Sound   = global.Sound;
		this.Texture = global.Texture;


		this.lychee              = {};
		this.lychee.debug        = global.lychee.debug;
		this.lychee.environment  = null;
		this.lychee.simulation   = null;
		this.lychee.ENVIRONMENTS = global.lychee.ENVIRONMENTS;
		this.lychee.FEATURES     = global.lychee.FEATURES;
		this.lychee.FILENAME     = global.lychee.FILENAME;
		this.lychee.PLATFORMS    = global.lychee.PLATFORMS;
		this.lychee.SIMULATIONS  = global.lychee.SIMULATIONS;
		this.lychee.ROOT         = {};
		this.lychee.ROOT.lychee  = global.lychee.ROOT.lychee;
		this.lychee.ROOT.project = global.lychee.ROOT.project;
		this.lychee.VERSION      = global.lychee.VERSION;


		_CRUX_CORE.forEach(identifier => {
			this.lychee[identifier] = _lychee[identifier];
		});

		_CRUX_DEFINITIONS.forEach(identifier => {
			this.lychee[identifier] = _lychee[identifier];
		});


		this.require = function(path) {
			return global.require(path);
		};

		this.setTimeout = function(callback, timeout) {
			global.setTimeout(callback, timeout);
		};

		this.setInterval = function(callback, interval) {
			global.setInterval(callback, interval);
		};



		/*
		 * GLOBAL INJECTION
		 */

		if (settings instanceof Object) {

			Object.keys(settings).forEach(key => {

				let instance = _lychee.deserialize(settings[key]);
				if (instance !== null) {
					this[key] = instance;
				}

			});

		}

		/*
		 * FEATURE INJECTION
		 */

		if (platforms.length > 0) {

			platforms.reverse().forEach(platform => {

				let features = _lychee.FEATURES[platform] || null;
				if (features instanceof Object) {

					for (let gid in features) {

						if (this[gid] === undefined) {

							let reference = global[gid];
							if (reference instanceof Object) {

								this[gid] = reference;

							} else if (typeof reference === 'function') {

								this[gid] = function() {
									return global[gid].apply(global, arguments);
								};

							} else {

								this[gid] = reference;

							}

						}

					}

				}

			});

		}

	};

	_Sandbox.prototype = {

		displayName: '_Sandbox',

		deserialize: function(blob) {

			if (blob.console instanceof Object) {
				this.console.deserialize(blob.console.blob);
			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			Object.keys(this).filter(key => key.charAt(0) !== '_' && key === key.toUpperCase()).forEach(key => {
				states[key] = _lychee.serialize(this[key]);
			});


			blob.lychee          = {};
			blob.lychee.debug    = this.lychee.debug;
			blob.lychee.FILENAME = this.lychee.FILENAME;
			blob.lychee.VERSION  = this.lychee.VERSION;
			blob.lychee.ROOT     = this.lychee.ROOT;


			let data = this.console.serialize();
			if (data.blob !== null) {
				blob.console = data;
			}


			return {
				'constructor': '_Sandbox',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id          = 'lychee-Environment-' + _id++;
		this.debug       = true;
		this.definitions = {};
		this.global      = global !== undefined ? global : {};
		this.packages    = {};
		this.sandbox     = false;
		this.tags        = {};
		this.target      = 'app.Main';
		this.timeout     = 10000;
		this.type        = 'source';
		this.variant     = 'application';

		this.__cache    = {
			active:        false,
			assimilations: [],
			start:         0,
			end:           0,
			retries:       0,
			timeout:       0,
			load:          [],
			trace:         [],
			required_by:   []
		};
		this.__features = {};


		// Alternative API for lychee.pkg

		if (states.packages instanceof Array) {

			this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Packages.');
			delete states.packages;

		} else if (states.packages instanceof Object) {

			for (let pid in states.packages) {

				let value = states.packages[pid];
				if (typeof value === 'string') {

					states.packages[pid] = new _lychee.Package({
						id:          pid,
						url:         value,
						type:        'source',
						environment: this
					});

				}

			}

		}


		this.setSandbox(states.sandbox);
		this.setDebug(states.debug);

		this.setDefinitions(states.definitions);
		this.setId(states.id);
		this.setPackages(states.packages);
		this.setTags(states.tags);
		this.setTimeout(states.timeout);
		this.setVariant(states.variant);

		// Needs this.packages to be ready
		this.setType(states.type);

		// Needs this.type to be ready
		this.setTarget(states.target);


		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.definitions instanceof Object) {

				for (let did in blob.definitions) {
					this.definitions[did] = _lychee.deserialize(blob.definitions[did]);
				}

			}

			let features = _lychee.deserialize(blob.features);
			if (features !== null) {
				this.__features = features;
			}

			if (blob.global instanceof Object) {

				this.global = new _Sandbox(blob.global.arguments[0], this.tags.platform || null);

				if (blob.global.blob !== null) {
					this.global.deserialize(blob.global.blob);
				}

			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')                 states.id      = this.id;
			if (this.debug !== true)            states.debug   = this.debug;
			if (this.sandbox !== false)         states.sandbox = this.sandbox;
			if (this.timeout !== 10000)         states.timeout = this.timeout;
			if (this.target !== 'app.Main')     states.target  = this.target;
			if (this.type !== 'source')         states.type    = this.type;
			if (this.variant !== 'application') states.variant = this.variant;


			if (Object.keys(this.packages).length > 0) {

				states.packages = {};

				for (let pid in this.packages) {
					states.packages[pid] = this.packages[pid].url;
				}

			}

			if (Object.keys(this.tags).length > 0) {

				states.tags = {};

				for (let tagid in this.tags) {
					states.tags[tagid] = this.tags[tagid];
				}

			}


			if (Object.keys(this.definitions).length > 0) {

				blob.definitions = {};

				for (let did in this.definitions) {
					blob.definitions[did] = _lychee.serialize(this.definitions[did]);
				}

			}

			if (Object.keys(this.__features).length > 0) blob.features = _lychee.serialize(this.__features);

			if (this.sandbox === true) {
				blob.global = this.global.serialize();
			}


			return {
				'constructor': 'lychee.Environment',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		load: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let tmp    = identifier.split('.');
				let pkg_id = tmp[0];
				let def_id = tmp.slice(1).join('.');


				let definition = this.definitions[identifier] || null;
				if (definition !== null) {

					return true;

				} else if (pkg_id === 'lychee' && _CRUX_DEFINITIONS.includes(def_id) === true) {

					return true;

				} else {

					let pkg = this.packages[pkg_id] || null;
					if (pkg !== null && pkg.config !== null) {

						let result = pkg.load(def_id, this.tags);
						if (result === true) {

							if (this.debug === true) {
								this.global.console.log('lychee.Environment ("' + this.id + '"): Loading "' + identifier + '" from Package "' + pkg.id + '".');
							}

						}

						return result;

					}

				}

			}


			return false;

		},

		define: function(definition, inject) {

			definition = definition instanceof _lychee.Definition ? definition : null;
			inject     = inject === true;


			if (definition !== null) {

				let url = definition.url || null;
				if (url !== null && inject === false) {

					let assimilation = true;
					let new_pkg_id   = null;
					let old_pkg_id   = definition.id.split('.')[0];
					let packages     = this.packages;

					for (let pid in packages) {

						let pkg = packages[pid];

						if (url.startsWith(pkg.root)) {
							new_pkg_id = pkg.id;
						}

						if (pid === old_pkg_id || pid === new_pkg_id) {
							assimilation = false;
						}

					}


					if (assimilation === true) {

						if (this.debug === true) {
							this.global.console.log('lychee.Environment ("' + this.id + '"): Assimilating Definition "' + definition.id + '".');
						}


						this.__cache.assimilations.push(definition.id);

					} else if (new_pkg_id !== null && new_pkg_id !== old_pkg_id) {

						if (this.debug === true) {
							this.global.console.log('lychee.Environment ("' + this.id + '"): Injecting Definition "' + definition.id + '" into Package "' + new_pkg_id + '".');
						}


						definition.id = new_pkg_id + '.' + definition.id.split('.').slice(1).join('.');

						for (let i = 0, il = definition._includes.length; i < il; i++) {

							let inc = definition._includes[i];
							if (inc.startsWith(old_pkg_id)) {
								definition._includes[i] = new_pkg_id + inc.substr(old_pkg_id.length);
							}

						}

						for (let r = 0, rl = definition._requires.length; r < rl; r++) {

							let req = definition._requires[r];
							if (req.startsWith(old_pkg_id)) {
								definition._requires[r] = new_pkg_id + req.substr(old_pkg_id.length);
							}

						}

					}

				} else {

					// XXX: Direct injection has no auto-mapping

				}


				if (_validate_definition.call(this, definition) === true) {

					if (this.debug === true) {
						let info = Object.keys(definition._tags).length > 0 ? (' (' + JSON.stringify(definition._tags) + ')') : '.';
						this.global.console.log('lychee.Environment ("' + this.id + '"): Mapping Definition "' + definition.id + '"' + info);
					}

					this.definitions[definition.id] = definition;


					return true;

				}

			}


			let info = Object.keys(definition._tags).length > 0 ? (' (' + JSON.stringify(definition._tags) + ').') : '.';
			this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Definition "' + definition.id + '"' + info);


			return false;

		},

		init: function(callback) {

			callback = callback instanceof Function ? callback : function() {};


			if (this.debug === true) {
				this.global.lychee.ENVIRONMENTS[this.id] = this;
			}


			let cache  = this.__cache;
			let target = this.target;

			if (target !== null && cache.active === false) {

				let result = this.load(target);
				if (result === true) {

					if (this.debug === true) {
						this.global.console.info('lychee.Environment ("' + this.id + '"): BUILD START ("' + target + '").');
					}


					cache.start       = Date.now();
					cache.timeout     = Date.now() + this.timeout;
					cache.load        = [ target ];
					cache.trace       = [];
					cache.required_by = [];
					cache.active      = true;


					let interval = setInterval(_ => {

						let cache = this.__cache;
						if (cache.active === true) {

							_build_loop.call(this, cache);

						} else if (cache.active === false) {

							if (interval !== null) {
								clearInterval(interval);
								interval = null;
							}


							let assimilations = cache.assimilations;
							if (assimilations.length > 0) {

								for (let a = 0, al = assimilations.length; a < al; a++) {

									let identifier = assimilations[a];
									let definition = this.definitions[identifier] || null;
									if (definition !== null) {
										definition.export(this.global);
									}

								}

							}


							cache.end = Date.now();


							if (cache.end > cache.timeout) {
								_on_build_timeout.call(this, cache, callback);
							} else {
								_on_build_success.call(this, cache, callback);
							}

						}

					}, (1000 / 60) | 0);

				} else {

					cache.retries++;


					if (cache.retries < 10) {

						if (this.debug === true) {
							this.global.console.warn('lychee.Environment ("' + this.id + '"): Unready Package "' + target + '" (retrying in 100ms ...).');
						}

						setTimeout(_ => this.init(callback), 100);

					} else {

						this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Dependencies\n\t - ' + target + ' (target).');


						try {
							callback.call(this.global, null);
						} catch (err) {
							_lychee.Debugger.report(this, err, null);
						}

					}

				}


				return true;

			}


			try {
				callback.call(this.global, null);
			} catch (err) {
				_lychee.Debugger.report(this, err, null);
			}


			return false;

		},

		resolve: function(path) {

			path = typeof path === 'string' ? path : '';


			let proto = path.split(':')[0] || '';
			if (/^http|https/g.test(proto) === false) {

				if (path.startsWith('/tmp') === false && path.startsWith(_lychee.ROOT.lychee) === false) {

					if (path.startsWith('/')) {
						path = _lychee.ROOT.lychee + path;
					} else {
						path = _lychee.ROOT.project + '/' + path;
					}

				}

			}


			let tmp = path.split('/');

			for (let t = 0, tl = tmp.length; t < tl; t++) {

				if (tmp[t] === '.') {
					tmp.splice(t, 1);
					tl--;
					t--;
				} else if (tmp[t] === '..') {
					tmp.splice(t - 1, 2);
					tl -= 2;
					t  -= 2;
				}

			}

			return tmp.join('/');

		},

		setDebug: function(debug) {

			debug = typeof debug === 'boolean' ? debug : null;


			if (debug !== null) {

				this.debug = debug;

				if (this.sandbox === true) {
					this.global.lychee.debug = debug;
				}

				return true;

			}


			return false;

		},

		setDefinitions: function(definitions) {

			definitions = definitions instanceof Object ? definitions : null;


			if (definitions !== null) {

				for (let identifier in definitions) {

					let definition = definitions[identifier];
					if (definition instanceof _lychee.Definition) {
						this.definitions[identifier] = definition;
					}

				}


				return true;

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;

				return true;

			}


			return false;

		},

		setPackages: function(packages) {

			packages = packages instanceof Object ? packages : null;


			if (packages !== null) {

				for (let pid in this.packages) {

					if (pid !== 'lychee') {
						this.packages[pid].setEnvironment(null);
						delete this.packages[pid];
					}

				}


				for (let pid in packages) {

					let pkg = packages[pid];
					if (pkg instanceof _lychee.Package) {

						if (this.debug === true) {
							this.global.console.log('lychee.Environment ("' + this.id + '"): Adding Package "' + pkg.id + '".');
						}

						pkg.setEnvironment(this);
						this.packages[pid] = pkg;

					}

				}


				let type = this.type;
				if (/^(export|source)$/g.test(type)) {

					let lychee_pkg = this.packages['lychee'] || null;
					if (lychee_pkg === null) {

						lychee_pkg = new _lychee.Package({
							id:          'lychee',
							url:         '/libraries/lychee/lychee.pkg',
							environment: this
						});

						if (this.debug === true) {
							this.global.console.log('lychee.Environment ("' + this.id + '"): Injecting Package "lychee".');
						}

						this.packages['lychee'] = lychee_pkg;

					}

				}

				return true;

			}


			return false;

		},

		setSandbox: function(sandbox) {

			sandbox = typeof sandbox === 'boolean' ? sandbox : null;


			if (sandbox !== null) {

				if (sandbox !== this.sandbox) {

					this.sandbox = sandbox;


					if (sandbox === true) {

						this.global = new _Sandbox(null, this.tags.platform || null);
						this.global.lychee.setEnvironment(this);

					} else {

						this.global = global;

					}

				}


				return true;

			}


			return false;

		},

		setTags: function(tags) {

			tags = tags instanceof Object ? tags : null;


			if (tags !== null) {

				this.tags = {};

				for (let type in tags) {

					let values = tags[type];
					if (values instanceof Array) {
						this.tags[type] = values.filter(value => typeof value === 'string');
					}

				}

				return true;

			}


			return false;

		},

		setTimeout: function(timeout) {

			timeout = typeof timeout === 'number' ? (timeout | 0) : null;


			if (timeout !== null) {

				this.timeout = timeout;

				return true;

			}


			return false;

		},

		setTarget: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let type = this.type;
				if (type === 'build') {

					this.target = identifier;

					return true;

				} else {

					let pid = identifier.split('.')[0];
					let pkg = this.packages[pid] || null;
					if (pkg !== null) {

						this.target = identifier;

						return true;

					}

				}

			}


			return false;

		},

		setType: function(type) {

			type = typeof type === 'string' ? type : null;


			if (type !== null) {

				if (/^(build|export|source)$/g.test(type)) {

					this.type = type;


					if (type === 'export') {
						type = 'source';
					}


					for (let pid in this.packages) {
						this.packages[pid].setType(type);
					}


					return true;

				}

			}


			return false;

		},

		setVariant: function(variant) {

			variant = typeof variant === 'string' ? variant : null;


			if (variant !== null) {

				if (/^(application|library)$/g.test(variant)) {

					this.variant = variant;

					return true;

				}


			}


			return false;

		}

	};


	Composite.displayName           = 'lychee.Environment';
	Composite.prototype.displayName = 'lychee.Environment';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Package = typeof lychee.Package !== 'undefined' ? lychee.Package : (function(global) {

	const lychee = global.lychee;


	/*
	 * HELPERS
	 */

	const _fuzz_id = function() {

		let found = null;

		if (this.url !== null) {

			let url = this.url;
			if (url.includes('/libraries/')) {

				let ns    = url.split('/');
				let tmp_i = ns.indexOf('libraries');
				let tmp_s = ns[tmp_i + 1] || '';

				if (tmp_s !== '') {
					found = tmp_s;
				}

			}

		}

		return found;

	};

	const _resolve_root = function() {

		let root = this.root;
		let type = this.type;

		if (type === 'api') {
			root += '/api';
		} else if (type === 'build') {
			root += '/build';
		} else if (type === 'review') {
			root += '/review';
		} else if (type === 'source') {
			root += '/source';
		}

		return root;

	};

	const _CORE_MAP = {
		'':              'lychee',
		'Asset':         'Asset',
		'Debugger':      'Debugger',
		'Definition':    'Definition',
		'Environment':   'Environment',
		'Package':       'Package',
		'Simulation':    'Simulation',
		'Specification': 'Specification'
	};

	const _resolve_path = function(candidate) {

		let config = this.config;
		let path   = typeof candidate === 'string' ? candidate.split('/') : null;

		if (config !== null && path !== null) {

			let pointer = config.buffer[this.type].files || null;

			if (pointer !== null) {

				for (let p = 0, pl = path.length; p < pl; p++) {

					let name = path[p];
					if (pointer[name] !== undefined) {
						pointer = pointer[name];
					} else {
						pointer = null;
						break;
					}

				}

			}

			return pointer;

		}


		return null;

	};

	const _resolve_attachments = function(candidate) {

		let config      = this.config;
		let attachments = {};

		if (config !== null) {

			let pointer = _resolve_path.call(this, candidate);
			if (pointer !== null && pointer instanceof Array) {

				let definition_path = _resolve_root.call(this) + '/' + candidate;

				for (let po = 0, pol = pointer.length; po < pol; po++) {

					let type = pointer[po];
					if (type !== 'js') {
						attachments[type] = definition_path + '.' + type;
					}

				}

			}

		}

		return attachments;

	};

	const _resolve_candidates = function(id, tags) {

		tags = tags instanceof Object ? tags : null;


		let candidatepath = id.split('.').join('/');
		let candidates    = [];

		if (tags !== null) {

			for (let tag in tags) {

				let values = [];

				if (tags[tag] instanceof Array) {

					let tmp = tags[tag].map(value => _resolve_tag.call(this, tag, value) + '/' + candidatepath);
					if (tmp.length > 0) {
						values = tmp.filter(path => _resolve_path.call(this, path) !== null);
					}

				}

				if (values.length > 0) {
					candidates.push.apply(candidates, values);
				}

			}

		}


		let core_path = _CORE_MAP[candidatepath] || null;
		if (core_path !== null && this.id === 'lychee' && this.type !== 'source') {

			candidates.push(core_path);

		} else {

			if (_resolve_path.call(this, candidatepath) !== null) {
				candidates.push(candidatepath);
			}

		}


		return candidates;

	};

	const _resolve_namespaces = function(node, namespaces, path) {

		namespaces = namespaces instanceof Array ? namespaces : [];
		path       = typeof path === 'string'    ? path       : '';


		if (node instanceof Array) {

			// Ignore Arrays specifically

		} else if (node instanceof Object) {

			if (path !== '' && namespaces.includes(path) === false) {
				namespaces.push(path);
			}

			Object.keys(node).forEach(child => {

				if (child.includes('__') === false) {

					if (node[child] instanceof Array) {
						// Ignore Arrays specifically
					} else {
						_resolve_namespaces(node[child], namespaces, (path !== '' ? (path + '.') : '') + child);
					}

				}

			});

		}

	};

	const _resolve_files = function(node, files, path, extensions) {

		files      = files instanceof Array   ? files : [];
		path       = typeof path === 'string' ? path  : '';
		extensions = extensions === true;


		if (node instanceof Array) {

			if (extensions === true) {

				for (let n = 0, nl = node.length; n < nl; n++) {
					files.push(path + '.' + node[n]);
				}

			} else {

				files.push(path);

			}

		} else if (node instanceof Object) {

			Object.keys(node).forEach(child => {

				if (child.includes('__') === false) {
					_resolve_files(node[child], files, path + '/' + child, extensions);
				}

			});

		}

		return files;

	};

	const _resolve_tag = function(tag, value) {

		tag   = typeof tag === 'string'   ? tag   : null;
		value = typeof value === 'string' ? value : null;


		let config = this.config;

		if (config !== null && tag !== null && value !== null) {

			let pointer = config.buffer[this.type].tags || null;
			if (pointer !== null) {

				if (pointer[tag] instanceof Object) {

					let path = pointer[tag][value] || null;
					if (path !== null) {
						return path;
					}

				}

			}

		}


		return '';

	};

	const _sort_by_tag = function(a, b) {

		let rank_a = 0;
		let rank_b = 0;

		let check_a = a.includes('-');
		let check_b = b.includes('-');

		if (check_a && check_b) {

			let tmp_a = a.split('-');
			let tmp_b = b.split('-');

			if (tmp_a[0] > tmp_b[0]) rank_a += 3;
			if (tmp_b[0] > tmp_a[0]) rank_b += 3;

			if (tmp_a[0] === tmp_b[0]) {
				if (tmp_a[1] > tmp_b[1]) rank_a += 1;
				if (tmp_b[1] > tmp_a[1]) rank_b += 1;
			}

		} else if (check_a && !check_b) {

			let tmp_a = a.split('-');

			if (tmp_a[0] > b)   rank_a += 3;
			if (b > tmp_a[0])   rank_b += 3;
			if (tmp_a[0] === b) rank_b += 1;

		} else if (!check_a && check_b) {

			let tmp_b = b.split('-');

			if (a > tmp_b[0])   rank_a += 3;
			if (tmp_b[0] > a)   rank_b += 3;
			if (a === tmp_b[0]) rank_a += 1;

		} else {

			if (a > b) rank_a += 3;
			if (b > a) rank_b += 3;

		}

		if (rank_a > rank_b) return  1;
		if (rank_b > rank_a) return -1;
		return 0;

	};

	const _validate_env_tags = function(source_tags, target_tags) {

		for (let tag in source_tags) {

			let source_value = source_tags[tag];
			let target_value = target_tags[tag] || null;
			if (target_value !== null) {

				if (source_value instanceof Array && target_value instanceof Array) {

					let valid = true;

					for (let t = 0, tl = target_value.length; t < tl; t++) {

						let check = source_value.includes(target_value[t]);
						if (check === false) {
							valid = false;
							break;
						}

					}

					if (valid === false) {
						return false;
					}

				} else if (source_value instanceof Array && typeof target_value === 'string') {

					let check = source_value.includes(target_value);
					if (check === false) {
						return false;
					}

				} else if (typeof source_value === 'string' && typeof target_value === 'string') {

					let check = source_value === target_value;
					if (check === false) {
						return false;
					}

				} else if (typeof source_value === 'string' && target_value instanceof Array) {

					let check = target_value.includes(source_value);
					if (check === false) {
						return false;
					}

				}

			}

		}


		return true;

	};

	const _load_candidate = function(id, candidates) {

		if (candidates.length > 0) {

			let map = {
				id:           id,
				candidate:    null,
				candidates:   Array.from(candidates),
				attachments:  [],
				dependencies: [],
				loading:      1,
				type:         this.type
			};


			this.__requests[id] = map;


			let candidate = map.candidates.shift();

			while (candidate !== undefined) {

				if (this.__blacklist[candidate] === 1) {
					candidate = map.candidates.shift();
				} else {
					break;
				}

			}


			// Try to load the first suggested Candidate Implementation
			if (candidate !== undefined) {

				let url            = _resolve_root.call(this) + '/' + candidate + '.js';
				let implementation = new lychee.Asset(url, null, false);
				let attachments    = _resolve_attachments.call(this, candidate);

				if (implementation !== null) {
					_load_candidate_implementation.call(this, candidate, implementation, attachments, map);
				}

			}

		}

	};

	const _load_candidate_implementation = function(candidate, implementation, attachments, map) {

		let type       = map.type;
		let identifier = this.id + '.' + map.id;
		if (identifier.endsWith('.')) {
			identifier = identifier.substr(0, identifier.length - 1);
		}


		implementation.onload = result => {

			map.loading--;


			if (result === true) {

				if (type === 'export' || type === 'source') {

					let environment = this.environment || null;
					if (environment !== null) {

						let definition = environment.definitions[identifier] || null;
						if (definition !== null) {

							map.candidate = this;


							let attachment_ids = Object.keys(attachments);
							if (attachment_ids.length > 0) {

								// Temporarily remove definition to prevent misusage
								delete environment.definitions[identifier];

								map.loading += attachment_ids.length;


								attachment_ids.forEach(assetId => {

									let url   = attachments[assetId];
									let asset = new lychee.Asset(url, null, true);
									if (asset !== null) {

										asset.onload = function(result) {

											map.loading--;

											let tmp = {};
											if (result === true) {
												tmp[assetId] = this;
											} else {
												tmp[assetId] = null;
											}

											definition.attaches(tmp);


											if (map.loading === 0) {
												environment.definitions[identifier] = definition;
											}

										};

										asset.load();

									} else {

										map.loading--;

									}

								});

							}


							for (let i = 0, il = definition._includes.length; i < il; i++) {
								environment.load(definition._includes[i]);
							}

							for (let r = 0, rl = definition._requires.length; r < rl; r++) {
								environment.load(definition._requires[r]);
							}

						} else {

							// Invalid Definition format
							delete environment.definitions[identifier];

						}

					}

				} else if (type === 'review') {

					let simulation = this.simulation || null;
					if (simulation !== null) {

						let specification = simulation.specifications[identifier] || null;
						if (specification !== null) {

							for (let r = 0, rl = specification._requires.length; r < rl; r++) {
								simulation.load(specification._requires[r]);
							}

						} else {

							// Invalid Specification format
							delete simulation.specifications[identifier];

						}

					}

				}

			}


			this.__blacklist[candidate] = 1;

			// Load next candidate, if any available
			if (map.candidates.length > 0) {
				_load_candidate.call(this, map.id, map.candidates);
			}

		};

		implementation.load();

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id          = 'app';
		this.config      = null;
		this.environment = null;
		this.root        = null;
		this.simulation  = null;
		this.type        = 'source';
		this.url         = null;

		this.__blacklist = {};
		this.__requests  = {};
		this.__warnings  = {};


		let check = states.id || null;
		if (check !== null && /^([a-z]+)$/g.test(check)) {
			this.setId(states.id);
			this.setUrl(states.url);
		} else {
			this.setUrl(states.url);
			this.setId(states.id);
		}


		this.setEnvironment(states.environment);
		this.setSimulation(states.simulation);
		this.setType(states.type);

		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.config instanceof Object) {
				this.config = lychee.deserialize(blob.config);
			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')         states.id   = this.id;
			if (this.type !== 'source') states.type = this.type;
			if (this.url !== '')        states.url  = this.url;


			if (this.config !== null) {
				blob.config = lychee.serialize(this.config);
			}


			return {
				'constructor': 'lychee.Package',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		getDefinitions: function(tags) {

			tags = tags instanceof Object ? tags : null;


			let filtered = [];

			let config = this.config || null;
			if (config !== null) {

				let buffer = config.buffer || null;
				if (buffer !== null) {

					let files = [];
					let type  = this.type;
					let root  = buffer[type].files || null;

					if (root !== null) {
						_resolve_files(root, files, '', false);
					}

					if (tags !== null) {

						for (let tag in tags) {

							if (tags[tag] instanceof Array) {

								for (let t = 0, tl = tags[tag].length; t < tl; t++) {

									let value  = tags[tag][t];
									let prefix = _resolve_tag.call(this, tag, value);

									for (let f = 0, fl = files.length; f < fl; f++) {

										let file = files[f];
										if (file.startsWith('/' + prefix + '/')) {

											let id = file.substr(1 + prefix.length + 1).split('/').join('.');
											if (filtered.includes(id) === false) {
												filtered.push(id);
											}

										}

									}

								}

							} else if (typeof tags[tag] === 'string') {

								let value  = tags[tag];
								let prefix = _resolve_tag.call(this, tag, value);

								for (let f = 0, fl = files.length; f < fl; f++) {

									let file = files[f];
									if (file.startsWith('/' + prefix + '/')) {

										let id = file.substr(1 + prefix.length + 1).split('/').join('.');
										if (filtered.includes(id) === false) {
											filtered.push(id);
										}

									}

								}

							}

						}

					} else {

						let tags     = [];
						let prefixes = [];
						let pointer  = config.buffer[this.type].tags || null;
						if (pointer !== null) {

							for (let tag in pointer) {

								tags.push(tag);


								let pkg_tags = pointer[tag];
								if (pkg_tags instanceof Object) {

									for (let id in pkg_tags) {

										let prefix = pkg_tags[id] || null;
										if (prefix !== null) {
											prefixes.push(prefix);
										}

									}

								}

							}

						}


						for (let f = 0, fl = files.length; f < fl; f++) {

							let file = files[f];

							for (let p = 0, pl = prefixes.length; p < pl; p++) {

								let prefix = prefixes[p];

								if (file.startsWith('/' + prefix + '/')) {

									let id = file.substr(1 + prefix.length + 1).split('/').join('.');
									if (filtered.includes(id) === false) {
										filtered.push(id);
									}

								} else {

									let untagged = true;

									for (let t = 0, tl = tags.length; t < tl; t++) {

										let tag = tags[t];

										if (file.startsWith('/' + tag)) {
											untagged = false;
											break;
										}

									}

									if (untagged === true) {

										let id = file.substr(1).split('/').join('.');
										if (filtered.includes(id) === false) {
											filtered.push(id);
										}

									}

								}

							}

						}

					}

				}

			}

			filtered = filtered.sort();


			return filtered;

		},

		getEnvironments: function(tags) {

			tags = tags instanceof Object ? tags : null;


			let filtered = [];

			let config = this.config || null;
			if (config !== null) {

				let buffer = config.buffer || null;
				if (buffer !== null) {

					let type         = this.type;
					let environments = buffer[type].environments || null;

					if (environments !== null) {

						for (let id in environments) {

							let environment = lychee.assignunlink({
								id: id
							}, environments[id]);


							if (tags !== null) {

								let valid = _validate_env_tags(environment.tags || {}, tags);
								if (valid === true) {
									filtered.push(environment);
								}

							} else {

								filtered.push(environment);

							}

						}

					}

				}

			}

			filtered = filtered.sort((a, b) => _sort_by_tag(a.id, b.id));


			return filtered;

		},

		getFiles: function(tags) {

			tags = tags instanceof Object ? tags : null;


			let filtered = [];

			let config = this.config || null;
			if (config !== null) {

				let buffer = config.buffer || null;
				if (buffer !== null) {

					let files = [];
					let type  = this.type;
					let root  = buffer[type].files || null;

					if (root !== null) {
						_resolve_files(root, files, '', true);
					}

					if (tags !== null) {

						for (let tag in tags) {

							if (tags[tag] instanceof Array) {

								for (let t = 0, tl = tags[tag].length; t < tl; t++) {

									let value  = tags[tag][t];
									let prefix = _resolve_tag.call(this, tag, value);

									for (let f = 0, fl = files.length; f < fl; f++) {

										let file = files[f];
										if (file.startsWith('/' + prefix + '/')) {
											filtered.push(file.substr(1));
										}

									}

								}

							} else if (typeof tags[tag] === 'string') {

								let value  = tags[tag];
								let prefix = _resolve_tag.call(this, tag, value);

								for (let f = 0, fl = files.length; f < fl; f++) {

									let file = files[f];
									if (file.startsWith('/' + prefix + '/')) {
										filtered.push(file.substr(1));
									}

								}

							}

						}

					} else {

						for (let f = 0, fl = files.length; f < fl; f++) {
							filtered.push(files[f].substr(1));
						}

					}

				}

			}

			filtered = filtered.sort();


			return filtered;

		},

		getNamespaces: function(tags) {

			tags = tags instanceof Object ? tags : null;


			let filtered = [];

			let config = this.config || null;
			if (config !== null) {

				let buffer = config.buffer || null;
				if (buffer !== null) {

					let namespaces = [];
					let type       = this.type;
					let root       = buffer[type].files || null;

					if (root !== null) {
						_resolve_namespaces(root, namespaces, '');
					}

					if (tags !== null) {

						for (let tag in tags) {

							if (tags[tag] instanceof Array) {

								for (let t = 0, tl = tags[tag].length; t < tl; t++) {

									let value  = tags[tag][t];
									let prefix = _resolve_tag.call(this, tag, value).split('/').join('.');

									for (let n = 0, nl = namespaces.length; n < nl; n++) {

										let namespace = namespaces[n];
										if (namespace.startsWith(prefix + '.')) {

											let id = namespace.substr(prefix.length + 1);
											if (filtered.includes(id) === false) {
												filtered.push(id);
											}

										}

									}

								}

							} else if (typeof tags[tag] === 'string') {

								let value  = tags[tag];
								let prefix = _resolve_tag.call(this, tag, value).split('/').join('.');

								for (let n = 0, nl = namespaces.length; n < nl; n++) {

									let namespace = namespaces[n];
									if (namespace.startsWith(prefix + '.')) {

										let id = namespace.substr(prefix.length + 1);
										if (filtered.includes(id) === false) {
											filtered.push(id);
										}

									}

								}

							}

						}

					} else {

						let tags     = [];
						let prefixes = [];
						let pointer  = config.buffer[this.type].tags || null;
						if (pointer !== null) {

							for (let tag in pointer) {

								tags.push(tag);


								let pkg_tags = pointer[tag];
								if (pkg_tags instanceof Object) {

									for (let id in pkg_tags) {

										let prefix = pkg_tags[id] || null;
										if (prefix !== null) {
											prefixes.push(prefix.split('/').join('.'));
										}

									}

								}

							}

						}


						for (let n = 0, nl = namespaces.length; n < nl; n++) {

							let namespace = namespaces[n];

							for (let p = 0, pl = prefixes.length; p < pl; p++) {

								let prefix = prefixes[p];

								if (namespace.startsWith(prefix + '.')) {

									let id = namespace.substr(prefix.length + 1);
									if (filtered.includes(id) === false) {
										filtered.push(id);
									}

								} else {

									let untagged = true;

									for (let t = 0, tl = tags.length; t < tl; t++) {

										let tag = tags[t];

										if (namespace.startsWith(tag)) {
											untagged = false;
											break;
										}

									}

									if (untagged === true) {

										let id = namespace;
										if (filtered.includes(id) === false) {
											filtered.push(id);
										}

									}

								}

							}

						}

					}

				}

			}

			filtered = filtered.sort();


			return filtered;

		},

		getSimulations: function(tags) {

			tags = tags instanceof Object ? tags : null;


			let filtered = [];

			let config = this.config || null;
			if (config !== null) {

				let buffer = config.buffer || null;
				if (buffer !== null) {

					let type        = this.type;
					let simulations = buffer[type].simulations || null;

					if (simulations !== null) {

						for (let id in simulations) {

							let simulation = lychee.assignunlink({
								id: id
							}, simulations[id]);


							let environment = simulation.environment || null;
							if (environment instanceof Object && tags !== null) {

								let valid = _validate_env_tags(environment.tags || {}, tags);
								if (valid === true) {
									filtered.push(simulation);
								}

							} else {

								filtered.push(simulation);

							}

						}

					}

				}

			}

			filtered = filtered.sort((a, b) => _sort_by_tag(a.id, b.id));


			return filtered;

		},

		load: function(id, tags) {

			id   = typeof id === 'string' ? id   : null;
			tags = tags instanceof Object ? tags : null;


			let config = this.config;

			if (id !== null && config !== null) {

				let request = this.__requests[id] || null;
				if (request === null) {

					let candidates = _resolve_candidates.call(this, id, tags);
					if (candidates.length > 0) {

						_load_candidate.call(this, id, candidates);

						return true;

					} else {

						let check = this.__warnings[id] || null;
						if (check === null) {

							if (tags !== null) {
								let info = Object.keys(tags).length > 0 ? (' (' + JSON.stringify(tags) + ').') : '.';
								console.error('lychee.Package ("' + this.id + '"): Invalid Definition "' + id + '"' + info);
							} else {
								console.error('lychee.Package ("' + this.id + '"): Invalid Definition "' + id + '".');
							}

							this.__warnings[id] = 1;

						}

						return false;

					}

				} else {

					return true;

				}

			}


			return false;

		},

		resolve: function(id, tags) {

			id   = typeof id === 'string' ? id   : null;
			tags = tags instanceof Object ? tags : null;


			let config   = this.config;
			let filtered = [];

			if (id !== null && config !== null) {

				let candidates = _resolve_candidates.call(this, id, tags);
				if (candidates.length > 0) {

					for (let c = 0, cl = candidates.length; c < cl; c++) {
						filtered.push(candidates[c]);
					}

				}

			}

			return filtered;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && /^([a-z]+)$/g.test(id)) {

				this.id = id;

				return true;

			} else {

				let fuzzed = _fuzz_id.call(this);
				if (fuzzed !== null) {

					this.id = fuzzed;

					console.warn('lychee.Package: Injecting Identifier "' + fuzzed + '" ("' + this.url + '").');

					return true;

				} else if (id !== null) {

					console.error('lychee.Package: Invalid Identifier "' + id + '" ("' + this.url + '").');

				}

			}


			return false;

		},

		setUrl: function(url) {

			url = typeof url === 'string' ? url : null;


			if (url !== null && url.endsWith('/lychee.pkg')) {

				this.config = null;
				this.root   = url.split('/').slice(0, -1).join('/');
				this.url    = url;


				let config = new Config(url);

				config.onload = result => {

					let buffer = config.buffer || null;
					if (
						buffer !== null
						&& buffer instanceof Object
						&& buffer.build instanceof Object
						&& buffer.review instanceof Object
						&& buffer.source instanceof Object
					) {

						console.info('lychee.Package ("' + this.id + '"): Config "' + config.url + '" ready.');

						this.config = config;

					} else {

						console.error('lychee.Package ("' + this.id + '"): Config "' + config.url + '" corrupt.');

					}

				};

				config.load();


				return true;

			}


			return false;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;

				return true;

			} else {

				this.environment = null;

			}


			return false;

		},

		setSimulation: function(simulation) {

			simulation = simulation instanceof lychee.Simulation ? simulation : null;


			if (simulation !== null) {

				this.simulation = simulation;

				return true;

			} else {

				this.simulation = null;

			}


			return false;

		},

		setType: function(type) {

			type = typeof type === 'string' ? type : null;


			if (type !== null) {

				if (/^(api|build|review|source)$/g.test(type)) {

					this.type = type;

					return true;

				}

			}


			return false;

		}

	};


	Composite.displayName           = 'lychee.Package';
	Composite.prototype.displayName = 'lychee.Package';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Simulation = typeof lychee.Simulation !== 'undefined' ? lychee.Simulation : (function(global) {

	let   _id      = 0;
	const _console = global.console;
	const _lychee  = global.lychee;



	/*
	 * HELPERS
	 */

	const _get_debug = function() {

		let debug       = _lychee.debug;
		let environment = this.environment;
		if (environment !== null) {
			debug = environment.debug;
		}

		return debug;

	};

	const _get_console = function() {

		let console     = _console;
		let environment = this.environment;
		if (environment !== null) {
			console = environment.global.console;
		}

		return console;

	};

	const _get_global = function() {

		let pointer     = global;
		let environment = this.environment;
		if (environment !== null) {
			pointer = environment.global;
		}

		return pointer;

	};

	const _build_loop = function(cache) {

		let load  = cache.load;
		let trace = cache.trace;


		for (let l = 0, ll = load.length; l < ll; l++) {

			let identifier    = load[l];
			let specification = this.specifications[identifier] || null;
			if (specification !== null) {

				if (trace.indexOf(identifier) === -1) {
					trace.push(identifier);
				}

				load.splice(l, 1);
				ll--;
				l--;

			}

		}


		for (let t = 0, tl = trace.length; t < tl; t++) {

			let identifier = trace[t];
			let specification = this.specifications[identifier] || null;
			if (specification !== null) {

				let dependencies = _resolve_dependencies.call(this, specification);
				if (dependencies.length > 0) {

					for (let d = 0, dl = dependencies.length; d < dl; d++) {

						let dependency = dependencies[d];
						if (load.indexOf(dependency) === -1 && trace.indexOf(dependency) === -1) {

							this.load(dependency);
							load.push(dependency);

						}

					}

				} else {

					specification.export(this.sandboxes);

					trace.splice(t, 1);
					tl--;
					t--;

				}

			}

		}


		if (load.length === 0 && trace.length === 0) {

			cache.active = false;

		} else {

			if (Date.now() > cache.timeout) {
				cache.active = false;
			}

		}

	};

	const _on_build_success = function(cache, callback) {

		let console     = _get_console.call(this);
		let debug       = _get_debug.call(this);
		let environment = this.environment;
		let sandboxes   = this.sandboxes;


		if (debug === true) {
			console.info('lychee.Simulation ("' + this.id + '"): BUILD END (' + (cache.end - cache.start) + 'ms).');
		}


		try {
			callback.call(environment.global, sandboxes);
		} catch (err) {
			_lychee.Debugger.report(environment, err, null);
		}

	};

	const _on_build_timeout = function(cache, callback) {

		let console     = _get_console.call(this);
		let debug       = _get_debug.call(this);
		let environment = this.environment;


		if (debug === true) {
			console.warn('lychee.Simulation ("' + this.id + '"): BUILD TIMEOUT (' + (cache.end - cache.start) + 'ms).');
		}


		if (cache.load.length > 0) {
			console.error('lychee.Simulation ("' + this.id + '"): Invalid Dependencies\n' + cache.load.map(value => '\t - ' + value).join('\n') + '.');
		}


		try {
			callback.call(environment.global, null);
		} catch (err) {
			_lychee.Debugger.report(environment, err, null);
		}

	};

	const _resolve = function(identifier) {

		let pointer   = this;
		let namespace = identifier.split('.');
		let id        = namespace.pop();

		for (let n = 0, nl = namespace.length; n < nl; n++) {

			let name = namespace[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		let check = id.toLowerCase();
		if (check === id) {

			if (pointer[id] === undefined) {
				pointer[id] = {};
			}

			return pointer[id];

		} else {

			if (pointer[id] !== undefined) {
				return pointer[id];
			}

		}


		return null;

	};

	const _resolve_dependencies = function(specification) {

		let dependencies = [];

		if (specification instanceof _lychee.Specification) {

			for (let r = 0, rl = specification._requires.length; r < rl; r++) {

				let req   = specification._requires[r];
				let check = _resolve.call(this.sandboxes, req);
				if (check === null) {
					dependencies.push(req);
				}

			}

		}

		return dependencies;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id             = 'lychee-Simulation-' + _id++;
		this.environment    = null;
		this.specifications = {};
		this.target         = 'app.Main';
		this.timeout        = 10000;

		this.sandboxes  = {};
		this.__cache    = {
			active:        false,
			assimilations: [],
			start:         0,
			end:           0,
			retries:       0,
			timeout:       0,
			load:          [],
			trace:         []
		};
		this.__packages = {};


		this.setId(states.id);
		this.setSpecifications(states.specifications);
		this.setEnvironment(states.environment);
		this.setTimeout(states.timeout);

		// Needs this.__packages to be ready
		this.setTarget(states.target);


		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.specifications instanceof Object) {

				for (let id in blob.specifications) {
					this.specifications[id] = lychee.deserialize(blob.specifications[id]);
				}

			}

			if (blob.environment instanceof Object) {
				this.setEnvironment(lychee.deserialize(blob.environment));
			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')             states.id      = this.id;
			if (this.target !== 'app.Main') states.target  = this.target;
			if (this.timeout !== 10000)     states.timeout = this.timeout;


			if (Object.keys(this.specifications).length > 0) {

				blob.specifications = {};

				for (let sid in this.specifications) {
					blob.specifications[sid] = lychee.serialize(this.specifications[sid]);
				}

			}


			return {
				'constructor': 'lychee.Simulation',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		load: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let tmp    = identifier.split('.');
				let pkg_id = tmp[0];
				let def_id = tmp.slice(1).join('.');


				let specification = this.specifications[identifier] || null;
				if (specification !== null) {

					return true;

				} else {

					let pkg = this.__packages[pkg_id] || null;
					if (pkg !== null && pkg.config !== null) {

						let result = pkg.load(def_id);
						if (result === true) {

							let debug = _get_debug.call(this);
							if (debug === true) {
								console.log('lychee.Simulation ("' + this.id + '"): Loading "' + identifier + '" from Package "' + pkg.id + '".');
							}

						}

						return result;

					}

				}

			}


			return false;

		},

		specify: function(specification, inject) {

			specification = specification instanceof lychee.Specification ? specification : null;
			inject        = inject === true;


			let console = _get_console.call(this);
			let debug   = _get_debug.call(this);


			if (specification !== null) {

				let url = specification.url || null;
				if (url !== null && inject === false) {

					let old_pkg_id   = specification.id.split('.')[0];
					let new_pkg_id   = null;
					let assimilation = true;


					let packages = this.__packages;

					for (let pid in packages) {

						let pkg = packages[pid];

						if (url.startsWith(pkg.root)) {
							new_pkg_id = pkg.id;
						}

						if (pid === old_pkg_id || pid === new_pkg_id) {
							assimilation = false;
						}

					}


					if (assimilation === true) {

						if (debug === true) {
							console.log('lychee.Simulation ("' + this.id + '"): Assimilating Specification "' + specification.id + '".');
						}


						this.__cache.assimilations.push(specification.id);

					} else if (new_pkg_id !== null && new_pkg_id !== old_pkg_id) {

						if (debug === true) {
							console.log('lychee.Simulation ("' + this.id + '"): Injecting Specification "' + specification.id + '" into Package "' + new_pkg_id + '".');
						}


						specification.id = new_pkg_id + '.' + specification.id.split('.').slice(1).join('.');

						for (let r = 0, rl = specification._requires.length; r < rl; r++) {

							let req = specification._requires[r];
							if (req.startsWith(old_pkg_id)) {
								specification._requires[r] = new_pkg_id + req.substr(old_pkg_id.length);
							}

						}

					}

				} else {

					// XXX: Direct injection has no auto-mapping

				}


				if (debug === true) {
					console.log('lychee.Simulation ("' + this.id + '"): Mapping Specification "' + specification.id + '".');
				}


				this.specifications[specification.id] = specification;


				return true;

			}


			console.error('lychee.Simulation ("' + this.id + '"): Invalid Specification "' + specification.id + '".');


			return false;

		},

		init: function(callback) {

			callback = callback instanceof Function ? callback : null;


			let cache       = this.__cache;
			let console     = _get_console.call(this);
			let debug       = _get_debug.call(this);
			let environment = this.environment;
			let target      = this.target;


			if (debug === true) {
				global.lychee.SIMULATIONS[this.id] = this;
			}


			if (target !== null && environment !== null && cache.active === false) {

				let result = this.load(target);
				if (result === true) {

					if (debug === true) {
						console.info('lychee.Simulation ("' + this.id + '"): BUILD START ("' + target + '").');
					}


					cache.start   = Date.now();
					cache.timeout = Date.now() + this.timeout;
					cache.load    = [ target ];
					cache.trace   = [];
					cache.active  = true;


					let interval = setInterval(_ => {

						let cache = this.__cache;
						if (cache.active === true) {

							_build_loop.call(this, cache);

						} else if (cache.active === false) {

							if (interval !== null) {
								clearInterval(interval);
								interval = null;
							}


							let assimilations = cache.assimilations;
							if (assimilations.length > 0) {

								for (let a = 0, al = assimilations.length; a < al; a++) {

									let identifier    = assimilations[a];
									let specification = this.specifications[identifier] || null;
									if (specification !== null) {
										specification.export(this.sandboxes);
									}

								}

							}


							cache.end = Date.now();


							if (cache.end > cache.timeout) {
								_on_build_timeout.call(this, cache, callback);
							} else {
								_on_build_success.call(this, cache, callback);
							}

						}

					}, (1000 / 60) | 0);

				} else {

					cache.retries++;


					if (cache.retries < 3) {

						if (debug === true) {
							console.warn('lychee.Simulation ("' + this.id + '"): Unready Package "' + target + '" (retrying in 100ms ...).');
						}

						setTimeout(_ => this.init(callback), 100);

					} else {

						console.error('lychee.Simulation ("' + this.id + '"): Invalid Dependencies\n\t - ' + target + ' (target).');


						try {
							callback.call(environment.global || null, null);
						} catch (err) {
							_lychee.Debugger.report(environment, err, null);
						}

					}

				}


				return true;

			}


			try {
				callback.call(environment.global || null, null);
			} catch (err) {
				_lychee.Debugger.report(environment, err, null);
			}


			return false;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;
				this.__packages  = {};

				for (let pid in environment.packages) {

					let pkg = environment.packages[pid];

					this.__packages[pid] = new lychee.Package({
						id:         pkg.id,
						url:        pkg.url,
						type:       'review',
						simulation: this
					});

				}

				return true;

			} else {

				this.environment = null;
				this.__packages  = {};

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;

				return true;

			}


			return false;

		},

		setSpecifications: function(specifications) {

			specifications = specifications instanceof Object ? specifications : null;


			if (specifications !== null) {

				for (let identifier in specifications) {

					let specification = specifications[identifier];
					if (specification instanceof lychee.Specification) {
						this.specifications[identifier] = specification;
					}

				}


				return true;

			}


			return false;

		},

		setTarget: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let pid = identifier.split('.')[0];
				let pkg = this.__packages[pid] || null;
				if (pkg !== null) {

					this.target = identifier;

					return true;
				}

			}


			return false;

		},

		setTimeout: function(timeout) {

			timeout = typeof timeout === 'number' ? (timeout | 0) : null;


			if (timeout !== null) {

				this.timeout = timeout;

				return true;

			}


			return false;

		}

	};


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Specification = typeof lychee.Specification !== 'undefined' ? lychee.Specification : (function(global) {

	const lychee = global.lychee;



	/*
	 * HELPERS
	 */

	const _fuzz_id = function() {

		let found = null;

		if (this.url !== null) {

			let namespace = null;

			for (let pid in lychee.environment.packages) {

				let pkg  = lychee.environment.packages[pid];
				let base = pkg.url.split('/').slice(0, -1).join('/');

				if (this.url.startsWith(base)) {
					namespace = pkg.id;
				}

			}


			if (namespace !== null) {

				let id    = '';
				let ns    = this.url.split('/');
				let tmp_i = ns.indexOf('review');
				let tmp_s = ns[ns.length - 1];

				if (/\.js$/g.test(tmp_s)) {
					ns[ns.length - 1] = tmp_s.split('.').slice(0, -1).join('.');
				}

				if (tmp_i !== -1 && ns[tmp_i + 1] === 'core') {

					if (ns[tmp_i + 2] === 'lychee') {
						ns.splice(tmp_i + 1, 2);
					} else {
						ns.splice(tmp_i + 1, 1);
					}

				}

				if (tmp_i !== -1) {
					id = ns.slice(tmp_i + 1).join('.');
				}

				if (id !== '') {
					found = namespace + '.' + id;
				} else {
					found = namespace;
				}

			}

		}

		return found;

	};

	const _resolve = function(identifier) {

		let pointer   = this;
		let namespace = identifier.split('.');
		let id        = namespace.pop();

		for (let n = 0, nl = namespace.length; n < nl; n++) {

			let name = namespace[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		let check = id.toLowerCase();
		if (check === id) {

			if (pointer[id] === undefined) {
				pointer[id] = {};
			}

			return pointer[id];

		} else {

			if (pointer[id] !== undefined) {
				return pointer[id];
			}

		}


		return null;

	};

	const _assert = function(a, b) {

		let result = lychee.diff(a, b);
		if (result === false) {
			this.results.ok++;
		}

		this.results.all++;

	};

	const _expect = function(assert, callback) {

		this._expect++;


		callback((a, b) => {
			this._expect--;
			assert(a, b);
		});

	};

	const _Sandbox = function(identifier) {

		this._IDENTIFIER = identifier || null;
		this._INSTANCE   = null;

		this.blob       = {};
		this.states     = {};
		this.properties = {};
		this.enums      = {};
		this.events     = {};
		this.methods    = {};

	};

	_Sandbox.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.instance instanceof Object) {
				this._INSTANCE = lychee.deserialize(blob.instance);
			}

			if (blob.states instanceof Object) {
				this.states = lychee.deserialize(blob.states);
			}

			if (blob.properties instanceof Object) {

				for (let p in blob.properties) {
					this.properties[p] = lychee.deserialize(blob.properties[p]);
				}

			}

			if (blob.enums instanceof Object) {

				for (let e in blob.enums) {
					this.enums[e] = lychee.deserialize(blob.enums[e]);
				}

			}

			if (blob.events instanceof Object) {

				for (let e in blob.events) {
					this.events[e] = lychee.deserialize(blob.events[e]);
				}

			}

			if (blob.methods instanceof Object) {

				for (let m in blob.methods) {
					this.methods[m] = lychee.deserialize(blob.methods[m]);
				}

			}

		},

		serialize: function() {

			let blob = {};


			if (Object.keys(this.states).length > 0) {
				blob.states = lychee.serialize(this.states);
			}

			if (Object.keys(this.properties).length > 0) {

				blob.properties = {};

				for (let p in this.properties) {
					blob.properties[p] = lychee.serialize(this.properties[p]);
				}

			}

			if (Object.keys(this.enums).length > 0) {

				blob.enums = {};

				for (let e in this.enums) {
					blob.enums[e] = lychee.serialize(this.enums[e]);
				}

			}

			if (Object.keys(this.events).length > 0) {

				blob.events = {};

				for (let e in this.events) {
					blob.events[e] = lychee.serialize(this.events[e]);
				}

			}

			if (Object.keys(this.methods).length > 0) {

				blob.methods = {};

				for (let m in this.methods) {
					blob.methods[m] = lychee.serialize(this.methods[m]);
				}

			}


			if (this._INSTANCE !== null) {
				blob.instance = lychee.serialize(this._INSTANCE);
			}


			return {
				'constructor': '_Sandbox',
				'arguments':   [ this._IDENTIFIER ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		evaluate: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {

				let statistics = {
					properties: {},
					enums:      {},
					events:     {},
					methods:    {}
				};


				if (this._IDENTIFIER !== null) {

					let Definition = lychee.import(this._IDENTIFIER);
					if (Definition !== null) {

						if (Definition.prototype instanceof Object) {

							this._INSTANCE = new Definition(this.states);

							if (
								Object.keys(this.blob).length > 0
								&& typeof this._INSTANCE.deserialize === 'function'
							) {
								this._INSTANCE.deserialize(this.blob);
							}

						} else {
							this._INSTANCE = Definition;
						}

					}


					if (this._INSTANCE !== null) {

						for (let id in this.properties) {

							statistics.properties[id] = {
								_expect: 0,
								results: {
									ok:  0,
									all: 0
								}
							};

							let assert = _assert.bind(statistics.properties[id]);
							let expect = _expect.bind(statistics.properties[id], assert);

							this.properties[id].call(this._INSTANCE, assert, expect);

						}

						for (let id in this.enums) {

							statistics.enums[id] = {
								_expect: 0,
								results: {
									ok:  0,
									all: 0
								}
							};

							let assert = _assert.bind(statistics.enums[id]);
							let expect = _expect.bind(statistics.enums[id], assert);

							this.enums[id].call(this._INSTANCE, assert, expect);

						}

						for (let id in this.events) {

							statistics.events[id] = {
								_expect: 0,
								results: {
									ok:  0,
									all: 0
								}
							};

							let assert = _assert.bind(statistics.events[id]);
							let expect = _expect.bind(statistics.events[id], assert);

							this.events[id].call(this._INSTANCE, assert, expect);

						}

						for (let id in this.methods) {

							statistics.methods[id] = {
								_expect: 0,
								results: {
									ok:  0,
									all: 0
								}
							};

							let assert = _assert.bind(statistics.methods[id]);
							let expect = _expect.bind(statistics.methods[id], assert);

							this.methods[id].call(this._INSTANCE, assert, expect);

						}


						let timeout  = Date.now() + 5000;
						let interval = setInterval(_ => {

							if (Date.now() > timeout) {

								clearInterval(interval);
								interval = null;

								callback(statistics);

							} else {

								let stop = true;

								for (let type in statistics) {

									for (let id in statistics[type]) {

										if (statistics[type][id]._expect > 0) {
											stop = false;
											break;
										}

									}

								}

								if (stop === true) {

									clearInterval(interval);
									interval = null;

									callback(statistics);

								}

							}

						}, 500);

					} else {

						if (callback !== null) {
							callback(null);
						}

					}

				} else {

					if (callback !== null) {
						callback(null);
					}

				}

			}

		},

		setBlob: function(blob) {

			blob = blob instanceof Object ? blob : null;


			if (blob !== null) {

				this.blob = blob;

				return true;

			}


			return false;

		},

		setStates: function(states) {

			states = states instanceof Object ? states : null;


			if (states !== null) {

				this.states = states;

				return true;

			}


			return false;

		},

		setEnum: function(name, callback) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;


			if (name !== null && callback !== null) {

				this.enums[name] = callback;

				return true;

			}


			return false;

		},

		setEvent: function(name, callback) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;


			if (name !== null && callback !== null) {

				this.events[name] = callback;

				return true;

			}


			return false;

		},

		setMethod: function(name, callback) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;


			if (name !== null && callback !== null) {

				this.methods[name] = callback;

				return true;

			}


			return false;

		},

		setProperty: function(name, callback) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;


			if (name !== null && callback !== null) {

				this.properties[name] = callback;

				return true;

			}


			return false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id  = '';
		this.url = lychee.FILENAME || null;

		this._requires = [];
		this._exports  = null;


		// XXX: url has to be set first for fuzzing
		this.setUrl(states.url);
		this.setId(states.id);

		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.requires instanceof Array) {
				this.requires(blob.requires);
			}

			if (typeof blob.exports === 'string') {

				// Function head
				let tmp = blob.exports.split('{')[0].trim();
				if (tmp.startsWith('function')) {
					tmp = tmp.substr('function'.length).trim();
				}

				if (tmp.startsWith('anonymous')) tmp = tmp.substr('anonymous'.length).trim();
				if (tmp.startsWith('('))         tmp = tmp.substr(1).trim();
				if (tmp.endsWith(')'))           tmp = tmp.substr(0, tmp.length - 1).trim();

				let bindargs = tmp.split(',').map(name => name.trim());
				let check    = bindargs[bindargs.length - 1];
				if (check.includes('\n')) {
					bindargs[bindargs.length - 1] = check.split('\n')[0];
				}


				// Function body
				let i1 = blob.exports.indexOf('{') + 1;
				let i2 = blob.exports.lastIndexOf('}') - 1;
				bindargs.push(blob.exports.substr(i1, i2 - i1));

				this.exports(Function.apply(Function, bindargs));

			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')  states.id  = this.id;
			if (this.url !== '') states.url = this.url;

			if (this._requires.length > 0)         blob.requires = this._requires.slice(0);
			if (this._exports instanceof Function) blob.exports  = this._exports.toString();


			return {
				'constructor': 'lychee.Specification',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				if (id.includes('.') && /^([A-Za-z0-9-.]+)$/g.test(id)) {

					this.id = id;

					return true;

				} else {

					let fuzzed = _fuzz_id.call(this);
					if (fuzzed !== null) {

						this.id = fuzzed;

						console.warn('lychee.Specification: Injecting Identifier "' + fuzzed + '" ("' + this.url + '").');

						return true;

					} else {

						console.error('lychee.Specification: Invalid Identifier "' + id + '" ("' + this.url + '").');

					}

				}

			}


			return false;

		},

		setUrl: function(url) {

			url = typeof url === 'string' ? url : null;


			if (url !== null) {

				this.url = url;

				return true;

			}


			return false;

		},

		export: function(sandboxes) {

			sandboxes = sandboxes instanceof Object ? sandboxes : global;


			let check = _resolve.call(sandboxes, this.id);
			if (check === null) {

				if (this._exports !== null) {

					let requires = this._requires.map(id => _resolve.call(sandboxes, id));
					if (requires.includes(null) === false) {

						let id        = this.id;
						let namespace = _resolve.call(sandboxes, id.split('.').slice(0, -1).join('.'));
						let name      = id.split('.').pop();
						let sandbox   = new _Sandbox(id);


						try {
							this._exports.call(
								this._exports,
								lychee,
								sandbox
							) || null;
						} catch (err) {
							lychee.Debugger.report(lychee.environment, err, this);
						}


						namespace[name] = sandbox;


						return true;

					} else {

						let invalid_requires = this._requires.filter((id, r) => requires[r] === null);
						if (invalid_requires.length > 0) {

							for (let i = 0, il = invalid_requires.length; i < il; i++) {
								let tmp = invalid_requires[i];
								console.error('lychee.Specification ("' + this.id + '"): Invalid Requirement of "' + tmp + '".');
							}

						}

					}

				}

			}


			return false;

		},

		exports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {

				let check = (callback).toString().split('{')[0];
				if (check.includes('\n')) {
					check = check.split('\n').join('');
				}

				if (check.includes('(lychee, sandbox)') || check.includes('(lychee,sandbox)')) {
					this._exports = callback;
				} else {
					console.error('lychee.Specification ("' + this.id + '"): Invalid exports callback.');
					console.info('lychee.Specification ("' + this.id + '"): Use lychee.specify(id).exports(function(lychee, sandbox) {}).');
				}

			}


			return this;

		},

		requires: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (let d = 0, dl = definitions.length; d < dl; d++) {

					let definition = definitions[d];
					if (typeof definition === 'string') {

						let is_definition = definition.includes('.');
						let is_namespace  = definition === definition.toLowerCase();

						if (is_definition === true) {

							if (this._requires.includes(definition) === false) {
								this._requires.push(definition);
							}

						} else if (is_namespace === true) {
							this._requires.push(definition);
						}

					} else {
						console.warn('lychee.Specification ("' + this.id + '"): Invalid Requirement #' + d + '.');
					}

				}

			}


			return this;

		}

	};


	Composite.displayName           = 'lychee.Specification';
	Composite.prototype.displayName = 'lychee.Specification';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


["html","html-nwjs","html-webview","nidium","node","node-sdl"].forEach(function(platform) {
	if (lychee.PLATFORMS.includes(platform) === false) {
		lychee.PLATFORMS.push(platform);
	}
});


(function(lychee, global) {

	let _std_out = '';
	let _std_err = '';



	/*
	 * HELPERS
	 */

	const _INDENT     = '    ';
	const _WHITESPACE = new Array(512).fill(' ').join('');

	const _format_date = function(n) {
		return n < 10 ? '0' + n : '' + n;
	};

	const _stringify = function(data, indent) {

		indent = typeof indent === 'string' ? indent : '';


		let str = '';

		if (
			typeof data === 'boolean'
			|| data === null
			|| data === undefined
			|| (
				typeof data === 'number'
				&& (
					data === Infinity
					|| data === -Infinity
					|| isNaN(data) === true
				)
			)
		) {

			if (data === null) {
				str = indent + 'null';
			} else if (data === undefined) {
				str = indent + 'undefined';
			} else if (data === false) {
				str = indent + 'false';
			} else if (data === true) {
				str = indent + 'true';
			} else if (data === Infinity) {
				str = indent + 'Infinity';
			} else if (data === -Infinity) {
				str = indent + '-Infinity';
			} else if (isNaN(data) === true) {
				str = indent + 'NaN';
			}

		} else if (typeof data === 'number') {

			str = indent + data.toString();

		} else if (typeof data === 'string') {

			str = indent + '"' + data + '"';

		} else if (typeof data === 'function') {

			let body   = data.toString().split('\n');
			let offset = 0;

			let first = body.find(ch => ch.startsWith('\t')) || null;
			if (first !== null) {

				let check = /(^\t+)/g.exec(first);
				if (check !== null) {
					offset = Math.max(0, check[0].length - indent.length);
				}

			}


			for (let b = 0, bl = body.length; b < bl; b++) {

				let line = body[b];
				if (line.startsWith('\t')) {
					str += indent + line.substr(offset);
				} else {
					str += indent + line;
				}

				str += '\n';

			}

		} else if (data instanceof Array) {

			let is_primitive = data.find(val => val instanceof Object || typeof val === 'function') === undefined;
			let dimension    = Math.sqrt(data.length, 2);
			let is_matrix    = dimension === (dimension | 0);

			if (data.length === 0) {

				str = indent + '[]';

			} else if (is_primitive === true && is_matrix === true) {

				let max = 0;

				for (let d = 0, dl = data.length; d < dl; d++) {
					max = Math.max(max, (data[d]).toString().length);
				}


				str  = indent;
				str += '[\n';

				for (let y = 0; y < dimension; y++) {

					str += '\t' + indent;

					for (let x = 0; x < dimension; x++) {

						let tmp = (data[x + y * dimension]).toString();
						if (tmp.length < max) {
							str += _WHITESPACE.substr(0, max - tmp.length);
						}

						str += tmp;

						if (x < dimension - 1) {
							str += ', ';
						}

					}

					if (y < dimension - 1) {
						str += ',';
					}

					str += '\n';

				}

				str += indent + ']';

			} else if (is_primitive === true) {

				str  = indent;
				str += '[';

				for (let d = 0, dl = data.length; d < dl; d++) {

					if (d === 0) {
						str += ' ';
					}

					str += _stringify(data[d]);

					if (d < dl - 1) {
						str += ', ';
					} else {
						str += ' ';
					}

				}

				str += ']';

			} else {

				str  = indent;
				str += '[\n';

				for (let d = 0, dl = data.length; d < dl; d++) {

					str += _stringify(data[d], '\t' + indent);

					if (d < dl - 1) {
						str += ',';
					}

					str += '\n';

				}

				str += indent + ']';

			}

		} else if (data instanceof Date) {

			str  = indent;

			str += data.getUTCFullYear()                + '-';
			str += _format_date(data.getUTCMonth() + 1) + '-';
			str += _format_date(data.getUTCDate())      + 'T';
			str += _format_date(data.getUTCHours())     + ':';
			str += _format_date(data.getUTCMinutes())   + ':';
			str += _format_date(data.getUTCSeconds())   + 'Z';

		} else if (data instanceof Object) {

			let keys = Object.keys(data);
			if (keys.length === 0) {

				str = indent + '{}';

			} else {

				str  = indent;
				str += '{\n';

				for (let k = 0, kl = keys.length; k < kl; k++) {

					let key = keys[k];

					str += '\t' + indent + '"' + key + '": ';
					str += _stringify(data[key], '\t' + indent).trim();

					if (k < kl - 1) {
						str += ',';
					}

					str += '\n';

				}

				str += indent + '}';

			}

		}


		return str;

	};

	const _args_to_string = function(args, offset) {

		offset = typeof offset === 'number' ? offset : null;


		let output  = [];
		let columns = process.stdout.columns;

		for (let a = 0, al = args.length; a < al; a++) {

			let value = args[a];
			let o     = 0;

			if (typeof value === 'function') {

				let tmp = (value).toString().split('\n');

				for (let t = 0, tl = tmp.length; t < tl; t++) {
					output.push(tmp[t].replace(/\t/g, _INDENT));
				}

				o = output.length - 1;

			} else if (value instanceof Object) {

				let tmp = _stringify(value).split('\n');
				if (tmp.length > 1) {

					for (let t = 0, tl = tmp.length; t < tl; t++) {
						output.push(tmp[t].replace(/\t/g, _INDENT));
					}

					o = output.length - 1;

				} else {

					let chunk = output[o];
					if (chunk === undefined) {
						output[o] = tmp[0].trim();
					} else {
						output[o] = (chunk + ' ' + tmp[0]).trim();
					}

				}

			} else if (typeof value === 'string' && value.includes('\n')) {

				let tmp = value.split('\n');

				for (let t = 0, tl = tmp.length; t < tl; t++) {
					output.push(tmp[t].replace(/\t/g, _INDENT));
				}

				o = output.length - 1;

			} else {

				let chunk = output[o];
				if (chunk === undefined) {
					output[o] = ('' + value).replace(/\t/g, _INDENT).trim();
				} else {
					output[o] = (chunk + (' ' + value).replace(/\t/g, _INDENT)).trim();
				}

			}

		}


		let ol = output.length;
		if (ol > 1) {

			if (offset !== null) {

				for (let o = 0; o < ol; o++) {

					let line = output[o];
					let maxl = (o === 0 || o === ol - 1) ? (columns - offset) : columns;
					if (line.length > maxl) {
						output[o] = line.substr(0, maxl);
					} else {
						output[o] = line + _WHITESPACE.substr(0, maxl - line.length);
					}

				}

			}


			return output.join('\n');

		} else {

			if (offset !== null) {

				let line = output[0];
				let maxl = columns - offset * 2;
				if (line.length > maxl) {
					line = line.substr(0, maxl);
				} else {
					line = line + _WHITESPACE.substr(0, maxl - line.length);
				}

				return line;

			}


			return output[0];

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	console.clear = function() {

		// clear screen
		// process.stdout.write('\x1B[2J');

		// clear screen and reset cursor
		process.stdout.write('\x1B[2J\x1B[0f');

		// clear scroll buffer
		process.stdout.write('\u001b[3J');

	};

	console.log = function() {

		let al   = arguments.length;
		let args = [ '(L)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += _args_to_string(args) + '\n';

		process.stdout.write('\u001b[49m\u001b[97m ' + _args_to_string(args, 1) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	};

	console.info = function() {

		let al   = arguments.length;
		let args = [ '(I)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += _args_to_string(args) + '\n';

		process.stdout.write('\u001b[42m\u001b[97m ' + _args_to_string(args, 1) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	};

	console.warn = function() {

		let al   = arguments.length;
		let args = [ '(W)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += _args_to_string(args) + '\n';

		process.stdout.write('\u001b[43m\u001b[97m ' + _args_to_string(args, 1) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	};

	console.error = function() {

		let al   = arguments.length;
		let args = [ '(E)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_err += _args_to_string(args) + '\n';

		process.stderr.write('\u001b[41m\u001b[97m ' + _args_to_string(args, 1) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	};

	console.deserialize = function(blob) {

		if (typeof blob.stdout === 'string') {
			_std_out = blob.stdout;
		}

		if (typeof blob.stderr === 'string') {
			_std_err = blob.stderr;
		}

	};

	console.serialize = function() {

		let blob = {};


		if (_std_out.length > 0) blob.stdout = _std_out;
		if (_std_err.length > 0) blob.stderr = _std_err;


		return {
			'reference': 'console',
			'blob':      Object.keys(blob).length > 0 ? blob : null
		};

	};

})(lychee, global);


(function(lychee, global) {

	(function(process, selfpath) {

		let tmp1 = selfpath.indexOf('/libraries/lychee');
		if (tmp1 !== -1) {
			lychee.ROOT.lychee = selfpath.substr(0, tmp1);
		}

		let tmp2 = selfpath.split('/').slice(0, 3).join('/');
		if (tmp2.startsWith('/opt/lycheejs')) {
			lychee.ROOT.lychee = tmp2;
		}

		let tmp3 = process.env.LYCHEEJS_ROOT || '';
		if (tmp3 !== '') {
			lychee.ROOT.lychee = tmp3;
		}

		let cwd = typeof process.cwd === 'function' ? process.cwd() : '';
		if (cwd !== '') {
			lychee.ROOT.project = cwd;
		}

	})(global.process || {}, typeof __filename === 'string' ? __filename : '');



	/*
	 * POLYFILLS
	 */

	const _META_KEYCODE     = /^(?:\x1b)([a-zA-Z0-9])$/;
	const _FUNCTION_KEYCODE = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/;

	const _parse_keypress   = function(str) {

		let parts;


		if (Buffer.isBuffer(str)) {

			if (str[0] > 127 && str[1] === undefined) {
				str[0] -= 128;
				str = '\x1b' + str.toString('utf8');
			} else {
				str = str.toString('utf8');
			}

		}


		let key = {
			name:  null,
			ctrl:  false,
			meta:  false,
			shift: false
		};


		// Return
		if (str === '\r' || str === '\n') {

			key.name = 'return';

		// Tab
		} else if (str === '\t') {

			key.name = 'tab';

		// Backspace or Ctrl + H
		} else if (str === '\b' || str === '\x7f' || str === '\x1b\b' || str === '\x1b\x7f') {

			key.name = 'backspace';
			key.meta = (str.charAt(0) === '\x1b');

		// Escape
		} else if (str === '\x1b' || str === '\x1b\x1b') {

			key.name = 'escape';
			key.meta = (str.length === 2);

		// Space
		} else if (str === ' ' || str === '\x1b ') {

			key.name = 'space';
			key.meta = (str.length === 2);

		// Ctrl + Letter
		} else if (str <= '\x1a') {

			key.name = String.fromCharCode(str.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
			key.ctrl = true;

		// Letter
		} else if (str.length === 1 && str >= 'a' && str <= 'z') {

			key.name = str;

		// Shift + Letter
		} else if (str.length === 1 && str >= 'A' && str <= 'Z') {

			// was: key.name = str.toLowerCase();
			key.name = str;
			key.shift = true;

		// Meta + Letter
		} else if ((parts = _META_KEYCODE.exec(str))) {

			key.name = parts[1].toLowerCase();
			key.meta = true;
			key.shift = /^[A-Z]$/.test(parts[1]);

		// Function Key (ANSI ESCAPE SEQUENCE)
		} else if ((parts = _FUNCTION_KEYCODE.exec(str))) {

			let code = (parts[1] || '') + (parts[2] || '') + (parts[4] || '') + (parts[6] || '');
			let mod  = (parts[3] || parts[5] || 1) - 1;

			key.ctrl = !!(mod & 4);
			key.meta = !!(mod & 10);
			key.shift = !!(mod & 1);


			// Parse the key itself
			switch (code) {

				// xterm ESC O letter
				case 'OP':   key.name = 'f1'; break;
				case 'OQ':   key.name = 'f2'; break;
				case 'OR':   key.name = 'f3'; break;
				case 'OS':   key.name = 'f4'; break;

				// xterm ESC [ number ~
				case '[11~': key.name = 'f1'; break;
				case '[12~': key.name = 'f2'; break;
				case '[13~': key.name = 'f3'; break;
				case '[14~': key.name = 'f4'; break;

				// Cygwin/libuv
				case '[[A':  key.name = 'f1'; break;
				case '[[B':  key.name = 'f2'; break;
				case '[[C':  key.name = 'f3'; break;
				case '[[D':  key.name = 'f4'; break;
				case '[[E':  key.name = 'f5'; break;

				// common
				case '[15~': key.name = 'f5';  break;
				case '[17~': key.name = 'f6';  break;
				case '[18~': key.name = 'f7';  break;
				case '[19~': key.name = 'f8';  break;
				case '[20~': key.name = 'f9';  break;
				case '[21~': key.name = 'f10'; break;
				case '[23~': key.name = 'f11'; break;
				case '[24~': key.name = 'f12'; break;

				// xterm ESC [ letter
				case '[A':   key.name = 'up';    break;
				case '[B':   key.name = 'down';  break;
				case '[C':   key.name = 'right'; break;
				case '[D':   key.name = 'left';  break;
				case '[E':   key.name = 'clear'; break;
				case '[F':   key.name = 'end';   break;
				case '[H':   key.name = 'home';  break;

				// xterm ESC O letter
				case 'OA':   key.name = 'up';    break;
				case 'OB':   key.name = 'down';  break;
				case 'OC':   key.name = 'right'; break;
				case 'OD':   key.name = 'left';  break;
				case 'OE':   key.name = 'clear'; break;
				case 'OF':   key.name = 'end';   break;
				case 'OH':   key.name = 'home';  break;

				// xterm ESC [ number ~
				case '[1~':  key.name = 'home';     break;
				case '[2~':  key.name = 'insert';   break;
				case '[3~':  key.name = 'delete';   break;
				case '[4~':  key.name = 'end';      break;
				case '[5~':  key.name = 'pageup';   break;
				case '[6~':  key.name = 'pagedown'; break;

				// Putty
				case '[[5~': key.name = 'pageup';   break;
				case '[[6~': key.name = 'pagedown'; break;

				// misc.
				case '[Z':   key.name = 'tab'; key.shift = true; break;
				default:     key.name = null;                    break;

			}

		}


		if (key.name !== null) {
			return key;
		}


		return null;

	};



	/*
	 * EXPORTS
	 */

	global.require = require;

	Object.defineProperty(lychee, 'FILENAME', {

		get: function() {

			let filename = global.__FILENAME || null;
			if (filename !== null) {
				return filename;
			}

			return null;

		},

		set: function() {
			return false;
		}

	});

	module.exports = function(root) {

		root = typeof root === 'string' ? root : null;


		if (root === null) {
			console.warn('BOOTSTRAP.js: No project root set.                                ');
			console.warn('Use "require(\'./libraries/crux/build/node/dist.js\')(__dirname)".');
		}


		let stream      = process.stdin;
		let is_emitting = stream._emitsKeypress === true;
		if (is_emitting === false) {

			// Note: This fixes issues with running IOJS with nohup
			if (stream.isTTY === true) {

				stream._emitsKeypress = true;

				stream.setEncoding('utf8');
				stream.setRawMode(true);
				stream.resume();

				stream.on('data', function(data) {

					if (this.listeners('keypress').length > 0) {

						let key = _parse_keypress(data);
						if (key !== null) {
							this.emit('keypress', key);
						}

					}

				});

			}

		}


		if (typeof root === 'string') {
			lychee.ROOT.project = root;
		}


		return lychee;

	};

})(lychee, global);


(function(lychee, global) {



	/*
	 * IMPLEMENTATION
	 */

	Buffer.prototype.serialize = function() {

		return {
			'constructor': 'Buffer',
			'arguments':   [ this.toString('base64'), 'base64' ]
		};

	};

	Buffer.prototype.map = function(callback) {

		callback = callback instanceof Function ? callback : null;


		let clone = Buffer.alloc(this.length);

		if (callback !== null) {

			for (let b = 0; b < this.length; b++) {
				clone[b] = callback(this[b], b);
			}

		} else {

			for (let b = 0; b < this.length; b++) {
				clone[b] = this[b];
			}

		}

		return clone;

	};


	global.Buffer = Buffer;

})(lychee, global);


(function(lychee, global) {

	const _fs = require('fs');



	/*
	 * HELPERS
	 */

	const _CONFIG_CACHE = {};

	const _clone_config = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = JSON.parse(JSON.stringify(origin.buffer));

			clone.__load = false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Config = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url    = url;
		this.onload = null;
		this.buffer = null;

		this.__load = true;


		if (url !== null) {

			if (_CONFIG_CACHE[url] !== undefined) {
				_clone_config(_CONFIG_CACHE[url], this);
			} else {
				_CONFIG_CACHE[url] = this;
			}

		}

	};


	Config.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				let tmp1 = blob.buffer.substr(blob.buffer.indexOf(',') + 1);
				let tmp2 = Buffer.from(tmp1, 'base64');

				try {
					this.buffer = JSON.parse(tmp2.toString('utf8'));
				} catch (err) {
				}

				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};


			if (this.buffer !== null) {

				let tmp1 = JSON.stringify(this.buffer, null, '\t');
				let tmp2 = Buffer.from(tmp1, 'utf8');

				blob.buffer = 'data:application/json;base64,' + tmp2.toString('base64');

			}


			return {
				'constructor': 'Config',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let path = lychee.environment.resolve(this.url);

			_fs.readFile(path, 'utf8', (error, buffer) => {

				let data = null;
				try {
					data = JSON.parse(buffer);
				} catch (err) {
				}


				this.buffer = data;
				this.__load = false;

				if (data === null) {
					console.warn('Invalid Config at "' + this.url + '" (No JSON file).');
					console.warn(path);
				}

				if (this.onload instanceof Function) {
					this.onload(data !== null);
					this.onload = null;
				}

			});

		}

	};


	global.Config = Config;

})(lychee, global);


(function(lychee, global) {

	const _fs = require('fs');



	/*
	 * HELPERS
	 */

	const _parse_font = function() {

		let data = this.__buffer;

		if (typeof data.kerning === 'number' && typeof data.spacing === 'number') {

			if (data.kerning > data.spacing) {
				data.kerning = data.spacing;
			}

		}


		if (data.texture !== undefined) {

			let texture = new Texture(data.texture);

			texture.onload = result => {
				this.texture = texture;
			};

			texture.load();

		} else {

			console.warn('Invalid Font at "' + this.url + '" (No FNT file).');

		}


		this.baseline   = typeof data.baseline === 'number'   ? data.baseline   : this.baseline;
		this.charset    = typeof data.charset === 'string'    ? data.charset    : this.charset;
		this.lineheight = typeof data.lineheight === 'number' ? data.lineheight : this.lineheight;
		this.kerning    = typeof data.kerning === 'number'    ? data.kerning    : this.kerning;
		this.spacing    = typeof data.spacing === 'number'    ? data.spacing    : this.spacing;


		if (data.font instanceof Object) {

			this.__font.color   = data.font.color   || '#ffffff';
			this.__font.family  = data.font.family  || 'Ubuntu Mono';
			this.__font.outline = data.font.outline || 0;
			this.__font.size    = data.font.size    || 16;
			this.__font.style   = data.font.style   || 'normal';

		}


		_parse_font_characters.call(this);

	};

	const _parse_font_characters = function() {

		let data = this.__buffer;
		let url  = this.url;

		if (_CHAR_CACHE[url] === undefined) {
			_CHAR_CACHE[url] = {};
		}

		if (data.map instanceof Array) {

			let offset = this.spacing;

			for (let c = 0, cl = this.charset.length; c < cl; c++) {

				let id  = this.charset[c];
				let chr = {
					width:      data.map[c] + this.spacing * 2,
					height:     this.lineheight,
					realwidth:  data.map[c],
					realheight: this.lineheight,
					x:          offset - this.spacing,
					y:          0
				};

				offset += chr.width;

				_CHAR_CACHE[url][id] = chr;

			}

		}

	};


	const _CHAR_CACHE = {};
	const _FONT_CACHE = {};

	const _clone_font = function(origin, clone) {

		if (origin.__buffer !== null) {

			clone.__buffer = origin.__buffer;
			clone.__load   = false;

			_parse_font.call(clone);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Font = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url        = url;
		this.onload     = null;
		this.texture    = null;

		this.baseline   = 0;
		this.charset    = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
		this.kerning    = 0;
		this.spacing    = 0;
		this.lineheight = 1;

		this.__buffer   = null;
		this.__font     = {
			color:   '#ffffff',
			family:  'Ubuntu Mono',
			outline: 0,
			size:    16,
			style:   'normal'
		};
		this.__load     = true;


		if (url !== null) {

			if (_CHAR_CACHE[url] === undefined) {

				_CHAR_CACHE[url]     = {};
				_CHAR_CACHE[url][''] = {
					width:      0,
					height:     this.lineheight,
					realwidth:  0,
					realheight: this.lineheight,
					x:          0,
					y:          0
				};

			}


			if (_FONT_CACHE[url] !== undefined) {
				_clone_font(_FONT_CACHE[url], this);
			} else {
				_FONT_CACHE[url] = this;
			}

		}

	};


	Font.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				let tmp1 = blob.buffer.substr(blob.buffer.indexOf(',') + 1);
				let tmp2 = Buffer.from(tmp1, 'base64');

				try {
					this.__buffer = JSON.parse(tmp2.toString('utf8'));
				} catch (err) {
				}

				this.__load = false;
				_parse_font.call(this);

			}

		},

		serialize: function() {

			let blob = {};


			if (this.__buffer !== null) {

				let tmp1 = JSON.stringify(this.__buffer, null, '\t');
				let tmp2 = Buffer.from(tmp1, 'utf8');

				blob.buffer = 'data:application/json;base64,' + tmp2.toString('base64');

			}


			return {
				'constructor': 'Font',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		measure: function(text) {

			text = typeof text === 'string' ? text : '';


			let buffer = this.__buffer;
			if (buffer !== null) {

				// Cache Usage
				if (this.__load === false) {

					let cache = _CHAR_CACHE[this.url] || null;
					if (cache !== null) {

						let tl = text.length;
						if (tl === 1) {

							if (cache[text] !== undefined) {
								return cache[text];
							}

						} else if (tl > 1) {

							let data = cache[text] || null;
							if (data === null) {

								let width = 0;
								let map   = buffer.map;

								for (let t = 0; t < tl; t++) {

									let m = this.charset.indexOf(text[t]);
									if (m !== -1) {
										width += map[m] + this.kerning;
									}

								}

								if (width > 0) {

									// TODO: Embedded Font ligatures will set x and y values based on settings.map
									data = cache[text] = {
										width:      width,
										height:     this.lineheight,
										realwidth:  width,
										realheight: this.lineheight,
										x:          0,
										y:          0
									};

								}

							}


							return data;

						}


						return cache[''];

					}

					// Temporary Usage
				} else {

					let tl = text.length;
					if (tl === 1) {

						let m = this.charset.indexOf(text);
						if (m !== -1) {

							let offset  = this.spacing;
							let spacing = this.spacing;
							let map     = buffer.map;

							for (let c = 0; c < m; c++) {
								offset += map[c] + spacing * 2;
							}

							return {
								width:      map[m] + spacing * 2,
								height:     this.lineheight,
								realwidth:  map[m],
								realheight: this.lineheight,
								x:          offset - spacing,
								y:          0
							};

						}

					} else if (tl > 1) {

						let width = 0;
						let map   = buffer.map;

						for (let t = 0; t < tl; t++) {

							let m = this.charset.indexOf(text[t]);
							if (m !== -1) {
								width += map[m] + this.kerning;
							}

						}

						if (width > 0) {

							return {
								width:      width,
								height:     this.lineheight,
								realwidth:  width,
								realheight: this.lineheight,
								x:          0,
								y:          0
							};

						}

					}


					return {
						width:      0,
						height:     this.lineheight,
						realwidth:  0,
						realheight: this.lineheight,
						x:          0,
						y:          0
					};

				}

			}


			return null;

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let path = lychee.environment.resolve(this.url);

			_fs.readFile(path, 'utf8', (error, buffer) => {

				let data = null;
				try {
					data = JSON.parse(buffer);
				} catch (err) {
				}


				this.__buffer = data;
				this.__load   = false;

				if (data !== null) {
					_parse_font.call(this);
				}

				if (this.onload instanceof Function) {
					this.onload(data !== null);
					this.onload = null;
				}

			});

		}

	};


	global.Font = Font;

})(lychee, global);


(function(lychee, global) {

	const _fs = require('fs');



	/*
	 * HELPERS
	 */

	const _MUSIC_CACHE = {};

	const _clone_music = function(origin, clone) {

		if (origin.__buffer.ogg !== null || origin.__buffer.mp3 !== null) {

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Music = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 0.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_MUSIC_CACHE[url] !== undefined) {
				_clone_music(_MUSIC_CACHE[url], this);
			} else {
				_MUSIC_CACHE[url] = this;
			}

		}

	};


	Music.prototype = {

		deserialize: function(blob) {

			if (blob.buffer instanceof Object) {

				if (typeof blob.buffer.ogg === 'string') {

					let tmp = blob.buffer.ogg.substr(blob.buffer.ogg.indexOf(',') + 1);

					this.__buffer.ogg = Buffer.from(tmp, 'base64');

				}

				if (typeof blob.buffer.mp3 === 'string') {

					let tmp = blob.buffer.mp3.substr(blob.buffer.mp3.indexOf(',') + 1);

					this.__buffer.mp3 = Buffer.from(tmp, 'base64');

				}


				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};


			if (this.__buffer.ogg !== null || this.__buffer.mp3 !== null) {

				blob.buffer = {};

				if (this.__buffer.ogg !== null) {
					blob.buffer.ogg = 'data:application/ogg;base64,' + this.__buffer.ogg.toString('base64');
				}

				if (this.__buffer.mp3 !== null) {
					blob.buffer.mp3 = 'data:audio/mp3;base64,' + this.__buffer.mp3.toString('base64');
				}

			}


			return {
				'constructor': 'Music',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let path_ogg = lychee.environment.resolve(this.url + '.ogg');
			let path_mp3 = lychee.environment.resolve(this.url + '.mp3');

			_fs.readFile(path_ogg, (error_ogg, buffer_ogg) => {

				_fs.readFile(path_mp3, (error_mp3, buffer_mp3) => {

					this.__buffer.ogg = buffer_ogg || null;
					this.__buffer.mp3 = buffer_mp3 || null;
					this.__load       = false;

					if (this.onload instanceof Function) {
						this.onload(buffer_ogg !== null || buffer_mp3 !== null);
						this.onload = null;
					}

				});

			});

		},

		clone: function() {
			return new Music(this.url);
		},

		play: function() {
			this.isIdle = false;
		},

		pause: function() {
			this.isIdle = true;
		},

		resume: function() {
			this.isIdle = false;
		},

		stop: function() {
			this.isIdle = true;
		},

		setVolume: function(volume) {

			volume = typeof volume === 'number' ? volume : null;


			return false;

		}

	};


	global.Music = Music;

})(lychee, global);


(function(lychee, global) {

	const _fs = require('fs');



	/*
	 * HELPERS
	 */

	const _SOUND_CACHE = {};

	const _clone_sound = function(origin, clone) {

		if (origin.__buffer.ogg !== null || origin.__buffer.mp3 !== null) {

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Sound = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 0.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_SOUND_CACHE[url] !== undefined) {
				_clone_sound(_SOUND_CACHE[url], this);
			} else {
				_SOUND_CACHE[url] = this;
			}

		}

	};


	Sound.prototype = {

		deserialize: function(blob) {

			if (blob.buffer instanceof Object) {

				if (typeof blob.buffer.ogg === 'string') {

					let tmp = blob.buffer.ogg.substr(blob.buffer.ogg.indexOf(',') + 1);

					this.__buffer.ogg = Buffer.from(tmp, 'base64');

				}

				if (typeof blob.buffer.mp3 === 'string') {

					let tmp = blob.buffer.mp3.substr(blob.buffer.mp3.indexOf(',') + 1);

					this.__buffer.mp3 = Buffer.from(tmp, 'base64');

				}


				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};


			if (this.__buffer.ogg !== null || this.__buffer.mp3 !== null) {

				blob.buffer = {};

				if (this.__buffer.ogg !== null) {
					blob.buffer.ogg = 'data:application/ogg;base64,' + this.__buffer.ogg.toString('base64');
				}

				if (this.__buffer.mp3 !== null) {
					blob.buffer.mp3 = 'data:audio/mp3;base64,' + this.__buffer.mp3.toString('base64');
				}

			}


			return {
				'constructor': 'Sound',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let path_ogg = lychee.environment.resolve(this.url + '.ogg');
			let path_mp3 = lychee.environment.resolve(this.url + '.mp3');

			_fs.readFile(path_ogg, (error_ogg, buffer_ogg) => {

				_fs.readFile(path_mp3, (error_mp3, buffer_mp3) => {

					this.__buffer.ogg = buffer_ogg || null;
					this.__buffer.mp3 = buffer_mp3 || null;
					this.__load       = false;

					if (this.onload instanceof Function) {
						this.onload(buffer_ogg !== null || buffer_mp3 !== null);
						this.onload = null;
					}

				});

			});

		},

		clone: function() {
			return new Sound(this.url);
		},

		play: function() {
			this.isIdle = false;
		},

		pause: function() {
			this.isIdle = true;
		},

		resume: function() {
			this.isIdle = false;
		},

		stop: function() {
			this.isIdle = true;
		},

		setVolume: function(volume) {

			volume = typeof volume === 'number' ? volume : null;


			return false;

		}

	};


	global.Sound = Sound;

})(lychee, global);


(function(lychee, global) {

	const _fs = require('fs');



	/*
	 * HELPERS
	 */

	const _STUFF_CACHE = {};

	const _clone_stuff = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = origin.buffer;

			clone.__load = false;

		}

	};

	const _execute_stuff = function(callback) {

		let url    = this.url;
		let ignore = this.__ignore;

		if (url.endsWith('.js') && ignore === false) {

			// XXX: Used by BOOTSTRAP.js
			global.__FILENAME = url;


			let cid = lychee.environment.resolve(url);
			if (require.cache[cid] !== undefined) {
				delete require.cache[cid];
			}

			let result = false;
			try {
				require(cid);
				result = true;
			} catch (err) {
				lychee.Debugger.report(lychee.environment, err, this);
			}


			// XXX: Used by BOOTSTRAP.js
			global.__FILENAME = null;


			callback.call(this, result);

		} else {

			callback.call(this, true);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Stuff = function(url, ignore) {

		url    = typeof url === 'string' ? url : null;
		ignore = ignore === true;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;

		this.__ignore = ignore;
		this.__load   = true;


		if (url !== null) {

			if (_STUFF_CACHE[url] !== undefined) {
				_clone_stuff(_STUFF_CACHE[url], this);
			} else {
				_STUFF_CACHE[url] = this;
			}

		}

	};


	Stuff.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				let tmp = blob.buffer.substr(blob.buffer.indexOf(',') + 1);

				this.buffer = Buffer.from(tmp, 'base64');
				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};
			let mime = 'application/octet-stream';


			if (this.url.endsWith('.js')) {
				mime = 'application/javascript';
			}


			if (this.buffer !== null) {
				blob.buffer = 'data:' + mime + ';base64,' + this.buffer.toString('base64');
			}


			return {
				'constructor': 'Stuff',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				_execute_stuff.call(this, function(result) {

					if (this.onload instanceof Function) {
						this.onload(result);
						this.onload = null;
					}

				});


				return;

			}


			let path = lychee.environment.resolve(this.url);

			_fs.readFile(path, (error, buffer) => {

				let raw = buffer || null;
				if (raw !== null) {

					this.buffer = Buffer.from(raw);
					this.__load = false;

					_execute_stuff.call(this, function(result) {

						if (this.onload instanceof Function) {
							this.onload(result);
							this.onload = null;
						}

					});

				} else {

					this.buffer = null;
					this.__load = false;

					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}

			});

		}

	};


	global.Stuff = Stuff;

})(lychee, global);


(function(lychee, global) {

	const _fs = require('fs');



	/*
	 * HELPERS
	 */

	let   _TEXTURE_ID    = 0;
	const _TEXTURE_CACHE = {};

	const _parse_texture = function(data) {

		this.width  = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
		this.height = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];

	};

	const _clone_texture = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.id     = origin.id;

			clone.buffer = origin.buffer;
			clone.width  = origin.width;
			clone.height = origin.height;

			clone.__load = false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Texture = function(url) {

		url = typeof url === 'string' ? url : null;


		this.id     = _TEXTURE_ID++;
		this.url    = url;
		this.onload = null;
		this.buffer = null;
		this.width  = 0;
		this.height = 0;

		this.__load = true;


		if (url !== null && url.startsWith('data:image') === false) {

			if (_TEXTURE_CACHE[url] !== undefined) {
				_clone_texture(_TEXTURE_CACHE[url], this);
			} else {
				_TEXTURE_CACHE[url] = this;
			}

		}

	};


	Texture.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				let tmp = blob.buffer.substr(blob.buffer.indexOf(',') + 1);

				this.buffer = Buffer.from(tmp, 'base64');
				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};


			if (this.buffer !== null) {
				blob.buffer = 'data:image/png;base64,' + this.buffer.toString('base64');
			}


			return {
				'constructor': 'Texture',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let url = this.url;
			if (url.startsWith('data:')) {

				if (url.startsWith('data:image/png;')) {

					let b64data = url.substr(15, url.length - 15);
					this.buffer = Buffer.from(b64data, 'base64');
					this.__load = false;

					_parse_texture.call(this, this.buffer.slice(16, 24));


					let is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
					if (lychee.debug === true && is_power_of_two === false) {
						console.warn('Invalid Texture at data:image/png; (NOT power-of-two).');
					}

				} else {

					console.warn('Invalid Texture at "' + url.substr(0, 15) + '" (No PNG file).');

				}


				if (this.onload instanceof Function) {
					this.onload(this.buffer !== null);
					this.onload = null;
				}

			} else {

				if (url.endsWith('.png')) {


					let path = lychee.environment.resolve(url);

					_fs.readFile(path, (error, buffer) => {

						this.buffer = buffer || null;
						this.__load = false;

						if (this.buffer !== null) {
							_parse_texture.call(this, this.buffer);
						}

						let is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
						if (lychee.debug === true && is_power_of_two === false) {
							console.warn('Invalid Texture at "' + this.url + '" (NOT power-of-two).');
						}

						if (this.onload instanceof Function) {
							this.onload(buffer !== null);
							this.onload = null;
						}

					});

				} else {

					console.warn('Invalid Texture at "' + this.url + '" (No PNG file).');


					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}

			}

		}

	};


	global.Texture = Texture;

})(lychee, global);


(function(lychee, global) {

	const _BUFFER = {
		Buffer: function() {}
	};

	const _CHILD_PROCESS = {
		execFile: function(path, args) {}
	};

	const _FS = {
		readFile:      function(path, encoding, callback) {},
		readFileSync:  function(path, encoding) {},
		mkdirSync:     function(path, mode) {},
		unlinkSync:    function(path) {},
		writeFileSync: function(path, data, encoding) {},

		lstatSync:     function(path) {
			return {
				isDirectory: function() {}
			};
		}

	};

	const _Server = function(states) {

		this.allowHalfOpen  = false;
		this.pauseOnConnect = false;

	};

	_Server.prototype = {

		close:  function() {},
		listen: function(port, host) {},

		on: function(event, callback) {

			if (event === 'connection') {
				callback(new _Socket());
			}

		}

	};

	const _Socket = function(states) {

		this.allowHalfOpen = false;

	};

	_Socket.prototype = {
		destroy:            function() {},
		on:                 function(event, callback) {},
		removeAllListeners: function(event) {},
		setKeepAlive:       function(flag, delay) {},
		setNoDelay:         function(flag) {},
		setTimeout:         function(delay) {}
	};


	const _NET = {
		Server: _Server,
		Socket: _Socket
	};

	const _PATH = {
		dirname: function(path) {}
	};

	const _FEATURES = {

		require: function(id) {

			if (id === 'buffer')        return _BUFFER;
			if (id === 'child_process') return _CHILD_PROCESS;
			if (id === 'fs')            return _FS;
			if (id === 'net')           return _NET;
			if (id === 'path')          return _PATH;


			throw new Error('Cannot find module \'' + id + '\'');

		},

		process: {
			env: {
				APPDATA: null,
				HOME:    '/home/dev'
			},
			stdin: {
				on: function(event, callback) {}
			},
			stdout: {
				on:    function(event, callback) {},
				write: function(str) {}
			}
		},

		clearInterval: function(id) {},
		clearTimeout:  function(id) {},
		setInterval:   function(callback, delay) {},
		setTimeout:    function(callback, delay) {}

	};


	lychee.FEATURES['node'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _CONTEXT = {
		fillStyle:    '#000000',
		globalAlpha:  1.0,
		lineWidth:    1,
		strokeStyle:  '#000000'
	};

	_CONTEXT.prototype = {

		arc:          function(x, y, radius, start, end) {},
		beginPath:    function() {},
		closePath:    function() {},
		drawImage:    function(image, x, y, width, height, srcx, srcy, src_width, src_height) {},
		fill:         function() {},
		fillRect:     function(x, y, width, height) {},
		setTransform: function(x1, y1, z1, x2, y2, z2) {},
		lineTo:       function(x, y) {},
		moveTo:       function(x, y) {},
		stroke:       function() {},
		strokeRect:   function(x, y, width, height) {}

	};

	const _ELEMENT = {
		id:        '',
		className: '',
		style:     {
			position:        'static',
			width:           1337,
			height:          1337,
			backgroundColor: '#000000',
			pointerEvents:   'none',
			transform:       '',
			zIndex:          0
		}
	};

	_ELEMENT.prototype = {

		getBoundingClientRect: function() {

			return {
				left: 1337,
				top:  1337
			};

		}

	};

	const _CANVAS = Object.assign({}, _ELEMENT);

	_CANVAS.prototype = Object.assign({}, _ELEMENT.prototype, {

		getContext: function(context) {

			if (context === '2d') {
				return _CONTEXT;
			}

			return null;

		}

	});

	const _INPUT = {

		oncancel:     function() {},
		onchange:     function() {},
		onclick:      function() {},
		value:        '',

		click:        function() {},
		setAttribute: function(name, value) {}

	};

	const _FEATURES = {

		innerWidth:  1337,
		innerHeight: 1337,

		CanvasRenderingContext2D: function() {},
		FileReader:               function() {},
		Storage:                  function() {},
		WebSocket:                function(url, protocols) {},
		XMLHttpRequest:           function() {},

		addEventListener:      function(event, callback, bubble) {},
		clearInterval:         function(id) {},
		clearTimeout:          function(id) {},
		requestAnimationFrame: function(callback) {},
		setInterval:           function(callback, delay) {},
		setTimeout:            function(callback, delay) {},

		document: {

			createElement: function(type) {

				if (type === 'a' || type === 'div') {
					return _ELEMENT;
				} else if (type === 'input') {
					return _INPUT;
				} else if (type === 'canvas') {
					return _CANVAS;
				}

				return null;

			},

			querySelectorAll: function(query) {

				if (query === '.lychee-Renderer') {
					return [ _ELEMENT ];
				}

				return null;

			},
			body: {
				appendChild: function(element) {}
			}
		},

		location: {
			href: 'file:///tmp/index.html'
		},

		localStorage: {
			setItem: function(key, value) {},
			getItem: function(key) {}
		},

		sessionStorage: {
			setItem: function(key, value) {},
			getItem: function(key) {}
		}

	};

	_FEATURES.FileReader.prototype.readAsDataURL = function() {};


	lychee.FEATURES['html'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _BUFFER = {
		Buffer: function() {}
	};

	const _CHILD_PROCESS = {
		execFile: function(path, args) {}
	};

	const _FS = {
		readFile:      function(path, encoding, callback) {},
		readFileSync:  function(path, encoding) {},
		mkdirSync:     function(path, mode) {},
		unlinkSync:    function(path) {},
		writeFileSync: function(path, data, encoding) {},

		lstatSync:     function(path) {
			return {
				isDirectory: function() {}
			};
		}

	};

	const _Server = function(states) {

		this.allowHalfOpen  = false;
		this.pauseOnConnect = false;

	};

	_Server.prototype = {

		close:  function() {},
		listen: function(port, host) {},

		on: function(event, callback) {

			if (event === 'connection') {
				callback(new _Socket());
			}

		}

	};

	const _Socket = function(states) {

		this.allowHalfOpen = false;

	};

	_Socket.prototype = {
		destroy:            function() {},
		on:                 function(event, callback) {},
		removeAllListeners: function(event) {},
		setKeepAlive:       function(flag, delay) {},
		setNoDelay:         function(flag) {},
		setTimeout:         function(delay) {}
	};


	const _NET = {
		Server: _Server,
		Socket: _Socket
	};

	const _PATH = {
		dirname: function(path) {}
	};

	const _FEATURES = {

		require: function(id) {

			if (id === 'buffer')        return _BUFFER;
			if (id === 'child_process') return _CHILD_PROCESS;
			if (id === 'fs')            return _FS;
			if (id === 'net')           return _NET;
			if (id === 'path')          return _PATH;


			throw new Error('Cannot find module \'' + id + '\'');

		},

		process: {
			env: {
				APPDATA: null,
				HOME:    '/home/dev'
			},
			stdin: {
				on: function(event, callback) {}
			},
			stdout: {
				on:    function(event, callback) {},
				write: function(str) {}
			}
		},

		clearInterval: function(id) {},
		clearTimeout:  function(id) {},
		setInterval:   function(callback, delay) {},
		setTimeout:    function(callback, delay) {}

	};


	// XXX: This is an incremental platform of 'html'

	lychee.FEATURES['html-nwjs'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _FEATURES = {
	};


	lychee.FEATURES['html-webview'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _CONTEXT = {
		fillStyle:    '#000000',
		globalAlpha:  1.0,
		lineWidth:    1,
		strokeStyle:  '#000000'
	};

	_CONTEXT.prototype = {

		arc:          function(x, y, radius, start, end) {},
		beginPath:    function() {},
		closePath:    function() {},
		drawImage:    function(image, x, y, width, height, srcx, srcy, src_width, src_height) {},
		fill:         function() {},
		fillRect:     function(x, y, width, height) {},
		setTransform: function(x1, y1, z1, x2, y2, z2) {},
		lineTo:       function(x, y) {},
		moveTo:       function(x, y) {},
		stroke:       function() {},
		strokeRect:   function(x, y, width, height) {}

	};

	const _Canvas = function(width, height, options) {
		this.width  = 1337;
		this.height = 1337;
		this.__left = 0;
		this.__top  = 0;
	};

	_Canvas.prototype = {

		clear: function() {},

		getContext: function(context) {

			if (context === '2d') {
				return _CONTEXT;
			}

			return null;

		}

	};

	const _File = function(path, options, callback) {
		this.filesize = 1337;
	};

	_File.prototype = {
		openSync:  function(mode, callback) {},
		readSync:  function(bytes, callback) {},
		writeSync: function(buffer, callback) {},
		closeSync: function() {}
	};

	_File.read = function(path, options, callback) {
	};

	const _Socket = function(host, port) {
		this.binary       = false;
		this.encoding     = 'utf8';
		this.onconnect    = null;
		this.ondisconnect = null;
		this.ondrain      = null;
		this.onmessage    = null;
	};

	_Socket.prototype = {
		close:   function() {},
		connect: function(mode) {},
		listen:  function(mode) {},
		write:   function(data) {}
	};


	const _FEATURES = {

		Canvas:                   _Canvas,
		CanvasRenderingContext2D: _CONTEXT,
		File:                     _File,
		Socket:                   _Socket,

		addEventListener:      function(event, callback, bubble) {},
		clearInterval:         function(id) {},
		clearTimeout:          function(id) {},
		requestAnimationFrame: function(callback) {},
		setInterval:           function(callback, delay) {},
		setTimeout:            function(callback, delay) {},

		document: {

			canvas: {

				add:    function(canvas) {},
				remove: function(canvas) {}

			}

		},

		window: {

			innerWidth:  1337,
			innerHeight: 1337,
			left:        0,
			top:         0,

			_onblur:     null,
			_onfocus:    null,

			__nidium__:  {
				build:    'abcdef0123456789',
				revision: 'abcdef0123456789',
				version:  '0.2'
			},

			addEventListener:      function(event, callback) {},
			exec:                  function(cmd) {},
			openFileDialog:        function(types, callback) {},
			requestAnimationFrame: function(callback) {},
			setSize:               function(width, height) {}

		}

	};


	lychee.FEATURES['nidium'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);

(function(lychee, global) {

	const _BUFFER = {
		Buffer: function() {}
	};

	const _CHILD_PROCESS = {
		execFile: function(path, args) {}
	};

	const _FS = {
		readFile:      function(path, encoding, callback) {},
		readFileSync:  function(path, encoding) {},
		mkdirSync:     function(path, mode) {},
		unlinkSync:    function(path) {},
		writeFileSync: function(path, data, encoding) {},

		lstatSync:     function(path) {
			return {
				isDirectory: function() {}
			};
		}

	};

	const _Server = function(states) {

		this.allowHalfOpen  = false;
		this.pauseOnConnect = false;

	};

	_Server.prototype = {

		close:  function() {},
		listen: function(port, host) {},

		on: function(event, callback) {

			if (event === 'connection') {
				callback(new _Socket());
			}

		}

	};

	const _Socket = function(states) {

		this.allowHalfOpen = false;

	};

	_Socket.prototype = {
		destroy:            function() {},
		on:                 function(event, callback) {},
		removeAllListeners: function(event) {},
		setKeepAlive:       function(flag, delay) {},
		setNoDelay:         function(flag) {},
		setTimeout:         function(delay) {}
	};


	const _NET = {
		Server: _Server,
		Socket: _Socket
	};

	const _PATH = {
		dirname: function(path) {}
	};

	const _FEATURES = {

		require: function(id) {

			if (id === 'buffer')        return _BUFFER;
			if (id === 'child_process') return _CHILD_PROCESS;
			if (id === 'fs')            return _FS;
			if (id === 'net')           return _NET;
			if (id === 'path')          return _PATH;


			throw new Error('Cannot find module \'' + id + '\'');

		},

		process: {
			env: {
				APPDATA: null,
				HOME:    '/home/dev'
			},
			stdin: {
				on: function(event, callback) {}
			},
			stdout: {
				on:    function(event, callback) {},
				write: function(str) {}
			}
		},

		clearInterval: function(id) {},
		clearTimeout:  function(id) {},
		setInterval:   function(callback, delay) {},
		setTimeout:    function(callback, delay) {}

	};


	lychee.FEATURES['node'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _FEATURES = {
	};


	lychee.FEATURES['node-sdl'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	if (lychee === undefined) {

		try {
			lychee = require('./crux.js')(__dirname);
		} catch (err) {
		}

	}


	let blob = {
		"constructor": "lychee.Environment",
		"arguments": [
			{
				"id": "/libraries/fertilizer/dist",
				"debug": false,
				"target": "fertilizer.Main",
				"type": "build",
				"variant": "library",
				"tags": {
					"platform": [
						"node"
					]
				}
			}
		],
		"blob": {
			"definitions": {
				"fertilizer.Main": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.Main",
							"url": "./source/Main.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"lychee.Package",
							"lychee.event.Queue",
							"fertilizer.event.Flow",
							"fertilizer.event.flow.Build",
							"fertilizer.event.flow.Configure",
							"fertilizer.event.flow.Fertilize",
							"fertilizer.event.flow.Package",
							"fertilizer.event.flow.Publish",
							"fertilizer.event.flow.html.Build",
							"fertilizer.event.flow.html-nwjs.Build",
							"fertilizer.event.flow.html-webview.Build",
							"fertilizer.event.flow.nidium.Build",
							"fertilizer.event.flow.node.Build",
							"fertilizer.event.flow.html-nwjs.Package",
							"fertilizer.event.flow.nidium.Package",
							"fertilizer.event.flow.node.Package"
						],
						"includes": [
							"lychee.event.Emitter"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _flow      = lychee.import('fertilizer.event.flow');\n\tconst _lychee    = lychee.import('lychee');\n\tconst _Build     = lychee.import('fertilizer.event.flow.Build');\n\tconst _Configure = lychee.import('fertilizer.event.flow.Configure');\n\tconst _Emitter   = lychee.import('lychee.event.Emitter');\n\tconst _Flow      = lychee.import('fertilizer.event.Flow');\n\tconst _Fertilize = lychee.import('fertilizer.event.flow.Fertilize');\n\tconst _Package   = lychee.import('fertilizer.event.flow.Package');\n\tconst _Publish   = lychee.import('fertilizer.event.flow.Publish');\n\tconst _Queue     = lychee.import('lychee.event.Queue');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _self_check = function(flows) {\n\n\t\tflows = flows instanceof Array ? flows : null;\n\n\n\t\tif (flows !== null) {\n\n\t\t\tconsole.log('fertilizer: self-check');\n\n\t\t\tlet result = true;\n\n\t\t\tfor (let f = 0, fl = flows.length; f < fl; f++) {\n\n\t\t\t\tlet flow   = flows[f];\n\t\t\t\tlet events = Object.keys(flow.___events);\n\t\t\t\tlet stacks = Object.values(flow.___events);\n\n\t\t\t\tlet check = stacks.map(stack => stack.length).find(val => val > 1) || null;\n\t\t\t\tif (check !== null) {\n\n\t\t\t\t\tconsole.warn('fertilizer: -> Invalid Flow \"' + flow.displayName + '\".');\n\t\t\t\t\tresult = false;\n\n\t\t\t\t\tevents.forEach((event, e) => {\n\n\t\t\t\t\t\tlet length = stacks[e].length;\n\t\t\t\t\t\tif (length > 1) {\n\t\t\t\t\t\t\tconsole.warn('fertilizer: -> Event \"' + event + '\" has ' + length + ' bindings.');\n\t\t\t\t\t\t}\n\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (result === true) {\n\t\t\t\tconsole.info('fertilizer: -> SUCCESS');\n\t\t\t} else {\n\t\t\t\tconsole.warn('fertilizer: -> FAILURE');\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _create_flow = function(data) {\n\n\t\tlet platform = data.target.split('/').shift() || null;\n\t\tif (platform !== null) {\n\n\t\t\tlet Configure = _Configure;\n\t\t\tlet Build     = _Build;\n\t\t\tlet Package   = _Package;\n\t\t\tlet Fertilize = _Fertilize;\n\t\t\tlet Publish   = _Publish;\n\n\t\t\tif (_flow[platform] !== undefined) {\n\n\t\t\t\tif (_flow[platform].Configure !== undefined) Configure = _flow[platform].Configure;\n\t\t\t\tif (_flow[platform].Build !== undefined)     Build     = _flow[platform].Build;\n\t\t\t\tif (_flow[platform].Package !== undefined)   Package   = _flow[platform].Package;\n\n\t\t\t} else if (platform.includes('-') === true) {\n\n\t\t\t\tlet major = platform.split('-')[0];\n\t\t\t\tlet minor = platform.split('-')[1];\n\n\t\t\t\tif (_flow[major] !== undefined) {\n\t\t\t\t\tif (_flow[major].Configure !== undefined) Configure = _flow[major].Configure;\n\t\t\t\t\tif (_flow[major].Build !== undefined)     Build     = _flow[major].Build;\n\t\t\t\t\tif (_flow[major].Package !== undefined)   Package   = _flow[major].Package;\n\t\t\t\t}\n\n\t\t\t\tif (_flow[major + '-' + minor] !== undefined) {\n\t\t\t\t\tif (_flow[major + '-' + minor].Configure !== undefined) Configure = _flow[major + '-' + minor].Configure;\n\t\t\t\t\tif (_flow[major + '-' + minor].Build !== undefined)     Build     = _flow[major + '-' + minor].Build;\n\t\t\t\t\tif (_flow[major + '-' + minor].Package !== undefined)   Package   = _flow[major + '-' + minor].Package;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tlet action = data.action;\n\t\t\tif (action === 'fertilize') {\n\n\t\t\t\tlet flow_fertilize = new Fertilize(data);\n\t\t\t\tlet flow_configure = new Configure(data);\n\t\t\t\tlet flow_build     = new Build(data);\n\t\t\t\tlet flow_package   = new Package(data);\n\n\t\t\t\tif (Configure !== _Configure) {\n\n\t\t\t\t\tflow_fertilize.unbind('configure-project');\n\n\t\t\t\t\tflow_configure.transfer('configure-project', flow_fertilize);\n\n\t\t\t\t}\n\n\t\t\t\tif (Build !== _Build) {\n\n\t\t\t\t\tflow_fertilize.unbind('read-package');\n\t\t\t\t\tflow_fertilize.unbind('read-assets');\n\t\t\t\t\tflow_fertilize.unbind('read-assets-crux');\n\t\t\t\t\tflow_fertilize.unbind('build-environment');\n\t\t\t\t\tflow_fertilize.unbind('build-assets');\n\t\t\t\t\tflow_fertilize.unbind('write-assets');\n\t\t\t\t\tflow_fertilize.unbind('build-project');\n\n\t\t\t\t\tflow_build.transfer('read-package',      flow_fertilize);\n\t\t\t\t\tflow_build.transfer('read-assets',       flow_fertilize);\n\t\t\t\t\tflow_build.transfer('read-assets-crux',  flow_fertilize);\n\t\t\t\t\tflow_build.transfer('build-environment', flow_fertilize);\n\t\t\t\t\tflow_build.transfer('build-assets',      flow_fertilize);\n\t\t\t\t\tflow_build.transfer('write-assets',      flow_fertilize);\n\t\t\t\t\tflow_build.transfer('build-project',     flow_fertilize);\n\n\t\t\t\t}\n\n\t\t\t\tif (Package !== _Package) {\n\n\t\t\t\t\tflow_fertilize.unbind('package-runtime');\n\t\t\t\t\tflow_fertilize.unbind('package-project');\n\n\t\t\t\t\tflow_package.transfer('package-runtime', flow_fertilize);\n\t\t\t\t\tflow_package.transfer('package-project', flow_fertilize);\n\n\t\t\t\t}\n\n\t\t\t\t_self_check([\n\t\t\t\t\tflow_configure,\n\t\t\t\t\tflow_build,\n\t\t\t\t\tflow_package\n\t\t\t\t]);\n\n\t\t\t\treturn flow_fertilize;\n\n\t\t\t} else if (action === 'configure') {\n\n\t\t\t\tlet flow = new Configure(data);\n\n\t\t\t\t_self_check([\n\t\t\t\t\tflow\n\t\t\t\t]);\n\n\t\t\t\treturn flow;\n\n\t\t\t} else if (action === 'build') {\n\n\t\t\t\tlet flow = new Build(data);\n\n\t\t\t\t_self_check([\n\t\t\t\t\tflow\n\t\t\t\t]);\n\n\t\t\t\treturn flow;\n\n\t\t\t} else if (action === 'package') {\n\n\t\t\t\tlet flow = new Package(data);\n\n\t\t\t\t_self_check([\n\t\t\t\t\tflow\n\t\t\t\t]);\n\n\t\t\t\treturn flow;\n\n\t\t\t} else if (action === 'publish') {\n\n\t\t\t\tlet flow = new Publish(data);\n\n\t\t\t\t_self_check([\n\t\t\t\t\tflow\n\t\t\t\t]);\n\n\t\t\t\treturn flow;\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _create_flow_thirdparty = function(data) {\n\n\t\tlet action = data.action;\n\t\tlet flow   = new _Flow(data);\n\n\t\tflow.reset();\n\n\t\tif (action === 'configure' || action === 'fertilize') {\n\t\t\tflow.then('configure-project');\n\t\t}\n\n\t\tif (action === 'build' || action === 'fertilize') {\n\t\t\tflow.then('build-project');\n\t\t}\n\n\t\tif (action === 'package' || action === 'fertilize') {\n\t\t\tflow.then('package-project');\n\t\t}\n\n\t\treturn flow;\n\n\t};\n\n\tconst _init_queue = function(queue) {\n\n\t\tlet autofixed = false;\n\t\tlet haderrors = false;\n\n\t\tqueue.bind('update', function(flow, oncomplete) {\n\n\t\t\tconsole.log('');\n\t\t\tconsole.log('');\n\t\t\tconsole.info('fertilizer: ' + flow.action + ' \"' + flow.project + '\" \"' + flow.target + '\"');\n\n\t\t\tflow.bind('complete', _ => {\n\n\t\t\t\tconsole.info('fertilizer: SUCCESS');\n\n\t\t\t\tif (flow._autofixed === true) {\n\t\t\t\t\tautofixed = true;\n\t\t\t\t}\n\n\t\t\t\toncomplete(true);\n\n\t\t\t}, this);\n\n\t\t\tflow.bind('error', event => {\n\n\t\t\t\tconsole.error('fertilizer: FAILURE at \"' + event + '\" event.');\n\n\t\t\t\thaderrors = true;\n\t\t\t\toncomplete(true);\n\n\t\t\t}, this);\n\n\t\t\tflow.init();\n\n\t\t}, this);\n\n\t\tqueue.bind('complete', _ => {\n\n\t\t\tif (autofixed === true) {\n\t\t\t\tprocess.exit(2);\n\t\t\t} else if (haderrors === true) {\n\t\t\t\tprocess.exit(1);\n\t\t\t} else {\n\t\t\t\tprocess.exit(0);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tqueue.bind('error', _ => {\n\t\t\tprocess.exit(1);\n\t\t}, this);\n\n\t\tqueue.init();\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(states) {\n\n\t\tthis.settings = _lychee.assignunlink({\n\t\t\taction:  null,\n\t\t\tdebug:   false,\n\t\t\tproject: null,\n\t\t\ttarget:  null\n\t\t}, states);\n\n\t\tthis.defaults = _lychee.assignunlink({\n\t\t\taction:  null,\n\t\t\tdebug:   false,\n\t\t\tproject: null,\n\t\t\ttarget:  null\n\t\t}, this.settings);\n\n\n\t\tlet debug = this.settings.debug;\n\t\tif (debug === true) {\n\t\t\tconsole.log('fertilizer.Main: Parsed settings are ...');\n\t\t\tconsole.log(this.settings);\n\t\t}\n\n\n\t\tthis.__package = null;\n\n\n\t\t_Emitter.call(this);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('load', function() {\n\n\t\t\tlet debug   = this.settings.debug   || false;\n\t\t\tlet project = this.settings.project || null;\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tlychee.ROOT.project                           = _lychee.ROOT.lychee + project;\n\t\t\t\tlychee.environment.global.lychee.ROOT.project = _lychee.ROOT.lychee + project;\n\n\n\t\t\t\tlet pkg = new _lychee.Package({\n\t\t\t\t\turl:  project + '/lychee.pkg',\n\t\t\t\t\ttype: 'build'\n\t\t\t\t});\n\n\t\t\t\tsetTimeout(_ => {\n\n\t\t\t\t\tthis.__package = pkg;\n\n\t\t\t\t\tif (pkg.config !== null && pkg.config.buffer !== null) {\n\n\t\t\t\t\t\tif (debug === true) {\n\t\t\t\t\t\t\tconsole.info('fertilizer: Valid Package at \"' + project + '/lychee.pkg\".');\n\t\t\t\t\t\t\tconsole.info('fertilizer: Initializing lychee.js Mode.');\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthis.trigger('init');\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\tif (debug === true) {\n\t\t\t\t\t\t\tconsole.warn('fertilizer: Invalid Package at \"' + project + '/lychee.pkg\".');\n\t\t\t\t\t\t\tconsole.warn('fertilizer: Initializing Third-Party Mode.');\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthis.trigger('init-thirdparty');\n\n\t\t\t\t\t}\n\n\t\t\t\t}, 200);\n\n\t\t\t} else {\n\n\t\t\t\tif (debug === true) {\n\t\t\t\t\tconsole.error('fertilizer: FAILURE (\"' + project + '\") at \"load\" event.');\n\t\t\t\t}\n\n\t\t\t\tthis.destroy(1);\n\n\t\t\t}\n\n\t\t}, this, true);\n\n\t\tthis.bind('init', function() {\n\n\t\t\tlet action  = this.settings.action  || null;\n\t\t\tlet debug   = this.settings.debug   || false;\n\t\t\tlet project = this.settings.project || null;\n\t\t\tlet target  = this.settings.target  || null;\n\n\t\t\tif (action !== null && project !== null && target !== null) {\n\n\t\t\t\tlet queue = new _Queue();\n\t\t\t\tlet flow  = _create_flow({\n\t\t\t\t\taction:  action,\n\t\t\t\t\tdebug:   debug,\n\t\t\t\t\tproject: project,\n\t\t\t\t\ttarget:  target\n\t\t\t\t});\n\n\t\t\t\tif (flow !== null) {\n\t\t\t\t\tqueue.then(flow);\n\t\t\t\t}\n\n\t\t\t\t_init_queue.call(this, queue);\n\n\t\t\t} else if (action !== null && project !== null) {\n\n\t\t\t\tlet pkg = this.__package;\n\t\t\t\tif (pkg !== null) {\n\n\t\t\t\t\tlet targets = pkg.getEnvironments().map(env => env.id);\n\t\t\t\t\tif (targets.length > 0) {\n\n\t\t\t\t\t\tlet queue = new _Queue();\n\n\t\t\t\t\t\ttargets.forEach(target => {\n\n\t\t\t\t\t\t\tif (debug === true) {\n\t\t\t\t\t\t\t\tconsole.log('fertilizer: -> Queueing Flow \"lycheejs-fertilizer ' + action + ' ' + project + ' ' + target + '\"');\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tlet flow = _create_flow({\n\t\t\t\t\t\t\t\taction:  action,\n\t\t\t\t\t\t\t\tdebug:   debug,\n\t\t\t\t\t\t\t\tproject: project,\n\t\t\t\t\t\t\t\ttarget:  target\n\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\tif (flow !== null) {\n\t\t\t\t\t\t\t\tqueue.then(flow);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\t_init_queue.call(this, queue);\n\n\t\t\t\t\t} else {\n\t\t\t\t\t\tthis.destroy(0);\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\n\t\t\t\t\tif (debug === true) {\n\t\t\t\t\t\tconsole.error('fertilizer: FAILURE (\"' + project + '\") at \"init\" event.');\n\t\t\t\t\t}\n\n\t\t\t\t\tthis.destroy(1);\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this, true);\n\n\t\tthis.bind('init-thirdparty', function() {\n\n\t\t\tlet action  = this.settings.action  || null;\n\t\t\tlet project = this.settings.project || null;\n\t\t\tlet target  = this.settings.target  || null;\n\n\t\t\tif (action !== null && project !== null) {\n\n\t\t\t\tlet queue = new _Queue();\n\t\t\t\tlet flow  = _create_flow_thirdparty({\n\t\t\t\t\taction:  action,\n\t\t\t\t\tdebug:   debug,\n\t\t\t\t\tproject: project,\n\t\t\t\t\ttarget:  target || '*'\n\t\t\t\t});\n\n\t\t\t\tif (flow !== null) {\n\t\t\t\t\tqueue.then(flow);\n\t\t\t\t}\n\n\t\t\t\t_init_queue(queue);\n\n\t\t\t} else {\n\n\t\t\t\tif (debug === true) {\n\t\t\t\t\tconsole.error('fertilizer: FAILURE (\"' + project + '\") at \"init-thirdparty\" event.');\n\t\t\t\t}\n\n\t\t\t\tthis.destroy(1);\n\n\t\t\t}\n\n\t\t}, this, true);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.Main';\n\n\n\t\t\tlet states = _lychee.assignunlink({}, this.settings);\n\t\t\tlet blob   = data['blob'] || {};\n\n\n\t\t\tdata['arguments'][0] = states;\n\t\t\tdata['blob']         = Object.keys(blob).length > 0 ? blob : null;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * MAIN API\n\t\t */\n\n\t\tinit: function() {\n\n\t\t\tlet action  = this.settings.action  || null;\n\t\t\tlet project = this.settings.project || null;\n\n\t\t\tif (action !== null && project !== null) {\n\n\t\t\t\tthis.trigger('load');\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tdestroy: function(code) {\n\n\t\t\tcode = typeof code === 'number' ? code : 0;\n\n\n\t\t\tthis.trigger('destroy', [ code ]);\n\n\t\t\treturn true;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.flow.Build": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.flow.Build",
							"url": "./source/event/flow/Build.js"
						}
					],
					"blob": {
						"attaches": {},
						"includes": [
							"fertilizer.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Flow = lychee.import('fertilizer.event.Flow');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Flow.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\t// this.then('configure-project');\n\n\t\tthis.then('read-package');\n\t\tthis.then('read-assets');\n\t\tthis.then('read-assets-crux');\n\n\t\tthis.then('build-environment');\n\t\tthis.then('build-assets');\n\t\tthis.then('write-assets');\n\t\tthis.then('build-project');\n\n\t\t// this.then('package-runtime');\n\t\t// this.then('package-project');\n\n\t\t// this.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.flow.Build';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.flow.Configure": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.flow.Configure",
							"url": "./source/event/flow/Configure.js"
						}
					],
					"blob": {
						"attaches": {},
						"includes": [
							"fertilizer.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Flow = lychee.import('fertilizer.event.Flow');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Flow.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\tthis.then('configure-project');\n\n\t\t// this.then('read-package');\n\t\t// this.then('read-assets');\n\t\t// this.then('read-assets-crux');\n\n\t\t// this.then('build-environment');\n\t\t// this.then('build-assets');\n\t\t// this.then('write-assets');\n\t\t// this.then('build-project');\n\n\t\t// this.then('package-runtime');\n\t\t// this.then('package-project');\n\n\t\t// this.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.flow.Configure';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.flow.Fertilize": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.flow.Fertilize",
							"url": "./source/event/flow/Fertilize.js"
						}
					],
					"blob": {
						"attaches": {},
						"includes": [
							"fertilizer.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Flow = lychee.import('fertilizer.event.Flow');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Flow.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tif (this.has('build-assets') === false) {\n\t\t\tthis.bind('build-assets', oncomplete => oncomplete(true), this);\n\t\t}\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\tthis.then('configure-project');\n\n\t\tthis.then('read-package');\n\t\tthis.then('read-assets');\n\t\tthis.then('read-assets-crux');\n\n\t\tthis.then('build-environment');\n\t\tthis.then('build-assets');\n\t\tthis.then('write-assets');\n\t\tthis.then('build-project');\n\n\t\tthis.then('package-runtime');\n\t\tthis.then('package-project');\n\n\t\t// this.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.flow.Fertilize';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.flow.Package": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.flow.Package",
							"url": "./source/event/flow/Package.js"
						}
					],
					"blob": {
						"attaches": {},
						"includes": [
							"fertilizer.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Flow = lychee.import('fertilizer.event.Flow');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Flow.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\t// this.then('configure-project');\n\n\t\t// this.then('read-package');\n\t\t// this.then('read-assets');\n\t\t// this.then('read-assets-crux');\n\n\t\t// this.then('build-environment');\n\t\t// this.then('build-assets');\n\t\t// this.then('write-assets');\n\t\t// this.then('build-project');\n\n\t\tthis.then('package-runtime');\n\t\tthis.then('package-project');\n\n\t\t// this.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.flow.Package';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.flow.Publish": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.flow.Publish",
							"url": "./source/event/flow/Publish.js"
						}
					],
					"blob": {
						"attaches": {},
						"includes": [
							"fertilizer.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Flow = lychee.import('fertilizer.event.Flow');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Flow.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\t// this.then('configure-project');\n\n\t\t// this.then('read-package');\n\t\t// this.then('read-assets');\n\t\t// this.then('read-assets-crux');\n\n\t\t// this.then('build-environment');\n\t\t// this.then('build-assets');\n\t\t// this.then('write-assets');\n\t\t// this.then('build-project');\n\n\t\t// this.then('package-runtime');\n\t\t// this.then('package-project');\n\n\t\tthis.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.flow.Publish';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.flow.html-nwjs.Package": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.flow.html-nwjs.Package",
							"url": "./source/event/flow/html-nwjs/Package.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"fertilizer.data.Shell",
							"lychee.event.Queue"
						],
						"includes": [
							"fertilizer.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Flow   = lychee.import('fertilizer.event.Flow');\n\tconst _Queue  = lychee.import('lychee.event.Queue');\n\tconst _Shell  = lychee.import('fertilizer.data.Shell');\n\tconst _ASSETS = {\n\t\tlinux: [\n\t\t\t'icudtl.dat',\n\t\t\t'natives_blob.bin',\n\t\t\t'nw',\n\t\t\t'nw_100_percent.pak',\n\t\t\t'nw_200_percent.pak',\n\t\t\t'resources.pak',\n\t\t\t'v8_context_snapshot.bin',\n\t\t\t'lib/libffmpeg.so',\n\t\t\t'lib/libnode.so',\n\t\t\t'lib/libnw.so',\n\t\t\t'locales/en-US.pak',\n\t\t\t'swiftshader/libEGL.so',\n\t\t\t'swiftshader/libGLESv2.so'\n\t\t],\n\t\tmacos: [\n\t\t],\n\t\twindows: [\n\t\t\t'd3dcompiler_47.dll',\n\t\t\t'ffmpeg.dll',\n\t\t\t'icudtl.dat',\n\t\t\t'libEGL.dll',\n\t\t\t'libGLESv2.dll',\n\t\t\t'natives_blob.bin',\n\t\t\t'node.dll',\n\t\t\t'nw_100_percent.pak',\n\t\t\t'nw_200_percent.pak',\n\t\t\t'nw.dll',\n\t\t\t'nw_elf.dll',\n\t\t\t'nw.exe',\n\t\t\t'resources.pak',\n\t\t\t'v8_context_snapshot.bin',\n\t\t\t'locales/en-US.pak',\n\t\t\t'swiftshader/libEGL.dll',\n\t\t\t'swiftshader/libGLESv2.dll'\n\t\t]\n\t};\n\n\n\t// XXX: html-nwjs runtime for MacOS contains hundreds of files...\n\t(function(shell) {\n\n\t\tshell.tree('/bin/runtime/html-nwjs/macos/x86_64', urls => {\n\n\t\t\tlet filtered = urls.filter(url => url.startsWith('./nwjs.app'));\n\t\t\tif (filtered.length > 0) {\n\n\t\t\t\tfiltered.sort().forEach(url => {\n\t\t\t\t\t_ASSETS.macos.push(url.substr(2));\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t});\n\n\t})(new _Shell());\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _write_binaries = function(urls, binaries, oncomplete) {\n\n\t\tlet stash = this.stash;\n\t\tif (stash !== null) {\n\t\t\tstash.write(urls, binaries, result => oncomplete(result), this);\n\t\t} else {\n\t\t\toncomplete(false);\n\t\t}\n\n\t};\n\n\tconst _package_linux = function(arch, zip, oncomplete) {\n\n\t\tlet project = this.project;\n\t\tlet shell   = this.shell;\n\t\tlet stash   = this.stash;\n\t\tlet target  = this.target;\n\n\t\tif (project !== null && shell !== null && stash !== null && target !== null) {\n\n\t\t\tlet prefix1 = project + '/build/' + target + '-linux-' + arch;\n\t\t\tlet prefix2 = '/bin/runtime/html-nwjs/linux/' + arch;\n\n\n\t\t\tstash.read(_ASSETS.linux.map(file => prefix2 + '/' + file), function(binaries) {\n\n\t\t\t\tlet runtime = binaries.find(asset => asset.url.endsWith('/nw')) || null;\n\t\t\t\tif (runtime !== null) {\n\t\t\t\t\truntime.url    = project + '/' + project.split('/').pop();\n\t\t\t\t\truntime.buffer = Buffer.concat([ runtime.buffer, zip.buffer ], runtime.buffer.length + zip.buffer.length);\n\t\t\t\t}\n\n\t\t\t\tlet urls = binaries.map(asset => {\n\n\t\t\t\t\tlet url = asset.url;\n\t\t\t\t\tif (url.startsWith(prefix2)) {\n\t\t\t\t\t\treturn prefix1 + url.substr(prefix2.length);\n\t\t\t\t\t} else if (url.startsWith('./')) {\n\t\t\t\t\t\treturn prefix1 + url.substr(1);\n\t\t\t\t\t} else if (url.startsWith(project)) {\n\t\t\t\t\t\treturn prefix1 + url.substr(project.length);\n\t\t\t\t\t}\n\n\t\t\t\t\treturn url;\n\n\t\t\t\t});\n\n\t\t\t\tsetTimeout(_ => _write_binaries.call(this, urls, binaries, oncomplete), 100);\n\n\t\t\t}, this);\n\n\t\t} else {\n\t\t\toncomplete(false);\n\t\t}\n\n\t};\n\n\tconst _package_macos = function(arch, zip, oncomplete) {\n\n\t\tlet project = this.project;\n\t\tlet shell   = this.shell;\n\t\tlet stash   = this.stash;\n\t\tlet target  = this.target;\n\n\t\tif (project !== null && shell !== null && stash !== null && target !== null) {\n\n\t\t\tlet prefix1 = project + '/build/' + target + '-macos-' + arch;\n\t\t\tlet prefix2 = '/bin/runtime/html-nwjs/macos/' + arch;\n\n\t\t\tlet app_nw = lychee.deserialize(lychee.serialize(zip));\n\t\t\tif (app_nw !== null) {\n\n\t\t\t\tapp_nw.url = prefix2 + '/nwjs.app/Contents/Resources/app.nw';\n\n\n\t\t\t\tstash.read(_ASSETS.macos.map(file => prefix2 + '/' + file), function(binaries) {\n\n\t\t\t\t\tbinaries = binaries.concat(app_nw);\n\n\n\t\t\t\t\tlet info_plist = binaries.find(asset => asset.url.endsWith('nwjs.app/Contents/Info.plist')) || null;\n\t\t\t\t\tif (info_plist !== null) {\n\n\t\t\t\t\t\tlet template = info_plist.buffer.toString('utf8');\n\t\t\t\t\t\ttemplate = template.replace('__NAME__', project.split('/').pop());\n\t\t\t\t\t\tinfo_plist.buffer = Buffer.from(template, 'utf8');\n\n\t\t\t\t\t}\n\n\n\t\t\t\t\tlet urls = binaries.map(asset => {\n\n\t\t\t\t\t\tlet url = asset.url;\n\t\t\t\t\t\tif (url.startsWith(prefix2)) {\n\t\t\t\t\t\t\treturn prefix1 + url.substr(prefix2.length);\n\t\t\t\t\t\t} else if (url.startsWith('./')) {\n\t\t\t\t\t\t\treturn prefix1 + url.substr(1);\n\t\t\t\t\t\t} else if (url.startsWith(project)) {\n\t\t\t\t\t\t\treturn prefix1 + url.substr(project.length);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treturn url;\n\n\t\t\t\t\t}).map(url => {\n\n\t\t\t\t\t\tif (url.startsWith(prefix1 + '/nwjs.app/')) {\n\t\t\t\t\t\t\treturn prefix1 + '/' + project.split('/').pop() + '.app/' + url.substr(prefix1.length + 10);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treturn url;\n\n\t\t\t\t\t});\n\n\t\t\t\t\tsetTimeout(_ => _write_binaries.call(this, urls, binaries, oncomplete), 100);\n\n\t\t\t\t}, this);\n\n\t\t\t} else {\n\t\t\t\toncomplete(false);\n\t\t\t}\n\n\t\t} else {\n\t\t\toncomplete(false);\n\t\t}\n\n\t};\n\n\tconst _package_windows = function(arch, zip, oncomplete) {\n\n\t\tlet project = this.project;\n\t\tlet shell   = this.shell;\n\t\tlet stash   = this.stash;\n\t\tlet target  = this.target;\n\n\t\tif (project !== null && shell !== null && stash !== null && target !== null) {\n\n\t\t\tlet prefix1 = project + '/build/' + target + '-windows-' + arch;\n\t\t\tlet prefix2 = '/bin/runtime/html-nwjs/windows/' + arch;\n\n\n\t\t\tstash.read(_ASSETS.windows.map(file => prefix2 + '/' + file), function(binaries) {\n\n\t\t\t\tlet runtime = binaries.find(asset => asset.url.endsWith('/nw.exe')) || null;\n\t\t\t\tif (runtime !== null) {\n\t\t\t\t\truntime.url    = project + '/' + project.split('/').pop() + '.exe';\n\t\t\t\t\truntime.buffer = Buffer.concat([ runtime.buffer, zip.buffer ], runtime.buffer.length + zip.buffer.length);\n\t\t\t\t}\n\n\t\t\t\tlet urls = binaries.map(asset => {\n\n\t\t\t\t\tlet url = asset.url;\n\t\t\t\t\tif (url.startsWith(prefix2)) {\n\t\t\t\t\t\treturn prefix1 + url.substr(prefix2.length);\n\t\t\t\t\t} else if (url.startsWith('./')) {\n\t\t\t\t\t\treturn prefix1 + url.substr(1);\n\t\t\t\t\t} else if (url.startsWith(project)) {\n\t\t\t\t\t\treturn prefix1 + url.substr(project.length);\n\t\t\t\t\t}\n\n\t\t\t\t\treturn url;\n\n\t\t\t\t});\n\n\t\t\t\tsetTimeout(_ => _write_binaries.call(this, urls, binaries, oncomplete), 100);\n\n\t\t\t}, this);\n\n\t\t} else {\n\t\t\toncomplete(false);\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Flow.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.unbind('package-runtime');\n\n\t\tthis.bind('package-runtime', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet project = this.project;\n\t\t\tlet shell   = this.shell;\n\t\t\tlet target  = this.target;\n\n\t\t\tif (action !== null && project !== null && shell !== null && target !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/PACKAGE-RUNTIME \"' + project + '\"');\n\n\n\t\t\t\tlet env = this.__environment;\n\t\t\t\tif (env !== null && env.variant === 'application') {\n\n\t\t\t\t\tlet assets = this.assets.filter(asset => asset !== null && asset.buffer !== null);\n\t\t\t\t\tif (assets.length > 0) {\n\n\t\t\t\t\t\tassets.forEach(asset => {\n\n\t\t\t\t\t\t\tif (asset.url.startsWith(project + '/')) {\n\t\t\t\t\t\t\t\tasset.url = './' + asset.url.substr(project.length + 1);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\tshell.zip(assets, function(zip) {\n\n\t\t\t\t\t\t\tif (zip !== null) {\n\n\t\t\t\t\t\t\t\tlet queue = new _Queue();\n\n\t\t\t\t\t\t\t\tqueue.then({ name: 'Linux x86',      method: _package_linux.bind(this,   'x86',    zip) });\n\t\t\t\t\t\t\t\tqueue.then({ name: 'Linux x86_64',   method: _package_linux.bind(this,   'x86_64', zip) });\n\t\t\t\t\t\t\t\tqueue.then({ name: 'MacOS x86_64',   method: _package_macos.bind(this,   'x86_64', zip) });\n\t\t\t\t\t\t\t\tqueue.then({ name: 'Windows x86',    method: _package_windows.bind(this, 'x86',    zip) });\n\t\t\t\t\t\t\t\tqueue.then({ name: 'Windows x86_64', method: _package_windows.bind(this, 'x86_64', zip) });\n\n\t\t\t\t\t\t\t\tqueue.bind('update', (entry, oncomplete) => {\n\n\t\t\t\t\t\t\t\t\tconsole.log('fertilizer: -> \"' + entry.name + '\"');\n\n\t\t\t\t\t\t\t\t\tentry.method(result => {\n\n\t\t\t\t\t\t\t\t\t\tif (result === true) {\n\t\t\t\t\t\t\t\t\t\t\tconsole.info('fertilizer: -> SUCCESS');\n\t\t\t\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\t\t\t\tconsole.warn('fertilizer: -> FAILURE');\n\t\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t\toncomplete(true);\n\n\t\t\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\t\t}, this);\n\n\t\t\t\t\t\t\t\tqueue.bind('complete', _ => oncomplete(true), this);\n\t\t\t\t\t\t\t\tqueue.bind('error',    _ => oncomplete(false), this);\n\t\t\t\t\t\t\t\tqueue.init();\n\n\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\toncomplete(false);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}, this);\n\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\t\t\t\t\tconsole.log('fertilizer: -> Skipping \"' + target + '\".');\n\t\t\t\t\toncomplete(true);\n\t\t\t\t}\n\n\t\t\t} else {\n\t\t\t\toncomplete(false);\n\t\t\t}\n\n\t\t}, this);\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\t// this.then('configure-project');\n\n\t\t// this.then('read-package');\n\t\t// this.then('read-assets');\n\t\t// this.then('read-assets-crux');\n\n\t\t// this.then('build-environment');\n\t\t// this.then('build-assets');\n\t\t// this.then('write-assets');\n\t\t// this.then('build-project');\n\n\t\tthis.then('package-runtime');\n\t\tthis.then('package-project');\n\n\t\t// this.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.flow.html-nwjs.Package';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.Flow": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.Flow",
							"url": "./source/event/Flow.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"fertilizer.data.Shell",
							"lychee.Environment",
							"lychee.Package",
							"lychee.Stash"
						],
						"includes": [
							"lychee.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _lychee      = lychee.import('lychee');\n\tconst _Environment = lychee.import('lychee.Environment');\n\tconst _Flow        = lychee.import('lychee.event.Flow');\n\tconst _Package     = lychee.import('lychee.Package');\n\tconst _Shell       = lychee.import('fertilizer.data.Shell');\n\tconst _Stash       = lychee.import('lychee.Stash');\n\tconst _ENVIRONMENT = lychee.environment;\n\tconst _STASH       = new _Stash({\n\t\ttype: _Stash.TYPE.persistent\n\t});\n\tconst _TEXTURE     = _STASH.read([ '/libraries/breeder/asset/init/icon.png' ])[0] || null;\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _create_meta_icon = function() {\n\n\t\tlet texture = lychee.deserialize(lychee.serialize(_TEXTURE));\n\t\tif (texture !== null) {\n\t\t\ttexture.url = './icon.png';\n\t\t}\n\n\t\treturn texture;\n\n\t};\n\n\tconst _create_meta_manifest = function() {\n\n\t\tlet project = this.project;\n\t\tif (project !== null) {\n\n\t\t\tlet config  = new Config();\n\t\t\tlet date    = new Date();\n\t\t\tlet name    = project.split('/').pop();\n\t\t\tlet today   = (date.getUTCMonth() + 1) + '/' + date.getUTCDate();\n\t\t\tlet version = lychee.VERSION + '/' + today;\n\n\t\t\tconfig.url    = './manifest.json';\n\t\t\tconfig.buffer = {\n\t\t\t\tbackground_color: '#405050',\n\t\t\t\tdisplay:          'standalone',\n\t\t\t\tname:             name + ' (powered by lychee.js)',\n\t\t\t\torientation:      'landscape',\n\t\t\t\tshort_name:       name,\n\t\t\t\tstart_url:        'index.html',\n\t\t\t\ttheme_color:      '#2f3736',\n\t\t\t\tversion:          version,\n\t\t\t\ticons: [{\n\t\t\t\t\tsrc:   'icon.png',\n\t\t\t\t\tsizes: '128x128',\n\t\t\t\t\ttype:  'image/png'\n\t\t\t\t}]\n\t\t\t};\n\n\t\t\treturn config;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _create_meta_package = function() {\n\n\t\tlet project = this.project;\n\t\tif (project !== null) {\n\n\t\t\tlet config  = new Config();\n\t\t\tlet debug   = this.debug;\n\t\t\tlet date    = new Date();\n\t\t\tlet name    = project.split('/').pop();\n\t\t\tlet today   = (date.getUTCMonth() + 1) + '/' + date.getUTCDate();\n\t\t\tlet version = lychee.VERSION + '/' + today;\n\n\t\t\tconfig.url    = './package.json';\n\t\t\tconfig.buffer = {\n\t\t\t\tmain:        './index.html',\n\t\t\t\tname:        name,\n\t\t\t\tdescription: name + ' (powered by lychee.js)',\n\t\t\t\tversion:     version,\n\t\t\t\twebkit: {\n\t\t\t\t\tplugin: false\n\t\t\t\t},\n\t\t\t\twindow: {\n\t\t\t\t\ttitle:    name + ' (powered by lychee.js)',\n\t\t\t\t\ticon:     './icon.png',\n\t\t\t\t\ttoolbar:  debug === true,\n\t\t\t\t\tframe:    true,\n\t\t\t\t\twidth:    640,\n\t\t\t\t\theight:   480,\n\t\t\t\t\tposition: 'center'\n\t\t\t\t}\n\t\t\t};\n\n\t\t\treturn config;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _initialize_environment = function(settings, callback) {\n\n\t\tlet environment    = new _Environment(settings);\n\t\tlet pkg_fertilizer = environment.packages['fertilizer'] || null;\n\t\tif (pkg_fertilizer !== null) {\n\n\t\t\tfor (let id in _ENVIRONMENT.definitions) {\n\t\t\t\tenvironment.define(_ENVIRONMENT.definitions[id]);\n\t\t\t}\n\n\t\t}\n\n\n\t\t_lychee.debug = false;\n\t\t_lychee.setEnvironment(environment);\n\n\t\tenvironment.init(sandbox => {\n\n\t\t\t_lychee.setEnvironment(_ENVIRONMENT);\n\t\t\tcallback(environment, sandbox);\n\n\t\t});\n\n\t};\n\n\tconst _trace_shell = function(stack) {\n\n\t\tfor (let s = 0, sl = stack.length; s < sl; s++) {\n\n\t\t\tlet context = stack[s];\n\t\t\tlet code    = context.exit;\n\t\t\tlet name    = '...' + context.file.substr(context.path.length);\n\n\t\t\tif (code === 0) {\n\t\t\t\tconsole.info('fertilizer: -> ' + name + ' exited with code \"' + code + '\":');\n\t\t\t} else if (code === 1) {\n\t\t\t\tconsole.error('fertilizer: -> ' + name + ' exited with code \"' + code + '\":');\n\t\t\t} else {\n\t\t\t\tconsole.warn('fertilizer: -> ' + name + ' exited with code \"' + code + '\":');\n\t\t\t}\n\n\t\t\tcontext.stdout.trim().split('\\n').forEach(line => {\n\n\t\t\t\tlet chunk = line.trim();\n\t\t\t\tif (chunk !== '') {\n\t\t\t\t\tconsole.log('fertilizer: -> (stdout) ' + chunk);\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t\tcontext.stderr.trim().split('\\n').forEach(line => {\n\n\t\t\t\tlet chunk = line.trim();\n\t\t\t\tif (chunk !== '') {\n\t\t\t\t\tconsole.error('fertilizer: -> (stderr) ' + chunk);\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}\n\n\t\tconsole.warn('');\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.assets = [];\n\n\t\tthis.action  = null;\n\t\tthis.debug   = false;\n\t\tthis.project = null;\n\t\tthis.target  = null;\n\t\tthis.shell   = new _Shell();\n\t\tthis.stash   = new _Stash({\n\t\t\ttype: _Stash.TYPE.persistent\n\t\t});\n\n\t\tthis._autofixed = false;\n\n\t\tthis.__environment = null;\n\t\tthis.__namespace   = null;\n\t\tthis.__packages    = {};\n\t\tthis.__profile     = null;\n\n\n\t\tthis.setAction(states.action);\n\t\tthis.setDebug(states.debug);\n\t\tthis.setProject(states.project);\n\t\tthis.setTarget(states.target);\n\n\n\t\t_Flow.call(this);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('read-package', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet project = this.project;\n\n\t\t\tif (action !== null && project !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/READ-PACKAGE \"' + project + '\"');\n\n\n\t\t\t\tif (project !== '/libraries/lychee') {\n\n\t\t\t\t\tconsole.log('fertilizer: -> Mapping /libraries/lychee/lychee.pkg as \"lychee\"');\n\n\t\t\t\t\tthis.__packages['lychee'] = new _Package({\n\t\t\t\t\t\turl:  '/libraries/lychee/lychee.pkg',\n\t\t\t\t\t\ttype: 'source'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\n\t\t\t\tlet pkg = new _Package({\n\t\t\t\t\turl:  project + '/lychee.pkg',\n\t\t\t\t\ttype: 'source'\n\t\t\t\t});\n\n\t\t\t\tconsole.log('fertilizer: -> Mapping ' + pkg.url + ' as \"' + pkg.id + '\"');\n\n\t\t\t\tsetTimeout(_ => {\n\t\t\t\t\tthis.__namespace        = pkg.id;\n\t\t\t\t\tthis.__packages[pkg.id] = pkg;\n\t\t\t\t\toncomplete(true);\n\t\t\t\t}, 200);\n\n\t\t\t} else {\n\t\t\t\toncomplete(false);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('read-assets', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet project = this.project;\n\t\t\tlet stash   = this.stash;\n\n\t\t\tif (action !== null && project !== null && stash !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/READ-ASSETS \"' + project + '\"');\n\n\n\t\t\t\tstash.read([\n\t\t\t\t\tproject + '/icon.png',\n\t\t\t\t\tproject + '/manifest.json',\n\t\t\t\t\tproject + '/package.json'\n\t\t\t\t], function(assets) {\n\n\t\t\t\t\tthis.assets = assets.filter(asset => asset.buffer !== null);\n\n\t\t\t\t\tlet meta_icon = this.assets.find(asset => asset.url.endsWith('/icon.png')) || null;\n\t\t\t\t\tif (meta_icon === null || meta_icon.buffer === null) {\n\t\t\t\t\t\tmeta_icon = _create_meta_icon.call(this);\n\t\t\t\t\t\tthis.assets.push(meta_icon);\n\t\t\t\t\t}\n\n\t\t\t\t\tlet meta_manifest = this.assets.find(asset => asset.url.endsWith('/manifest.json')) || null;\n\t\t\t\t\tif (meta_manifest === null || meta_manifest.buffer === null) {\n\t\t\t\t\t\tmeta_manifest = _create_meta_manifest.call(this);\n\t\t\t\t\t\tthis.assets.push(meta_manifest);\n\t\t\t\t\t}\n\n\t\t\t\t\tlet meta_package = this.assets.find(asset => asset.url.endsWith('/package.json')) || null;\n\t\t\t\t\tif (meta_package === null || meta_package.buffer === null) {\n\t\t\t\t\t\tmeta_package = _create_meta_package.call(this);\n\t\t\t\t\t\tthis.assets.push(meta_package);\n\t\t\t\t\t}\n\n\t\t\t\t\toncomplete(true);\n\n\t\t\t\t}, this);\n\n\t\t\t} else {\n\t\t\t\toncomplete(false);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('read-assets-crux', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet project = this.project;\n\t\t\tlet stash   = this.stash;\n\t\t\tlet target  = this.target;\n\n\t\t\tif (action !== null && project !== null && stash !== null && target !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/READ-ASSETS-CRUX \"' + project + '\" \"' + target + '\"');\n\n\n\t\t\t\tlet platform = target.split('/')[0] || null;\n\t\t\t\tif (platform !== null) {\n\n\t\t\t\t\tstash.read([\n\t\t\t\t\t\t'/libraries/crux/build/' + platform + '/dist.js'\n\t\t\t\t\t], function(assets) {\n\n\t\t\t\t\t\tlet asset = assets[0] || null;\n\t\t\t\t\t\tif (asset !== null) {\n\n\t\t\t\t\t\t\tasset.url = './crux.js';\n\n\t\t\t\t\t\t\tthis.assets.push(asset);\n\n\t\t\t\t\t\t\toncomplete(true);\n\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\toncomplete(false);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}, this);\n\n\t\t\t\t} else {\n\t\t\t\t\toncomplete(false);\n\t\t\t\t}\n\n\t\t\t} else {\n\t\t\t\toncomplete(false);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('configure-project', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet debug   = this.debug;\n\t\t\tlet project = this.project;\n\t\t\tlet shell   = this.shell;\n\t\t\tlet target  = this.target;\n\n\t\t\tif (action !== null && project !== null && shell !== null && target !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/CONFIGURE-PROJECT \"' + project + '\"');\n\n\n\t\t\t\tlet info = shell.info(project + '/bin/configure.sh');\n\t\t\t\tif (info !== null && info.type === 'file') {\n\n\t\t\t\t\tconsole.log('fertilizer: -> Executing \"' + project + '/bin/configure.sh\"');\n\n\t\t\t\t\tshell.exec(project + '/bin/configure.sh \"' + target + '\"', result => {\n\n\t\t\t\t\t\tif (result === false) {\n\n\t\t\t\t\t\t\tconsole.warn('fertilizer: -> FAILURE');\n\n\t\t\t\t\t\t\tif (debug === true) {\n\t\t\t\t\t\t\t\t_trace_shell(shell.trace(1));\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\toncomplete(true);\n\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\toncomplete(true);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t});\n\n\t\t\t\t} else {\n\t\t\t\t\tconsole.log('fertilizer: -> Skipping \"' + project + '/bin/configure.sh\"');\n\t\t\t\t\toncomplete(true);\n\t\t\t\t}\n\n\t\t\t} else {\n\t\t\t\toncomplete(true);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('build-environment', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet project = this.project;\n\t\t\tlet target  = this.target;\n\n\t\t\tif (action !== null && project !== null && target !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/BUILD-ENVIRONMENT \"' + project + '\"');\n\n\n\t\t\t\tlet pkg = this.__packages[this.__namespace] || null;\n\t\t\t\tif (pkg !== null) {\n\n\t\t\t\t\tpkg.setType('build');\n\n\t\t\t\t\tlet platform = target.split('/')[0];\n\t\t\t\t\tlet defaults = pkg.getEnvironments({\n\t\t\t\t\t\tplatform: platform\n\t\t\t\t\t}).find(env => env.id === target) || null;\n\n\t\t\t\t\tif (defaults !== null) {\n\n\t\t\t\t\t\tlet settings = _lychee.assignunlink({}, defaults, {\n\t\t\t\t\t\t\tid:      project + '/' + target.split('/').pop(),\n\t\t\t\t\t\t\tdebug:   false,\n\t\t\t\t\t\t\tsandbox: true,\n\t\t\t\t\t\t\ttimeout: 10000,\n\t\t\t\t\t\t\ttype:    'export'\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\tif (settings.packages instanceof Object) {\n\n\t\t\t\t\t\t\tfor (let pid in settings.packages) {\n\n\t\t\t\t\t\t\t\tlet url = settings.packages[pid];\n\t\t\t\t\t\t\t\tif (url.startsWith('./')) {\n\t\t\t\t\t\t\t\t\tsettings.packages[pid] = project + '/' + url.substr(2);\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif (settings.profile instanceof Object) {\n\t\t\t\t\t\t\tthis.__profile = settings.profile;\n\t\t\t\t\t\t\tdelete settings.profile;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tthis.__profile = {};\n\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\t_initialize_environment(settings, (environment, sandbox) => {\n\n\t\t\t\t\t\t\tenvironment.debug    = defaults.debug;\n\t\t\t\t\t\t\tenvironment.packages = {};\n\t\t\t\t\t\t\tenvironment.sandbox  = defaults.sandbox;\n\t\t\t\t\t\t\tenvironment.type     = 'build';\n\n\t\t\t\t\t\t\tthis.__environment = environment;\n\n\n\t\t\t\t\t\t\t// XXX: Build failed and was autofixed\n\t\t\t\t\t\t\t// and will result in MAIN.destroy(2)\n\t\t\t\t\t\t\tif (sandbox === null) {\n\t\t\t\t\t\t\t\tthis._autofixed = true;\n\t\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\t\tif (typeof environment.global.console.serialize === 'function') {\n\n\t\t\t\t\t\t\t\tlet blob = environment.global.console.serialize().blob || null;\n\t\t\t\t\t\t\t\tif (blob !== null) {\n\n\t\t\t\t\t\t\t\t\t(blob.stderr || '').trim().split('\\n').map(line => {\n\t\t\t\t\t\t\t\t\t\treturn (line.indexOf(':') !== -1 ? line.split(':')[1].trim() : line.trim());\n\t\t\t\t\t\t\t\t\t}).forEach(line => {\n\t\t\t\t\t\t\t\t\t\tconsole.warn('fertilizer: ' + line);\n\t\t\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\t\toncomplete(true);\n\n\t\t\t\t\t\t});\n\n\t\t\t\t\t} else {\n\t\t\t\t\t\tconsole.warn('fertilizer: -> Invalid Environment Tags at \"' + pkg.url + '/build/' + target + '\".');\n\t\t\t\t\t\toncomplete(false);\n\t\t\t\t\t}\n\n\t\t\t\t\tpkg.setType('source');\n\n\t\t\t\t}\n\n\t\t\t} else {\n\t\t\t\toncomplete(false);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('build-assets', function(oncomplete) {\n\n\t\t\tlet action = this.action;\n\t\t\tif (action !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + this.action + '/BUILD-ASSETS');\n\t\t\t\tconsole.log('fertilizer: -> Skipping');\n\n\t\t\t\toncomplete(true);\n\n\t\t\t} else {\n\t\t\t\toncomplete(false);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('write-assets', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet project = this.project;\n\t\t\tlet stash   = this.stash;\n\t\t\tlet target  = this.target;\n\n\t\t\tif (action !== null && project !== null && target !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/WRITE-ASSETS \"' + project + '\"');\n\n\n\t\t\t\tlet assets = this.assets;\n\t\t\t\tif (assets.length > 0) {\n\n\t\t\t\t\tstash.write(assets.map(asset => {\n\n\t\t\t\t\t\tlet url = asset.url;\n\t\t\t\t\t\tif (url.startsWith(project)) {\n\t\t\t\t\t\t\treturn project + '/build/' + target + url.substr(project.length);\n\t\t\t\t\t\t} else if (url.startsWith('./')) {\n\t\t\t\t\t\t\treturn project + '/build/' + target + url.substr(1);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}), assets, result => oncomplete(true), this);\n\n\t\t\t\t} else {\n\t\t\t\t\toncomplete(true);\n\t\t\t\t}\n\n\t\t\t} else {\n\t\t\t\toncomplete(false);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('build-project', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet debug   = this.debug;\n\t\t\tlet project = this.project;\n\t\t\tlet shell   = this.shell;\n\t\t\tlet target  = this.target;\n\n\t\t\tif (action !== null && project !== null && shell !== null && target !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/BUILD-PROJECT \"' + project + '\"');\n\n\n\t\t\t\tlet info = shell.info(project + '/bin/build.sh');\n\t\t\t\tif (info !== null && info.type === 'file') {\n\n\t\t\t\t\tconsole.log('fertilizer: -> Executing \"' + project + '/bin/build.sh\"');\n\n\t\t\t\t\tshell.exec(project + '/bin/build.sh \"' + target + '\"', result => {\n\n\t\t\t\t\t\tif (result === false) {\n\n\t\t\t\t\t\t\tconsole.warn('fertilizer: -> FAILURE');\n\n\t\t\t\t\t\t\tif (debug === true) {\n\t\t\t\t\t\t\t\t_trace_shell(shell.trace(1));\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\toncomplete(true);\n\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\toncomplete(true);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t});\n\n\t\t\t\t} else {\n\t\t\t\t\tconsole.log('fertilizer: -> Skipping \"' + project + '/bin/build.sh\"');\n\t\t\t\t\toncomplete(true);\n\t\t\t\t}\n\n\t\t\t} else {\n\t\t\t\toncomplete(true);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('package-runtime', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet debug   = this.debug;\n\t\t\tlet project = this.project;\n\t\t\tlet shell   = this.shell;\n\t\t\tlet target  = this.target;\n\n\t\t\tif (action !== null && project !== null && shell !== null && target !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/PACKAGE-RUNTIME \"' + project + '\"');\n\n\n\t\t\t\tlet env      = this.__environment;\n\t\t\t\tlet platform = target.split('/').shift();\n\t\t\t\tlet info     = shell.info('/bin/runtime/' + platform + '/package.sh');\n\t\t\t\tlet variant  = env.variant;\n\n\t\t\t\tif (info !== null && info.type === 'file' && variant === 'application') {\n\n\t\t\t\t\tconsole.log('fertilizer: -> Executing \"/bin/runtime/' + platform + '/package.sh ' + project + ' ' + target + '\"');\n\n\t\t\t\t\tshell.exec('/bin/runtime/' + platform + '/package.sh ' + project + ' ' + target, result => {\n\n\t\t\t\t\t\tif (result === false) {\n\n\t\t\t\t\t\t\tconsole.error('fertilizer: -> FAILURE');\n\n\t\t\t\t\t\t\tif (debug === true) {\n\t\t\t\t\t\t\t\t_trace_shell(shell.trace(1));\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\toncomplete(false);\n\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\toncomplete(true);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t});\n\n\t\t\t\t} else {\n\t\t\t\t\tconsole.log('fertilizer: -> Skipping \"/bin/runtime/' + platform + '/bin/package.sh\"');\n\t\t\t\t\toncomplete(true);\n\t\t\t\t}\n\n\t\t\t} else {\n\t\t\t\toncomplete(false);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('package-project', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet debug   = this.debug;\n\t\t\tlet project = this.project;\n\t\t\tlet shell   = this.shell;\n\t\t\tlet target  = this.target;\n\n\t\t\tif (action !== null && project !== null && shell !== null && target !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/PACKAGE-PROJECT \"' + project + '\"');\n\n\n\t\t\t\tlet info = shell.info(project + '/bin/package.sh');\n\t\t\t\tif (info !== null && info.type === 'file') {\n\n\t\t\t\t\tconsole.log('fertilizer: -> Executing \"' + project + '/bin/package.sh ' + target + '\"');\n\n\t\t\t\t\tshell.exec(project + '/bin/package.sh ' + target, result => {\n\n\t\t\t\t\t\tif (result === false) {\n\n\t\t\t\t\t\t\tconsole.warn('fertilizer: -> FAILURE');\n\n\t\t\t\t\t\t\tif (debug === true) {\n\t\t\t\t\t\t\t\t_trace_shell(shell.trace(1));\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\toncomplete(true);\n\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\toncomplete(true);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t});\n\n\t\t\t\t} else {\n\t\t\t\t\tconsole.log('fertilizer: -> Skipping \"' + project + '/bin/package.sh\"');\n\t\t\t\t\toncomplete(true);\n\t\t\t\t}\n\n\t\t\t} else {\n\t\t\t\toncomplete(true);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('publish-project', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet debug   = this.debug;\n\t\t\tlet project = this.project;\n\t\t\tlet shell   = this.shell;\n\t\t\tlet target  = this.target;\n\n\t\t\tif (action !== null && project !== null && shell !== null && target !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/PUBLISH-PROJECT \"' + project + '\"');\n\n\n\t\t\t\tlet info = shell.info(project + '/bin/publish.sh');\n\t\t\t\tif (info !== null && info.type === 'file') {\n\n\t\t\t\t\tconsole.log('fertilizer: -> Executing \"' + project + '/bin/publish.sh\"');\n\n\t\t\t\t\tshell.exec(project + '/bin/publish.sh \"' + target + '\"', result => {\n\n\t\t\t\t\t\tif (result === false) {\n\n\t\t\t\t\t\t\tconsole.warn('fertilizer: -> FAILURE');\n\n\t\t\t\t\t\t\tif (debug === true) {\n\t\t\t\t\t\t\t\t_trace_shell(shell.trace(1));\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\toncomplete(true);\n\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\toncomplete(true);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t});\n\n\t\t\t\t} else {\n\t\t\t\t\tconsole.log('fertilizer: -> Skipping \"' + project + '/bin/publish.sh\"');\n\t\t\t\t\toncomplete(true);\n\t\t\t\t}\n\n\t\t\t} else {\n\t\t\t\toncomplete(true);\n\t\t\t}\n\n\t\t}, this);\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\t// this.then('configure-project');\n\n\t\t// this.then('read-package');\n\t\t// this.then('read-assets');\n\t\t// this.then('read-assets-crux');\n\n\t\t// this.then('build-environment');\n\t\t// this.then('build-assets'); // XXX: Done by platform-specific flows\n\t\t// this.then('write-assets');\n\t\t// this.then('build-project');\n\n\t\t// this.then('package-runtime');\n\t\t// this.then('package-project');\n\n\t\t// this.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.Flow';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsetAction: function(action) {\n\n\t\t\taction = typeof action === 'string' ? action : null;\n\n\n\t\t\tif (action !== null) {\n\n\t\t\t\tthis.action = action;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetDebug: function(debug) {\n\n\t\t\tdebug = typeof debug === 'boolean' ? debug : null;\n\n\n\t\t\tif (debug !== null) {\n\n\t\t\t\tthis.debug = debug;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetProject: function(project) {\n\n\t\t\tproject = typeof project === 'string' ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tthis.project = project;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetTarget: function(target) {\n\n\t\t\ttarget = typeof target === 'string' ? target : null;\n\n\n\t\t\tif (target !== null) {\n\n\t\t\t\tthis.target = target;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.flow.html.Build": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.flow.html.Build",
							"url": "./source/event/flow/html/Build.js"
						}
					],
					"blob": {
						"attaches": {
							"index.appcache": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/html/Build.index.appcache"
								],
								"blob": {
									"buffer": "data:application/octet-stream;base64,Q0FDSEUgTUFOSUZFU1QKCkNBQ0hFOgovZmF2aWNvbi5pY28KY3J1eC5qcwppY29uLnBuZwppbmRleC5odG1sCmluZGV4LmpzCm1hbmlmZXN0Lmpzb24KCk5FVFdPUks6Ci9hcGkKaHR0cDovL2hhcnZlc3Rlci5hcnRpZmljaWFsLmVuZ2luZWVyaW5nOjQ4NDgKaHR0cDovL2xvY2FsaG9zdDo0ODQ4Cgo="
								}
							},
							"index.js": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/html/Build.index.js"
								],
								"blob": {
									"buffer": "data:application/javascript;base64,CihmdW5jdGlvbihseWNoZWUsIGdsb2JhbCkgewoKCWlmIChseWNoZWUgPT09IHVuZGVmaW5lZCkgewoKCQl0cnkgewoKCQkJbGV0IHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOwoJCQl0bXAuc3JjICAgICAgID0gJy4vY3J1eC5qcyc7CgkJCXRtcC5fZmlsZW5hbWUgPSAnLi9jcnV4LmpzJzsKCQkJdG1wLmFzeW5jICAgICA9IGZhbHNlOwoJCQlkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRtcCk7CgoJCX0gY2F0Y2ggKGVycikgewoJCX0KCgl9CgoKCWxldCBibG9iID0gJHtibG9ifTsKCgoJbGV0IGVudmlyb25tZW50ID0gbHljaGVlLmRlc2VyaWFsaXplKGJsb2IpOwoJaWYgKGVudmlyb25tZW50ICE9PSBudWxsKSB7CgkJZW52aXJvbm1lbnQuaW5pdCgpOwoJfQoKCWx5Y2hlZS5FTlZJUk9OTUVOVFNbJyR7aWR9J10gPSBlbnZpcm9ubWVudDsKCglyZXR1cm4gZW52aXJvbm1lbnQ7Cgp9KSh0eXBlb2YgbHljaGVlICE9PSAndW5kZWZpbmVkJyA/IGx5Y2hlZSA6IHVuZGVmaW5lZCwgdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTsK"
								}
							},
							"package.json": {
								"constructor": "Config",
								"arguments": [
									"./source/event/flow/html/Build.package.json"
								],
								"blob": {
									"buffer": "data:application/json;base64,ewoJImJyb3dzZXIiOiAiLi9pbmRleC5qcyIsCgkibmFtZSI6ICIke2lkfSIsCgkidGl0bGUiOiAiJHtpZH0gKHBvd2VyZWQgYnkgbHljaGVlLmpzKSIsCgkiaG9tZXBhZ2UiOiAiaHR0cHM6Ly9seWNoZWUuanMub3JnIiwKCSJkZXNjcmlwdGlvbiI6ICJOZXh0LUdlbiBJc29tb3JwaGljIEFwcGxpY2F0aW9uIEVuZ2luZSIsCgkibGljZW5zZSI6ICIoTUlUIEFORCBHUEwtMy4wKSIsCgkicmVwb3NpdG9yeSI6IHsKCQkidHlwZSI6ICJnaXQiLAoJCSJ1cmwiOiAiaHR0cHM6Ly9naXRodWIuY29tL0FydGlmaWNpYWwtRW5naW5lZXJpbmcvbHljaGVlanMuZ2l0IgoJfQp9"
								}
							},
							"index.html": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/html/Build.index.html"
								],
								"blob": {
									"buffer": "data:application/octet-stream;base64,PCFET0NUWVBFIGh0bWw+CjxodG1sIG1hbmlmZXN0PSJpbmRleC5hcHBjYWNoZSI+CjxoZWFkPgoJPG1ldGEgY2hhcnNldD0idXRmLTgiPgoJPHRpdGxlPiR7aWR9PC90aXRsZT4KCTxtZXRhIG5hbWU9InZpZXdwb3J0IiBjb250ZW50PSJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MSwgbWluaW11bS1zY2FsZT0xLCBtYXhpbXVtLXNjYWxlPTEsIHVzZXItc2NhbGFibGU9bm8iPgoJPG1ldGEgbmFtZT0iYXBwbGUtbW9iaWxlLXdlYi1hcHAtY2FwYWJsZSIgY29udGVudD0ieWVzIj4KCTxtZXRhIG5hbWU9ImFwcGxlLW1vYmlsZS13ZWItYXBwLXN0YXR1cy1iYXItc3R5bGUiIGNvbnRlbnQ9ImJsYWNrLXRyYW5zbHVjZW50Ij4KCTxtZXRhIGh0dHAtZXF1aXY9IlgtVUEtQ29tcGF0aWJsZSIgY29udGVudD0iSUU9ZWRnZSI+CgoJPCEtLSBCT09UU1RSQVAgLS0+Cgk8c2NyaXB0IHNyYz0iLi9jcnV4LmpzIj48L3NjcmlwdD4KCgk8IS0tIE1FVEEgLS0+Cgk8bGluayByZWw9Im1hbmlmZXN0IiBocmVmPSIuL21hbmlmZXN0Lmpzb24iPgoJPGxpbmsgcmVsPSJpY29uIiBocmVmPSIuL2ljb24ucG5nIiBzaXplcz0iMTI4eDEyOCIgdHlwZT0iaW1hZ2UvcG5nIj4KCgk8c3R5bGU+CgkJLmx5Y2hlZS1SZW5kZXJlciB7CgkJCW1hcmdpbjogMCBhdXRvOwoJCX0KCTwvc3R5bGU+Cgo8L2hlYWQ+Cjxib2R5Pgo8c2NyaXB0PgooZnVuY3Rpb24obHljaGVlLCBnbG9iYWwpIHsKCglsZXQgZW52aXJvbm1lbnQgPSBseWNoZWUuZGVzZXJpYWxpemUoJHtibG9ifSk7CglpZiAoZW52aXJvbm1lbnQgIT09IG51bGwpIHsKCgkJbHljaGVlLmluaXQoZW52aXJvbm1lbnQsIHsKCQkJcHJvZmlsZTogJHtwcm9maWxlfQoJCX0pOwoKCX0KCn0pKGx5Y2hlZSwgdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTsKPC9zY3JpcHQ+CjwvYm9keT4KPC9odG1sPgo="
								}
							}
						},
						"includes": [
							"fertilizer.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Flow  = lychee.import('fertilizer.event.Flow');\n\tconst _INDEX = {\n\t\tapplication: attachments['index.html'],\n\t\tlibrary:     attachments['index.js']\n\t};\n\tconst _META  = {\n\t\tapplication: attachments['index.appcache'],\n\t\tlibrary:     attachments['package.json']\n\t};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _build_index = function(variant, stuff) {\n\n\t\tstuff = stuff instanceof Stuff ? stuff : null;\n\n\n\t\tif (stuff !== null) {\n\n\t\t\tlet code = stuff.buffer.toString('utf8');\n\t\t\tif (code.includes('${blob}') === false) {\n\t\t\t\tcode = _INDEX[variant].buffer.toString('utf8');\n\t\t\t}\n\n\n\t\t\tlet env = this.__environment;\n\t\t\tif (env !== null) {\n\n\t\t\t\tlet lines = code.split('\\n');\n\n\t\t\t\tlet blob      = JSON.stringify(env.serialize(), null, '\\t');\n\t\t\t\tlet blob_line = lines.find(line => line.includes('${blob}')) || null;\n\t\t\t\tif (blob_line !== null) {\n\n\t\t\t\t\tlet indent = blob_line.substr(0, blob_line.indexOf(blob_line.trim()));\n\t\t\t\t\tif (indent !== '') {\n\t\t\t\t\t\tblob = blob.split('\\n').map((line, l) => {\n\t\t\t\t\t\t\treturn l === 0 ? line : indent + line;\n\t\t\t\t\t\t}).join('\\n');\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tlet profile      = JSON.stringify(this.__profile, null, '\\t');\n\t\t\t\tlet profile_line = lines.find(line => line.includes('{$profile}')) || null;\n\t\t\t\tif (profile_line !== null) {\n\n\t\t\t\t\tlet indent = profile_line.substr(0, profile_line.indexOf(profile_line.trim()));\n\t\t\t\t\tif (indent !== '') {\n\t\t\t\t\t\tprofile = profile.split('\\n').map((line, l) => {\n\t\t\t\t\t\t\treturn l === 0 ? line : indent + line;\n\t\t\t\t\t\t}).join('\\n');\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tstuff.buffer = Buffer.from(code.replaceObject({\n\t\t\t\t\tid:      env.id,\n\t\t\t\t\tblob:    blob,\n\t\t\t\t\tprofile: profile\n\t\t\t\t}), 'utf8');\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _build_meta = function(variant, asset) {\n\n\t\tif (variant === 'application') {\n\n\t\t\t// XXX: Nothing to do\n\n\t\t} else if (variant === 'library') {\n\n\t\t\tlet buffer = asset.buffer;\n\t\t\tif (buffer instanceof Object) {\n\n\t\t\t\tlet env = this.__environment;\n\t\t\t\tif (env !== null) {\n\n\t\t\t\t\tasset.buffer = JSON.parse(JSON.stringify(buffer).replaceObject({\n\t\t\t\t\t\tid: env.id\n\t\t\t\t\t}));\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _create_index = function(variant) {\n\n\t\tlet template = null;\n\t\tif (variant === 'application') {\n\t\t\ttemplate = lychee.serialize(_INDEX.application);\n\t\t} else if (variant === 'library') {\n\t\t\ttemplate = lychee.serialize(_INDEX.library);\n\t\t}\n\n\t\tif (template !== null) {\n\n\t\t\tlet asset = lychee.deserialize(template);\n\t\t\tif (asset !== null) {\n\n\t\t\t\tlet base = asset.url.split('/').pop();\n\t\t\t\tlet name = base.split('.').slice(1).join('.');\n\n\t\t\t\tasset.url = './' + name;\n\n\t\t\t}\n\n\t\t\treturn asset;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _create_meta = function(variant) {\n\n\t\tlet template = null;\n\t\tif (variant === 'application') {\n\t\t\ttemplate = lychee.serialize(_META.application);\n\t\t} else if (variant === 'library') {\n\t\t\ttemplate = lychee.serialize(_META.library);\n\t\t}\n\n\t\tif (template !== null) {\n\n\t\t\tlet asset = lychee.deserialize(template);\n\t\t\tif (asset !== null) {\n\n\t\t\t\tlet base = asset.url.split('/').pop();\n\t\t\t\tlet name = base.split('.').slice(1).join('.');\n\n\t\t\t\tasset.url = './' + name;\n\n\t\t\t}\n\n\t\t\treturn asset;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Flow.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.unbind('build-assets');\n\n\t\tthis.bind('build-assets', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet project = this.project;\n\n\t\t\tif (action !== null && project !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/BUILD-ASSETS \"' + project + '\"');\n\n\n\t\t\t\tlet env = this.__environment;\n\t\t\t\tif (env !== null) {\n\n\t\t\t\t\tlet base_index = '*';\n\t\t\t\t\tlet base_meta  = '*';\n\n\t\t\t\t\tlet variant = env.variant;\n\t\t\t\t\tif (variant === 'application') {\n\n\t\t\t\t\t\tbase_index = 'index.html';\n\t\t\t\t\t\tbase_meta  = 'index.appcache';\n\n\t\t\t\t\t} else if (variant === 'library') {\n\n\t\t\t\t\t\tbase_index = 'index.js';\n\t\t\t\t\t\tbase_meta  = 'package.json';\n\n\t\t\t\t\t}\n\n\n\t\t\t\t\tlet meta = this.assets.find(asset => asset.url.endsWith('/' + base_meta)) || null;\n\t\t\t\t\tif (meta === null || meta.buffer === null) {\n\t\t\t\t\t\tmeta = _create_meta.call(this, variant);\n\t\t\t\t\t\t_build_meta.call(this, variant, meta);\n\t\t\t\t\t\tthis.assets.push(meta);\n\t\t\t\t\t} else {\n\t\t\t\t\t\t_build_meta.call(this, variant, meta);\n\t\t\t\t\t}\n\n\t\t\t\t\tlet index = this.assets.find(asset => asset.url.endsWith('/' + base_index)) || null;\n\t\t\t\t\tif (index === null || index.buffer === null) {\n\t\t\t\t\t\tindex = _create_index.call(this, variant);\n\t\t\t\t\t\t_build_index.call(this, variant, index);\n\t\t\t\t\t\tthis.assets.push(index);\n\t\t\t\t\t} else {\n\t\t\t\t\t\t_build_index.call(this, variant, index);\n\t\t\t\t\t}\n\n\n\t\t\t\t\toncomplete(true);\n\n\t\t\t\t} else {\n\t\t\t\t\toncomplete(false);\n\t\t\t\t}\n\n\n\t\t\t} else {\n\t\t\t\toncomplete(true);\n\t\t\t}\n\n\t\t}, this);\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\t// this.then('configure-project');\n\n\t\tthis.then('read-package');\n\t\tthis.then('read-assets');\n\t\tthis.then('read-assets-crux');\n\n\t\tthis.then('build-environment');\n\t\tthis.then('build-assets');\n\t\tthis.then('write-assets');\n\t\tthis.then('build-project');\n\n\t\t// this.then('package-runtime');\n\t\t// this.then('package-project');\n\n\t\t// this.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.flow.html.Build';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.flow.html-nwjs.Build": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.flow.html-nwjs.Build",
							"url": "./source/event/flow/html-nwjs/Build.js"
						}
					],
					"blob": {
						"attaches": {
							"index.html": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/html-nwjs/Build.index.html"
								],
								"blob": {
									"buffer": "data:application/octet-stream;base64,PCFET0NUWVBFIGh0bWw+CjxodG1sPgo8aGVhZD4KCTxtZXRhIGNoYXJzZXQ9InV0Zi04Ij4KCTx0aXRsZT4ke2lkfTwvdGl0bGU+Cgk8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEsIG1pbmltdW0tc2NhbGU9MSwgbWF4aW11bS1zY2FsZT0xLCB1c2VyLXNjYWxhYmxlPW5vIj4KCgk8IS0tIEJPT1RTVFJBUCAtLT4KCTxzY3JpcHQgc3JjPSIuL2NydXguanMiPjwvc2NyaXB0PgoKCTwhLS0gTUVUQSAtLT4KCTxsaW5rIHJlbD0iaWNvbiIgaHJlZj0iLi9pY29uLnBuZyIgc2l6ZXM9IjEyOHgxMjgiIHR5cGU9ImltYWdlL3BuZyI+CgoJPHN0eWxlPgoJCS5seWNoZWUtUmVuZGVyZXIgewoJCQltYXJnaW46IDAgYXV0bzsKCQl9Cgk8L3N0eWxlPgoKPC9oZWFkPgo8Ym9keT4KPHNjcmlwdD4KKGZ1bmN0aW9uKGx5Y2hlZSwgZ2xvYmFsKSB7CgoJbGV0IGJsb2IgPSAke2Jsb2J9OwoKCglsZXQgZW52aXJvbm1lbnQgPSBseWNoZWUuZGVzZXJpYWxpemUoYmxvYik7CglpZiAoZW52aXJvbm1lbnQgIT09IG51bGwpIHsKCgkJbHljaGVlLmluaXQoZW52aXJvbm1lbnQsIHsKCQkJcHJvZmlsZTogJHtwcm9maWxlfQoJCX0pOwoKCX0KCn0pKGx5Y2hlZSwgdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTsKPC9zY3JpcHQ+CjwvYm9keT4KPC9odG1sPgo="
								}
							},
							"index.js": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/html-nwjs/Build.index.js"
								],
								"blob": {
									"buffer": "data:application/javascript;base64,CihmdW5jdGlvbihseWNoZWUsIGdsb2JhbCkgewoKCWlmIChseWNoZWUgPT09IHVuZGVmaW5lZCkgewoKCQl0cnkgewoJCQlseWNoZWUgPSByZXF1aXJlKCcuL2NydXguanMnKShfX2Rpcm5hbWUpOwoJCX0gY2F0Y2ggKGVycikgewoJCX0KCgl9CgoKCWxldCBibG9iID0gJHtibG9ifTsKCgoJbGV0IGVudmlyb25tZW50ID0gbHljaGVlLmRlc2VyaWFsaXplKGJsb2IpOwoJaWYgKGVudmlyb25tZW50ICE9PSBudWxsKSB7CgkJZW52aXJvbm1lbnQuaW5pdCgpOwoJfQoKCWx5Y2hlZS5FTlZJUk9OTUVOVFNbJyR7aWR9J10gPSBlbnZpcm9ubWVudDsKCglyZXR1cm4gZW52aXJvbm1lbnQ7Cgp9KSh0eXBlb2YgbHljaGVlICE9PSAndW5kZWZpbmVkJyA/IGx5Y2hlZSA6IHVuZGVmaW5lZCwgdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTsK"
								}
							},
							"package.json": {
								"constructor": "Config",
								"arguments": [
									"./source/event/flow/html-nwjs/Build.package.json"
								],
								"blob": {
									"buffer": "data:application/json;base64,ewoJIm1haW4iOiAiLi9pbmRleC5odG1sIiwKCSJuYW1lIjogIiR7aWR9IiwKCSJ0aXRsZSI6ICIke2lkfSAocG93ZXJlZCBieSBseWNoZWUuanMpIiwKCSJ2ZXJzaW9uIjogIiR7dmVyc2lvbn0iLAoJImhvbWVwYWdlIjogImh0dHBzOi8vbHljaGVlLmpzLm9yZyIsCgkiZGVzY3JpcHRpb24iOiAiTmV4dC1HZW4gSXNvbW9ycGhpYyBBcHBsaWNhdGlvbiBFbmdpbmUiLAoJImxpY2Vuc2UiOiAiKE1JVCBBTkQgR1BMLTMuMCkiLAoJInJlcG9zaXRvcnkiOiB7CgkJInR5cGUiOiAiZ2l0IiwKCQkidXJsIjogImh0dHBzOi8vZ2l0aHViLmNvbS9BcnRpZmljaWFsLUVuZ2luZWVyaW5nL2x5Y2hlZWpzLmdpdCIKCX0sCgkid2luZG93IjogewoJCSJ0aXRsZSI6ICIke2lkfSAocG93ZXJlZCBieSBseWNoZWUuanMpIiwKCQkiaWNvbiI6ICIuL2ljb24ucG5nIiwKCQkidG9vbGJhciI6IGZhbHNlLAoJCSJmcmFtZSI6IHRydWUsCgkJIndpZHRoIjogNjQwLAoJCSJoZWlnaHQiOiA0ODAsCgkJInBvc2l0aW9uIjogImNlbnRlciIKCX0sCgkid2Via2l0IjogewoJCSJwbHVnaW4iOiBmYWxzZQoJfQp9"
								}
							}
						},
						"includes": [
							"fertilizer.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Flow  = lychee.import('fertilizer.event.Flow');\n\tconst _INDEX = {\n\t\tapplication: attachments['index.html'],\n\t\tlibrary:     attachments['index.js']\n\t};\n\tconst _META  = attachments['package.json'];\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _build_index = function(variant, stuff) {\n\n\t\tstuff = stuff instanceof Stuff ? stuff : null;\n\n\n\t\tif (stuff !== null) {\n\n\t\t\tlet code = stuff.buffer.toString('utf8');\n\t\t\tif (code.includes('${blob}') === false) {\n\t\t\t\tcode = _INDEX[variant].buffer.toString('utf8');\n\t\t\t}\n\n\n\t\t\tlet env = this.__environment;\n\t\t\tif (env !== null) {\n\n\t\t\t\tlet lines = code.split('\\n');\n\n\t\t\t\tlet blob      = JSON.stringify(env.serialize(), null, '\\t');\n\t\t\t\tlet blob_line = lines.find(line => line.includes('${blob}')) || null;\n\t\t\t\tif (blob_line !== null) {\n\n\t\t\t\t\tlet indent = blob_line.substr(0, blob_line.indexOf(blob_line.trim()));\n\t\t\t\t\tif (indent !== '') {\n\t\t\t\t\t\tblob = blob.split('\\n').map((line, l) => {\n\t\t\t\t\t\t\treturn l === 0 ? line : indent + line;\n\t\t\t\t\t\t}).join('\\n');\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tlet profile      = JSON.stringify(this.__profile, null, '\\t');\n\t\t\t\tlet profile_line = lines.find(line => line.includes('{$profile}')) || null;\n\t\t\t\tif (profile_line !== null) {\n\n\t\t\t\t\tlet indent = profile_line.substr(0, profile_line.indexOf(profile_line.trim()));\n\t\t\t\t\tif (indent !== '') {\n\t\t\t\t\t\tprofile = profile.split('\\n').map((line, l) => {\n\t\t\t\t\t\t\treturn l === 0 ? line : indent + line;\n\t\t\t\t\t\t}).join('\\n');\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tstuff.buffer = Buffer.from(code.replaceObject({\n\t\t\t\t\tid:      env.id,\n\t\t\t\t\tblob:    blob,\n\t\t\t\t\tprofile: profile\n\t\t\t\t}), 'utf8');\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _build_meta = function(variant, asset) {\n\n\t\tlet buffer = asset.buffer;\n\t\tif (buffer instanceof Object) {\n\n\t\t\tlet env = this.__environment;\n\t\t\tif (env !== null) {\n\n\t\t\t\tlet date    = new Date();\n\t\t\t\tlet today   = (date.getUTCMonth() + 1) + '/' + date.getUTCDate();\n\t\t\t\tlet version = lychee.VERSION + '/' + today;\n\n\t\t\t\tasset.buffer = JSON.parse(JSON.stringify(buffer).replaceObject({\n\t\t\t\t\tid:      env.id,\n\t\t\t\t\tversion: version\n\t\t\t\t}));\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _create_index = function(variant) {\n\n\t\tlet template = null;\n\t\tif (variant === 'application') {\n\t\t\ttemplate = lychee.serialize(_INDEX.application);\n\t\t} else if (variant === 'library') {\n\t\t\ttemplate = lychee.serialize(_INDEX.library);\n\t\t}\n\n\t\tif (template !== null) {\n\n\t\t\tlet asset = lychee.deserialize(template);\n\t\t\tif (asset !== null) {\n\n\t\t\t\tlet base = asset.url.split('/').pop();\n\t\t\t\tlet name = base.split('.').slice(1).join('.');\n\n\t\t\t\tasset.url = './' + name;\n\n\t\t\t}\n\n\t\t\treturn asset;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _create_meta = function(variant) {\n\n\t\tlet template = lychee.serialize(_META);\n\t\tif (template !== null) {\n\n\t\t\tlet asset = lychee.deserialize(template);\n\t\t\tif (asset !== null) {\n\n\t\t\t\tlet base = asset.url.split('/').pop();\n\t\t\t\tlet name = base.split('.').slice(1).join('.');\n\n\t\t\t\tasset.url = './' + name;\n\n\t\t\t}\n\n\t\t\treturn asset;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Flow.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.unbind('build-assets');\n\n\t\tthis.bind('build-assets', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet project = this.project;\n\n\t\t\tif (action !== null && project !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/BUILD-ASSETS \"' + project + '\"');\n\n\n\t\t\t\tlet env = this.__environment;\n\t\t\t\tif (env !== null) {\n\n\t\t\t\t\tlet base_index = '*';\n\n\t\t\t\t\tlet variant = env.variant;\n\t\t\t\t\tif (variant === 'application') {\n\t\t\t\t\t\tbase_index = 'index.html';\n\t\t\t\t\t} else if (variant === 'library') {\n\t\t\t\t\t\tbase_index = 'index.js';\n\t\t\t\t\t}\n\n\n\t\t\t\t\tlet meta = this.assets.find(asset => asset.url.endsWith('/package.json')) || null;\n\t\t\t\t\tif (meta === null || meta.buffer === null) {\n\t\t\t\t\t\tmeta = _create_meta.call(this, variant);\n\t\t\t\t\t\t_build_meta.call(this, variant, meta);\n\t\t\t\t\t\tthis.assets.push(meta);\n\t\t\t\t\t} else {\n\t\t\t\t\t\t_build_meta.call(this, variant, meta);\n\t\t\t\t\t}\n\n\t\t\t\t\tlet index = this.assets.find(asset => asset.url.endsWith('/' + base_index)) || null;\n\t\t\t\t\tif (index === null || index.buffer === null) {\n\t\t\t\t\t\tindex = _create_index.call(this, variant);\n\t\t\t\t\t\t_build_index.call(this, variant, index);\n\t\t\t\t\t\tthis.assets.push(index);\n\t\t\t\t\t} else {\n\t\t\t\t\t\t_build_index.call(this, variant, index);\n\t\t\t\t\t}\n\n\n\t\t\t\t\toncomplete(true);\n\n\t\t\t\t} else {\n\t\t\t\t\toncomplete(false);\n\t\t\t\t}\n\n\n\t\t\t} else {\n\t\t\t\toncomplete(true);\n\t\t\t}\n\n\t\t}, this);\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\t// this.then('configure-project');\n\n\t\tthis.then('read-package');\n\t\tthis.then('read-assets');\n\t\tthis.then('read-assets-crux');\n\n\t\tthis.then('build-environment');\n\t\tthis.then('build-assets');\n\t\tthis.then('write-assets');\n\t\tthis.then('build-project');\n\n\t\t// this.then('package-runtime');\n\t\t// this.then('package-project');\n\n\t\t// this.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.flow.html-nwjs.Build';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.flow.html-webview.Build": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.flow.html-webview.Build",
							"url": "./source/event/flow/html-webview/Build.js"
						}
					],
					"blob": {
						"attaches": {
							"index.appcache": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/html-webview/Build.index.appcache"
								],
								"blob": {
									"buffer": "data:application/octet-stream;base64,Q0FDSEUgTUFOSUZFU1QKCkNBQ0hFOgovZmF2aWNvbi5pY28KY3J1eC5qcwppY29uLnBuZwppbmRleC5odG1sCmluZGV4LmpzCm1hbmlmZXN0Lmpzb24KCk5FVFdPUks6Ci9hcGkKaHR0cDovL2hhcnZlc3Rlci5hcnRpZmljaWFsLmVuZ2luZWVyaW5nOjQ4NDgKaHR0cDovL2xvY2FsaG9zdDo0ODQ4Cgo="
								}
							},
							"index.html": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/html-webview/Build.index.html"
								],
								"blob": {
									"buffer": "data:application/octet-stream;base64,PCFET0NUWVBFIGh0bWw+CjxodG1sIG1hbmlmZXN0PSJpbmRleC5hcHBjYWNoZSI+CjxoZWFkPgoJPG1ldGEgY2hhcnNldD0idXRmLTgiPgoJPHRpdGxlPiR7aWR9PC90aXRsZT4KCTxtZXRhIG5hbWU9InZpZXdwb3J0IiBjb250ZW50PSJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MSwgbWluaW11bS1zY2FsZT0xLCBtYXhpbXVtLXNjYWxlPTEsIHVzZXItc2NhbGFibGU9bm8iPgoJPG1ldGEgbmFtZT0iYXBwbGUtbW9iaWxlLXdlYi1hcHAtY2FwYWJsZSIgY29udGVudD0ieWVzIj4KCTxtZXRhIG5hbWU9ImFwcGxlLW1vYmlsZS13ZWItYXBwLXN0YXR1cy1iYXItc3R5bGUiIGNvbnRlbnQ9ImJsYWNrLXRyYW5zbHVjZW50Ij4KCTxtZXRhIGh0dHAtZXF1aXY9IlgtVUEtQ29tcGF0aWJsZSIgY29udGVudD0iSUU9ZWRnZSI+CgoJPCEtLSBCT09UU1RSQVAgLS0+Cgk8c2NyaXB0IHNyYz0iLi9jcnV4LmpzIj48L3NjcmlwdD4KCgk8IS0tIE1FVEEgLS0+Cgk8bGluayByZWw9Im1hbmlmZXN0IiBocmVmPSIuL21hbmlmZXN0Lmpzb24iPgoJPGxpbmsgcmVsPSJpY29uIiBocmVmPSIuL2ljb24ucG5nIiBzaXplcz0iMTI4eDEyOCIgdHlwZT0iaW1hZ2UvcG5nIj4KCgk8c3R5bGU+CgkJLmx5Y2hlZS1SZW5kZXJlciB7CgkJCW1hcmdpbjogMCBhdXRvOwoJCX0KCTwvc3R5bGU+Cgo8L2hlYWQ+Cjxib2R5Pgo8c2NyaXB0PgooZnVuY3Rpb24obHljaGVlLCBnbG9iYWwpIHsKCglsZXQgZW52aXJvbm1lbnQgPSBseWNoZWUuZGVzZXJpYWxpemUoJHtibG9ifSk7CglpZiAoZW52aXJvbm1lbnQgIT09IG51bGwpIHsKCgkJbHljaGVlLmluaXQoZW52aXJvbm1lbnQsIHsKCQkJcHJvZmlsZTogJHtwcm9maWxlfQoJCX0pOwoKCX0KCn0pKGx5Y2hlZSwgdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTsKPC9zY3JpcHQ+CjwvYm9keT4KPC9odG1sPgo="
								}
							},
							"index.js": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/html-webview/Build.index.js"
								],
								"blob": {
									"buffer": "data:application/javascript;base64,CihmdW5jdGlvbihseWNoZWUsIGdsb2JhbCkgewoKCWlmIChseWNoZWUgPT09IHVuZGVmaW5lZCkgewoKCQl0cnkgewoKCQkJbGV0IHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOwoJCQl0bXAuc3JjICAgICAgID0gJy4vY3J1eC5qcyc7CgkJCXRtcC5fZmlsZW5hbWUgPSAnLi9jcnV4LmpzJzsKCQkJdG1wLmFzeW5jICAgICA9IGZhbHNlOwoJCQlkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRtcCk7CgoJCX0gY2F0Y2ggKGVycikgewoJCX0KCgl9CgoKCWxldCBibG9iID0gJHtibG9ifTsKCgoJbGV0IGVudmlyb25tZW50ID0gbHljaGVlLmRlc2VyaWFsaXplKGJsb2IpOwoJaWYgKGVudmlyb25tZW50ICE9PSBudWxsKSB7CgkJZW52aXJvbm1lbnQuaW5pdCgpOwoJfQoKCWx5Y2hlZS5FTlZJUk9OTUVOVFNbJyR7aWR9J10gPSBlbnZpcm9ubWVudDsKCglyZXR1cm4gZW52aXJvbm1lbnQ7Cgp9KSh0eXBlb2YgbHljaGVlICE9PSAndW5kZWZpbmVkJyA/IGx5Y2hlZSA6IHVuZGVmaW5lZCwgdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTsK"
								}
							},
							"package.json": {
								"constructor": "Config",
								"arguments": [
									"./source/event/flow/html-webview/Build.package.json"
								],
								"blob": {
									"buffer": "data:application/json;base64,ewoJImJyb3dzZXIiOiAiLi9pbmRleC5qcyIsCgkibmFtZSI6ICIke2lkfSIsCgkidGl0bGUiOiAiJHtpZH0gKHBvd2VyZWQgYnkgbHljaGVlLmpzKSIsCgkiaG9tZXBhZ2UiOiAiaHR0cHM6Ly9seWNoZWUuanMub3JnIiwKCSJkZXNjcmlwdGlvbiI6ICJOZXh0LUdlbiBJc29tb3JwaGljIEFwcGxpY2F0aW9uIEVuZ2luZSIsCgkibGljZW5zZSI6ICIoTUlUIEFORCBHUEwtMy4wKSIsCgkicmVwb3NpdG9yeSI6IHsKCQkidHlwZSI6ICJnaXQiLAoJCSJ1cmwiOiAiaHR0cHM6Ly9naXRodWIuY29tL0FydGlmaWNpYWwtRW5naW5lZXJpbmcvbHljaGVlanMuZ2l0IgoJfQp9"
								}
							}
						},
						"includes": [
							"fertilizer.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Flow  = lychee.import('fertilizer.event.Flow');\n\tconst _INDEX = {\n\t\tapplication: attachments['index.html'],\n\t\tlibrary:     attachments['index.js']\n\t};\n\tconst _META  = {\n\t\tapplication: attachments['index.appcache'],\n\t\tlibrary:     attachments['package.json']\n\t};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _build_index = function(variant, stuff) {\n\n\t\tstuff = stuff instanceof Stuff ? stuff : null;\n\n\n\t\tif (stuff !== null) {\n\n\t\t\tlet code = stuff.buffer.toString('utf8');\n\t\t\tif (code.includes('${blob}') === false) {\n\t\t\t\tcode = _INDEX[variant].buffer.toString('utf8');\n\t\t\t}\n\n\n\t\t\tlet env = this.__environment;\n\t\t\tif (env !== null) {\n\n\t\t\t\tlet lines = code.split('\\n');\n\n\t\t\t\tlet blob      = JSON.stringify(env.serialize(), null, '\\t');\n\t\t\t\tlet blob_line = lines.find(line => line.includes('${blob}')) || null;\n\t\t\t\tif (blob_line !== null) {\n\n\t\t\t\t\tlet indent = blob_line.substr(0, blob_line.indexOf(blob_line.trim()));\n\t\t\t\t\tif (indent !== '') {\n\t\t\t\t\t\tblob = blob.split('\\n').map((line, l) => {\n\t\t\t\t\t\t\treturn l === 0 ? line : indent + line;\n\t\t\t\t\t\t}).join('\\n');\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tlet profile      = JSON.stringify(this.__profile, null, '\\t');\n\t\t\t\tlet profile_line = lines.find(line => line.includes('{$profile}')) || null;\n\t\t\t\tif (profile_line !== null) {\n\n\t\t\t\t\tlet indent = profile_line.substr(0, profile_line.indexOf(profile_line.trim()));\n\t\t\t\t\tif (indent !== '') {\n\t\t\t\t\t\tprofile = profile.split('\\n').map((line, l) => {\n\t\t\t\t\t\t\treturn l === 0 ? line : indent + line;\n\t\t\t\t\t\t}).join('\\n');\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tstuff.buffer = Buffer.from(code.replaceObject({\n\t\t\t\t\tid:      env.id,\n\t\t\t\t\tblob:    blob,\n\t\t\t\t\tprofile: profile\n\t\t\t\t}), 'utf8');\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _build_meta = function(variant, asset) {\n\n\t\tif (variant === 'application') {\n\n\t\t\t// XXX: Nothing to do\n\n\t\t} else if (variant === 'library') {\n\n\t\t\tlet buffer = asset.buffer;\n\t\t\tif (buffer instanceof Object) {\n\n\t\t\t\tlet env = this.__environment;\n\t\t\t\tif (env !== null) {\n\n\t\t\t\t\tasset.buffer = JSON.parse(JSON.stringify(buffer).replaceObject({\n\t\t\t\t\t\tid: env.id\n\t\t\t\t\t}));\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _create_index = function(variant) {\n\n\t\tlet template = null;\n\t\tif (variant === 'application') {\n\t\t\ttemplate = lychee.serialize(_INDEX.application);\n\t\t} else if (variant === 'library') {\n\t\t\ttemplate = lychee.serialize(_INDEX.library);\n\t\t}\n\n\t\tif (template !== null) {\n\n\t\t\tlet asset = lychee.deserialize(template);\n\t\t\tif (asset !== null) {\n\n\t\t\t\tlet base = asset.url.split('/').pop();\n\t\t\t\tlet name = base.split('.').slice(1).join('.');\n\n\t\t\t\tasset.url = './' + name;\n\n\t\t\t}\n\n\t\t\treturn asset;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _create_meta = function(variant) {\n\n\t\tlet template = null;\n\t\tif (variant === 'application') {\n\t\t\ttemplate = lychee.serialize(_META.application);\n\t\t} else if (variant === 'library') {\n\t\t\ttemplate = lychee.serialize(_META.library);\n\t\t}\n\n\t\tif (template !== null) {\n\n\t\t\tlet asset = lychee.deserialize(template);\n\t\t\tif (asset !== null) {\n\n\t\t\t\tlet base = asset.url.split('/').pop();\n\t\t\t\tlet name = base.split('.').slice(1).join('.');\n\n\t\t\t\tasset.url = './' + name;\n\n\t\t\t}\n\n\t\t\treturn asset;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Flow.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.unbind('build-assets');\n\n\t\tthis.bind('build-assets', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet project = this.project;\n\n\t\t\tif (action !== null && project !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/BUILD-ASSETS \"' + project + '\"');\n\n\n\t\t\t\tlet env = this.__environment;\n\t\t\t\tif (env !== null) {\n\n\t\t\t\t\tlet base_index = '*';\n\t\t\t\t\tlet base_meta  = '*';\n\n\t\t\t\t\tlet variant = env.variant;\n\t\t\t\t\tif (variant === 'application') {\n\n\t\t\t\t\t\tbase_index = 'index.html';\n\t\t\t\t\t\tbase_meta  = 'index.appcache';\n\n\t\t\t\t\t} else if (variant === 'library') {\n\n\t\t\t\t\t\tbase_index = 'index.js';\n\t\t\t\t\t\tbase_meta  = 'package.json';\n\n\t\t\t\t\t}\n\n\n\t\t\t\t\tlet meta = this.assets.find(asset => asset.url.endsWith('/' + base_meta)) || null;\n\t\t\t\t\tif (meta === null || meta.buffer === null) {\n\t\t\t\t\t\tmeta = _create_meta.call(this, variant);\n\t\t\t\t\t\t_build_meta.call(this, variant, meta);\n\t\t\t\t\t\tthis.assets.push(meta);\n\t\t\t\t\t} else {\n\t\t\t\t\t\t_build_meta.call(this, variant, meta);\n\t\t\t\t\t}\n\n\t\t\t\t\tlet index = this.assets.find(asset => asset.url.endsWith('/' + base_index)) || null;\n\t\t\t\t\tif (index === null || index.buffer === null) {\n\t\t\t\t\t\tindex = _create_index.call(this, variant);\n\t\t\t\t\t\t_build_index.call(this, variant, index);\n\t\t\t\t\t\tthis.assets.push(index);\n\t\t\t\t\t} else {\n\t\t\t\t\t\t_build_index.call(this, variant, index);\n\t\t\t\t\t}\n\n\n\t\t\t\t\toncomplete(true);\n\n\t\t\t\t} else {\n\t\t\t\t\toncomplete(false);\n\t\t\t\t}\n\n\n\t\t\t} else {\n\t\t\t\toncomplete(true);\n\t\t\t}\n\n\t\t}, this);\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\t// this.then('configure-project');\n\n\t\tthis.then('read-package');\n\t\tthis.then('read-assets');\n\t\tthis.then('read-assets-crux');\n\n\t\tthis.then('build-environment');\n\t\tthis.then('build-assets');\n\t\tthis.then('write-assets');\n\t\tthis.then('build-project');\n\n\t\t// this.then('package-runtime');\n\t\t// this.then('package-project');\n\n\t\t// this.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.flow.html-webview.Build';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.flow.nidium.Build": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.flow.nidium.Build",
							"url": "./source/event/flow/nidium/Build.js"
						}
					],
					"blob": {
						"attaches": {
							"index.js": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/nidium/Build.index.js"
								],
								"blob": {
									"buffer": "data:application/javascript;base64,CihmdW5jdGlvbihseWNoZWUsIGdsb2JhbCkgewoKCWlmIChseWNoZWUgPT09IHVuZGVmaW5lZCkgewoKCQl0cnkgewoKCQkJbGV0IHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOwoJCQl0bXAuc3JjICAgICAgID0gJy4vY3J1eC5qcyc7CgkJCXRtcC5fZmlsZW5hbWUgPSAnLi9jcnV4LmpzJzsKCQkJdG1wLmFzeW5jICAgICA9IGZhbHNlOwoJCQlkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRtcCk7CgoJCX0gY2F0Y2ggKGVycikgewoJCX0KCgl9CgoKCWxldCBibG9iID0gJHtibG9ifTsKCgoJbGV0IGVudmlyb25tZW50ID0gbHljaGVlLmRlc2VyaWFsaXplKGJsb2IpOwoJaWYgKGVudmlyb25tZW50ICE9PSBudWxsKSB7CgkJZW52aXJvbm1lbnQuaW5pdCgpOwoJfQoKCWx5Y2hlZS5FTlZJUk9OTUVOVFNbJyR7aWR9J10gPSBlbnZpcm9ubWVudDsKCglyZXR1cm4gZW52aXJvbm1lbnQ7Cgp9KSh0eXBlb2YgbHljaGVlICE9PSAndW5kZWZpbmVkJyA/IGx5Y2hlZSA6IHVuZGVmaW5lZCwgdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTsK"
								}
							},
							"index.nml": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/nidium/Build.index.nml"
								],
								"blob": {
									"buffer": "data:application/octet-stream;base64,PGFwcGxpY2F0aW9uPgoJPG1ldGE+CgkJPHRpdGxlPiR7aWR9PC90aXRsZT4KCQk8dmlld3BvcnQ+MTAyNHg3Njg8L3ZpZXdwb3J0PgoJCTxpZGVudGlmaWVyPiR7aWR9PC9pZGVudGlmaWVyPgoJPC9tZXRhPgoJPGFzc2V0cz4KCQk8c2NyaXB0IHNyYz0iLi9jcnV4LmpzIj48L3NjcmlwdD4KCQk8c2NyaXB0PgoJCShmdW5jdGlvbihseWNoZWUsIGdsb2JhbCkgewoKCQkJbGV0IGJsb2IgPSAke2Jsb2J9OwoKCQkJbGV0IGVudmlyb25tZW50ID0gbHljaGVlLmRlc2VyaWFsaXplKGJsb2IpOwoJCQlpZiAoZW52aXJvbm1lbnQgIT09IG51bGwpIHsKCgkJCQlseWNoZWUuaW5pdChlbnZpcm9ubWVudCwgewoJCQkJCXByb2ZpbGU6ICR7cHJvZmlsZX0KCQkJCX0pOwoKCQkJfQoKCQl9KShseWNoZWUsIHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdGhpcyk7CgkJPC9zY3JpcHQ+Cgk8L2Fzc2V0cz4KPC9hcHBsaWNhdGlvbj4KCg=="
								}
							}
						},
						"includes": [
							"fertilizer.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Flow  = lychee.import('fertilizer.event.Flow');\n\tconst _INDEX = {\n\t\tapplication: attachments['index.html'],\n\t\tlibrary:     attachments['index.js']\n\t};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _build_index = function(variant, stuff) {\n\n\t\tstuff = stuff instanceof Stuff ? stuff : null;\n\n\n\t\tif (stuff !== null) {\n\n\t\t\tlet code = stuff.buffer.toString('utf8');\n\t\t\tif (code.includes('${blob}') === false) {\n\t\t\t\tcode = _INDEX[variant].buffer.toString('utf8');\n\t\t\t}\n\n\n\t\t\tlet env = this.__environment;\n\t\t\tif (env !== null) {\n\n\t\t\t\tlet lines = code.split('\\n');\n\n\t\t\t\tlet blob      = JSON.stringify(env.serialize(), null, '\\t');\n\t\t\t\tlet blob_line = lines.find(line => line.includes('${blob}')) || null;\n\t\t\t\tif (blob_line !== null) {\n\n\t\t\t\t\tlet indent = blob_line.substr(0, blob_line.indexOf(blob_line.trim()));\n\t\t\t\t\tif (indent !== '') {\n\t\t\t\t\t\tblob = blob.split('\\n').map((line, l) => {\n\t\t\t\t\t\t\treturn l === 0 ? line : indent + line;\n\t\t\t\t\t\t}).join('\\n');\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tlet profile      = JSON.stringify(this.__profile, null, '\\t');\n\t\t\t\tlet profile_line = lines.find(line => line.includes('{$profile}')) || null;\n\t\t\t\tif (profile_line !== null) {\n\n\t\t\t\t\tlet indent = profile_line.substr(0, profile_line.indexOf(profile_line.trim()));\n\t\t\t\t\tif (indent !== '') {\n\t\t\t\t\t\tprofile = profile.split('\\n').map((line, l) => {\n\t\t\t\t\t\t\treturn l === 0 ? line : indent + line;\n\t\t\t\t\t\t}).join('\\n');\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tstuff.buffer = Buffer.from(code.replaceObject({\n\t\t\t\t\tid:      env.id,\n\t\t\t\t\tblob:    blob,\n\t\t\t\t\tprofile: profile\n\t\t\t\t}), 'utf8');\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _create_index = function(variant) {\n\n\t\tlet template = null;\n\t\tif (variant === 'application') {\n\t\t\ttemplate = lychee.serialize(_INDEX.application);\n\t\t} else if (variant === 'library') {\n\t\t\ttemplate = lychee.serialize(_INDEX.library);\n\t\t}\n\n\t\tif (template !== null) {\n\n\t\t\tlet asset = lychee.deserialize(template);\n\t\t\tif (asset !== null) {\n\n\t\t\t\tlet base = asset.url.split('/').pop();\n\t\t\t\tlet name = base.split('.').slice(1).join('.');\n\n\t\t\t\tasset.url = './' + name;\n\n\t\t\t}\n\n\t\t\treturn asset;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Flow.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.unbind('build-assets');\n\n\t\tthis.bind('build-assets', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet project = this.project;\n\n\t\t\tif (action !== null && project !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/BUILD-ASSETS \"' + project + '\"');\n\n\n\t\t\t\tlet env = this.__environment;\n\t\t\t\tif (env !== null) {\n\n\t\t\t\t\tlet variant = env.variant;\n\t\t\t\t\tlet base    = env.variant === 'application' ? 'index.nml' : 'index.js';\n\t\t\t\t\tlet index   = this.assets.find(asset => asset.url.endsWith('/' + base)) || null;\n\n\t\t\t\t\tif (index === null || index.buffer === null) {\n\t\t\t\t\t\tindex = _create_index.call(this, variant);\n\t\t\t\t\t\t_build_index.call(this, variant, index);\n\t\t\t\t\t\tthis.assets.push(index);\n\t\t\t\t\t} else {\n\t\t\t\t\t\t_build_index.call(this, variant, index);\n\t\t\t\t\t}\n\n\n\t\t\t\t\toncomplete(true);\n\n\t\t\t\t} else {\n\t\t\t\t\toncomplete(false);\n\t\t\t\t}\n\n\n\t\t\t} else {\n\t\t\t\toncomplete(true);\n\t\t\t}\n\n\t\t}, this);\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\t// this.then('configure-project');\n\n\t\tthis.then('read-package');\n\t\tthis.then('read-assets');\n\t\tthis.then('read-assets-crux');\n\n\t\tthis.then('build-environment');\n\t\tthis.then('build-assets');\n\t\tthis.then('write-assets');\n\t\tthis.then('build-project');\n\n\t\t// this.then('package-runtime');\n\t\t// this.then('package-project');\n\n\t\t// this.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.flow.nidium.Build';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.flow.node.Build": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.flow.node.Build",
							"url": "./source/event/flow/node/Build.js"
						}
					],
					"blob": {
						"attaches": {
							"index.js": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/node/Build.index.js"
								],
								"blob": {
									"buffer": "data:application/javascript;base64,CihmdW5jdGlvbihseWNoZWUsIGdsb2JhbCkgewoKCWlmIChseWNoZWUgPT09IHVuZGVmaW5lZCkgewoKCQl0cnkgewoJCQlseWNoZWUgPSByZXF1aXJlKCcuL2NydXguanMnKShfX2Rpcm5hbWUpOwoJCX0gY2F0Y2ggKGVycikgewoJCX0KCgl9CgoKCWxldCBibG9iID0gJHtibG9ifTsKCglsZXQgZW52aXJvbm1lbnQgPSBseWNoZWUuZGVzZXJpYWxpemUoYmxvYik7CglpZiAoZW52aXJvbm1lbnQgIT09IG51bGwpIHsKCgkJaWYgKGVudmlyb25tZW50LnZhcmlhbnQgPT09ICdhcHBsaWNhdGlvbicpIHsKCQkJbHljaGVlLmluaXQoZW52aXJvbm1lbnQsIHsKCQkJCXByb2ZpbGU6ICR7cHJvZmlsZX0KCQkJfSk7CgkJfSBlbHNlIGlmIChlbnZpcm9ubWVudC52YXJpYW50ID09PSAnbGlicmFyeScpIHsKCQkJZW52aXJvbm1lbnQuaW5pdCgpOwoJCX0KCgl9CgoJbHljaGVlLkVOVklST05NRU5UU1snJHtpZH0nXSA9IGVudmlyb25tZW50OwoKCXJldHVybiBlbnZpcm9ubWVudDsKCn0pKHR5cGVvZiBseWNoZWUgIT09ICd1bmRlZmluZWQnID8gbHljaGVlIDogdW5kZWZpbmVkLCB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpOwo="
								}
							},
							"package.json": {
								"constructor": "Config",
								"arguments": [
									"./source/event/flow/node/Build.package.json"
								],
								"blob": {
									"buffer": "data:application/json;base64,ewoJIm1haW4iOiAiLi9pbmRleC5qcyIsCgkibmFtZSI6ICIke2lkfSIsCgkidGl0bGUiOiAiJHtpZH0gKHBvd2VyZWQgYnkgbHljaGVlLmpzKSIsCgkiaG9tZXBhZ2UiOiAiaHR0cHM6Ly9seWNoZWUuanMub3JnIiwKCSJkZXNjcmlwdGlvbiI6ICJOZXh0LUdlbiBJc29tb3JwaGljIEFwcGxpY2F0aW9uIEVuZ2luZSIsCgkibGljZW5zZSI6ICIoTUlUIEFORCBHUEwtMy4wKSIsCgkicmVwb3NpdG9yeSI6IHsKCQkidHlwZSI6ICJnaXQiLAoJCSJ1cmwiOiAiaHR0cHM6Ly9naXRodWIuY29tL0FydGlmaWNpYWwtRW5naW5lZXJpbmcvbHljaGVlanMuZ2l0IgoJfQp9"
								}
							}
						},
						"includes": [
							"fertilizer.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Flow  = lychee.import('fertilizer.event.Flow');\n\tconst _INDEX = attachments['index.js'];\n\tconst _META  = attachments['package.json'];\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _build_index = function(stuff) {\n\n\t\tstuff = stuff instanceof Stuff ? stuff : null;\n\n\n\t\tif (stuff !== null) {\n\n\t\t\tlet code = stuff.buffer.toString('utf8');\n\t\t\tif (code.includes('${blob}') === false) {\n\t\t\t\tcode = _INDEX.buffer.toString('utf8');\n\t\t\t}\n\n\n\t\t\tlet env = this.__environment;\n\t\t\tif (env !== null) {\n\n\t\t\t\tlet lines = code.split('\\n');\n\n\t\t\t\tlet blob      = JSON.stringify(env.serialize(), null, '\\t');\n\t\t\t\tlet blob_line = lines.find(line => line.includes('${blob}')) || null;\n\t\t\t\tif (blob_line !== null) {\n\n\t\t\t\t\tlet indent = blob_line.substr(0, blob_line.indexOf(blob_line.trim()));\n\t\t\t\t\tif (indent !== '') {\n\t\t\t\t\t\tblob = blob.split('\\n').map((line, l) => {\n\t\t\t\t\t\t\treturn l === 0 ? line : indent + line;\n\t\t\t\t\t\t}).join('\\n');\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tlet profile      = JSON.stringify(this.__profile, null, '\\t');\n\t\t\t\tlet profile_line = lines.find(line => line.includes('{$profile}')) || null;\n\t\t\t\tif (profile_line !== null) {\n\n\t\t\t\t\tlet indent = profile_line.substr(0, profile_line.indexOf(profile_line.trim()));\n\t\t\t\t\tif (indent !== '') {\n\t\t\t\t\t\tprofile = profile.split('\\n').map((line, l) => {\n\t\t\t\t\t\t\treturn l === 0 ? line : indent + line;\n\t\t\t\t\t\t}).join('\\n');\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tstuff.buffer = Buffer.from(code.replaceObject({\n\t\t\t\t\tid:      env.id,\n\t\t\t\t\tblob:    blob,\n\t\t\t\t\tprofile: profile\n\t\t\t\t}), 'utf8');\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _build_meta = function(asset) {\n\n\t\tlet buffer = asset.buffer;\n\t\tif (buffer instanceof Object) {\n\n\t\t\tlet env = this.__environment;\n\t\t\tif (env !== null) {\n\n\t\t\t\tasset.buffer = JSON.parse(JSON.stringify(buffer).replaceObject({\n\t\t\t\t\tid: env.id\n\t\t\t\t}));\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _create_index = function() {\n\n\t\tlet template = lychee.serialize(_INDEX);\n\t\tif (template !== null) {\n\n\t\t\tlet asset = lychee.deserialize(template);\n\t\t\tif (asset !== null) {\n\n\t\t\t\tlet base = asset.url.split('/').pop();\n\t\t\t\tlet name = base.split('.').slice(1).join('.');\n\n\t\t\t\tasset.url = './' + name;\n\n\t\t\t}\n\n\t\t\treturn asset;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _create_meta = function() {\n\n\t\tlet template = lychee.serialize(_META);\n\t\tif (template !== null) {\n\n\t\t\tlet asset = lychee.deserialize(template);\n\t\t\tif (asset !== null) {\n\n\t\t\t\tlet base = asset.url.split('/').pop();\n\t\t\t\tlet name = base.split('.').slice(1).join('.');\n\n\t\t\t\tasset.url = './' + name;\n\n\t\t\t}\n\n\t\t\treturn asset;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Flow.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.unbind('build-assets');\n\n\t\tthis.bind('build-assets', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet project = this.project;\n\n\t\t\tif (action !== null && project !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/BUILD-ASSETS \"' + project + '\"');\n\n\n\t\t\t\tlet env = this.__environment;\n\t\t\t\tif (env !== null) {\n\n\t\t\t\t\tlet meta = this.assets.find(asset => asset.url.endsWith('/package.json')) || null;\n\t\t\t\t\tif (meta === null || meta.buffer === null) {\n\t\t\t\t\t\tmeta = _create_meta.call(this);\n\t\t\t\t\t\t_build_meta.call(this, meta);\n\t\t\t\t\t\tthis.assets.push(meta);\n\t\t\t\t\t} else {\n\t\t\t\t\t\t_build_meta.call(this, meta);\n\t\t\t\t\t}\n\n\t\t\t\t\tlet index = this.assets.find(asset => asset.url.endsWith('/index.js')) || null;\n\t\t\t\t\tif (index === null || index.buffer === null) {\n\t\t\t\t\t\tindex = _create_index.call(this);\n\t\t\t\t\t\t_build_index.call(this, index);\n\t\t\t\t\t\tthis.assets.push(index);\n\t\t\t\t\t} else {\n\t\t\t\t\t\t_build_index.call(this, index);\n\t\t\t\t\t}\n\n\n\t\t\t\t\toncomplete(true);\n\n\t\t\t\t} else {\n\t\t\t\t\toncomplete(false);\n\t\t\t\t}\n\n\n\t\t\t} else {\n\t\t\t\toncomplete(true);\n\t\t\t}\n\n\t\t}, this);\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\t// this.then('configure-project');\n\n\t\tthis.then('read-package');\n\t\tthis.then('read-assets');\n\t\tthis.then('read-assets-crux');\n\n\t\tthis.then('build-environment');\n\t\tthis.then('build-assets');\n\t\tthis.then('write-assets');\n\t\tthis.then('build-project');\n\n\t\t// this.then('package-runtime');\n\t\t// this.then('package-project');\n\n\t\t// this.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.flow.node.Build';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.event.Queue": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.event.Queue",
							"url": "/libraries/lychee/source/event/Queue.js"
						}
					],
					"blob": {
						"attaches": {},
						"includes": [
							"lychee.event.Emitter"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Emitter = lychee.import('lychee.event.Emitter');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _process_recursive = function(result) {\n\n\t\tif (result instanceof Object) {\n\t\t\t_process_stack.call(this);\n\t\t} else if (result === true) {\n\t\t\t_process_stack.call(this);\n\t\t} else {\n\t\t\tthis.trigger('error');\n\t\t}\n\n\t};\n\n\tconst _process_stack = function() {\n\n\t\tlet data = this.___stack.shift() || null;\n\t\tif (data !== null) {\n\n\t\t\tthis.trigger('update', [ data, _process_recursive.bind(this) ]);\n\n\t\t} else {\n\n\t\t\tthis.trigger('complete');\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function() {\n\n\t\tthis.___init  = false;\n\t\tthis.___stack = [];\n\n\t\t_Emitter.call(this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.event.Queue';\n\n\t\t\tlet blob = (data['blob'] || {});\n\n\n\t\t\tif (this.___stack.length > 0) {\n\n\t\t\t\tblob.stack = [];\n\n\t\t\t\tfor (let s = 0, sl = this.___stack.length; s < sl; s++) {\n\t\t\t\t\tblob.stack.push(lychee.serialize(this.___stack[s]));\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tdata['blob'] = Object.keys(blob).length > 0 ? blob : null;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tthen: function(data) {\n\n\t\t\tdata = data instanceof Object ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tthis.___stack.push(data);\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tinit: function() {\n\n\t\t\tif (this.___init === false) {\n\n\t\t\t\tthis.___init = true;\n\n\n\t\t\t\tif (this.___stack.length > 0) {\n\n\t\t\t\t\t_process_stack.call(this);\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t} else {\n\n\t\t\t\t\tthis.trigger('error');\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.flow.nidium.Package": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.flow.nidium.Package",
							"url": "./source/event/flow/nidium/Package.js"
						}
					],
					"blob": {
						"attaches": {
							"index.sh": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/nidium/Package.index.sh"
								],
								"blob": {
									"buffer": "data:application/octet-stream;base64,IyEvYmluL2Jhc2gKClBST0pFQ1RfUk9PVD0kKGNkICIkKGRpcm5hbWUgIiQwIikvIjsgcHdkKTsKCmNkICRQUk9KRUNUX1JPT1Q7Ci4vbmlkaXVtIC4vaW5kZXgubm1sICIkMSIgIiQyIiAiJDMiICIkNCIgIiQ1IiAiJDYiICIkNyIgIiQ4IjsKCg=="
								}
							}
						},
						"requires": [
							"lychee.event.Queue"
						],
						"includes": [
							"fertilizer.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Flow  = lychee.import('fertilizer.event.Flow');\n\tconst _Queue = lychee.import('lychee.event.Queue');\n\tconst _INDEX = {\n\t\tlinux: attachments['index.sh'],\n\t\tmacos: attachments['index.sh']\n\t};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _package = function(os, arch, assets, oncomplete) {\n\n\t\tlet project = this.project;\n\t\tlet shell   = this.shell;\n\t\tlet stash   = this.stash;\n\t\tlet target  = this.target;\n\n\t\tif (project !== null && shell !== null && stash !== null && target !== null) {\n\n\t\t\tlet prefix = project + '/build/' + target + '-' + os + '-' + arch;\n\n\t\t\tstash.read([\n\t\t\t\t'/bin/runtime/nidium/' + os + '/' + arch + '/nidium'\n\t\t\t], binaries => {\n\n\t\t\t\tlet runtime = binaries[0] || null;\n\t\t\t\tif (runtime !== null) {\n\n\t\t\t\t\tlet files = assets.slice(0).concat(runtime).concat(_INDEX[os]);\n\t\t\t\t\tlet urls  = files.map(asset => prefix + '/' + asset.url.split('/').pop());\n\n\t\t\t\t\tstash.write(urls, files, result => oncomplete(result), this);\n\t\t\t\t\tstash.sync();\n\n\t\t\t\t} else {\n\t\t\t\t\toncomplete(false);\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t} else {\n\t\t\toncomplete(false);\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Flow.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.unbind('package-runtime');\n\n\t\tthis.bind('package-runtime', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet project = this.project;\n\t\t\tlet target  = this.target;\n\n\t\t\tif (action !== null && project !== null && target !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/PACKAGE-RUNTIME \"' + project + '\"');\n\n\n\t\t\t\tlet env = this.__environment;\n\t\t\t\tif (env !== null && env.variant === 'application') {\n\n\t\t\t\t\tlet assets = this.assets.filter(asset => asset !== null && asset.buffer !== null);\n\t\t\t\t\tif (assets.length > 0) {\n\n\t\t\t\t\t\tlet queue = new _Queue();\n\n\t\t\t\t\t\tqueue.then({ name: 'Linux x86_64', method: _package.bind(this, 'linux', 'x86_64', assets) });\n\t\t\t\t\t\tqueue.then({ name: 'MacOS x86_64', method: _package.bind(this, 'macos', 'x86_64', assets) });\n\n\t\t\t\t\t\tqueue.bind('update', (entry, oncomplete) => {\n\n\t\t\t\t\t\t\tentry.method(result => {\n\n\t\t\t\t\t\t\t\tif (result === true) {\n\t\t\t\t\t\t\t\t\tconsole.info('fertilizer: -> \"' + entry.name + '\" SUCCESS');\n\t\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\t\tconsole.warn('fertilizer: -> \"' + entry.name + '\" FAILURE');\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\toncomplete(true);\n\n\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t}, this);\n\n\t\t\t\t\t\tqueue.bind('complete', _ => oncomplete(true),  this);\n\t\t\t\t\t\tqueue.bind('error',    _ => oncomplete(false), this);\n\t\t\t\t\t\tqueue.init();\n\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\t\t\t\t\tconsole.log('fertilizer: -> Skipping \"' + target + '\".');\n\t\t\t\t\toncomplete(true);\n\t\t\t\t}\n\n\t\t\t} else {\n\t\t\t\toncomplete(false);\n\t\t\t}\n\n\t\t}, this);\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\t// this.then('configure-project');\n\n\t\t// this.then('read-package');\n\t\t// this.then('read-assets');\n\t\t// this.then('read-assets-crux');\n\n\t\t// this.then('build-environment');\n\t\t// this.then('build-assets');\n\t\t// this.then('write-assets');\n\t\t// this.then('build-project');\n\n\t\tthis.then('package-runtime');\n\t\tthis.then('package-project');\n\n\t\t// this.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.flow.nidium.Package';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.event.flow.node.Package": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.event.flow.node.Package",
							"url": "./source/event/flow/node/Package.js"
						}
					],
					"blob": {
						"attaches": {
							"index.cmd": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/node/Package.index.cmd"
								],
								"blob": {
									"buffer": "data:application/octet-stream;base64,QGVjaG8gb2ZmCm5vZGUuZXhlIGluZGV4LmpzICIlMSIgIiUyIiAiJTMiICIlNCIgIiU1IiAiJTYiICIlNyIgIiU4IgoK"
								}
							},
							"index.sh": {
								"constructor": "Stuff",
								"arguments": [
									"./source/event/flow/node/Package.index.sh"
								],
								"blob": {
									"buffer": "data:application/octet-stream;base64,IyEvYmluL2Jhc2gKClBST0pFQ1RfUk9PVD0kKGNkICIkKGRpcm5hbWUgIiQwIikvIjsgcHdkKTsKCmNkICRQUk9KRUNUX1JPT1Q7Ci4vbm9kZSAuL2luZGV4LmpzICIkMSIgIiQyIiAiJDMiICIkNCIgIiQ1IiAiJDYiICIkNyIgIiQ4IjsKCg=="
								}
							}
						},
						"requires": [
							"lychee.event.Queue"
						],
						"includes": [
							"fertilizer.event.Flow"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Flow  = lychee.import('fertilizer.event.Flow');\n\tconst _Queue = lychee.import('lychee.event.Queue');\n\tconst _INDEX = {\n\t\tlinux:   attachments['index.sh'],\n\t\tmacos:   attachments['index.sh'],\n\t\twindows: attachments['index.cmd']\n\t};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _package = function(os, arch, binary, assets, oncomplete) {\n\n\t\tlet project = this.project;\n\t\tlet shell   = this.shell;\n\t\tlet stash   = this.stash;\n\t\tlet target  = this.target;\n\n\t\tif (project !== null && shell !== null && stash !== null && target !== null) {\n\n\t\t\tlet prefix = project + '/build/' + target + '-' + os + '-' + arch;\n\n\t\t\tstash.read([\n\t\t\t\t'/bin/runtime/node/' + os + '/' + arch + '/' + binary\n\t\t\t], binaries => {\n\n\t\t\t\tlet runtime = binaries[0] || null;\n\t\t\t\tif (runtime !== null) {\n\n\t\t\t\t\tlet files = assets.slice(0).concat(runtime).concat(_INDEX[os]);\n\t\t\t\t\tlet urls  = files.map(asset => prefix + '/' + asset.url.split('/').pop());\n\n\t\t\t\t\tstash.write(urls, files, result => oncomplete(result), this);\n\t\t\t\t\tstash.sync();\n\n\t\t\t\t} else {\n\t\t\t\t\toncomplete(false);\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t} else {\n\t\t\toncomplete(false);\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Flow.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.unbind('package-runtime');\n\n\t\tthis.bind('package-runtime', function(oncomplete) {\n\n\t\t\tlet action  = this.action;\n\t\t\tlet project = this.project;\n\t\t\tlet target  = this.target;\n\n\t\t\tif (action !== null && project !== null && target !== null) {\n\n\t\t\t\tconsole.log('fertilizer: ' + action + '/PACKAGE-RUNTIME \"' + project + '\"');\n\n\n\t\t\t\tlet env = this.__environment;\n\t\t\t\tif (env !== null && env.variant === 'application') {\n\n\t\t\t\t\tlet assets = this.assets.filter(asset => asset !== null && asset.buffer !== null);\n\t\t\t\t\tif (assets.length > 0) {\n\n\t\t\t\t\t\tlet queue = new _Queue();\n\n\t\t\t\t\t\tqueue.then({ name: 'Linux ARM',      method: _package.bind(this, 'linux',   'arm',    'node',     assets) });\n\t\t\t\t\t\tqueue.then({ name: 'Linux x86_64',   method: _package.bind(this, 'linux',   'x86_64', 'node',     assets) });\n\t\t\t\t\t\tqueue.then({ name: 'MacOS x86_64',   method: _package.bind(this, 'macos',   'x86_64', 'node',     assets) });\n\t\t\t\t\t\tqueue.then({ name: 'Windows x86',    method: _package.bind(this, 'windows', 'x86',    'node.exe', assets) });\n\t\t\t\t\t\tqueue.then({ name: 'Windows x86_64', method: _package.bind(this, 'windows', 'x86_64', 'node.exe', assets) });\n\n\t\t\t\t\t\tqueue.bind('update', (entry, oncomplete) => {\n\n\t\t\t\t\t\t\tentry.method(result => {\n\n\t\t\t\t\t\t\t\tif (result === true) {\n\t\t\t\t\t\t\t\t\tconsole.info('fertilizer: -> \"' + entry.name + '\" SUCCESS');\n\t\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\t\tconsole.warn('fertilizer: -> \"' + entry.name + '\" FAILURE');\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\toncomplete(true);\n\n\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t}, this);\n\n\t\t\t\t\t\tqueue.bind('complete', _ => oncomplete(true), this);\n\t\t\t\t\t\tqueue.bind('error',    _ => oncomplete(false), this);\n\t\t\t\t\t\tqueue.init();\n\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\t\t\t\t\tconsole.log('fertilizer: -> Skipping \"' + target + '\".');\n\t\t\t\t\toncomplete(true);\n\t\t\t\t}\n\n\t\t\t} else {\n\t\t\t\toncomplete(false);\n\t\t\t}\n\n\t\t}, this);\n\n\n\n\t\t/*\n\t\t * FLOW\n\t\t */\n\n\t\t// this.then('configure-project');\n\n\t\t// this.then('read-package');\n\t\t// this.then('read-assets');\n\t\t// this.then('read-assets-crux');\n\n\t\t// this.then('build-environment');\n\t\t// this.then('build-assets');\n\t\t// this.then('write-assets');\n\t\t// this.then('build-project');\n\n\t\tthis.then('package-runtime');\n\t\tthis.then('package-project');\n\n\t\t// this.then('publish-project');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Flow.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'fertilizer.event.flow.node.Package';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.event.Flow": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.event.Flow",
							"url": "/libraries/lychee/source/event/Flow.js"
						}
					],
					"blob": {
						"attaches": {},
						"includes": [
							"lychee.event.Emitter"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Emitter = lychee.import('lychee.event.Emitter');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _process_recursive = function(event, result) {\n\n\t\tif (result === true) {\n\n\t\t\tif (this.___timeout === null) {\n\n\t\t\t\tthis.___timeout = setTimeout(_ => {\n\t\t\t\t\tthis.___timeout = null;\n\t\t\t\t\t_process_stack.call(this);\n\t\t\t\t}, 0);\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tthis.trigger('error', [ event ]);\n\n\t\t}\n\n\t};\n\n\tconst _process_stack = function() {\n\n\t\tlet entry = this.___stack.shift() || null;\n\t\tif (entry !== null) {\n\n\t\t\tlet data  = entry.data;\n\t\t\tlet event = entry.event;\n\t\t\tlet args  = [ event, [] ];\n\n\t\t\tif (data !== null) {\n\t\t\t\targs[1].push.apply(args[1], data);\n\t\t\t}\n\n\t\t\targs[1].push(_process_recursive.bind(this, event));\n\n\n\t\t\tlet result = this.trigger.apply(this, args);\n\t\t\tif (result === false) {\n\t\t\t\tthis.trigger('error', [ event ]);\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tthis.trigger('complete');\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function() {\n\n\t\tthis.___init    = false;\n\t\tthis.___stack   = [];\n\t\tthis.___timeout = null;\n\n\t\t_Emitter.call(this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.event.Flow';\n\n\t\t\tlet blob = (data['blob'] || {});\n\n\n\t\t\tif (this.___stack.length > 0) {\n\n\t\t\t\tblob.stack = [];\n\n\t\t\t\tfor (let s = 0, sl = this.___stack.length; s < sl; s++) {\n\n\t\t\t\t\tlet entry = this.___stack[s];\n\n\t\t\t\t\tblob.stack.push({\n\t\t\t\t\t\tevent: entry.event,\n\t\t\t\t\t\tdata:  lychee.serialize(entry.data)\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tdata['blob'] = Object.keys(blob).length > 0 ? blob : null;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tinit: function() {\n\n\t\t\tif (this.___init === false) {\n\n\t\t\t\tthis.___init = true;\n\n\n\t\t\t\tif (this.___stack.length > 0) {\n\n\t\t\t\t\t_process_stack.call(this);\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\treset: function() {\n\n\t\t\tthis.__stack = [];\n\n\t\t\treturn true;\n\n\t\t},\n\n\t\tthen: function(event, data) {\n\n\t\t\tevent = typeof event === 'string' ? event : null;\n\t\t\tdata  = data instanceof Array     ? data  : null;\n\n\n\t\t\tif (event !== null) {\n\n\t\t\t\tthis.___stack.push({\n\t\t\t\t\tevent: event,\n\t\t\t\t\tdata:  data\n\t\t\t\t});\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"fertilizer.data.Shell": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "fertilizer.data.Shell",
							"url": "./source/platform/node/data/Shell.js"
						}
					],
					"blob": {
						"attaches": {},
						"tags": {
							"platform": "node"
						},
						"requires": [
							"lychee.Asset"
						],
						"supports": "(lychee, global) => {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('child_process');\n\t\t\tglobal.require('fs');\n\t\t\tglobal.require('path');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}",
						"exports": "(lychee, global, attachments) => {\n\n\tconst _child_process = require('child_process');\n\tconst _fs            = require('fs');\n\tconst _path          = require('path');\n\tconst _Asset         = lychee.import('lychee.Asset');\n\tconst _ROOT          = lychee.ROOT.lychee;\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _create_directory = function(path, mode) {\n\n\t\tif (mode === undefined) {\n\t\t\tmode = 0o777 & (~process.umask());\n\t\t}\n\n\n\t\tlet is_directory = false;\n\n\t\ttry {\n\n\t\t\tlet stat1 = _fs.lstatSync(path);\n\t\t\tif (stat1.isSymbolicLink()) {\n\n\t\t\t\tlet tmp   = _fs.realpathSync(path);\n\t\t\t\tlet stat2 = _fs.lstatSync(tmp);\n\t\t\t\tif (stat2.isDirectory()) {\n\t\t\t\t\tis_directory = true;\n\t\t\t\t}\n\n\t\t\t} else if (stat1.isDirectory()) {\n\t\t\t\tis_directory = true;\n\t\t\t}\n\n\t\t} catch (err) {\n\n\t\t\tif (err.code === 'ENOENT') {\n\n\t\t\t\tif (_create_directory(_path.dirname(path), mode) === true) {\n\t\t\t\t\t_fs.mkdirSync(path, mode);\n\t\t\t\t}\n\n\t\t\t\ttry {\n\n\t\t\t\t\tlet stat2 = _fs.lstatSync(path);\n\t\t\t\t\tif (stat2.isSymbolicLink()) {\n\n\t\t\t\t\t\tlet tmp   = _fs.realpathSync(path);\n\t\t\t\t\t\tlet stat3 = _fs.lstatSync(tmp);\n\t\t\t\t\t\tif (stat3.isDirectory()) {\n\t\t\t\t\t\t\tis_directory = true;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else if (stat2.isDirectory()) {\n\t\t\t\t\t\tis_directory = true;\n\t\t\t\t\t}\n\n\t\t\t\t} catch (err) {\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn is_directory;\n\n\t};\n\n\tconst _walk_recursive = function(path, filtered) {\n\n\t\tlet info = this.info(path);\n\t\tif (info !== null && info.type === 'directory') {\n\n\t\t\tlet resolved = _path.normalize(this.__root + path);\n\n\t\t\tlet files = [];\n\n\t\t\ttry {\n\t\t\t\tfiles = _fs.readdirSync(resolved);\n\t\t\t} catch (err) {\n\t\t\t}\n\n\t\t\tfiles.filter(file => file.startsWith('.') === false).forEach(file => {\n\n\t\t\t\tlet info = this.info(path + '/' + file);\n\t\t\t\tif (info !== null) {\n\n\t\t\t\t\tif (info.type === 'directory') {\n\n\t\t\t\t\t\t_walk_recursive.call(this, path + '/' + file, filtered);\n\n\t\t\t\t\t} else if (info.type === 'file') {\n\n\t\t\t\t\t\tlet url = path + '/' + file;\n\t\t\t\t\t\tif (filtered.includes(url) === false) {\n\t\t\t\t\t\t\tfiltered.push(url);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.root = typeof states.root === 'string' ? states.root : null;\n\n\t\tthis.__root  = _ROOT;\n\t\tthis.__stack = [];\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tif (this.root !== null) {\n\n\t\t\tlet tmp1 = _path.normalize(this.root);\n\t\t\tlet tmp2 = _ROOT;\n\t\t\tif (tmp1.startsWith('/')) {\n\t\t\t\ttmp2 = _ROOT + tmp1;\n\t\t\t} else if (tmp1.startsWith('./')) {\n\t\t\t\ttmp2 = _ROOT + tmp1.substr(1);\n\t\t\t}\n\n\t\t\tif (tmp2.endsWith('/')) {\n\t\t\t\ttmp2 = tmp2.substr(0, tmp2.length - 1);\n\t\t\t}\n\n\t\t\tthis.__root = tmp2;\n\n\t\t}\n\n\t\tstates = null;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tif (blob.stack instanceof Array) {\n\n\t\t\t\tfor (let s = 0, sl = blob.stack.length; s < sl; s++) {\n\t\t\t\t\tthis.__stack.push(blob.stack[s]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet states = {};\n\t\t\tlet blob   = {};\n\n\n\t\t\tif (this.root !== null) states.root = this.root.substr(_ROOT.length);\n\n\n\t\t\tif (this.__stack.length > 0) {\n\t\t\t\tblob.stack = this.__stack.map(lychee.serialize);\n\t\t\t}\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'fertilizer.data.Shell',\n\t\t\t\t'arguments':   [ states ],\n\t\t\t\t'blob':        Object.keys(blob).length > 0 ? blob : null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcopy: function(path, dest, callback, scope) {\n\n\t\t\tpath     = typeof path === 'string'     ? path     : null;\n\t\t\tdest     = typeof dest === 'string'     ? dest     : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (path !== null && dest !== null) {\n\n\t\t\t\tif (path.charAt(0) !== '/') {\n\t\t\t\t\tpath = '/' + path;\n\t\t\t\t}\n\n\t\t\t\tif (dest.charAt(0) !== '/') {\n\t\t\t\t\tdest = '/' + dest;\n\t\t\t\t}\n\n\n\t\t\t\tlet path_info = this.info(path);\n\t\t\t\tlet dest_info = this.info(dest);\n\n\t\t\t\tif (path_info.type === 'file' && dest_info === null) {\n\n\t\t\t\t\tlet result = true;\n\t\t\t\t\ttry {\n\n\t\t\t\t\t\tlet fd_read  = _fs.openSync(path, 'r');\n\t\t\t\t\t\tlet fd_write = _fs.openSync(dest, 'w');\n\t\t\t\t\t\tlet buffer   = Buffer.alloc(64 * 1025);\n\t\t\t\t\t\tlet bytes    = 0;\n\t\t\t\t\t\tlet offset   = 0;\n\n\t\t\t\t\t\tdo {\n\n\t\t\t\t\t\t\tbytes = _fs.readSync(fd_read, buffer, 0, buffer.length, offset);\n\t\t\t\t\t\t\t_fs.writeSync(fd_write, buffer, 0, bytes);\n\t\t\t\t\t\t\toffset += bytes;\n\n\t\t\t\t\t\t} while (bytes !== 0);\n\n\t\t\t\t\t\t_fs.closeSync(fd_read);\n\t\t\t\t\t\t_fs.closeSync(fd_write);\n\n\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\tresult = false;\n\t\t\t\t\t}\n\n\n\t\t\t\t\tif (callback !== null) {\n\t\t\t\t\t\tcallback.call(scope, result);\n\t\t\t\t\t} else {\n\t\t\t\t\t\treturn result;\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\n\t\t\t\t\tif (callback !== null) {\n\t\t\t\t\t\tcallback.call(scope, false);\n\t\t\t\t\t} else {\n\t\t\t\t\t\treturn false;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback.call(scope, false);\n\t\t\t\t} else {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tinfo: function(path, callback, scope) {\n\n\t\t\tpath     = typeof path === 'string'     ? path     : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (path !== null) {\n\n\t\t\t\tif (path.charAt(0) !== '/') {\n\t\t\t\t\tpath = '/' + path;\n\t\t\t\t}\n\n\t\t\t\tlet resolved = _path.normalize(this.__root + path);\n\t\t\t\tif (resolved !== null) {\n\n\t\t\t\t\tlet result = null;\n\n\t\t\t\t\ttry {\n\n\t\t\t\t\t\tlet stat1 = _fs.lstatSync(resolved);\n\t\t\t\t\t\tif (stat1.isSymbolicLink()) {\n\n\t\t\t\t\t\t\tlet tmp   = _fs.realpathSync(resolved);\n\t\t\t\t\t\t\tlet stat2 = _fs.lstatSync(tmp);\n\n\t\t\t\t\t\t\tresult = {\n\t\t\t\t\t\t\t\ttype:  stat2.isFile() ? 'file' : 'directory',\n\t\t\t\t\t\t\t\tmtime: new Date(stat2.mtime.toUTCString())\n\t\t\t\t\t\t\t};\n\n\t\t\t\t\t\t} else {\n\n\t\t\t\t\t\t\tresult = {\n\t\t\t\t\t\t\t\ttype:  stat1.isFile() ? 'file' : 'directory',\n\t\t\t\t\t\t\t\tmtime: new Date(stat1.mtime.toUTCString())\n\t\t\t\t\t\t\t};\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} catch (err) {\n\t\t\t\t\t}\n\n\n\t\t\t\t\tif (callback !== null) {\n\t\t\t\t\t\tcallback.call(scope, result);\n\t\t\t\t\t} else {\n\t\t\t\t\t\treturn result;\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\n\t\t\t\t\tif (callback !== null) {\n\t\t\t\t\t\tcallback.call(scope, null);\n\t\t\t\t\t} else {\n\t\t\t\t\t\treturn null;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback.call(scope, null);\n\t\t\t\t} else {\n\t\t\t\t\treturn null;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\texec: function(command, callback, scope) {\n\n\t\t\tcommand  = typeof command === 'string'  ? command  : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (command !== null) {\n\n\t\t\t\tlet args  = command.split(' ').slice(1);\n\t\t\t\tlet cmd   = command.split(' ')[0];\n\t\t\t\tlet file  = _ROOT + (cmd.charAt(0) !== '/' ? '/' : '') + cmd;\n\t\t\t\tlet stack = this.__stack;\n\n\t\t\t\tlet path = file.split('/').slice(0, -1).join('/');\n\t\t\t\tif (path.endsWith('/bin')) {\n\t\t\t\t\tpath = path.split('/').slice(0, -1).join('/');\n\t\t\t\t}\n\n\n\t\t\t\tif (file.endsWith('.js')) {\n\n\t\t\t\t\targs.reverse();\n\t\t\t\t\targs.push(file);\n\t\t\t\t\targs.push('env:node');\n\t\t\t\t\targs.reverse();\n\n\t\t\t\t\tfile = _ROOT + '/bin/helper/helper.sh';\n\n\t\t\t\t}\n\n\n\t\t\t\tif (callback !== null) {\n\n\t\t\t\t\ttry {\n\n\t\t\t\t\t\t_child_process.execFile(file, args, {\n\t\t\t\t\t\t\tcwd: path\n\t\t\t\t\t\t}, (error, stdout, stderr) => {\n\n\t\t\t\t\t\t\tlet code = 0;\n\t\t\t\t\t\t\tif (error !== null) {\n\t\t\t\t\t\t\t\tcode = error.code;\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tstack.push({\n\t\t\t\t\t\t\t\targs:   args,\n\t\t\t\t\t\t\t\texit:   code,\n\t\t\t\t\t\t\t\tfile:   file,\n\t\t\t\t\t\t\t\tpath:   path,\n\t\t\t\t\t\t\t\tstdout: stdout.toString(),\n\t\t\t\t\t\t\t\tstderr: stderr.toString()\n\t\t\t\t\t\t\t});\n\n\n\t\t\t\t\t\t\tif (error) {\n\t\t\t\t\t\t\t\tcallback.call(scope, false);\n\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\tcallback.call(scope, true);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t});\n\n\t\t\t\t\t} catch (err) {\n\n\t\t\t\t\t\tcallback.call(scope, false);\n\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\n\t\t\t\t\tlet result = true;\n\t\t\t\t\tlet stdout = '';\n\n\t\t\t\t\ttry {\n\n\t\t\t\t\t\tstdout = _child_process.execFileSync(file, args, {\n\t\t\t\t\t\t\tcwd:   path,\n\t\t\t\t\t\t\tstdio: [ 'ignore', 'pipe', 'ignore' ]\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\tstack.push({\n\t\t\t\t\t\t\targs:   args,\n\t\t\t\t\t\t\texit:   0,\n\t\t\t\t\t\t\tfile:   file,\n\t\t\t\t\t\t\tpath:   path,\n\t\t\t\t\t\t\tstdout: stdout.toString(),\n\t\t\t\t\t\t\tstderr: ''\n\t\t\t\t\t\t});\n\n\t\t\t\t\t} catch (err) {\n\n\t\t\t\t\t\tstack.push({\n\t\t\t\t\t\t\targs:   args,\n\t\t\t\t\t\t\texit:   1,\n\t\t\t\t\t\t\tfile:   file,\n\t\t\t\t\t\t\tpath:   path,\n\t\t\t\t\t\t\tstdout: stdout.toString(),\n\t\t\t\t\t\t\tstderr: ''\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\tresult = false;\n\n\t\t\t\t\t}\n\n\t\t\t\t\treturn result;\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback.call(scope, false);\n\t\t\t\t} else {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\ttrace: function(limit, callback, scope) {\n\n\t\t\tlimit    = typeof limit === 'number'    ? (limit | 0) : null;\n\t\t\tcallback = callback instanceof Function ? callback    : null;\n\t\t\tscope    = scope !== undefined          ? scope       : this;\n\n\n\t\t\tlet stack = this.__stack;\n\t\t\tif (limit !== null) {\n\t\t\t\tstack = stack.reverse().slice(0, limit).reverse();\n\t\t\t} else {\n\t\t\t\tstack = stack.slice(0);\n\t\t\t}\n\n\n\t\t\tif (callback !== null) {\n\t\t\t\tcallback.call(scope, stack);\n\t\t\t} else {\n\t\t\t\treturn stack;\n\t\t\t}\n\n\t\t},\n\n\t\ttree: function(path, callback, scope) {\n\n\n\t\t\tpath     = typeof path === 'string'     ? path     : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (path !== null) {\n\n\t\t\t\tlet urls = [];\n\n\t\t\t\t_walk_recursive.call(this, path, urls);\n\n\t\t\t\tlet filtered = urls.map(url => '.' + url.substr(path.length));\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback.call(scope, filtered);\n\t\t\t\t} else {\n\t\t\t\t\treturn filtered;\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback.call(scope, []);\n\t\t\t\t} else {\n\t\t\t\t\treturn [];\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tzip: function(assets, callback, scope) {\n\n\t\t\tassets   = assets instanceof Array      ? assets   : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (assets !== null) {\n\n\t\t\t\tlet sandbox = '/tmp/fertilizer-data-Shell-' + Date.now();\n\t\t\t\tlet urls = assets.map(asset => {\n\n\t\t\t\t\tif (asset instanceof Object) {\n\n\t\t\t\t\t\tlet url = asset.url || null;\n\t\t\t\t\t\tif (url !== null) {\n\n\t\t\t\t\t\t\tif (url.startsWith('./')) {\n\t\t\t\t\t\t\t\treturn sandbox + '/' + url.substr(2);\n\t\t\t\t\t\t\t} else if (url.startsWith('/')) {\n\t\t\t\t\t\t\t\treturn sandbox + url;\n\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\treturn url;\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t\treturn null;\n\n\t\t\t\t});\n\n\t\t\t\tlet buffers = assets.map(asset => {\n\n\t\t\t\t\tif (asset instanceof Object) {\n\n\t\t\t\t\t\tlet buffer = asset.buffer || null;\n\t\t\t\t\t\tif (buffer instanceof Buffer) {\n\t\t\t\t\t\t\treturn buffer;\n\t\t\t\t\t\t} else {\n\n\t\t\t\t\t\t\tlet data = lychee.serialize(asset);\n\t\t\t\t\t\t\tif (data !== null && data.blob instanceof Object) {\n\n\t\t\t\t\t\t\t\tlet blob = data.blob;\n\t\t\t\t\t\t\t\tif (typeof blob.buffer === 'string') {\n\n\t\t\t\t\t\t\t\t\tlet tmp = blob.buffer.substr(blob.buffer.indexOf(',') + 1);\n\n\t\t\t\t\t\t\t\t\treturn Buffer.from(tmp, 'base64');\n\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t\treturn null;\n\n\t\t\t\t});\n\n\n\t\t\t\t_create_directory(sandbox);\n\n\n\t\t\t\turls.forEach((url, u) => {\n\n\t\t\t\t\tlet buffer = buffers[u] || null;\n\t\t\t\t\tlet result = false;\n\n\t\t\t\t\tif (url !== null && buffer !== null) {\n\n\t\t\t\t\t\tlet folder = _path.dirname(url);\n\t\t\t\t\t\tlet path   = url;\n\n\t\t\t\t\t\t_create_directory(folder);\n\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t_fs.writeFileSync(path, buffer, 'binary');\n\t\t\t\t\t\t\tresult = true;\n\t\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\t\tresult = false;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\n\t\t\t\t\tif (result === false) {\n\t\t\t\t\t\tconsole.warn('fertilizer.data.Shell: Could not write \"' + url + '\".');\n\t\t\t\t\t}\n\n\t\t\t\t});\n\n\n\t\t\t\tlet result = false;\n\n\t\t\t\ttry {\n\t\t\t\t\tlet cmd = 'cd \"' + sandbox + '\" && zip -r -q \"' + sandbox + '.zip\" ./*';\n\t\t\t\t\t_child_process.execSync(cmd);\n\t\t\t\t\tresult = true;\n\t\t\t\t} catch (err) {\n\t\t\t\t\tresult = false;\n\t\t\t\t}\n\n\n\t\t\t\tif (result === true) {\n\n\t\t\t\t\tlet asset = new _Asset(sandbox + '.zip', null, true);\n\t\t\t\t\tif (asset !== null) {\n\n\t\t\t\t\t\tif (callback !== null) {\n\n\t\t\t\t\t\t\tasset.onload = function(result) {\n\n\t\t\t\t\t\t\t\tif (result === true) {\n\t\t\t\t\t\t\t\t\tcallback.call(scope, asset);\n\t\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\t\tcallback.call(scope, null);\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t};\n\n\t\t\t\t\t\t\tasset.load();\n\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\treturn asset;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\tif (callback !== null) {\n\t\t\t\t\t\t\tcallback.call(scope, null);\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\treturn null;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\n\t\t\t\t\tif (callback !== null) {\n\t\t\t\t\t\tcallback.call(scope, null);\n\t\t\t\t\t} else {\n\t\t\t\t\t\treturn null;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback.call(scope, null);\n\t\t\t\t} else {\n\t\t\t\t\treturn null;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.Stash": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.Stash",
							"url": "/libraries/lychee/source/platform/node/Stash.js"
						}
					],
					"blob": {
						"attaches": {},
						"tags": {
							"platform": "node"
						},
						"requires": [
							"lychee.Asset"
						],
						"includes": [
							"lychee.event.Emitter"
						],
						"supports": "(lychee, global) => {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('fs');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}",
						"exports": "(lychee, global, attachments) => {\n\n\tlet   _id         = 0;\n\tconst _Asset      = lychee.import('lychee.Asset');\n\tconst _Emitter    = lychee.import('lychee.event.Emitter');\n\tconst _PERSISTENT = {\n\t\tdata: {},\n\t\tread: function() {\n\t\t\treturn null;\n\t\t},\n\t\twrite: function(id, asset) {\n\t\t\treturn false;\n\t\t}\n\t};\n\tconst _TEMPORARY  = {\n\t\tdata: {},\n\t\tread: function() {\n\n\t\t\tif (Object.keys(this.data).length > 0) {\n\t\t\t\treturn this.data;\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\t\twrite: function(id, asset) {\n\n\t\t\tif (asset !== null) {\n\t\t\t\tthis.data[id] = asset;\n\t\t\t} else {\n\t\t\t\tdelete this.data[id];\n\t\t\t}\n\n\t\t\treturn true;\n\n\t\t}\n\t};\n\n\n\n\t/*\n\t * FEATURE DETECTION\n\t */\n\n\t(function() {\n\n\t\tconst _ENCODING = {\n\t\t\t'Config':  'utf8',\n\t\t\t'Font':    'utf8',\n\t\t\t'Music':   'binary',\n\t\t\t'Sound':   'binary',\n\t\t\t'Texture': 'binary',\n\t\t\t'Stuff':   'utf8'\n\t\t};\n\n\n\t\tconst _fs      = global.require('fs');\n\t\tconst _path    = global.require('path');\n\t\tconst _mkdir_p = function(path, mode) {\n\n\t\t\tif (mode === undefined) {\n\t\t\t\tmode = 0o777 & (~process.umask());\n\t\t\t}\n\n\n\t\t\tlet is_directory = false;\n\n\t\t\ttry {\n\n\t\t\t\tlet stat1 = _fs.lstatSync(path);\n\t\t\t\tif (stat1.isSymbolicLink()) {\n\n\t\t\t\t\tlet tmp   = _fs.realpathSync(path);\n\t\t\t\t\tlet stat2 = _fs.lstatSync(tmp);\n\t\t\t\t\tif (stat2.isDirectory()) {\n\t\t\t\t\t\tis_directory = true;\n\t\t\t\t\t}\n\n\t\t\t\t} else if (stat1.isDirectory()) {\n\t\t\t\t\tis_directory = true;\n\t\t\t\t}\n\n\t\t\t} catch (err) {\n\n\t\t\t\tif (err.code === 'ENOENT') {\n\n\t\t\t\t\tif (_mkdir_p(_path.dirname(path), mode) === true) {\n\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t_fs.mkdirSync(path, mode);\n\t\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t\ttry {\n\n\t\t\t\t\t\tlet stat2 = _fs.lstatSync(path);\n\t\t\t\t\t\tif (stat2.isSymbolicLink()) {\n\n\t\t\t\t\t\t\tlet tmp   = _fs.realpathSync(path);\n\t\t\t\t\t\t\tlet stat3 = _fs.lstatSync(tmp);\n\t\t\t\t\t\t\tif (stat3.isDirectory()) {\n\t\t\t\t\t\t\t\tis_directory = true;\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t} else if (stat2.isDirectory()) {\n\t\t\t\t\t\t\tis_directory = true;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} catch (err) {\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn is_directory;\n\n\t\t};\n\n\n\t\tlet unlink = 'unlinkSync' in _fs;\n\t\tlet write  = 'writeFileSync' in _fs;\n\t\tif (unlink === true && write === true) {\n\n\t\t\t_PERSISTENT.write = function(id, asset) {\n\n\t\t\t\tlet result = false;\n\n\n\t\t\t\tlet path = lychee.environment.resolve(id);\n\t\t\t\tif (path.startsWith(lychee.ROOT.project)) {\n\n\t\t\t\t\tif (asset !== null) {\n\n\t\t\t\t\t\tlet dir = path.split('/').slice(0, -1).join('/');\n\t\t\t\t\t\tif (dir.startsWith(lychee.ROOT.project)) {\n\t\t\t\t\t\t\t_mkdir_p(dir);\n\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\tlet data = lychee.serialize(asset);\n\t\t\t\t\t\tlet enc  = _ENCODING[data.constructor] || _ENCODING['Stuff'];\n\n\t\t\t\t\t\tif (data !== null && data.blob instanceof Object) {\n\n\t\t\t\t\t\t\tlet buffer = data.blob.buffer || null;\n\t\t\t\t\t\t\tif (buffer instanceof Object) {\n\n\t\t\t\t\t\t\t\tfor (let sub in buffer) {\n\n\t\t\t\t\t\t\t\t\tif (typeof buffer[sub] === 'string') {\n\n\t\t\t\t\t\t\t\t\t\tlet index = buffer[sub].indexOf('base64,') + 7;\n\t\t\t\t\t\t\t\t\t\tif (index > 7) {\n\n\t\t\t\t\t\t\t\t\t\t\tlet tmp = buffer[sub].substr(index, buffer[sub].length - index);\n\t\t\t\t\t\t\t\t\t\t\tlet raw = Buffer.from(tmp, 'base64');\n\n\t\t\t\t\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\t\t\t\t\t_fs.writeFileSync(path + '.' + sub, raw, enc);\n\t\t\t\t\t\t\t\t\t\t\t\tresult = true;\n\t\t\t\t\t\t\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\t\t\t\t\t\t\tresult = false;\n\t\t\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t} else if (typeof buffer === 'string') {\n\n\t\t\t\t\t\t\t\tlet index = buffer.indexOf('base64,') + 7;\n\t\t\t\t\t\t\t\tif (index > 7) {\n\n\t\t\t\t\t\t\t\t\tlet tmp = buffer.substr(index, buffer.length - index);\n\t\t\t\t\t\t\t\t\tlet raw = Buffer.from(tmp, 'base64');\n\n\t\t\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\t\t\t_fs.writeFileSync(path, raw, enc);\n\t\t\t\t\t\t\t\t\t\tresult = true;\n\t\t\t\t\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\t\t\t\t\tresult = false;\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t_fs.unlinkSync(path);\n\t\t\t\t\t\t\tresult = true;\n\t\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\t\tresult = false;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\tif (result === false) {\n\t\t\t\t\tconsole.error('lychee.Stash: Could not write \"' + id + '\".');\n\t\t\t\t\tconsole.info('lychee.Stash: Check filesystem quota and permissions.');\n\t\t\t\t}\n\n\n\t\t\t\treturn result;\n\n\t\t\t};\n\n\t\t}\n\n\n\t\tif (lychee.debug === true) {\n\n\t\t\tlet methods = [];\n\n\t\t\tif (write && unlink) methods.push('Persistent');\n\t\t\tif (_TEMPORARY)      methods.push('Temporary');\n\n\n\t\t\tif (methods.length === 0) {\n\t\t\t\tconsole.error('lychee.Stash: Supported methods are NONE');\n\t\t\t} else {\n\t\t\t\tconsole.info('lychee.Stash: Supported methods are ' + methods.join(', '));\n\t\t\t}\n\n\t\t}\n\n\t})();\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _validate_asset = function(asset) {\n\n\t\tif (asset instanceof Object && typeof asset.serialize === 'function') {\n\t\t\treturn true;\n\t\t}\n\n\t\treturn false;\n\n\t};\n\n\tconst _read_stash = function(silent) {\n\n\t\tsilent = silent === true;\n\n\n\t\tlet blob = null;\n\n\n\t\tlet type = this.type;\n\t\tif (type === Composite.TYPE.persistent) {\n\n\t\t\tblob = _PERSISTENT.read();\n\n\t\t} else if (type === Composite.TYPE.temporary) {\n\n\t\t\tblob = _TEMPORARY.read();\n\n\t\t}\n\n\n\t\tif (blob !== null) {\n\n\t\t\tif (Object.keys(this.__assets).length !== Object.keys(blob).length) {\n\n\t\t\t\tthis.__assets = {};\n\n\t\t\t\tfor (let id in blob) {\n\t\t\t\t\tthis.__assets[id] = blob[id];\n\t\t\t\t}\n\n\n\t\t\t\tif (silent === false) {\n\t\t\t\t\tthis.trigger('sync', [ this.__assets ]);\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn true;\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\tconst _write_stash = function(silent) {\n\n\t\tsilent = silent === true;\n\n\n\t\tlet operations = this.__operations;\n\t\tlet filtered   = {};\n\n\t\tif (operations.length !== 0) {\n\n\t\t\twhile (operations.length > 0) {\n\n\t\t\t\tlet operation = operations.shift();\n\t\t\t\tif (operation.type === 'update') {\n\n\t\t\t\t\tfiltered[operation.id] = operation.asset;\n\n\t\t\t\t\tif (this.__assets[operation.id] !== operation.asset) {\n\t\t\t\t\t\tthis.__assets[operation.id] = operation.asset;\n\t\t\t\t\t}\n\n\t\t\t\t} else if (operation.type === 'remove') {\n\n\t\t\t\t\tfiltered[operation.id] = null;\n\n\t\t\t\t\tif (this.__assets[operation.id] !== null) {\n\t\t\t\t\t\tthis.__assets[operation.id] = null;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tlet type = this.type;\n\t\t\tif (type === Composite.TYPE.persistent) {\n\n\t\t\t\tfor (let id in filtered) {\n\t\t\t\t\t_PERSISTENT.write(id, filtered[id]);\n\t\t\t\t}\n\n\t\t\t} else if (type === Composite.TYPE.temporary) {\n\n\t\t\t\tfor (let id in filtered) {\n\t\t\t\t\t_TEMPORARY.write(id, filtered[id]);\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (silent === false) {\n\t\t\t\tthis.trigger('sync', [ this.__assets ]);\n\t\t\t}\n\n\n\t\t\treturn true;\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.id   = 'lychee-Stash-' + _id++;\n\t\tthis.type = Composite.TYPE.persistent;\n\n\n\t\tthis.__assets     = {};\n\t\tthis.__operations = [];\n\n\n\t\tthis.setId(states.id);\n\t\tthis.setType(states.type);\n\n\n\t\t_Emitter.call(this);\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\t_read_stash.call(this);\n\n\n\t\tstates = null;\n\n\t};\n\n\n\tComposite.TYPE = {\n\t\tpersistent: 0,\n\t\ttemporary:  1\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tsync: function(silent) {\n\n\t\t\tsilent = silent === true;\n\n\n\t\t\tlet result = false;\n\n\t\t\tif (Object.keys(this.__assets).length > 0) {\n\n\t\t\t\tthis.__operations.push({\n\t\t\t\t\ttype: 'sync'\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t\tif (this.__operations.length > 0) {\n\t\t\t\tresult = _write_stash.call(this, silent);\n\t\t\t} else {\n\t\t\t\tresult = _read_stash.call(this, silent);\n\t\t\t}\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tif (blob.assets instanceof Object) {\n\n\t\t\t\tthis.__assets = {};\n\n\t\t\t\tfor (let id in blob.assets) {\n\t\t\t\t\tthis.__assets[id] = lychee.deserialize(blob.assets[id]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.Stash';\n\n\t\t\tlet states = {};\n\t\t\tlet blob   = (data['blob'] || {});\n\n\n\t\t\tif (this.id.startsWith('lychee-Stash-') === false) states.id   = this.id;\n\t\t\tif (this.type !== Composite.TYPE.persistent)       states.type = this.type;\n\n\n\t\t\tif (Object.keys(this.__assets).length > 0) {\n\n\t\t\t\tblob.assets = {};\n\n\t\t\t\tfor (let id in this.__assets) {\n\t\t\t\t\tblob.assets[id] = lychee.serialize(this.__assets[id]);\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tdata['arguments'][0] = states;\n\t\t\tdata['blob']         = Object.keys(blob).length > 0 ? blob : null;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tread: function(urls, callback, scope) {\n\n\t\t\turls     = urls instanceof Array        ? urls     : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (urls !== null) {\n\n\t\t\t\tlet result  = [];\n\t\t\t\tlet loading = 0;\n\n\t\t\t\tfor (let u = 0, ul = urls.length; u < ul; u++) {\n\n\t\t\t\t\tlet url = urls[u];\n\t\t\t\t\tif (typeof url === 'string') {\n\n\t\t\t\t\t\tlet asset = new _Asset(url, null, true);\n\t\t\t\t\t\tif (asset !== null) {\n\n\t\t\t\t\t\t\tloading++;\n\n\t\t\t\t\t\t\tasset.onload = function() {\n\n\t\t\t\t\t\t\t\tloading--;\n\n\t\t\t\t\t\t\t\tif (callback !== null && loading === 0) {\n\t\t\t\t\t\t\t\t\tcallback.call(scope, result);\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t};\n\n\t\t\t\t\t\t\tthis.__assets[url] = asset;\n\t\t\t\t\t\t\tresult.push(asset);\n\t\t\t\t\t\t\tasset.load();\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\treturn;\n\t\t\t\t} else {\n\t\t\t\t\treturn result;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (callback !== null) {\n\t\t\t\tcallback.call(scope, []);\n\t\t\t} else {\n\t\t\t\treturn [];\n\t\t\t}\n\n\t\t},\n\n\t\tremove: function(urls, callback, scope) {\n\n\t\t\turls     = urls instanceof Array        ? urls     : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (urls !== null) {\n\n\t\t\t\tfor (let u = 0, ul = urls.length; u < ul; u++) {\n\n\t\t\t\t\tlet url = urls[u];\n\t\t\t\t\tif (typeof url === 'string') {\n\t\t\t\t\t\tthis.__operations.push({\n\t\t\t\t\t\t\ttype: 'remove',\n\t\t\t\t\t\t\tid:   urls[u]\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\t_write_stash.call(this);\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback.call(scope, true);\n\t\t\t\t\treturn;\n\t\t\t\t} else {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (callback !== null) {\n\t\t\t\tcallback.call(scope, false);\n\t\t\t} else {\n\t\t\t\treturn false;\n\t\t\t}\n\n\t\t},\n\n\t\twrite: function(urls, assets, callback, scope) {\n\n\t\t\turls     = urls instanceof Array        ? urls     : null;\n\t\t\tassets   = assets instanceof Array      ? assets   : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (urls !== null && assets !== null) {\n\n\t\t\t\tif (urls.length === assets.length) {\n\n\t\t\t\t\tfor (let u = 0, ul = urls.length; u < ul; u++) {\n\n\t\t\t\t\t\tlet url   = urls[u];\n\t\t\t\t\t\tlet asset = assets[u];\n\n\t\t\t\t\t\tif (typeof url === 'string' && _validate_asset(asset) === true) {\n\n\t\t\t\t\t\t\tthis.__operations.push({\n\t\t\t\t\t\t\t\ttype:  'update',\n\t\t\t\t\t\t\t\tid:    url,\n\t\t\t\t\t\t\t\tasset: asset\n\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t\t_write_stash.call(this);\n\n\t\t\t\t\tif (callback !== null) {\n\t\t\t\t\t\tcallback.call(scope, true);\n\t\t\t\t\t\treturn;\n\t\t\t\t\t} else {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (callback !== null) {\n\t\t\t\tcallback.call(scope, false);\n\t\t\t} else {\n\t\t\t\treturn false;\n\t\t\t}\n\n\t\t},\n\n\t\tsetId: function(id) {\n\n\t\t\tid = typeof id === 'string' ? id : null;\n\n\n\t\t\tif (id !== null) {\n\n\t\t\t\tthis.id = id;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetType: function(type) {\n\n\t\t\ttype = lychee.enumof(Composite.TYPE, type) ? type : null;\n\n\n\t\t\tif (type !== null) {\n\n\t\t\t\tthis.type = type;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.event.Emitter": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.event.Emitter",
							"url": "/libraries/lychee/source/event/Emitter.js"
						}
					],
					"blob": {
						"attaches": {},
						"exports": "(lychee, global, attachments) => {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _has = function(event, callback, scope) {\n\n\t\tlet found = false;\n\n\t\tif (event !== null) {\n\n\t\t\tfound = _has_event.call(this, event, callback, scope);\n\n\t\t} else {\n\n\t\t\tfor (event in this.___events) {\n\n\t\t\t\tlet result = _has_event.call(this, event, callback, scope);\n\t\t\t\tif (result === true) {\n\t\t\t\t\tfound = true;\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t\treturn found;\n\n\t};\n\n\tconst _has_event = function(event, callback, scope) {\n\n\t\tif (this.___events !== undefined && this.___events[event] !== undefined) {\n\n\t\t\tlet found = false;\n\n\t\t\tfor (let e = 0, el = this.___events[event].length; e < el; e++) {\n\n\t\t\t\tlet entry = this.___events[event][e];\n\n\t\t\t\tif ((callback === null || entry.callback === callback) && (scope === null || entry.scope === scope)) {\n\t\t\t\t\tfound = true;\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\treturn found;\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\tconst _bind = function(event, callback, scope, once) {\n\n\t\tif (event === null || callback === null) {\n\t\t\treturn false;\n\t\t}\n\n\n\t\tlet pass_event = false;\n\t\tlet pass_self  = false;\n\n\t\tlet modifier = event.charAt(0);\n\t\tif (modifier === '@') {\n\n\t\t\tevent      = event.substr(1, event.length - 1);\n\t\t\tpass_event = true;\n\n\t\t} else if (modifier === '#') {\n\n\t\t\tevent     = event.substr(1, event.length - 1);\n\t\t\tpass_self = true;\n\n\t\t}\n\n\n\t\tif (this.___events[event] === undefined) {\n\t\t\tthis.___events[event] = [];\n\t\t}\n\n\n\t\tthis.___events[event].push({\n\t\t\tpass_event: pass_event,\n\t\t\tpass_self:  pass_self,\n\t\t\tcallback:   callback,\n\t\t\tscope:      scope,\n\t\t\tonce:       once\n\t\t});\n\n\n\t\treturn true;\n\n\t};\n\n\tconst _publish = function(event, instance, once) {\n\n\t\tif (event === null || instance === null) {\n\t\t\treturn false;\n\t\t}\n\n\n\t\tlet callback = function() {\n\n\t\t\tlet event = arguments[0];\n\t\t\tlet data  = [];\n\n\t\t\tfor (let a = 1, al = arguments.length; a < al; a++) {\n\t\t\t\tdata.push(arguments[a]);\n\t\t\t}\n\n\t\t\tthis.trigger(event, data);\n\n\t\t};\n\n\n\t\tif (this.___events[event] === undefined) {\n\t\t\tthis.___events[event] = [];\n\t\t}\n\n\n\t\tthis.___events[event].push({\n\t\t\tpass_event: true,\n\t\t\tpass_self:  false,\n\t\t\tcallback:   callback,\n\t\t\tscope:      instance,\n\t\t\tonce:       once\n\t\t});\n\n\n\t\treturn true;\n\n\t};\n\n\tconst _subscribe = function(event, instance, once) {\n\n\t\tif (event === null || instance === null) {\n\t\t\treturn false;\n\t\t}\n\n\n\t\tlet callback = function() {\n\n\t\t\tlet event = arguments[0];\n\t\t\tlet data  = [];\n\n\t\t\tfor (let a = 1, al = arguments.length; a < al; a++) {\n\t\t\t\tdata.push(arguments[a]);\n\t\t\t}\n\n\t\t\tthis.trigger(event, data);\n\n\t\t};\n\n\n\t\tif (instance.___events[event] === undefined) {\n\t\t\tinstance.___events[event] = [];\n\t\t}\n\n\n\t\tinstance.___events[event].push({\n\t\t\tpass_event: true,\n\t\t\tpass_self:  false,\n\t\t\tcallback:   callback,\n\t\t\tscope:      this,\n\t\t\tonce:       once\n\t\t});\n\n\n\t\treturn true;\n\n\t};\n\n\tconst _transfer = function(event, instance, once) {\n\n\t\tif (event === null || instance === null) {\n\t\t\treturn false;\n\t\t}\n\n\n\t\tlet events = this.___events[event] || [];\n\t\tif (events.length > 0) {\n\n\t\t\tfor (let e = 0, el = events.length; e < el; e++) {\n\n\t\t\t\tlet entry = this.___events[event][e];\n\n\t\t\t\tinstance.___events[event].push({\n\t\t\t\t\tpass_event: entry.pass_event,\n\t\t\t\t\tpass_self:  entry.pass_self,\n\t\t\t\t\tcallback:   entry.callback,\n\t\t\t\t\tscope:      instance,\n\t\t\t\t\tonce:       once\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn true;\n\n\t};\n\n\tconst _trigger = function(event, data) {\n\n\t\tif (this.___events !== undefined && this.___events[event] !== undefined) {\n\n\t\t\tlet value = undefined;\n\n\t\t\tfor (let e = 0; e < this.___events[event].length; e++) {\n\n\t\t\t\tlet args  = [];\n\t\t\t\tlet entry = this.___events[event][e];\n\n\t\t\t\tif (entry.pass_event === true) {\n\n\t\t\t\t\targs.push(event);\n\n\t\t\t\t} else if (entry.pass_self === true) {\n\n\t\t\t\t\targs.push(this);\n\n\t\t\t\t}\n\n\n\t\t\t\tif (data !== null) {\n\t\t\t\t\targs.push.apply(args, data);\n\t\t\t\t}\n\n\n\t\t\t\tlet result = entry.callback.apply(entry.scope, args);\n\t\t\t\tif (result !== undefined) {\n\t\t\t\t\tvalue = result;\n\t\t\t\t}\n\n\n\t\t\t\tif (entry.once === true) {\n\n\t\t\t\t\tif (this.unbind(event, entry.callback, entry.scope) === true) {\n\t\t\t\t\t\te--;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (value !== undefined) {\n\t\t\t\treturn value;\n\t\t\t} else {\n\t\t\t\treturn true;\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\tconst _unbind = function(event, callback, scope) {\n\n\t\tlet found = false;\n\n\t\tif (event !== null) {\n\n\t\t\tfound = _unbind_event.call(this, event, callback, scope);\n\n\t\t} else {\n\n\t\t\tfor (event in this.___events) {\n\n\t\t\t\tlet result = _unbind_event.call(this, event, callback, scope);\n\t\t\t\tif (result === true) {\n\t\t\t\t\tfound = true;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t\treturn found;\n\n\t};\n\n\tconst _unbind_event = function(event, callback, scope) {\n\n\t\tif (this.___events !== undefined && this.___events[event] !== undefined) {\n\n\t\t\tlet found = false;\n\n\t\t\tfor (let e = 0, el = this.___events[event].length; e < el; e++) {\n\n\t\t\t\tlet entry = this.___events[event][e];\n\n\t\t\t\tif ((callback === null || entry.callback === callback) && (scope === null || entry.scope === scope)) {\n\n\t\t\t\t\tfound = true;\n\n\t\t\t\t\tthis.___events[event].splice(e, 1);\n\t\t\t\t\tel--;\n\t\t\t\t\te--;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\treturn found;\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function() {\n\n\t\tthis.___events   = {};\n\t\tthis.___timeline = {\n\t\t\tbind:      [],\n\t\t\thas:       [],\n\t\t\tpublish:   [],\n\t\t\tsubscribe: [],\n\t\t\ttransfer:  [],\n\t\t\ttrigger:   [],\n\t\t\tunbind:    []\n\t\t};\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tif (blob.events instanceof Object) {\n\t\t\t\t// TODO: deserialize events\n\t\t\t}\n\n\t\t\tif (blob.timeline instanceof Object) {\n\t\t\t\t// TODO: deserialize timeline\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet blob = {};\n\n\n\t\t\tif (Object.keys(this.___events).length > 0) {\n\n\t\t\t\tblob.events = {};\n\n\t\t\t\tfor (let event in this.___events) {\n\n\t\t\t\t\tblob.events[event] = [];\n\n\t\t\t\t\tfor (let e = 0, el = this.___events[event].length; e < el; e++) {\n\n\t\t\t\t\t\tlet entry = this.___events[event][e];\n\n\t\t\t\t\t\tblob.events[event].push({\n\t\t\t\t\t\t\tpass_event: entry.pass_event,\n\t\t\t\t\t\t\tpass_self:  entry.pass_self,\n\t\t\t\t\t\t\tcallback:   lychee.serialize(entry.callback),\n\t\t\t\t\t\t\t// scope:      lychee.serialize(entry.scope),\n\t\t\t\t\t\t\tscope:      null,\n\t\t\t\t\t\t\tonce:       entry.once\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tlet timeline = {};\n\n\t\t\tif (this.___timeline.bind.length > 0) {\n\n\t\t\t\ttimeline.bind = [];\n\n\t\t\t\tfor (let b = 0, bl = this.___timeline.bind.length; b < bl; b++) {\n\t\t\t\t\ttimeline.bind.push(this.___timeline.bind[b]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (this.___timeline.has.length > 0) {\n\n\t\t\t\ttimeline.has = [];\n\n\t\t\t\tfor (let h = 0, hl = this.___timeline.has.length; h < hl; h++) {\n\t\t\t\t\ttimeline.has.push(this.___timeline.has[h]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (this.___timeline.publish.length > 0) {\n\n\t\t\t\ttimeline.publish = [];\n\n\t\t\t\tfor (let p = 0, pl = this.___timeline.publish.length; p < pl; p++) {\n\t\t\t\t\ttimeline.publish.push(this.___timeline.publish[p]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (this.___timeline.subscribe.length > 0) {\n\n\t\t\t\ttimeline.subscribe = [];\n\n\t\t\t\tfor (let s = 0, sl = this.___timeline.subscribe.length; s < sl; s++) {\n\t\t\t\t\ttimeline.subscribe.push(this.___timeline.subscribe[s]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (this.___timeline.transfer.length > 0) {\n\n\t\t\t\ttimeline.transfer = [];\n\n\t\t\t\tfor (let t = 0, tl = this.___timeline.transfer.length; t < tl; t++) {\n\t\t\t\t\ttimeline.transfer.push(this.___timeline.transfer[t]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (this.___timeline.trigger.length > 0) {\n\n\t\t\t\ttimeline.trigger = [];\n\n\t\t\t\tfor (let t = 0, tl = this.___timeline.trigger.length; t < tl; t++) {\n\t\t\t\t\ttimeline.trigger.push(this.___timeline.trigger[t]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (this.___timeline.unbind.length > 0) {\n\n\t\t\t\ttimeline.unbind = [];\n\n\t\t\t\tfor (let u = 0, ul = this.___timeline.unbind.length; u < ul; u++) {\n\t\t\t\t\ttimeline.unbind.push(this.___timeline.unbind[u]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (Object.keys(timeline).length > 0) {\n\t\t\t\tblob.timeline = timeline;\n\t\t\t}\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'lychee.event.Emitter',\n\t\t\t\t'arguments':   [],\n\t\t\t\t'blob':        Object.keys(blob).length > 0 ? blob : null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tbind: function(event, callback, scope, once) {\n\n\t\t\tevent    = typeof event === 'string'    ? event    : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\t\t\tonce     = once === true;\n\n\n\t\t\tlet result = _bind.call(this, event, callback, scope, once);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.bind.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tcallback: lychee.serialize(callback),\n\t\t\t\t\t// scope:    lychee.serialize(scope),\n\t\t\t\t\tscope:    null,\n\t\t\t\t\tonce:     once\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\thas: function(event, callback, scope) {\n\n\t\t\tevent    = typeof event === 'string'    ? event    : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tlet result = _has.call(this, event, callback, scope);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.has.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tcallback: lychee.serialize(callback),\n\t\t\t\t\t// scope:    lychee.serialize(scope)\n\t\t\t\t\tscope:    null\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\tpublish: function(event, instance, once) {\n\n\t\t\tevent    = typeof event === 'string'               ? event    : null;\n\t\t\tinstance = lychee.interfaceof(Composite, instance) ? instance : null;\n\t\t\tonce     = once === true;\n\n\n\t\t\tlet result = _publish.call(this, event, instance, once);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.publish.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tinstance: lychee.serialize(instance),\n\t\t\t\t\tonce:     once\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\tsubscribe: function(event, instance, once) {\n\n\t\t\tevent    = typeof event === 'string'               ? event    : null;\n\t\t\tinstance = lychee.interfaceof(Composite, instance) ? instance : null;\n\t\t\tonce     = once === true;\n\n\n\t\t\tlet result = _subscribe.call(this, event, instance, once);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.subscribe.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tinstance: lychee.serialize(instance),\n\t\t\t\t\tonce:     once\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\ttransfer: function(event, instance, once) {\n\n\t\t\tevent    = typeof event === 'string'               ? event    : null;\n\t\t\tinstance = lychee.interfaceof(Composite, instance) ? instance : null;\n\t\t\tonce     = once === true;\n\n\n\t\t\tlet result = _transfer.call(this, event, instance, once);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.transfer.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tinstance: lychee.serialize(instance),\n\t\t\t\t\tonce:     once\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\ttrigger: function(event, data) {\n\n\t\t\tevent = typeof event === 'string' ? event : null;\n\t\t\tdata  = data instanceof Array     ? data  : null;\n\n\n\t\t\tlet result = _trigger.call(this, event, data);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.trigger.push({\n\t\t\t\t\ttime:  Date.now(),\n\t\t\t\t\tevent: event,\n\t\t\t\t\tdata:  lychee.serialize(data)\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\tunbind: function(event, callback, scope) {\n\n\t\t\tevent    = typeof event === 'string'    ? event    : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : null;\n\n\n\t\t\tlet result = _unbind.call(this, event, callback, scope);\n\t\t\tif (result === true) {\n\n\t\t\t\tthis.___timeline.unbind.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tcallback: lychee.serialize(callback),\n\t\t\t\t\t// scope:    lychee.serialize(scope)\n\t\t\t\t\tscope:    null\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				}
			},
			"features": {
				"require": "function"
			}
		}
	};

	let environment = lychee.deserialize(blob);
	if (environment !== null) {

		if (environment.variant === 'application') {
			lychee.init(environment, {
				profile: {}
			});
		} else if (environment.variant === 'library') {
			environment.init();
		}

	}

	lychee.ENVIRONMENTS['/libraries/fertilizer/dist'] = environment;

	return environment;

})(typeof lychee !== 'undefined' ? lychee : undefined, typeof global !== 'undefined' ? global : this);
